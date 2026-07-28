import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Mail, Phone, ChevronRight, ChevronLeft, Loader2, Sparkles, Layout, Plus, Trash2 } from 'lucide-react';
import StepProgressBar from '../components/StepProgressBar';
import DirectionSelect from '../components/DirectionSelect';
import { getApiUrl } from '../utils/apiUrl';

const CalculatorForm = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  // Vastu direction selections
  const [directions, setDirections] = useState({
    mainEntrance: 'N',
    kitchen: 'SE',
    masterBedroom: 'SW',
    poojaRoom: 'NE',
    bathroom: 'NW',
    plotFacing: 'N',
    plotShape: 'Square',
    staircaseBalcony: 'SW',
  });

  // Multiple Bedrooms / Bathrooms / Kitchens states
  const [additionalBedrooms, setAdditionalBedrooms] = useState([]);
  const [additionalBathrooms, setAdditionalBathrooms] = useState([]);
  const [additionalKitchens, setAdditionalKitchens] = useState([]);

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  const handleDirectionChange = (key, value) => {
    setDirections((prev) => ({ ...prev, [key]: value }));
  };

  // Additional Bedrooms handlers
  const addBedroom = () => {
    setAdditionalBedrooms((prev) => [...prev, 'W']);
  };

  const removeBedroom = (index) => {
    setAdditionalBedrooms((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAdditionalBedroomChange = (index, value) => {
    setAdditionalBedrooms((prev) => {
      const newBeds = [...prev];
      newBeds[index] = value;
      return newBeds;
    });
  };

  // Additional Bathrooms handlers
  const addBathroom = () => {
    setAdditionalBathrooms((prev) => [...prev, 'NW']);
  };

  const removeBathroom = (index) => {
    setAdditionalBathrooms((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAdditionalBathroomChange = (index, value) => {
    setAdditionalBathrooms((prev) => {
      const newBaths = [...prev];
      newBaths[index] = value;
      return newBaths;
    });
  };

  // Additional Kitchens handlers
  const addKitchen = () => {
    setAdditionalKitchens((prev) => [...prev, 'NW']);
  };

  const removeKitchen = (index) => {
    setAdditionalKitchens((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAdditionalKitchenChange = (index, value) => {
    setAdditionalKitchens((prev) => {
      const newKitchens = [...prev];
      newKitchens[index] = value;
      return newKitchens;
    });
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (step === 1) {
      if (!fullName.trim() || !email.trim() || !phone.trim()) {
        setError('Please fill in all personal details.');
        return;
      }
      if (!/\S+@\S+\.\S+/.test(email)) {
        setError('Please enter a valid email address.');
        return;
      }
    }
    setError('');
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setError('');
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    // Construct submission payload
    const payload = {
      fullName,
      email,
      phone,
      ...directions,
      additionalBedrooms,
      additionalBathrooms,
      additionalKitchens,
    };

    try {
      const API_URL = getApiUrl();
      const response = await axios.post(`${API_URL}/api/reports`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data?.success) {
        onComplete(response.data.data);
      } else {
        setError('Failed to calculate Vastu score. Please try again.');
      }
    } catch (err) {
      console.error(err);
      const serverMsg = err.response?.data?.message || err.message;
      setError(`Submission error: ${serverMsg}`);
    } finally {
      setLoading(false);
    }
  };

  // Section header component
  const SectionHeader = ({ stepNum, title, subtitle }) => (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-1.5">
        <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-indigo-sm">
          {stepNum}
        </div>
        <h3 className="text-base font-bold text-slate-900 font-display tracking-tight">
          {title}
        </h3>
      </div>
      {subtitle && (
        <p className="text-xs text-slate-500 ml-10 font-medium">{subtitle}</p>
      )}
      <div className="mt-3.5 h-px bg-slate-200" />
    </div>
  );

  return (
    <div className="w-full max-w-xl mx-auto bg-white p-5 sm:p-8 md:p-10 rounded-2xl border border-slate-200/80 shadow-card animate-fade-in">
      
      {/* Brand Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-100 mb-3">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-widest font-sans">
            Vedic Architecture Analysis
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display mb-2 tracking-tight">
          Vastu Harmony Scorer
        </h2>
        <p className="text-slate-500 text-xs sm:text-sm leading-relaxed max-w-md mx-auto font-medium">
          Enter property specifications and select room orientations to derive a precise architectural compliance rating.
        </p>
      </div>

      {/* Progress Stepper */}
      <StepProgressBar currentStep={step} />

      {/* Error message */}
      {error && (
        <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2 animate-slide-up">
          <span className="w-2 h-2 rounded-full bg-rose-600 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Form Content */}
      <form onSubmit={step === 3 ? handleSubmit : handleNext} className="mt-8">
        
        {/* Step 1: Owner Details & Entrance */}
        {step === 1 && (
          <div className="flex flex-col gap-6 animate-fade-in">
            <SectionHeader stepNum="1" title="Owner Details & Entrance" subtitle="Enter contact information and main property entrance direction." />
            
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Full Name *</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="input-minimalist pl-10"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Email Address *</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="e.g. john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-minimalist pl-10"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Phone Number *</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="tel"
                  required
                  placeholder="e.g. +1 234 567 8900"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input-minimalist pl-10"
                />
              </div>
            </div>

            <div className="mt-2">
              <DirectionSelect
                label="Main Entrance Direction (facing out) *"
                value={directions.mainEntrance}
                onChange={(val) => handleDirectionChange('mainEntrance', val)}
              />
            </div>
          </div>
        )}

        {/* Step 2: Key Living Zones */}
        {step === 2 && (
          <div className="flex flex-col gap-6 animate-fade-in">
            <SectionHeader stepNum="2" title="Key Living Zones" subtitle="Select compass placement for primary living areas." />

            <DirectionSelect
              label="Kitchen Zone Location *"
              value={directions.kitchen}
              onChange={(val) => handleDirectionChange('kitchen', val)}
            />

            {/* Additional Kitchens list */}
            <div className="pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Additional Kitchens ({additionalKitchens.length})
                </label>
              </div>

              {additionalKitchens.map((kitchenDir, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4 animate-scale-in">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-800">
                      🍳 Kitchen {idx + 2}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeKitchen(idx)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <DirectionSelect
                    label={`Kitchen ${idx + 2} Location`}
                    value={kitchenDir}
                    onChange={(val) => handleAdditionalKitchenChange(idx, val)}
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={addKitchen}
                className="flex items-center justify-center gap-2 text-xs font-bold text-indigo-600 border border-dashed border-indigo-300 hover:border-indigo-500 bg-indigo-50/50 hover:bg-indigo-50 py-3 px-4 rounded-xl transition-colors cursor-pointer w-full"
              >
                <Plus className="w-4 h-4" /> Add Kitchen
              </button>
            </div>

            <DirectionSelect
              label="Master Bedroom Location *"
              value={directions.masterBedroom}
              onChange={(val) => handleDirectionChange('masterBedroom', val)}
            />

            {/* Additional Bedrooms list */}
            <div className="pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Additional Bedrooms ({additionalBedrooms.length})
                </label>
              </div>

              {additionalBedrooms.map((bedroomDir, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4 animate-scale-in">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-800">
                      🛏️ Bedroom {idx + 2}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeBedroom(idx)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <DirectionSelect
                    label={`Bedroom ${idx + 2} Location`}
                    value={bedroomDir}
                    onChange={(val) => handleAdditionalBedroomChange(idx, val)}
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={addBedroom}
                className="flex items-center justify-center gap-2 text-xs font-bold text-indigo-600 border border-dashed border-indigo-300 hover:border-indigo-500 bg-indigo-50/50 hover:bg-indigo-50 py-3 px-4 rounded-xl transition-colors cursor-pointer w-full"
              >
                <Plus className="w-4 h-4" /> Add Bedroom
              </button>
            </div>

            <DirectionSelect
              label="Pooja / Prayer Room Zone *"
              value={directions.poojaRoom}
              onChange={(val) => handleDirectionChange('poojaRoom', val)}
            />
          </div>
        )}

        {/* Step 3: Property Configuration & Submit */}
        {step === 3 && (
          <div className="flex flex-col gap-6 animate-fade-in">
            <SectionHeader stepNum="3" title="Property Configuration" subtitle="Configure plot geometry, bathroom placements, and calculate score." />

            <DirectionSelect
              label="Plot / Property Facing Direction *"
              value={directions.plotFacing}
              onChange={(val) => handleDirectionChange('plotFacing', val)}
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Plot / Property Shape *
              </label>
              <div className="relative">
                <select
                  value={directions.plotShape}
                  onChange={(e) => handleDirectionChange('plotShape', e.target.value)}
                  className="input-minimalist pr-10 appearance-none cursor-pointer font-medium"
                >
                  <option value="Square">Square (Ideal)</option>
                  <option value="Rectangle">Rectangle (Auspicious)</option>
                  <option value="L-Shaped">L-Shaped (Imperfect)</option>
                  <option value="Extending">Extending Corners (Defected)</option>
                  <option value="Triangular">Triangular (Severe Defect)</option>
                  <option value="Irregular">Irregular Shape</option>
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <Layout className="w-4 h-4" />
                </div>
              </div>
            </div>

            <DirectionSelect
              label="Bathroom / Toilet Zone Location *"
              value={directions.bathroom}
              onChange={(val) => handleDirectionChange('bathroom', val)}
            />

            {/* Additional Bathrooms list */}
            <div className="pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Additional Bathrooms ({additionalBathrooms.length})
                </label>
              </div>

              {additionalBathrooms.map((bathDir, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4 animate-scale-in">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-800">
                      🚾 Bathroom {idx + 2}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeBathroom(idx)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <DirectionSelect
                    label={`Bathroom ${idx + 2} Location`}
                    value={bathDir}
                    onChange={(val) => handleAdditionalBathroomChange(idx, val)}
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={addBathroom}
                className="flex items-center justify-center gap-2 text-xs font-bold text-indigo-600 border border-dashed border-indigo-300 hover:border-indigo-500 bg-indigo-50/50 hover:bg-indigo-50 py-3 px-4 rounded-xl transition-colors cursor-pointer w-full"
              >
                <Plus className="w-4 h-4" /> Add Bathroom
              </button>
            </div>

            <DirectionSelect
              label="Staircase / Open Balcony Zone *"
              value={directions.staircaseBalcony}
              onChange={(val) => handleDirectionChange('staircaseBalcony', val)}
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-4 mt-10 pt-6 border-t border-slate-200">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              disabled={loading}
              className="btn-secondary flex items-center justify-center gap-1.5 py-2.5 px-5 text-sm"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="submit"
              className="btn-primary flex items-center justify-center gap-1.5 py-2.5 px-6 text-sm ml-auto"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="btn-terracotta flex items-center justify-center gap-2 py-3 px-8 text-sm ml-auto font-bold"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Calculating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Calculate Vastu Score
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CalculatorForm;
