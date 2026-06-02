import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { IndianRupee, Landmark } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

const SavingsCalculator = () => {
  const [initialAmount, setInitialAmount] = useState<string>('50000');
  const [monthlyContribution, setMonthlyContribution] = useState<string>('5000');
  const [interestRate, setInterestRate] = useState<string>('7.2');
  const [years, setYears] = useState<string>('15');
  const [compoundFrequency, setCompoundFrequency] = useState<string>('12');
  
  const [futureValue, setFutureValue] = useState<number | null>(null);
  const [totalContributions, setTotalContributions] = useState<number | null>(null);
  const [totalInterest, setTotalInterest] = useState<number | null>(null);
  const [growthData, setGrowthData] = useState<any[]>([]);

  const calculateSavings = () => {
    try {
      const p = parseFloat(initialAmount); // Principal
      const pmt = parseFloat(monthlyContribution); // Monthly contribution
      const r = parseFloat(interestRate) / 100; // Annual interest rate
      const t = parseFloat(years); // Time in years
      const n = parseFloat(compoundFrequency); // Compound frequency per year
      
      if (isNaN(p) || isNaN(pmt) || isNaN(r) || isNaN(t) || isNaN(n) || 
          p < 0 || r < 0 || t <= 0 || n <= 0) {
        throw new Error('Please enter valid positive values');
      }
      
      // Calculate future value with compound interest and regular contributions
      // A = P(1 + r/n)^(nt) + PMT × [((1 + r/n)^(nt) - 1) / (r/n)]
      const ratePerPeriod = r / n;
      const totalPeriods = n * t;
      
      let fv = p * Math.pow(1 + ratePerPeriod, totalPeriods);
      if (pmt > 0) {
        const monthlyRate = r / 12;
        const totalMonths = t * 12;
        fv = p * Math.pow(1 + ratePerPeriod, totalPeriods) + 
             pmt * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
      }
      
      const totalContrib = p + (pmt * t * 12);
      const totalInt = fv - totalContrib;
      
      setFutureValue(fv);
      setTotalContributions(totalContrib);
      setTotalInterest(totalInt);
      
      // Generate growth data for chart
      const growthSchedule = [];
      const monthlyRate = r / 12;
      for (let i = 0; i <= t; i++) {
        const periods = n * i;
        let value = p * Math.pow(1 + ratePerPeriod, periods);
        if (pmt > 0) {
          const months = i * 12;
          value = p * Math.pow(1 + ratePerPeriod, periods) + 
                  pmt * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
        }
        
        const contributed = i === 0 ? p : p + (pmt * i * 12);
        growthSchedule.push({
          year: i,
          value: Math.round(value),
          contributions: Math.round(contributed),
          interest: Math.round(Math.max(0, value - contributed))
        });
      }
      
      setGrowthData(growthSchedule);
      toast.success('Savings calculation complete!');
      
    } catch (error: any) {
      toast.error(error.message || 'Calculation error');
    }
  };

  useEffect(() => {
    calculateSavings();
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="input-group">
            <Label htmlFor="initialAmount" className="text-sm font-semibold text-slate-600 dark:text-slate-400">Initial Deposit</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₹</span>
              <Input
                id="initialAmount"
                type="number"
                value={initialAmount}
                onChange={(e) => setInitialAmount(e.target.value)}
                className="pl-8 finance-input"
                min="0"
                placeholder="e.g. 50000"
              />
            </div>
          </div>
          
          <div className="input-group">
            <Label htmlFor="monthlyContribution" className="text-sm font-semibold text-slate-600 dark:text-slate-400">Monthly Contribution</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₹</span>
              <Input
                id="monthlyContribution"
                type="number"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(e.target.value)}
                className="pl-8 finance-input"
                min="0"
                placeholder="e.g. 5000"
              />
            </div>
          </div>
          
          <div className="input-group">
            <Label htmlFor="interestRate" className="text-sm font-semibold text-slate-600 dark:text-slate-400">Annual Interest Rate (%)</Label>
            <Input
              id="interestRate"
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              className="finance-input"
              min="0"
              step="0.1"
              placeholder="e.g. 7.2"
            />
          </div>
          
          <div className="input-group">
            <Label htmlFor="years" className="text-sm font-semibold text-slate-600 dark:text-slate-400">Time Period (Years)</Label>
            <Input
              id="years"
              type="number"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              className="finance-input"
              min="1"
              placeholder="e.g. 15"
            />
          </div>
          
          <div className="input-group">
            <Label htmlFor="compound" className="text-sm font-semibold text-slate-600 dark:text-slate-400">Compound Frequency</Label>
            <Select
              value={compoundFrequency}
              onValueChange={setCompoundFrequency}
            >
              <SelectTrigger id="compound" className="finance-input w-full bg-white/60 dark:bg-slate-800/60">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Annually</SelectItem>
                <SelectItem value="2">Semi-annually</SelectItem>
                <SelectItem value="4">Quarterly</SelectItem>
                <SelectItem value="12">Monthly</SelectItem>
                <SelectItem value="365">Daily</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={calculateSavings}
            className="w-full bg-finance-secondary hover:bg-finance-secondary/95 text-white py-3 rounded-lg font-bold shadow-lg shadow-finance-secondary/20 transition-all duration-300"
          >
            <Landmark className="mr-2 h-5 w-5" /> Calculate Savings
          </Button>
        </div>
        
        <div>
          {futureValue !== null && (
            <Card className="result-card border-finance-secondary flex flex-col justify-between h-full">
              <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Savings Summary</h3>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Future Value</span>
                    <div className="flex items-center font-extrabold text-2xl text-cyan-600 dark:text-cyan-400">
                      <IndianRupee size={22} className="mr-1" />
                      <span>{Math.round(futureValue).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Total Contributed</span>
                    <div className="flex items-center font-bold text-slate-800 dark:text-white">
                      <IndianRupee size={15} className="mr-1 text-slate-400" />
                      <span>{totalContributions ? Math.round(totalContributions).toLocaleString('en-IN') : 0}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-slate-800 dark:text-white font-bold">Total Interest Earned</span>
                    <div className="flex items-center font-bold text-emerald-600 dark:text-emerald-400">
                      <IndianRupee size={15} className="mr-1" />
                      <span>{totalInterest ? Math.round(totalInterest).toLocaleString('en-IN') : 0}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {growthData.length > 0 && (
                <div className="mt-6 h-[200px]">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Growth Projection Chart</h4>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={growthData}
                      margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                      <YAxis 
                        tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`}
                        tick={{ fontSize: 11 }}
                      />
                      <Tooltip 
                        formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, undefined]}
                        labelFormatter={(value) => `Year ${value}`}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="contributions" 
                        stackId="1" 
                        name="Capital Contributed" 
                        stroke="#06b6d4" 
                        fill="#06b6d4" 
                        fillOpacity={0.15}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="interest" 
                        stackId="1" 
                        name="Interest Earned" 
                        stroke="#10b981" 
                        fill="#10b981" 
                        fillOpacity={0.25}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavingsCalculator;
