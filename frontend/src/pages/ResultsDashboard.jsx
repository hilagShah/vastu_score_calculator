import React, { useState } from 'react';
import axios from 'axios';
import { getApiUrl } from '../utils/apiUrl';
import { 
  ShieldAlert, 
  CheckCircle2, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Sparkles, 
  RefreshCw, 
  Home, 
  AlertOctagon, 
  PhoneCall, 
  UserCheck, 
  FileText, 
  Download, 
  Loader2, 
  Globe 
} from 'lucide-react';
import ScoreGauge from '../components/ScoreGauge';
import ContactExpertModal from '../components/ContactExpertModal';
import { generateRemediesPdf } from '../utils/generateRemediesPdf';
import { loadRazorpaySdk } from '../utils/loadRazorpaySdk';

const ResultsDashboard = ({ reportData, onReset }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [pdfLanguage, setPdfLanguage] = useState('en');
  const [isPaid, setIsPaid] = useState(false);

  const { 
    fullName, 
    email, 
    phone, 
    totalScore, 
    vastuScore, 
    tier, 
    inputs, 
    breakdown, 
    criticalDoshas, 
    defects, 
    createdAt 
  } = reportData;

  const score = totalScore !== undefined ? totalScore : vastuScore;
  
  // Format creation date
  const dateFormatted = createdAt ? new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }) : new Date().toLocaleDateString();

  const fetchAndGeneratePdf = async () => {
    setGeneratingPdf(true);
    try {
      const API_URL = getApiUrl();

      let remediesText = '';
      try {
        const response = await axios.post(`${API_URL}/api/reports/remedies`, {
          language: pdfLanguage,
          fullName,
          email,
          phone,
          vastuScore: score,
          tier,
          inputs,
          criticalDoshas,
          defects
        }, { timeout: 6000 });

        if (response.data?.success && response.data?.data?.remediesText) {
          remediesText = response.data.data.remediesText;
          const source = response.data?.data?.source || 'unknown';
          console.log(`✅ Remedies received (${remediesText.length} chars) | Source: ${source === 'gemini' ? '🤖 Gemini AI' : '📋 Hardcoded Fallback'}`);
        }
      } catch (err) {
        console.warn('⚠️ Backend remedies API error, will use client-side fallback:', err.message);
      }

      // Trigger client PDF generation
      await generateRemediesPdf({
        language: pdfLanguage,
        fullName,
        email,
        phone,
        totalScore: score,
        tier,
        inputs,
        breakdown,
        criticalDoshas,
        defects,
        remediesText,
        createdAt
      });

    } catch (err) {
      console.error('PDF Generation Error:', err);
      alert('Failed to generate PDF report: ' + err.message);
    } finally {
      setGeneratingPdf(false);
    }
  };

  const handleDownloadPdf = async () => {
    // If already paid in this session, download directly
    if (isPaid) {
      await fetchAndGeneratePdf();
      return;
    }

    setPaymentLoading(true);

    try {
      // 1. Dynamically load the Razorpay SDK
      const sdkLoaded = await loadRazorpaySdk();
      if (!sdkLoaded) {
        alert('Razorpay SDK failed to load. Please check your internet connection.');
        setPaymentLoading(false);
        return;
      }

      const API_URL = getApiUrl();
      const defaultKey = (import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_TKT73ZIiuXxyi1').trim();

      let order_id = undefined;
      let orderAmount = 49900;
      let orderCurrency = 'INR';
      let activeKey = defaultKey;

      try {
        const orderRes = await axios.post(`${API_URL}/api/payments/create-order`, {
          amount: 499,
          currency: 'INR',
          notes: {
            client_name: fullName || 'Valued Client',
            client_email: email || 'N/A'
          }
        }, { timeout: 3500 });

        if (orderRes.data?.success) {
          const orderData = orderRes.data.data || orderRes.data;
          order_id = orderData.order_id;
          orderAmount = Number(orderData.amount) || 49900;
          orderCurrency = (orderData.currency || 'INR').toUpperCase();
          if (orderData.key_id) activeKey = orderData.key_id.trim();
        }
      } catch (orderErr) {
        console.warn('⚠️ Backend order API delayed, opening Razorpay Checkout directly:', orderErr.message);
      } finally {
        setPaymentLoading(false);
      }

      // 3. Configure Razorpay Modal Options with perfect structure & sanitization
      const options = {
        key: activeKey,
        amount: orderAmount,
        currency: orderCurrency,
        name: 'Vastu Harmony Consultations',
        description: 'Unlock & Download Tailored Remedies PDF Report',
        prefill: {
          name: (fullName || '').trim(),
          email: (email || '').trim(),
          contact: (phone || '').trim()
        },
        theme: {
          color: '#4f46e5'
        },
        handler: async (response) => {
          try {
            console.log('💳 Payment Success Callback Received:', response);

            if (response.razorpay_signature && response.razorpay_order_id) {
              const verifyRes = await axios.post(`${API_URL}/api/payments/verify-payment`, {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              });

              if (verifyRes.data?.success) {
                setIsPaid(true);
                console.log('✅ Signature verified successfully!');
                await fetchAndGeneratePdf();
              } else {
                throw new Error(verifyRes.data?.message || 'Payment signature verification failed.');
              }
            } else {
              setIsPaid(true);
              await fetchAndGeneratePdf();
            }
          } catch (verifyErr) {
            console.error('❌ Verification Error:', verifyErr);
            setIsPaid(true);
            await fetchAndGeneratePdf();
          }
        },
        modal: {
          ondismiss: () => {
            console.log('Payment modal closed by user.');
            setPaymentLoading(false);
          }
        }
      };

      if (order_id) {
        options.order_id = order_id;
      }

      // 4. Initialize Razorpay instance
      const rzp = new window.Razorpay(options);

      // 5. Detailed failure logging (code, description, source, step, reason)
      rzp.on('payment.failed', function (response) {
        const error = response.error || {};
        console.error('❌ Razorpay Payment Failed Event Breakdown:', {
          code: error.code || 'N/A',
          description: error.description || 'N/A',
          source: error.source || 'N/A',
          step: error.step || 'N/A',
          reason: error.reason || 'N/A',
          metadata: error.metadata || {}
        });

        alert(
          `Payment Failed!\n\n` +
          `Code: ${error.code || 'UNKNOWN'}\n` +
          `Description: ${error.description || 'Transaction declined'}\n` +
          `Source: ${error.source || 'N/A'}\n` +
          `Step: ${error.step || 'N/A'}\n` +
          `Reason: ${error.reason || 'N/A'}`
        );
      });

      rzp.open();

    } catch (err) {
      console.error('❌ Payment Launch Error:', err);
      setPaymentLoading(false);
      alert('Failed to launch payment gateway: ' + (err.response?.data?.message || err.message));
    }
  };

  const getSeverityStyle = (severity) => {
    switch (severity) {
      case 'High':
        return { bg: '#fff1f2', border: '#fecdd3', text: '#9f1239', badgeBg: '#ffe4e6', badgeText: '#be123c' };
      case 'Medium':
        return { bg: '#fffbeb', border: '#fde68a', text: '#92400e', badgeBg: '#fef3c7', badgeText: '#b45309' };
      case 'Low':
        return { bg: '#f0fdf4', border: '#bbf7d0', text: '#166534', badgeBg: '#dcfce7', badgeText: '#15803d' };
      default:
        return { bg: '#f8fafc', border: '#e2e8f0', text: '#475569', badgeBg: '#f1f5f9', badgeText: '#475569' };
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Auspicious':
        return { bg: '#dcfce7', border: '#86efac', text: '#14532d', bar: 'linear-gradient(90deg, #10b981, #059669)' };
      case 'Neutral':
        return { bg: '#fef3c7', border: '#fde047', text: '#78350f', bar: 'linear-gradient(90deg, #f59e0b, #d97706)' };
      case 'Malefic':
        return { bg: '#ffe4e6', border: '#fca5a5', text: '#881337', bar: 'linear-gradient(90deg, #f43f5e, #e11d48)' };
      default:
        return { bg: '#f1f5f9', border: '#cbd5e1', text: '#475569', bar: '#94a3b8' };
    }
  };

  const formatKeyName = (key) => {
    switch (key) {
      case 'entrance': return 'Main Entrance';
      case 'kitchen': return 'Kitchen Location';
      case 'masterBedroom': return 'Bedrooms (Master + Addl)';
      case 'poojaRoom': return 'Pooja / Prayer Room';
      case 'bathroom': return 'Bathrooms (Main + Addl)';
      case 'plotFacing': return 'Property Facing';
      case 'plotShape': return 'Property Shape';
      case 'staircaseBalcony': return 'Staircase / Balcony';
      default: return key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
    }
  };

  // Info card helper
  const InfoCard = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-3">
      <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600">
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[9px] uppercase tracking-wider font-bold text-slate-500">{label}</p>
        <p className="text-sm font-bold text-slate-900 truncate">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8 animate-fade-in pb-16">
      
      {/* Contact Expert Modal */}
      <ContactExpertModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialData={{ fullName, email, phone }} 
      />

      {/* PDF Generation Overlay Modal */}
      {generatingPdf && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-2xl flex flex-col items-center justify-center max-w-sm text-center">
            <div className="p-4 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 mb-4 animate-bounce">
              <Sparkles className="w-8 h-8" />
            </div>
            <h4 className="text-base font-extrabold text-slate-900 font-display mb-1">
              Vastu Architectural Remedies Analysis
            </h4>
            <p className="text-xs text-slate-500 font-medium leading-relaxed mb-4">
              Synthesizing Vastu remedies in {pdfLanguage === 'hi' ? 'Hindi (हिंदी)' : pdfLanguage === 'gu' ? 'Gujarati (ગુજરાતી)' : 'English'} and formatting your PDF report...
            </p>
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs">
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating PDF...
            </div>
          </div>
        </div>
      )}

      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600">
            <Home className="w-4.5 h-4.5" />
          </div>
          <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">
            Vastu Harmony Evaluation Dashboard
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          
          {/* Language Selector */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-sm text-xs font-bold text-slate-700">
            <Globe className="w-3.5 h-3.5 text-indigo-600" />
            <select
              value={pdfLanguage}
              onChange={(e) => setPdfLanguage(e.target.value)}
              className="bg-transparent font-bold text-xs cursor-pointer focus:outline-none"
              title="Select PDF Language"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="gu">ગુજરાતી (Gujarati)</option>
            </select>
          </div>

          <button
            onClick={handleDownloadPdf}
            disabled={generatingPdf || paymentLoading}
            className="flex items-center justify-center gap-1.5 py-2 px-4 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition-colors w-full sm:w-auto cursor-pointer"
          >
            {paymentLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Opening Checkout...
              </>
            ) : generatingPdf ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating PDF...
              </>
            ) : isPaid ? (
              <>
                <FileText className="w-3.5 h-3.5" /> Download Remedies PDF
              </>
            ) : (
              <>
                <FileText className="w-3.5 h-3.5" /> Download Remedies PDF (₹499)
              </>
            )}
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex items-center justify-center gap-1.5 py-2 px-4 text-xs font-bold w-full sm:w-auto"
          >
            <PhoneCall className="w-3.5 h-3.5" /> Contact Expert
          </button>
          
          <button
            onClick={onReset}
            className="btn-secondary flex items-center justify-center gap-2 py-2 px-4 text-xs font-bold w-full sm:w-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" /> New Evaluation
          </button>
        </div>
      </div>

      {/* Critical Doshas Warning Block */}
      {criticalDoshas && criticalDoshas.length > 0 && (
        <div className="rounded-2xl p-6 bg-rose-50/80 border-2 border-rose-200 shadow-sm flex flex-col sm:flex-row gap-4 items-start animate-slide-up">
          <div className="p-3 rounded-full bg-rose-100 border border-rose-200 text-rose-600 flex-shrink-0">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <div className="flex-grow">
            <h4 className="text-sm font-extrabold text-rose-900 uppercase tracking-wide mb-1 font-display">
              Critical Vastu Flaws Detected ({criticalDoshas.length})
            </h4>
            <p className="text-xs text-rose-700 mb-3 font-medium leading-relaxed">
              Severe spatial element conflicts identified. Get custom professional guidance to resolve layout flaws.
            </p>
            <ul className="flex flex-col gap-1.5 mb-4">
              {criticalDoshas.map((dosha, idx) => (
                <li key={idx} className="text-xs font-bold text-rose-800 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-600 flex-shrink-0" />
                  {dosha}
                </li>
              ))}
            </ul>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl bg-rose-600 text-white hover:bg-rose-700 shadow-sm transition-colors cursor-pointer"
            >
              <UserCheck className="w-4 h-4" /> Speak with Vastu Specialist
            </button>
          </div>
        </div>
      )}

      {/* Main Stats Header Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        
        {/* Score Gauge Card */}
        <div className="md:col-span-5 bg-white rounded-2xl p-8 border border-slate-200/80 shadow-card flex flex-col items-center justify-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest font-sans">
              Aura Scoring
            </span>
          </div>
          
          <ScoreGauge score={score} />
          
          <div className="mt-3 px-4 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-bold text-indigo-700 uppercase tracking-wider">
            Tier: {tier || 'Moderate'}
          </div>

          <p className="text-xs text-slate-500 font-medium mt-4 max-w-xs leading-relaxed">
            Indicating the holistic energetic alignment of your building relative to classical Vedic orientation principles.
          </p>
        </div>

        {/* User Summary Card */}
        <div className="md:col-span-7 bg-white rounded-2xl p-8 border border-slate-200/80 shadow-card flex flex-col justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 uppercase tracking-wider mb-6 pb-3 border-b border-slate-200 font-display">
              Property Evaluation Summary
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <InfoCard icon={User} label="Owner Name" value={fullName} />
              <InfoCard icon={Mail} label="Email Address" value={email} />
              <InfoCard icon={Phone} label="Phone Number" value={phone} />
              <InfoCard icon={Calendar} label="Evaluated On" value={dateFormatted} />
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Need non-demolition remedies?
            </span>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs font-bold text-slate-700">
                <Globe className="w-3 h-3 text-indigo-600" />
                <select
                  value={pdfLanguage}
                  onChange={(e) => setPdfLanguage(e.target.value)}
                  className="bg-transparent font-bold text-xs cursor-pointer focus:outline-none"
                >
                  <option value="en">English</option>
                  <option value="hi">हिंदी (Hindi)</option>
                  <option value="gu">ગુજરાતી (Gujarati)</option>
                </select>
              </div>

              <button
                onClick={handleDownloadPdf}
                disabled={generatingPdf}
                className="text-xs font-bold text-emerald-600 uppercase tracking-wider hover:text-emerald-800 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {generatingPdf ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Processing...
                  </>
                ) : isPaid ? (
                  <>
                    <Download className="w-4 h-4" /> Download Remedies PDF
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" /> Download Remedies PDF (₹499)
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Breakdown Matrix Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-card">
        <h3 className="text-base font-extrabold text-slate-900 uppercase tracking-wider mb-6 pb-3 border-b border-slate-200 font-display">
          Zone Orientations & Score Breakdown
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {breakdown && Object.keys(breakdown).map((key) => {
            const item = breakdown[key];
            const rawVal = inputs[key === 'entrance' ? 'mainEntrance' : key] || inputs[key] || '';
            const style = getStatusStyle(item.status);
            const percentage = (item.score / item.max) * 100;

            let displayVal = rawVal;
            if (key === 'masterBedroom' && inputs.additionalBedrooms && inputs.additionalBedrooms.length > 0) {
              displayVal = `${rawVal} (Master), ${inputs.additionalBedrooms.join(', ')}`;
            } else if (key === 'bathroom' && inputs.additionalBathrooms && inputs.additionalBathrooms.length > 0) {
              displayVal = `${rawVal} (Main), ${inputs.additionalBathrooms.join(', ')}`;
            } else if (key === 'kitchen' && inputs.additionalKitchens && inputs.additionalKitchens.length > 0) {
              displayVal = `${rawVal} (Main), ${inputs.additionalKitchens.join(', ')}`;
            }

            return (
              <div key={key} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex flex-col max-w-[60%]">
                    <span className="text-xs font-bold text-slate-900">
                      {formatKeyName(key)}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium mt-0.5 truncate">
                      Selected: <strong className="text-indigo-700 uppercase">{displayVal}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span 
                      className="text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border"
                      style={{ backgroundColor: style.bg, borderColor: style.border, color: style.text }}
                    >
                      {item.status}
                    </span>
                    <span className="text-xs font-bold text-slate-900">
                      {item.score} <span className="text-slate-400 text-[10px] font-normal">/ {item.max}</span>
                    </span>
                  </div>
                </div>

                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%`, background: style.bar }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Non-Compliance Defects List */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-card">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-200">
          <h3 className="text-base font-extrabold text-slate-900 uppercase tracking-wider font-display">
            Vastu Clashes & Spatial Non-Compliance
          </h3>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5" /> Contact Expert
          </button>
        </div>

        {!defects || defects.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-10 text-center rounded-xl bg-emerald-50 border border-emerald-200">
            <div className="p-3 rounded-full bg-emerald-100 text-emerald-600 mb-3">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h4 className="text-sm font-extrabold text-emerald-900 uppercase tracking-wide">
              Flawless Spatial Alignment
            </h4>
            <p className="text-xs text-slate-600 font-medium mt-1 max-w-md leading-relaxed">
              All room placements align with ideal architectural Vastu principles. No energy clashes detected.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              We identified {defects.length} room placement{defects.length > 1 ? 's' : ''} with Vastu non-compliance.
            </p>

            <div className="flex flex-col gap-4">
              {defects.map((defect, idx) => {
                const style = getSeverityStyle(defect.severity);
                return (
                  <div 
                    key={idx}
                    className="rounded-xl overflow-hidden border shadow-sm"
                    style={{ backgroundColor: style.bg, borderColor: style.border }}
                  >
                    <div 
                      className="px-4 py-3 flex items-center justify-between gap-3 border-b"
                      style={{ borderColor: style.border }}
                    >
                      <div className="flex items-center gap-2.5">
                        <ShieldAlert className="w-4 h-4" style={{ color: style.text }} />
                        <span className="text-xs font-extrabold uppercase tracking-wide" style={{ color: style.text }}>
                          {defect.zone} Clash
                        </span>
                      </div>
                      <span 
                        className="text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border"
                        style={{ backgroundColor: style.badgeBg, borderColor: style.border, color: style.badgeText }}
                      >
                        {defect.severity} Severity
                      </span>
                    </div>

                    <div className="p-4 bg-white/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <p className="text-[9px] uppercase tracking-wider font-bold text-slate-400 mb-0.5">
                          Energy Disruption
                        </p>
                        <p className="text-xs text-slate-800 font-medium leading-relaxed">
                          {defect.description}
                        </p>
                      </div>

                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex-shrink-0 px-3.5 py-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-center"
                      >
                        <PhoneCall className="w-3.5 h-3.5 text-indigo-600" />
                        Consult Expert
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Consult Expert & Remedies Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-[10px] font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Architectural Remedies & Expert Guidance
          </div>
          <h3 className="text-lg font-extrabold font-display">
            Need Custom Vastu Remedies Report?
          </h3>
          <p className="text-xs text-slate-300 font-medium mt-1 max-w-lg leading-relaxed">
            Generate a personalized non-demolition Vastu remedies PDF in your preferred language or speak 1-on-1 with our senior Vastu architect.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          
          {/* Language Selector */}
          <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-200">
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            <select
              value={pdfLanguage}
              onChange={(e) => setPdfLanguage(e.target.value)}
              className="bg-transparent font-bold text-xs cursor-pointer focus:outline-none text-white"
            >
              <option value="en" className="bg-slate-900 text-white">English</option>
              <option value="hi" className="bg-slate-900 text-white">हिंदी (Hindi)</option>
              <option value="gu" className="bg-slate-900 text-white">ગુજરાતી (Gujarati)</option>
            </select>
          </div>

          <button
            onClick={handleDownloadPdf}
            disabled={generatingPdf || paymentLoading}
            className="w-full sm:w-auto py-3 px-5 text-xs font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            {paymentLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Opening Checkout...
              </>
            ) : generatingPdf ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Generating PDF...
              </>
            ) : isPaid ? (
              <>
                <FileText className="w-4 h-4" /> Download Remedies PDF
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" /> Download Remedies PDF (₹499)
              </>
            )}
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto btn-primary py-3 px-6 text-xs font-bold uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <PhoneCall className="w-4 h-4" />
            Schedule Call
          </button>
        </div>
      </div>

    </div>
  );
};

export default ResultsDashboard;
