import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, FileText, AlertCircle, IndianRupee } from 'lucide-react';

interface FinancialNarrativeResult {
  burn_rate_explanation: string;
  runway_interpretation: string;
  unit_economics_insight: string;
  summary: string;
  disclaimer: string;
  success: boolean;
}

const FinancialNarrativeGenerator: React.FC = () => {
  const [monthlyBurnRate, setMonthlyBurnRate] = useState('');
  const [runwayMonths, setRunwayMonths] = useState('');
  const [monthlyRevenue, setMonthlyRevenue] = useState('');
  const [cac, setCac] = useState('');
  const [ltv, setLtv] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FinancialNarrativeResult | null>(null);
  const [error, setError] = useState('');

  const generateNarrative = async () => {
    // Validate required fields
    if (!monthlyBurnRate || !runwayMonths) {
      setError('Please provide Monthly Burn Rate and Runway Months');
      return;
    }

    const burnRate = parseFloat(monthlyBurnRate);
    const runway = parseFloat(runwayMonths);

    if (isNaN(burnRate) || burnRate <= 0) {
      setError('Monthly Burn Rate must be a positive number');
      return;
    }

    if (isNaN(runway) || runway <= 0) {
      setError('Runway Months must be a positive number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      
      const payload: any = {
        monthly_burn_rate: burnRate,
        runway_months: runway,
      };

      // Add optional fields if provided
      if (monthlyRevenue) {
        const revenue = parseFloat(monthlyRevenue);
        if (!isNaN(revenue) && revenue > 0) {
          payload.monthly_revenue = revenue;
        }
      }

      if (cac) {
        const cacValue = parseFloat(cac);
        if (!isNaN(cacValue) && cacValue > 0) {
          payload.CAC = cacValue;
        }
      }

      if (ltv) {
        const ltvValue = parseFloat(ltv);
        if (!isNaN(ltvValue) && ltvValue > 0) {
          payload.LTV = ltvValue;
        }
      }

      const response = await fetch(`${apiUrl}/financial/narrative`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error('Financial narrative error:', err);
      setError(`Failed to generate narrative: ${err instanceof Error ? err.message : 'Please check if backend is running on port 8000'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      generateNarrative();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Financial Narrative Generator 💰
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Get plain-language explanations of your financial metrics. This is not financial advice.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Required Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="burnRate" className="flex items-center gap-1">
                Monthly Burn Rate <span className="text-red-500">*</span>
                <IndianRupee className="h-3 w-3" />
              </Label>
              <Input
                id="burnRate"
                type="number"
                placeholder="500000"
                value={monthlyBurnRate}
                onChange={(e) => setMonthlyBurnRate(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">How much you spend per month</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="runway" className="flex items-center gap-1">
                Runway (Months) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="runway"
                type="number"
                placeholder="12"
                value={runwayMonths}
                onChange={(e) => setRunwayMonths(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">Months until you run out of money</p>
            </div>
          </div>

          {/* Optional Fields */}
          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-3 text-muted-foreground">Optional Metrics</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="revenue" className="flex items-center gap-1">
                  Monthly Revenue
                  <IndianRupee className="h-3 w-3" />
                </Label>
                <Input
                  id="revenue"
                  type="number"
                  placeholder="100000"
                  value={monthlyRevenue}
                  onChange={(e) => setMonthlyRevenue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cac" className="flex items-center gap-1">
                  CAC (Cost per Customer)
                  <IndianRupee className="h-3 w-3" />
                </Label>
                <Input
                  id="cac"
                  type="number"
                  placeholder="5000"
                  value={cac}
                  onChange={(e) => setCac(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ltv" className="flex items-center gap-1">
                  LTV (Lifetime Value)
                  <IndianRupee className="h-3 w-3" />
                </Label>
                <Input
                  id="ltv"
                  type="number"
                  placeholder="50000"
                  value={ltv}
                  onChange={(e) => setLtv(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <Button
            onClick={generateNarrative}
            disabled={loading || !monthlyBurnRate || !runwayMonths}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Narrative...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Generate Narrative
              </>
            )}
          </Button>

          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-sm text-destructive flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {error}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Your Financial Narrative
              <Badge variant="outline" className="ml-auto">
                Groq AI
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Disclaimer */}
            <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-md">
              <p className="text-xs text-amber-800 dark:text-amber-200 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {result.disclaimer}
              </p>
            </div>

            {/* Summary */}
            <div className="space-y-2">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                📝 Summary
              </h3>
              <p className="text-sm leading-relaxed">{result.summary}</p>
            </div>

            {/* Burn Rate Explanation */}
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                💸 Monthly Burn Rate
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{result.burn_rate_explanation}</p>
            </div>

            {/* Runway Interpretation */}
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                ⏱️ Runway
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{result.runway_interpretation}</p>
            </div>

            {/* Unit Economics */}
            {result.unit_economics_insight && (
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  📊 Unit Economics
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{result.unit_economics_insight}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FinancialNarrativeGenerator;
