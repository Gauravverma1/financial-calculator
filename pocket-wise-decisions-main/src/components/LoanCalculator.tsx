import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { IndianRupee, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

const LoanCalculator = () => {
  const [principal, setPrincipal] = useState<string>('1000000');
  const [interestRate, setInterestRate] = useState<string>('8.5');
  const [loanTerm, setLoanTerm] = useState<string>('15');
  
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);
  const [totalPayment, setTotalPayment] = useState<number | null>(null);
  const [totalInterest, setTotalInterest] = useState<number | null>(null);
  const [amortizationData, setAmortizationData] = useState<any[]>([]);
  const [showTable, setShowTable] = useState<boolean>(false);

  const calculateLoan = () => {
    try {
      const p = parseFloat(principal);
      const r = parseFloat(interestRate) / 100 / 12; // Monthly interest rate
      const n = parseFloat(loanTerm) * 12; // Total number of payments
      
      if (isNaN(p) || isNaN(r) || isNaN(n) || p <= 0 || r <= 0 || n <= 0) {
        throw new Error('Please enter valid positive values');
      }
      
      // Calculate monthly payment: P * r * (1 + r)^n / ((1 + r)^n - 1)
      const monthlyPmt = p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
      const totalPmt = monthlyPmt * n;
      const totalInt = totalPmt - p;
      
      setMonthlyPayment(monthlyPmt);
      setTotalPayment(totalPmt);
      setTotalInterest(totalInt);
      
      // Generate amortization schedule data for chart and table
      let remainingBalance = p;
      let cumulativeInterest = 0;
      let yearPrincipal = 0;
      let yearInterest = 0;
      
      const yearlyData = [];
      for (let i = 1; i <= n; i++) {
        const interestPayment = remainingBalance * r;
        const principalPayment = monthlyPmt - interestPayment;
        
        yearPrincipal += principalPayment;
        yearInterest += interestPayment;
        cumulativeInterest += interestPayment;
        remainingBalance -= principalPayment;
        
        if (remainingBalance < 0) remainingBalance = 0;
        
        // Group by year
        if (i % 12 === 0 || i === n) {
          yearlyData.push({
            year: Math.ceil(i / 12),
            principalPaid: Math.round(yearPrincipal),
            interestPaid: Math.round(yearInterest),
            totalPaid: Math.round(yearPrincipal + yearInterest),
            balance: Math.max(0, Math.round(remainingBalance)),
            totalInterestPaid: Math.max(0, Math.round(cumulativeInterest))
          });
          yearPrincipal = 0;
          yearInterest = 0;
        }
      }
      setAmortizationData(yearlyData);
      toast.success('Loan calculation complete!');
      
    } catch (error: any) {
      toast.error(error.message || 'Calculation error');
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="input-group">
            <Label htmlFor="principal" className="text-sm font-semibold text-slate-600 dark:text-slate-400">Loan Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₹</span>
              <Input
                id="principal"
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                className="pl-8 finance-input"
                min="0"
                placeholder="e.g. 1000000"
              />
            </div>
          </div>
          
          <div className="input-group">
            <Label htmlFor="interest" className="text-sm font-semibold text-slate-600 dark:text-slate-400">Annual Interest Rate (%)</Label>
            <Input
              id="interest"
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              className="finance-input"
              min="0.1"
              step="0.1"
              placeholder="e.g. 8.5"
            />
          </div>
          
          <div className="input-group">
            <Label htmlFor="term" className="text-sm font-semibold text-slate-600 dark:text-slate-400">Loan Term (Years)</Label>
            <Input
              id="term"
              type="number"
              value={loanTerm}
              onChange={(e) => setLoanTerm(e.target.value)}
              className="finance-input"
              min="1"
              placeholder="e.g. 15"
            />
          </div>
          
          <Button 
            onClick={calculateLoan}
            className="w-full bg-finance-primary hover:bg-finance-primary/95 text-white py-3 rounded-lg font-bold shadow-lg shadow-finance-primary/20 transition-all duration-300"
          >
            Calculate EMI
          </Button>
        </div>
        
        <div>
          {monthlyPayment !== null && (
            <Card className="result-card border-finance-primary flex flex-col justify-between h-full">
              <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">EMI Summary</h3>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Monthly EMI</span>
                    <div className="flex items-center font-extrabold text-2xl text-indigo-600 dark:text-indigo-400">
                      <IndianRupee size={20} className="mr-1" />
                      <span>{Math.round(monthlyPayment).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Total Interest Payable</span>
                    <div className="flex items-center font-bold text-slate-850 dark:text-white">
                      <IndianRupee size={15} className="mr-1 text-slate-400" />
                      <span>{totalInterest ? Math.round(totalInterest).toLocaleString('en-IN') : 0}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-slate-800 dark:text-white font-bold">Total Payment (Principal + Interest)</span>
                    <div className="flex items-center font-bold text-slate-800 dark:text-white">
                      <IndianRupee size={15} className="mr-1 text-slate-400" />
                      <span>{totalPayment ? Math.round(totalPayment).toLocaleString('en-IN') : 0}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {amortizationData.length > 0 && (
                <div className="mt-6 h-[200px]">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Amortization Schedule Chart</h4>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={amortizationData}
                      margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                      <YAxis 
                        tickFormatter={(value) => `₹${(value/100000).toFixed(0)}L`}
                        tick={{ fontSize: 11 }}
                      />
                      <Tooltip 
                        formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, undefined]}
                        labelFormatter={(value) => `Year ${value}`}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px' }} />
                      <Line 
                        type="monotone" 
                        dataKey="balance" 
                        name="Remaining Balance" 
                        stroke="#4f46e5" 
                        strokeWidth={2}
                        activeDot={{ r: 6 }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="totalInterestPaid" 
                        name="Cumulative Interest" 
                        stroke="#10b981" 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </Card>
          )}
        </div>
      </div>

      {amortizationData.length > 0 && (
        <Card className="glass-card">
          <button
            onClick={() => setShowTable(!showTable)}
            className="w-full flex items-center justify-between font-bold text-slate-700 dark:text-slate-350"
          >
            <span className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-500" />
              Detailed Yearly Breakdowns (Table)
            </span>
            {showTable ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>

          {showTable && (
            <div className="overflow-x-auto mt-4 transition-all duration-300">
              <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-800/50">
                  <tr>
                    <th scope="col" className="px-4 py-3">Year</th>
                    <th scope="col" className="px-4 py-3">Principal Paid</th>
                    <th scope="col" className="px-4 py-3">Interest Paid</th>
                    <th scope="col" className="px-4 py-3">Total Payment</th>
                    <th scope="col" className="px-4 py-3">Ending Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {amortizationData.map((row) => (
                    <tr key={row.year} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                      <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">Year {row.year}</td>
                      <td className="px-4 py-3">₹{row.principalPaid.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3">₹{row.interestPaid.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3">₹{row.totalPaid.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">₹{row.balance.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default LoanCalculator;
