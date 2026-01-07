import React from 'react';
import FinancialNarrativeGenerator from '@/components/FinancialNarrativeGenerator';

const FinancialNarrativePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Financial Narrative Generator
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get plain-language explanations of your startup's financial metrics. 
            Understand your burn rate, runway, and unit economics in simple terms.
          </p>
          <p className="text-sm text-amber-600 mt-2 font-medium">
            ⚠️ This is not financial advice
          </p>
        </div>
        
        <FinancialNarrativeGenerator />
      </div>
    </div>
  );
};

export default FinancialNarrativePage;
