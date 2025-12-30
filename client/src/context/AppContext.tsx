import React, { createContext, useContext, useState, ReactNode } from 'react';

type StartupStage = 'Idea' | 'MVP' | 'Revenue' | 'Growth';
type FundingGoal = 'Grant' | 'Angel' | 'VC';
type Language = 'English' | 'Hindi' | 'Tamil' | 'Telugu';

interface FounderProfile {
  stage: StartupStage | '';
  sector: string;
  location: string;
  fundingGoal: FundingGoal | '';
  language: Language;
}

interface AppContextType {
  profile: FounderProfile;
  updateProfile: (data: Partial<FounderProfile>) => void;
  resetProfile: () => void;
}

const defaultProfile: FounderProfile = {
  stage: '',
  sector: '',
  location: '',
  fundingGoal: '',
  language: 'English',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<FounderProfile>(defaultProfile);

  const updateProfile = (data: Partial<FounderProfile>) => {
    setProfile((prev) => ({ ...prev, ...data }));
  };

  const resetProfile = () => {
    setProfile(defaultProfile);
  };

  return (
    <AppContext.Provider value={{ profile, updateProfile, resetProfile }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
