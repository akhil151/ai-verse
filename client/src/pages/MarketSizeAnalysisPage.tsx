import React from 'react';
import MarketSizeAnalyzer from '@/components/MarketSizeAnalyzer';

const MarketAnalysisPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Market Size & Opportunity Analysis
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get detailed market insights for your startup idea including TAM, SAM, SOM, 
            and growth opportunities in India and globally.
          </p>
        </div>
        
        <MarketSizeAnalyzer />
      </div>
    </div>
  );
};

export default MarketAnalysisPage;