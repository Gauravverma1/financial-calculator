import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { PlusCircle, MinusCircle, Save, Upload, Trash2, IndianRupee, PieChart as PieIcon } from 'lucide-react';
import { toast } from 'sonner';

interface BudgetItem {
  id: string;
  name: string;
  amount: number;
  type: 'income' | 'expense';
}

const COLORS = {
  income: ['#10b981', '#059669', '#047857', '#065f46', '#064e3b'],
  expense: ['#f43f5e', '#e11d48', '#be123c', '#9f1239', '#881337']
};

const getStorageKey = () => {
  const username = sessionStorage.getItem('username');
  return username ? `savedBudget_${username}` : 'savedBudget';
};

const BudgetCalculator = () => {
  const [items, setItems] = useState<BudgetItem[]>([]);
  const [itemName, setItemName] = useState('');
  const [itemAmount, setItemAmount] = useState('');
  const [itemType, setItemType] = useState<'income' | 'expense'>('income');

  // Load initial budget if present
  useEffect(() => {
    const saved = localStorage.getItem(getStorageKey());
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const addItem = () => {
    if (!itemName.trim() || !itemAmount.trim()) {
      toast.error('Please enter both category and amount');
      return;
    }
    
    const amount = parseFloat(itemAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid positive amount');
      return;
    }
    
    const newItem: BudgetItem = {
      id: Date.now().toString(),
      name: itemName.trim(),
      amount: amount,
      type: itemType
    };
    
    setItems([...items, newItem]);
    setItemName('');
    setItemAmount('');
    toast.success(`Added ${itemType}: ${itemName}`);
  };

  const removeItem = (id: string) => {
    const item = items.find(i => i.id === id);
    setItems(items.filter(i => i.id !== id));
    if (item) {
      toast.success(`Removed: ${item.name}`);
    }
  };

  const calculateTotals = () => {
    const totalIncome = items
      .filter(item => item.type === 'income')
      .reduce((sum, item) => sum + item.amount, 0);
    
    const totalExpenses = items
      .filter(item => item.type === 'expense')
      .reduce((sum, item) => sum + item.amount, 0);
    
    const balance = totalIncome - totalExpenses;
    
    return { totalIncome, totalExpenses, balance };
  };

  const { totalIncome, totalExpenses, balance } = calculateTotals();
  
  const saveBudget = () => {
    try {
      localStorage.setItem(getStorageKey(), JSON.stringify(items));
      toast.success('Budget saved successfully!');
    } catch (error) {
      toast.error('Failed to save budget');
      console.error(error);
    }
  };
  
  const loadBudget = () => {
    try {
      const savedBudget = localStorage.getItem(getStorageKey());
      if (savedBudget) {
        setItems(JSON.parse(savedBudget));
        toast.success('Budget loaded successfully!');
      } else {
        toast.error('No saved budget found');
      }
    } catch (error) {
      toast.error('Failed to load budget');
      console.error(error);
    }
  };
  
  const incomeData = items
    .filter(item => item.type === 'income')
    .map(item => ({
      name: item.name,
      value: item.amount
    }));
  
  const expenseData = items
    .filter(item => item.type === 'expense')
    .map(item => ({
      name: item.name,
      value: item.amount
    }));

  const summaryBarData = [
    { name: 'Income', value: totalIncome, fill: '#10b981' },
    { name: 'Expense', value: totalExpenses, fill: '#f43f5e' },
    { name: 'Balance', value: balance, fill: '#4f46e5' },
  ];

  // Calculate budget utilization percentage
  const budgetUtilization = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0;
  
  // Progress bar color based on utilization
  const getProgressColor = (pct: number) => {
    if (pct < 50) return 'bg-emerald-500';
    if (pct < 85) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Visual Budget Progress Bar */}
      {totalIncome > 0 && (
        <Card className="glass-card p-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-slate-650 dark:text-slate-300">Budget Spent: {Math.round(budgetUtilization)}% of Income</span>
            <span className="text-xs font-semibold text-slate-500">
              ₹{totalExpenses.toLocaleString('en-IN')} / ₹{totalIncome.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className={`h-full ${getProgressColor(budgetUtilization)} transition-all duration-500`}
              style={{ width: `${Math.min(budgetUtilization, 100)}%` }}
            ></div>
          </div>
          {budgetUtilization > 100 && (
            <p className="text-xs text-rose-500 mt-2 font-medium">⚠️ Warning: Your expenses exceed your total income!</p>
          )}
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="flex gap-4">
            <button
              type="button"
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                itemType === 'income' 
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
              onClick={() => setItemType('income')}
            >
              <div className="flex items-center justify-center gap-2">
                <PlusCircle size={18} />
                <span>Income</span>
              </div>
            </button>
            
            <button
              type="button"
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                itemType === 'expense' 
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' 
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
              onClick={() => setItemType('expense')}
            >
              <div className="flex items-center justify-center gap-2">
                <MinusCircle size={18} />
                <span>Expense</span>
              </div>
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="input-group">
              <Label htmlFor="itemName" className="text-sm font-semibold text-slate-650 dark:text-slate-400">
                {itemType === 'income' ? 'Income Source' : 'Expense Category'}
              </Label>
              <Input
                id="itemName"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="finance-input"
                placeholder={itemType === 'income' ? 'e.g. Salary, Dividend' : 'e.g. Rent, Groceries, Fuel'}
              />
            </div>
            
            <div className="input-group">
              <Label htmlFor="itemAmount" className="text-sm font-semibold text-slate-650 dark:text-slate-400">Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₹</span>
                <Input
                  id="itemAmount"
                  type="number"
                  value={itemAmount}
                  onChange={(e) => setItemAmount(e.target.value)}
                  className="pl-8 finance-input"
                  min="0"
                  placeholder="0.00"
                />
              </div>
            </div>
            
            <Button 
              onClick={addItem}
              className={`w-full text-white font-bold py-3 rounded-lg shadow-md transition-all duration-300 ${
                itemType === 'income' 
                  ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/10' 
                  : 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/10'
              }`}
            >
              Add {itemType === 'income' ? 'Income' : 'Expense'}
            </Button>
            
            <div className="flex gap-2 pt-2">
              <Button 
                variant="outline" 
                className="flex-1 border-primary text-primary hover:bg-primary/5 dark:border-indigo-400 dark:text-indigo-400 dark:hover:bg-indigo-400/5 transition-colors duration-200" 
                onClick={saveBudget}
              >
                <Save className="mr-2 h-4 w-4" /> Save Local
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 border-primary text-primary hover:bg-primary/5 dark:border-indigo-400 dark:text-indigo-400 dark:hover:bg-indigo-400/5 transition-colors duration-200" 
                onClick={loadBudget}
              >
                <Upload className="mr-2 h-4 w-4" /> Load Local
              </Button>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-3">Itemized List</h3>
            <div className="max-h-[300px] overflow-y-auto pr-1 space-y-2">
              {items.length === 0 ? (
                <div className="text-center text-slate-400 dark:text-slate-500 py-8 border border-dashed rounded-xl">
                  No items listed. Add income or expenses to begin.
                </div>
              ) : (
                items.map((item) => (
                  <div 
                    key={item.id} 
                    className={`flex justify-between items-center p-3 rounded-xl border transition-all duration-200 ${
                      item.type === 'income' 
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30' 
                        : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/30'
                    }`}
                  >
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="font-bold text-slate-800 dark:text-white truncate">{item.name}</div>
                      <div className="flex items-center text-xs text-slate-550 dark:text-slate-450 mt-0.5">
                        <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${item.type === 'income' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                        <span className="uppercase text-[10px] font-bold tracking-wider mr-2">{item.type}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`font-bold flex items-center ${item.type === 'income' ? 'text-emerald-600 dark:text-emerald-450' : 'text-rose-600 dark:text-rose-450'}`}>
                        <IndianRupee size={14} className="mr-0.5" />
                        {item.amount.toLocaleString('en-IN')}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-full h-8 w-8 transition-colors"
                      >
                        <Trash2 size={15} />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        
        <div>
          <Card className="result-card border-primary flex flex-col justify-between h-full">
            <div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Budget Summary</h3>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Total Income</span>
                  <div className="flex items-center font-bold text-emerald-600 dark:text-emerald-400">
                    <IndianRupee size={15} className="mr-1" />
                    <span>{totalIncome.toLocaleString('en-IN')}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Total Expenses</span>
                  <div className="flex items-center font-bold text-rose-600 dark:text-rose-400">
                    <IndianRupee size={15} className="mr-1" />
                    <span>{totalExpenses.toLocaleString('en-IN')}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-slate-800 dark:text-white font-bold">Net Balance</span>
                  <div className="flex items-center font-extrabold text-2xl text-indigo-600 dark:text-indigo-400">
                    <IndianRupee size={22} className="mr-1" />
                    <span className={balance >= 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-rose-600 dark:text-rose-400'}>
                      {balance.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {items.length > 0 && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Income vs Expense vs Net Balance</h4>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={summaryBarData} barCategoryGap={30}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                        <YAxis tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
                        <Tooltip
                          formatter={(value, name) => [`₹${Number(value).toLocaleString('en-IN')}`, name]}
                          cursor={{ fill: 'rgba(99, 102, 241, 0.04)' }}
                        />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                          {summaryBarData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                {/* Distribution Charts */}
                <div className="flex flex-col sm:flex-row gap-4 border-t border-slate-100 dark:border-slate-800/80 pt-4">
                  {incomeData.length > 0 && (
                    <div className="flex-1">
                      <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <PieIcon size={12} className="text-emerald-500" /> Income Share
                      </h4>
                      <div className="h-[120px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={incomeData}
                              cx="50%"
                              cy="50%"
                              outerRadius={45}
                              dataKey="value"
                            >
                              {incomeData.map((entry, index) => (
                                <Cell 
                                  key={`cell-income-${index}`} 
                                  fill={COLORS.income[index % COLORS.income.length]} 
                                />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}
                  
                  {expenseData.length > 0 && (
                    <div className="flex-1">
                      <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <PieIcon size={12} className="text-rose-500" /> Expense Share
                      </h4>
                      <div className="h-[120px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={expenseData}
                              cx="50%"
                              cy="50%"
                              outerRadius={45}
                              dataKey="value"
                            >
                              {expenseData.map((entry, index) => (
                                <Cell 
                                  key={`cell-expense-${index}`} 
                                  fill={COLORS.expense[index % COLORS.expense.length]} 
                                />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BudgetCalculator;
