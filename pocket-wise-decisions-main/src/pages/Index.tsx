
import React, { useState } from 'react';
import CalculatorHeader from '@/components/CalculatorHeader';
import LoanCalculator from '@/components/LoanCalculator';
import SavingsCalculator from '@/components/SavingsCalculator';
import BudgetCalculator from '@/components/BudgetCalculator';
import SIPCalculator from '@/components/SIPCalculator';
import InflationCalculator from '@/components/InflationCalculator';

const Index = () => {
  const [activeTab, setActiveTab] = useState('loan');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 md:px-8 transition-colors duration-300 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.12),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.18),rgba(255,255,255,0))]">
      <div className="calc-container mt-6">
        <CalculatorHeader activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="mt-8">
          {activeTab === 'loan' && <LoanCalculator />}
          {activeTab === 'savings' && <SavingsCalculator />}
          {activeTab === 'sip' && <SIPCalculator />}
          {activeTab === 'budget' && <BudgetCalculator />}
          {activeTab === 'inflation' && <InflationCalculator />}
        </main>
        
        <div className="mt-12 text-center text-xs text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-800/80 pt-6">
          <p>© {new Date().getFullYear()} PocketWise Decisions. Empowering your personal finance journey.</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
