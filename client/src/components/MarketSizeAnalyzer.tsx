import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, TrendingUp, Globe, IndianRupee } from 'lucide-react';

interface MarketData {
  tam: string;
  sam: string;
  som: string;
  growth: string;
  india_vs_global: string;
  assumptions: string;
  narration: string;
  sources: string[];
}

const MarketSizeAnalyzer: React.FC = () => {
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MarketData | null>(null);
  const [error, setError] = useState('');

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी' },
    { code: 'ta', name: 'தமிழ்' },
    { code: 'te', name: 'తెలుగు' },
    { code: 'kn', name: 'ಕನ್ನಡ' },
    { code: 'ml', name: 'മലയാളം' }
  ];

  const analyzeMarket = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/market-size`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query,
          language: language
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error('Market analysis error:', err);
      setError(`Failed to analyze market: ${err instanceof Error ? err.message : 'Please check if backend is running on port 8000'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6" />
            Market Size & Opportunity Narrator 📊
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Input
              placeholder="Enter your startup idea (e.g., AgriTech, EV, EdTech)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1"
            />
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={analyzeMarket} 
            disabled={loading || !query.trim()}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Market...
              </>
            ) : (
              'Explain Market Opportunity'
            )}
          </Button>
          
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
        </CardContent>
      </Card>

      {result && (
        <div className="grid gap-6">
          {/* Market Metrics */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-600">TAM</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{result.tam}</div>
                <p className="text-xs text-gray-500">Total Addressable Market</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-600">SAM</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{result.sam}</div>
                <p className="text-xs text-gray-500">Serviceable Available Market</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-600">SOM</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{result.som}</div>
                <p className="text-xs text-gray-500">Serviceable Obtainable Market</p>
              </CardContent>
            </Card>
          </div>

          {/* Growth Rate */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Market Growth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-semibold text-green-600">{result.growth}</div>
            </CardContent>
          </Card>

          {/* India vs Global */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                India vs Global Opportunity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{result.india_vs_global}</p>
            </CardContent>
          </Card>

          {/* Narration */}
          <Card>
            <CardHeader>
              <CardTitle>Market Opportunity Explanation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{result.narration}</p>
            </CardContent>
          </Card>

          {/* Assumptions */}
          <Card>
            <CardHeader>
              <CardTitle>Key Assumptions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">{result.assumptions}</p>
            </CardContent>
          </Card>

          {/* Sources */}
          {result.sources.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {result.sources.map((source, index) => (
                    <Badge key={index} variant="outline">
                      {source}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default MarketSizeAnalyzer;