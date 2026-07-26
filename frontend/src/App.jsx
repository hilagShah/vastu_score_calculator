import React, { useState } from 'react';
import CalculatorForm from './pages/CalculatorForm';
import ResultsDashboard from './pages/ResultsDashboard';
import ContactExpertModal from './components/ContactExpertModal';
import { Compass, Building2, ShieldCheck, PhoneCall, MessageCircle } from 'lucide-react';

function App() {
  const [report, setReport] = useState(null);
  const [isExpertModalOpen, setIsExpertModalOpen] = useState(false);

  const handleComplete = (data) => {
    setReport(data);
    window.scrollTo(0, 0);
  };

  const handleReset = () => {
    setReport(null);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans relative bg-[#f8fafc]">
      
      {/* Global Contact Expert Modal */}
      <ContactExpertModal 
        isOpen={isExpertModalOpen} 
        onClose={() => setIsExpertModalOpen(false)} 
        initialData={report ? { fullName: report.fullName, email: report.email, phone: report.phone } : {}}
      />

      {/* Background Decorator Gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div 
          className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-40 blur-[100px]"
          style={{ background: 'radial-gradient(circle, rgba(79, 70, 229, 0.08), transparent 70%)' }}
        />
        <div 
          className="absolute top-1/3 -left-40 w-[500px] h-[500px] rounded-full opacity-40 blur-[100px]"
          style={{ background: 'radial-gradient(circle, rgba(14, 165, 233, 0.08), transparent 70%)' }}
        />
      </div>

      {/* Navigation Header */}
      <header className="relative z-20 bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between py-3.5 px-6">
          
          {/* Logo & Title */}
          <div 
            onClick={handleReset}
            className="flex items-center gap-3 cursor-pointer select-none"
          >
            <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 text-white shadow-indigo-sm">
              <Compass className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold tracking-tight font-display text-slate-900">
                  VASTU HARMONY
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wide">
                  Verified Engine
                </span>
              </div>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
                Vedic Architecture & Spatial Scorer
              </p>
            </div>
          </div>

          {/* Header Actions / Info */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden md:flex items-center gap-4 text-xs font-medium text-slate-600 border-r border-slate-200 pr-4">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-indigo-600" /> Architectural Precision
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Vedic Standards
              </span>
            </div>
            
            <a
              href="https://wa.me/918140395693?text=Hello%20Vastu%20Expert%2C%20I%20would%20like%20to%20consult%20regarding%20my%20property."
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              WhatsApp
            </a>

            <button
              onClick={() => setIsExpertModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm text-xs font-bold transition-colors cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              Direct Contact
            </button>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow py-10 px-4 sm:px-6 relative z-10">
        {report ? (
          <ResultsDashboard reportData={report} onReset={handleReset} />
        ) : (
          <CalculatorForm onComplete={handleComplete} />
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-20 bg-white border-t border-slate-200 py-6 px-6 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-indigo-600" />
            <span>&copy; {new Date().getFullYear()} Vastu Harmony Scorer. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsExpertModalOpen(true)}
              className="hover:text-indigo-600 font-bold transition-colors cursor-pointer"
            >
              Contact Consultant (+91 81403 95693)
            </button>

            <span>Architectural Compliance</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
