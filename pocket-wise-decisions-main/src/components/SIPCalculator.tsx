import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { IndianRupee, TrendingUp, DollarSign } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { toast } from 'sonner';

const SIPCalculator = () => {
  const [calcMode, setCalcMode] = useState<'sip' | 'lumpsum'>('sip');
  const [amount, setAmount] = useState<string>('5000');
  const [expectedReturn, setExpectedReturn] = useState<string>('12');
  const [years, setYears] = useState<string>('10');

  const [investedAmount, setInvestedAmount] = useState<number | null>(null);
  const [estimatedReturns, setEstimatedReturns] = useState<number | null>(null);
  const [totalValue, setTotalValue] = useState<number | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);

  const calculateSIP = () => {
    try {
      const p = parseFloat(amount);
      const r = parseFloat(expectedReturn);
      const t = parseFloat(years);

      if (isNaN(p) || isNaN(r) || isNaN(t) || p <= 0 || r <= 0 || t <= 0) {
        throw new Error('Please enter valid positive numbers');
      }

      let totalInv = 0;
      let maturityValue = 0;
      const growthSchedule = [];

      if (calcMode === 'sip') {
        const monthlyRate = r / 12 / 100;
        const totalMonths = t * 12;
        totalInv = p * totalMonths;
        
        // SIP compound interest formula: P * [((1 + i)^n - 1) / i] * (1 + i)
        maturityValue = p * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate);

        // Generate yearly schedule for area chart
        for (let y = 0; y <= t; y++) {
          const months = y * 12;
          const investedAtYear = p * months;
          const valAtYear = y === 0 ? 0 : p * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
          growthSchedule.push({
            year: y,
            invested: Math.round(investedAtYear),
            value: Math.round(valAtYear),
            returns: Math.round(Math.max(0, valAtYear - investedAtYear))
          });
        }
      } else {
        // Lumpsum compound interest formula: P * (1 + r/100)^t
        totalInv = p;
        maturityValue = p * Math.pow(1 + r / 100, t);

        // Generate yearly schedule for area chart
        for (let y = 0; y <= t; y++) {
          const valAtYear = p * Math.pow(1 + r / 100, y);
          growthSchedule.push({
            year: y,
            invested: Math.round(p),
            value: Math.round(valAtYear),
            returns: Math.round(Math.max(0, valAtYear - p))
          });
        }
      }

      const returns = maturityValue - totalInv;
      setInvestedAmount(totalInv);
      setEstimatedReturns(returns);
      setTotalValue(maturityValue);
      setChartData(growthSchedule);
      toast.success(`${calcMode === 'sip' ? 'SIP' : 'Lumpsum'} calculation complete!`);
    } catch (err: any) {
      toast.error(err.message || 'Calculation error');
    }
  };

  // Run calculation on load
  useEffect(() => {
    calculateSIP();
  }, [calcMode]);

  const pieData = investedAmount !== null && estimatedReturns !== null ? [
    { name: 'Invested Amount', value: Math.round(investedAmount), color: '#6366f1' },
    { name: 'Est. Returns', value: Math.round(estimatedReturns), color: '#10b981' }
  ] : [];

  return (
    <div className="animate-fade-in">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="flex gap-4">
            <Button
              type="button"
              className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-300 ${
                calcMode === 'sip' 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
              onClick={() => setCalcMode('sip')}
            >
              Systematic Investment Plan (SIP)
            </Button>
            <Button
              type="button"
              className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-300 ${
                calcMode === 'lumpsum' 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
              onClick={() => setCalcMode('lumpsum')}
            >
              Lumpsum
            </Button>
          </div>

          <div className="space-y-4">
            <div className="input-group">
              <Label htmlFor="investmentAmount" className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                {calcMode === 'sip' ? 'Monthly Investment Amount' : 'Lumpsum Investment Amount'}
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₹</span>
                <Input
                  id="investmentAmount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-8 finance-input"
                  placeholder="e.g. 5000"
                  min="0"
                />
              </div>
            </div>

            <div className="input-group">
              <Label htmlFor="expectedReturn" className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                Expected Return Rate (p.a. %)
              </Label>
              <Input
                id="expectedReturn"
                type="number"
                value={expectedReturn}
                onChange={(e) => setExpectedReturn(e.target.value)}
                className="finance-input"
                placeholder="e.g. 12"
                min="1"
                max="50"
                step="0.1"
              />
            </div>

            <div className="input-group">
              <Label htmlFor="sipYears" className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                Time Period (Years)
              </Label>
              <Input
                id="sipYears"
                type="number"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                className="finance-input"
                placeholder="e.g. 10"
                min="1"
                max="40"
              />
            </div>

            <Button
              onClick={calculateSIP}
              className="w-full bg-finance-primary hover:bg-finance-primary/95 text-white py-3 rounded-lg font-bold shadow-lg shadow-finance-primary/20 mt-4 transition-all duration-300"
            >
              <TrendingUp className="mr-2 h-5 w-5" /> Calculate Wealth
            </Button>
          </div>
        </div>

        <div>
          {totalValue !== null && investedAmount !== null && estimatedReturns !== null && (
            <Card className="result-card flex flex-col justify-between h-full">
              <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center justify-between">
                  <span>Investment Summary</span>
                  <span className="text-xs px-2 py-1 rounded bg-indigo-50 text-indigo-600 dark:bg-slate-800 dark:text-indigo-400 uppercase tracking-wide">
                    {calcMode}
                  </span>
                </h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Invested Amount</span>
                    <div className="flex items-center font-bold text-slate-800 dark:text-white">
                      <IndianRupee size={15} className="mr-1" />
                      <span>{Math.round(investedAmount).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Est. Returns</span>
                    <div className="flex items-center font-bold text-emerald-600 dark:text-emerald-400">
                      <IndianRupee size={15} className="mr-1" />
                      <span>{Math.round(estimatedReturns).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-slate-800 dark:text-white font-bold">Total Value</span>
                    <div className="flex items-center font-extrabold text-2xl text-indigo-600 dark:text-indigo-400">
                      <IndianRupee size={22} className="mr-1" />
                      <span>{Math.round(totalValue).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {chartData.length > 0 && (
                <div className="space-y-6">
                  <div className="h-[180px] flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={75}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex flex-col gap-2 ml-4">
                      {pieData.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span style={{ display: 'inline-block', width: 12, height: 12, backgroundColor: item.color, borderRadius: '50%' }}></span>
                          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{item.name} ({Math.round((item.value / totalValue) * 100)}%)</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="h-[200px]">
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Wealth Growth Schedule</h4>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                        <YAxis tickFormatter={(val) => `₹${(val / 100000).toFixed(1)}L`} tick={{ fontSize: 11 }} />
                        <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} labelFormatter={(year) => `Year ${year}`} />
                        <Legend wrapperStyle={{ fontSize: '11px' }} />
                        <Area type="monotone" dataKey="invested" name="Invested Capital" stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} />
                        <Area type="monotone" dataKey="returns" name="Returns Earned" stroke="#10b981" fill="#10b981" fillOpacity={0.25} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SIPCalculator;
