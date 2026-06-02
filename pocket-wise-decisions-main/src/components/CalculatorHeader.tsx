import React from 'react';
import { Calculator, PiggyBank, DollarSign, TrendingUp, ShieldAlert, BadgeCent } from 'lucide-react';

interface CalculatorHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const CalculatorHeader: React.FC<CalculatorHeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="mb-8">
      <div className="flex flex-col items-center justify-center text-center gap-2 mb-6">
        <div className="flex items-center gap-3">
          <BadgeCent className="h-10 w-10 text-primary animate-pulse" />
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-indigo-500 to-finance-secondary bg-clip-text text-transparent">
            PocketWise
          </h1>
        </div>
        <p className="text-slate-500 dark:text-slate-400 font-medium max-w-md">
          A premium suite of personal finance planners and calculators to help you make smarter decisions.
        </p>
      </div>
      
      <div className="flex flex-wrap justify-center gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <button
          onClick={() => setActiveTab('loan')}
          className={`calc-tabs-button ${activeTab === 'loan' ? 'active' : 'text-slate-600 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800/40'}`}
        >
          <div className="flex items-center gap-2">
            <DollarSign size={16} />
            <span>Loan EMI</span>
          </div>
        </button>
        
        <button
          onClick={() => setActiveTab('savings')}
          className={`calc-tabs-button ${activeTab === 'savings' ? 'active' : 'text-slate-600 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800/40'}`}
        >
          <div className="flex items-center gap-2">
            <PiggyBank size={16} />
            <span>Savings</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('sip')}
          className={`calc-tabs-button ${activeTab === 'sip' ? 'active' : 'text-slate-600 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800/40'}`}
        >
          <div className="flex items-center gap-2">
            <TrendingUp size={16} />
            <span>SIP / Mutual Fund</span>
          </div>
        </button>
        
        <button
          onClick={() => setActiveTab('budget')}
          className={`calc-tabs-button ${activeTab === 'budget' ? 'active' : 'text-slate-600 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800/40'}`}
        >
          <div className="flex items-center gap-2">
            <Calculator size={16} />
            <span>Budget</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('inflation')}
          className={`calc-tabs-button ${activeTab === 'inflation' ? 'active' : 'text-slate-600 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800/40'}`}
        >
          <div className="flex items-center gap-2">
            <ShieldAlert size={16} />
            <span>Inflation</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default CalculatorHeader;
