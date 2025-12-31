// API Service Layer for Nivesh.ai Frontend
// Connects to FastAPI backend

// Production: Use VITE_API_URL env variable
// Development: Auto-detect localhost:8000
const API_BASE_URL = typeof window !== 'undefined' 
  ? (import.meta.env.VITE_API_URL || `${window.location.protocol}//${window.location.hostname}:8000`)
  : 'http://localhost:8000';

export interface FounderProfile {
  startup_stage: string;
  sector: string;
  location: string;
  funding_goal: string;
  preferred_language: string;
}

export interface FundingQuestion {
  question: string;
  context?: string;
}

export interface FundingAdvice {
  readiness_score: number;
  recommended_path: string;
  explanation: string;
  checklist: string[];
  language: string;
}

// Profile endpoints
export async function saveFounderProfile(profile: FounderProfile & { documents?: File[] }): Promise<any> {
  try {
    const formData = new FormData();
    Object.entries(profile).forEach(([key, value]) => {
      if (key !== 'documents') {
        formData.append(key, value as string);
      }
    });

    if (profile.documents) {
      profile.documents.forEach((file) => {
        formData.append('files', file);
      });
    }

    const response = await fetch(`${API_BASE_URL}/founder/profile`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error saving founder profile:', error);
    throw error;
  }
}

export async function getFounderProfile(): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/founder/profile`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching founder profile:', error);
    throw error;
  }
}

// Chat/Advice endpoints
export async function getFundingAdvice(question: FundingQuestion): Promise<FundingAdvice> {
  try {
    const response = await fetch(`${API_BASE_URL}/funding/advice`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(question),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail || `HTTP ${response.status}: ${response.statusText}`
      );
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching funding advice:', error);
    throw error;
  }
}

// Health check
export async function healthCheck(): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error checking health:', error);
    throw error;
  }
}
