import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { IndianRupee, ShieldAlert, Sparkles } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { toast } from 'sonner';

const InflationCalculator = () => {
  const [calcMode, setCalcMode] = useState<'cost' | 'power'>('cost');
  const [amount, setAmount] = useState<string>('50000');
  const [inflationRate, setInflationRate] = useState<string>('6');
  const [years, setYears] = useState<string>('10');

  const [futureValue, setFutureValue] = useState<number | null>(null);
  const [difference, setDifference] = useState<number | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);

  const calculateInflation = () => {
    try {
      const p = parseFloat(amount);
      const r = parseFloat(inflationRate) / 100;
      const t = parseFloat(years);

      if (isNaN(p) || isNaN(r) || isNaN(t) || p <= 0 || r < 0 || t <= 0) {
        throw new Error('Please enter valid positive values');
      }

      let resultValue = 0;
      const dataSchedule = [];

      if (calcMode === 'cost') {
        // Cost swell: FV = PV * (1 + r)^t
        resultValue = p * Math.pow(1 + r, t);

        for (let y = 0; y <= t; y++) {
          const costAtYear = p * Math.pow(1 + r, y);
          dataSchedule.push({
            year: y,
            originalCost: Math.round(p),
            futureCost: Math.round(costAtYear)
          });
        }
      } else {
        // Power erosion: FV_power = PV / (1 + r)^t
        resultValue = p / Math.pow(1 + r, t);

        for (let y = 0; y <= t; y++) {
          const powerAtYear = p / Math.pow(1 + r, y);
          dataSchedule.push({
            year: y,
            nominalValue: Math.round(p),
            realPurchasingPower: Math.round(powerAtYear)
          });
        }
      }

      setFutureValue(resultValue);
      setDifference(Math.abs(resultValue - p));
      setChartData(dataSchedule);
      toast.success('Inflation adjustment complete!');
    } catch (err: any) {
      toast.error(err.message || 'Calculation error');
    }
  };

  useEffect(() => {
    calculateInflation();
  }, [calcMode]);

  return (
    <div className="animate-fade-in">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="flex gap-4">
            <Button
              type="button"
              className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-300 ${
                calcMode === 'cost' 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
              onClick={() => setCalcMode('cost')}
            >
              Living Cost Swell
            </Button>
            <Button
              type="button"
              className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-300 ${
                calcMode === 'power' 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
              onClick={() => setCalcMode('power')}
            >
              Purchasing Power Erosion
            </Button>
          </div>

          <div className="space-y-4">
            <div className="input-group">
              <Label htmlFor="inflationAmount" className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                {calcMode === 'cost' ? 'Current Monthly Expense / Cost' : 'Current Cash Savings'}
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₹</span>
                <Input
                  id="inflationAmount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-8 finance-input"
                  placeholder="e.g. 50000"
                  min="0"
                />
              </div>
            </div>

            <div className="input-group">
              <Label htmlFor="inflationRate" className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                Expected Inflation Rate (% p.a.)
              </Label>
              <Input
                id="inflationRate"
                type="number"
                value={inflationRate}
                onChange={(e) => setInflationRate(e.target.value)}
                className="finance-input"
                placeholder="e.g. 6"
                min="0.1"
                max="30"
                step="0.1"
              />
            </div>

            <div className="input-group">
              <Label htmlFor="inflationYears" className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                Time Horizon (Years)
              </Label>
              <Input
                id="inflationYears"
                type="number"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                className="finance-input"
                placeholder="e.g. 10"
                min="1"
                max="50"
              />
            </div>

            <Button
              onClick={calculateInflation}
              className="w-full bg-finance-primary hover:bg-finance-primary/95 text-white py-3 rounded-lg font-bold shadow-lg shadow-finance-primary/20 mt-4 transition-all duration-300"
            >
              <ShieldAlert className="mr-2 h-5 w-5" /> Adjust for Inflation
            </Button>
          </div>
        </div>

        <div>
          {futureValue !== null && difference !== null && (
            <Card className="result-card flex flex-col justify-between h-full">
              <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center justify-between">
                  <span>Inflation Impact</span>
                  <span className="text-xs px-2.5 py-1 rounded bg-rose-50 text-rose-600 dark:bg-slate-800 dark:text-rose-400 uppercase tracking-wide">
                    {calcMode === 'cost' ? 'Future Expense' : 'Erosion'}
                  </span>
                </h3>

                <div className="space-y-4 mb-6">
                  {calcMode === 'cost' ? (
                    <>
                      <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Cost Today</span>
                        <div className="flex items-center font-bold text-slate-800 dark:text-white">
                          <IndianRupee size={15} className="mr-1" />
                          <span>{Math.round(Number(amount)).toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Cost in {years} Years</span>
                        <div className="flex items-center font-extrabold text-2xl text-rose-600 dark:text-rose-400">
                          <IndianRupee size={22} className="mr-1" />
                          <span>{Math.round(futureValue).toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-slate-800 dark:text-white font-bold">Extra Cost Required</span>
                        <div className="flex items-center font-bold text-rose-600 dark:text-rose-400">
                          <IndianRupee size={15} className="mr-1" />
                          <span>+{Math.round(difference).toLocaleString('en-IN')} ({Math.round((difference / Number(amount)) * 100)}% increase)</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Nominal Cash Today</span>
                        <div className="flex items-center font-bold text-slate-800 dark:text-white">
                          <IndianRupee size={15} className="mr-1" />
                          <span>{Math.round(Number(amount)).toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Value in {years} Years</span>
                        <div className="flex items-center font-extrabold text-2xl text-rose-600 dark:text-rose-400">
                          <IndianRupee size={22} className="mr-1" />
                          <span>{Math.round(futureValue).toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-slate-800 dark:text-white font-bold">Purchasing Power Lost</span>
                        <div className="flex items-center font-bold text-rose-600 dark:text-rose-400">
                          <IndianRupee size={15} className="mr-1" />
                          <span>-{Math.round(difference).toLocaleString('en-IN')} ({Math.round((difference / Number(amount)) * 100)}% lost)</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {chartData.length > 0 && (
                <div className="space-y-4">
                  <div className="h-[220px]">
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                      {calcMode === 'cost' ? 'Expense Swell Progression' : 'Cash Value Depletion'}
                    </h4>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                        <YAxis tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
                        <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} labelFormatter={(year) => `Year ${year}`} />
                        <Legend wrapperStyle={{ fontSize: '11px' }} />
                        {calcMode === 'cost' ? (
                          <>
                            <Bar dataKey="originalCost" name="Cost Today" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="futureCost" name="Future Cost" fill="#ef4444" radius={[4, 4, 0, 0]} />
                          </>
                        ) : (
                          <>
                            <Bar dataKey="nominalValue" name="Nominal cash" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="realPurchasingPower" name="Real purchasing power" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                          </>
                        )}
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-xs text-slate-400 italic text-center">
                    {calcMode === 'cost' 
                      ? 'Note: At this rate, your expenses double approximately every ' + (72 / parseFloat(inflationRate)).toFixed(1) + ' years.' 
                      : 'Note: To preserve this cash value, you need investments matching or beating ' + inflationRate + '% returns.'}
                  </p>
                </div>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default InflationCalculator;
