import React, { useState } from 'react';
import { X, PhoneCall, MessageCircle, ShieldCheck, ExternalLink, Clock, UserCheck } from 'lucide-react';

const ContactExpertModal = ({ isOpen, onClose, initialData = {} }) => {
  const consultantPhone = '8140395693';
  const consultantFormattedPhone = '+91 81403 95693';

  const [userName, setUserName] = useState(initialData.fullName || '');
  const [customMsg, setCustomMsg] = useState('');

  if (!isOpen) return null;

  // Build dynamic WhatsApp link
  const defaultWhatsAppText = userName 
    ? `Hello Vastu Expert, my name is ${userName}. I would like to consult regarding my property Vastu score evaluation.`
    : `Hello Vastu Expert, I would like to consult regarding my property Vastu score evaluation.`;
  
  const finalWhatsAppText = customMsg.trim() ? customMsg : defaultWhatsAppText;
  const whatsappUrl = `https://wa.me/91${consultantPhone}?text=${encodeURIComponent(finalWhatsAppText)}`;
  const phoneCallUrl = `tel:+91${consultantPhone}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-indigo-sm">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-display uppercase tracking-wider">
                Direct Vastu Consultation
              </h3>
              <p className="text-[10px] text-slate-300 font-medium">
                Connect Directly with Senior Architect
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 flex flex-col gap-5">

          {/* Privacy Badge */}
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>100% Private & Direct. No forms or public portal tracking.</span>
          </div>

          {/* Contact Methods */}
          <div className="flex flex-col gap-3">
            
            {/* WhatsApp Direct Action */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 transition-all transform active:scale-[0.98] group cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 rounded-lg bg-white/20 text-white">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-extrabold flex items-center gap-1.5">
                    Message on WhatsApp
                    <ExternalLink className="w-3.5 h-3.5 text-emerald-200 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <div className="text-xs text-emerald-100 font-medium">
                    {consultantFormattedPhone} • Instant Response
                  </div>
                </div>
              </div>
            </a>

            {/* Direct Phone Call Action */}
            <a
              href={phoneCallUrl}
              className="flex items-center justify-between p-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 transition-all transform active:scale-[0.98] group cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 rounded-lg bg-white/20 text-white">
                  <PhoneCall className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-extrabold flex items-center gap-1.5">
                    Direct Phone Call
                    <ExternalLink className="w-3.5 h-3.5 text-indigo-200 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <div className="text-xs text-indigo-100 font-medium">
                    {consultantFormattedPhone} • Immediate Call
                  </div>
                </div>
              </div>
            </a>

          </div>

          {/* Optional Pre-filled Message Note */}
          <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-100">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              Customize WhatsApp Message (Optional)
            </label>
            <textarea
              rows={2}
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              placeholder={defaultWhatsAppText}
              className="input-minimalist py-2 text-xs"
            />
          </div>

          {/* Consultant Availability Info */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Available: 9:00 AM - 8:00 PM IST
            </span>
            <span className="font-bold text-slate-700">Senior Vastu Architect</span>
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary py-2.5 px-4 text-xs font-bold w-full uppercase tracking-wider"
          >
            Close Window
          </button>

        </div>
      </div>
    </div>
  );
};

export default ContactExpertModal;
