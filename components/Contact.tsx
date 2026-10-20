import React, { useState } from 'react';
import { 
  Building2, 
  Send, 
  Check, 
  Phone, 
  Mail, 
  MapPin, 
  FileText, 
  Clock, 
  ShieldCheck, 
  ArrowRight,
  HardHat,
  Loader2
} from 'lucide-react';
import { submitContactInquiry } from '../src/lib/supabase';
import { adminStore } from '../src/admin/adminStore';

export const Contact: React.FC = () => {
  // Step in Wizard: 1 -> 2 -> 3
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form Fields
  const [projectScope, setProjectScope] = useState('Deep Excavation & Earthmoving');
  const [siteLocation, setSiteLocation] = useState('');
  const [scaleDepth, setScaleDepth] = useState('2-3 Basement Levels');
  const [targetTimeline, setTargetTimeline] = useState('Immediate / Tendering Now');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [rfpLink, setRfpLink] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (!siteLocation.trim()) {
        setErrorMessage('Please enter project location / corridor.');
        return;
      }
      setErrorMessage('');
      setStep(3);
    }
  };

  const handleSubmitFinal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone) {
      setErrorMessage('Please provide your name, business email, and direct phone.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    const formattedMessage = `[Scope: ${projectScope}] [Scale: ${scaleDepth}] [Timeline: ${targetTimeline}] [Location: ${siteLocation}] [Company: ${companyName}] Notes: ${message} ${rfpLink ? `(RFP Link: ${rfpLink})` : ''}`;

    try {
      await submitContactInquiry({
        full_name: fullName,
        email,
        phone,
        project_location: siteLocation,
        message: formattedMessage,
      });

      // Optimistic update in adminStore
      adminStore.syncWithSupabase().catch(() => {});

      setSubmitted(true);
    } catch (err: any) {
      console.error('Submission failed:', err);
      setErrorMessage('Could not transmit proposal request. Please call our tendering desk directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="scroll-mt-28 py-20 px-4 bg-background border-t border-border-subtle relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-safety/10 border border-safety/30 text-safety text-xs font-mono font-bold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Direct Commercial & Tendering Gateway</span>
          </div>
          <h2 className="font-header text-4xl sm:text-5xl uppercase font-bold text-text-primary tracking-tight">
            Discuss Your Upcoming Project
          </h2>
          <p className="font-body text-text-secondary text-sm sm:text-base mt-3 leading-relaxed">
            Connect directly with our engineering and estimating directors. We provide initial feasibility reviews, shoring constructability advice, and BOQ rate estimates.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Contacts & Human Transparency */}
          <div className="lg:col-span-5 space-y-6">
            {/* Named Executive Contact Box */}
            <div className="bg-surface border border-border-subtle rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-safety font-bold block mb-1">
                  Managing Leadership & Tendering Desk
                </span>
                <h3 className="font-header text-2xl font-bold uppercase text-text-primary">
                  Mr. Ashok Kumar Pal
                </h3>
                <p className="text-xs text-text-secondary font-mono mt-0.5">
                  Proprietor & Head of Contracts
                </p>
              </div>

              <div className="space-y-4 pt-2 border-t border-border-subtle text-xs sm:text-sm">
                <a
                  href="tel:+919930900048"
                  className="flex items-center gap-3 text-text-secondary hover:text-safety transition-colors group"
                >
                  <div className="w-9 h-9 rounded-lg bg-surface-subtle group-hover:bg-safety/10 flex items-center justify-center text-safety flex-shrink-0 border border-border-subtle">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-text-secondary uppercase block">Direct Desk / Mobile</span>
                    <span className="font-mono font-bold text-text-primary">+91 99309 00048</span>
                  </div>
                </a>

                <a
                  href="mailto:omenterprise20@gmail.com"
                  className="flex items-center gap-3 text-text-secondary hover:text-safety transition-colors group"
                >
                  <div className="w-9 h-9 rounded-lg bg-surface-subtle group-hover:bg-safety/10 flex items-center justify-center text-safety flex-shrink-0 border border-border-subtle">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-text-secondary uppercase block">Tenders & Inquiries</span>
                    <span className="font-mono font-bold text-text-primary">omenterprise20@gmail.com</span>
                  </div>
                </a>

                <div className="flex items-start gap-3 text-text-secondary">
                  <div className="w-9 h-9 rounded-lg bg-surface-subtle flex items-center justify-center text-safety flex-shrink-0 border border-border-subtle mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-text-secondary uppercase block">Registered Office</span>
                    <span className="text-xs text-text-primary leading-snug block">
                      412, B2B Agrawal Centre, D’Monte Lane, Kanchpada, Malad West, Mumbai – 400064, Maharashtra.
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-text-secondary">
                  <div className="w-9 h-9 rounded-lg bg-surface-subtle flex items-center justify-center text-safety flex-shrink-0 border border-border-subtle">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-text-secondary uppercase block">Office Hours</span>
                    <span className="text-xs font-mono text-text-primary">Monday – Saturday: 9:00 AM – 7:00 PM</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Subcontractor & Vendor Callout */}
            <div className="p-4 bg-surface-subtle border border-border-subtle rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <HardHat className="w-4 h-4 text-text-secondary" />
                <span className="text-text-secondary">Material Suppliers & Trade Vendors:</span>
              </div>
              <a
                href="mailto:omenterprise20@gmail.com?subject=Vendor%20Prequalification%20Submission"
                className="font-mono font-bold text-safety hover:underline"
              >
                Vendor Registration &rarr;
              </a>
            </div>
          </div>

          {/* Right Column: 3-Step Project Proposal Wizard (The PCL Model) */}
          <div className="lg:col-span-7 bg-surface border border-border-subtle rounded-2xl p-6 sm:p-8 shadow-xl">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="font-header text-2xl font-bold uppercase text-text-primary">
                  Inquiry Transmitted to Tendering Desk
                </h3>
                <p className="font-body text-xs sm:text-sm text-text-secondary max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="text-text-primary">{fullName}</strong>. Our senior estimating team will review your project parameters and reach out within 24 business hours.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setStep(1);
                    }}
                    className="px-5 py-2.5 rounded-lg bg-surface-subtle hover:bg-border-subtle text-text-primary font-mono text-xs cursor-pointer border border-border-subtle"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {/* Wizard Step Progress Indicator */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-border-subtle">
                  <div className="flex items-center gap-2">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                      step === 1 ? 'bg-safety text-black' : 'bg-surface-subtle text-text-secondary'
                    }`}>
                      1
                    </span>
                    <span className={`text-xs font-header uppercase tracking-wider ${
                      step === 1 ? 'text-text-primary font-bold' : 'text-text-secondary'
                    }`}>
                      Scope
                    </span>
                  </div>

                  <div className="h-0.5 flex-1 mx-3 bg-border-subtle" />

                  <div className="flex items-center gap-2">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                      step === 2 ? 'bg-safety text-black' : 'bg-surface-subtle text-text-secondary'
                    }`}>
                      2
                    </span>
                    <span className={`text-xs font-header uppercase tracking-wider ${
                      step === 2 ? 'text-text-primary font-bold' : 'text-text-secondary'
                    }`}>
                      Scale & Site
                    </span>
                  </div>

                  <div className="h-0.5 flex-1 mx-3 bg-border-subtle" />

                  <div className="flex items-center gap-2">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                      step === 3 ? 'bg-safety text-black' : 'bg-surface-subtle text-text-secondary'
                    }`}>
                      3
                    </span>
                    <span className={`text-xs font-header uppercase tracking-wider ${
                      step === 3 ? 'text-text-primary font-bold' : 'text-text-secondary'
                    }`}>
                      Proposal
                    </span>
                  </div>
                </div>

                {errorMessage && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400 font-mono">
                    {errorMessage}
                  </div>
                )}

                {/* STEP 1: SCOPE */}
                {step === 1 && (
                  <form onSubmit={handleNextStep} className="space-y-5">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-3">
                        Select Primary Substructure Scope Required:
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          'Deep Excavation & Earthmoving',
                          'Piling & Shoring Pit Walls',
                          'Prestressed Rock Anchoring',
                          'Structural Building Demolition',
                          'Turnkey Substructure Package',
                          'Plant & Machinery Hire',
                        ].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setProjectScope(s)}
                            className={`p-3.5 rounded-xl border text-left text-xs font-header uppercase tracking-wider font-bold transition-all cursor-pointer ${
                              projectScope === s
                                ? 'bg-safety/15 text-safety border-safety shadow-sm'
                                : 'bg-surface-subtle/50 text-text-secondary hover:text-text-primary border-border-subtle'
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button
                        type="submit"
                        className="px-6 py-3 rounded-lg bg-safety hover:bg-safety-hover text-black font-header font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-safety/20"
                      >
                        <span>Continue to Step 2</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                )}

                {/* STEP 2: SCALE & SITE */}
                {step === 2 && (
                  <form onSubmit={handleNextStep} className="space-y-4">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1.5">
                        Site Location / Corridor *
                      </label>
                      <input
                        type="text"
                        required
                        value={siteLocation}
                        onChange={(e) => setSiteLocation(e.target.value)}
                        placeholder="e.g. Bandra West, Powai, Thane West, Navi Mumbai..."
                        className="w-full bg-surface-subtle border border-border-subtle rounded-lg px-3.5 py-2.5 text-xs text-text-primary focus:outline-none focus:border-safety"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1.5">
                          Basement Depth / Scale
                        </label>
                        <select
                          value={scaleDepth}
                          onChange={(e) => setScaleDepth(e.target.value)}
                          className="w-full bg-surface-subtle border border-border-subtle rounded-lg px-3.5 py-2.5 text-xs text-text-primary focus:outline-none focus:border-safety cursor-pointer"
                        >
                          <option value="1 Basement (4m - 6m)">1 Basement Level (4m - 6m)</option>
                          <option value="2-3 Basement Levels (8m - 12m)">2-3 Basement Levels (8m - 12m)</option>
                          <option value="4+ Deep Basements (14m - 20m)">4+ Deep Basements (14m - 20m)</option>
                          <option value="Mass Earthmoving (50,000+ CuM)">Mass Earthmoving (50,000+ CuM)</option>
                          <option value="Bridge / Marine Foundation">Bridge / Marine Foundation</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1.5">
                          Target Mobilization Timeline
                        </label>
                        <select
                          value={targetTimeline}
                          onChange={(e) => setTargetTimeline(e.target.value)}
                          className="w-full bg-surface-subtle border border-border-subtle rounded-lg px-3.5 py-2.5 text-xs text-text-primary focus:outline-none focus:border-safety cursor-pointer"
                        >
                          <option value="Immediate / Tendering Now">Immediate / Tendering Now</option>
                          <option value="Mobilization within 30-45 Days">Mobilization within 30-45 Days</option>
                          <option value="Q1/Q2 Upcoming Planning">Q1/Q2 Upcoming Planning</option>
                          <option value="Budgeting & Feasibility">Budgeting & Feasibility Study</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-4 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="px-4 py-2.5 rounded-lg text-xs font-mono text-text-secondary hover:text-text-primary"
                      >
                        &larr; Back
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-3 rounded-lg bg-safety hover:bg-safety-hover text-black font-header font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-safety/20"
                      >
                        <span>Continue to Step 3</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                )}

                {/* STEP 3: CONTACT & PROPOSAL */}
                {step === 3 && (
                  <form onSubmit={handleSubmitFinal} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Your Name"
                          className="w-full bg-surface-subtle border border-border-subtle rounded-lg px-3.5 py-2 text-xs text-text-primary focus:outline-none focus:border-safety"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1">
                          Company / Developer Name
                        </label>
                        <input
                          type="text"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="e.g. L&T / Godrej / Self"
                          className="w-full bg-surface-subtle border border-border-subtle rounded-lg px-3.5 py-2 text-xs text-text-primary focus:outline-none focus:border-safety"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1">
                          Work Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@company.com"
                          className="w-full bg-surface-subtle border border-border-subtle rounded-lg px-3.5 py-2 text-xs text-text-primary focus:outline-none focus:border-safety"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1">
                          Direct Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98..."
                          className="w-full bg-surface-subtle border border-border-subtle rounded-lg px-3.5 py-2 text-xs text-text-primary focus:outline-none focus:border-safety"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1">
                        Brief Technical Scope / Notes
                      </label>
                      <textarea
                        rows={2}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Any specific rock conditions, site constraints, or tender timelines..."
                        className="w-full bg-surface-subtle border border-border-subtle rounded-lg px-3.5 py-2 text-xs text-text-primary focus:outline-none focus:border-safety"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1">
                        BOQ / Geotechnical Report Link (Google Drive / WeTransfer)
                      </label>
                      <input
                        type="url"
                        value={rfpLink}
                        onChange={(e) => setRfpLink(e.target.value)}
                        placeholder="https://drive.google.com/..."
                        className="w-full bg-surface-subtle border border-border-subtle rounded-lg px-3.5 py-2 text-xs text-text-primary focus:outline-none focus:border-safety"
                      />
                    </div>

                    <div className="pt-3 flex items-center justify-between border-t border-border-subtle">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="px-4 py-2 rounded-lg text-xs font-mono text-text-secondary hover:text-text-primary"
                      >
                        &larr; Back
                      </button>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-3 rounded-lg bg-safety hover:bg-safety-hover text-black font-header font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-safety/20 disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Transmitting...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Submit Project RFP</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
