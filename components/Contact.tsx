import React from 'react';
import { Button } from './Button';
import { ButtonVariant } from '../types';

export const Contact: React.FC = () => {
  return (
    <>
      <style>{`
        .clipboard {
          background-color: #f3f4f6;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          position: relative;
          padding-top: 60px; /* Space for the clip */
        }

        .clipboard-clip {
          position: absolute;
          top: -20px;
          left: 50%;
          transform: translateX(-50%);
          width: 120px;
          height: 40px;
          background-color: #9ca3af;
          border: 1px solid #6b7280;
          border-bottom: none;
          border-radius: 8px 8px 0 0;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .form-input-group {
          position: relative;
        }

        .form-input {
          font-family: 'IBM Plex Mono', monospace;
          background: transparent;
          border: 1px solid #9ca3af;
          border-radius: 4px;
          padding: 12px 16px;
          width: 100%;
          color: #1f2937;
          transition: border-color 0.3s ease;
        }
        
        .form-input:focus {
          outline: none;
          border-color: #f97316;
        }
        
        .drop-zone {
          border: 2px dashed #9ca3af;
          border-radius: 8px;
          padding: 40px;
          text-align: center;
          color: #6b7280;
          cursor: pointer;
          transition: border-color 0.3s ease, background-color 0.3s ease;
        }
        
        .drop-zone:hover {
          border-color: #f97316;
          background-color: #fef2e8;
        }
        
        .contact-section-wrapper {
          position: relative;
          z-index: 20; /* Ensure contact is above footer initially */
          background-color: #111827; /* bg-background */
        }
        
        .footer-reveal {
          position: sticky;
          bottom: 0;
          z-index: 10;
        }
      `}</style>
      <div className="contact-section-wrapper">
        <section id="contact" className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="clipboard p-6 md:p-10">
              <div className="clipboard-clip"></div>
              <div className="text-center mb-10">
                <h2 className="font-header text-4xl uppercase font-bold text-gray-800">Project Intake</h2>
                <p className="font-body text-gray-600">Site Inspection & RFP Submission</p>
              </div>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-input-group">
                    <input type="text" placeholder="Full Name" className="form-input" />
                  </div>
                  <div className="form-input-group">
                    <input type="email" placeholder="Email Address" className="form-input" />
                  </div>
                </div>
                <div className="form-input-group">
                  <input type="text" placeholder="Project Location (e.g., Mumbai, MH)" className="form-input" />
                </div>
                <div className="form-input-group">
                  <textarea placeholder="Brief Project Description..." className="form-input h-32"></textarea>
                </div>
                
                <div className="drop-zone">
                  <p className="font-body">Drag & Drop Site Maps, RFPs, or other documents here.</p>
                  <p className="text-xs text-gray-500 mt-1">Max file size: 25MB</p>
                </div>

                <div className="text-center">
                  <Button label="Submit Inquiry" variant={ButtonVariant.PRIMARY} />
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
