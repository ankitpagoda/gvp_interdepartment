import React from 'react';
import type { User } from '../types';

interface SuggestionsSectionProps {
    user: User | null;
}

const SuggestionsSection: React.FC<SuggestionsSectionProps> = ({ user }) => {
    return (
        <div className="suggestions-root">
            <div className="suggestions-container">
                <div className="suggestions-card shadow-soft">
                    <header className="suggestions-header">
                        <h1 className="suggestions-title">Suggestions</h1>
                        <div className="suggestions-underline"></div>
                    </header>

                    <form className="suggestions-form" onSubmit={(e) => e.preventDefault()}>
                        <div className="form-group">
                            <label htmlFor="name" className="form-label-hidden">Name</label>
                            <input
                                type="text"
                                id="name"
                                className="suggestion-input autofill-look"
                                defaultValue={user?.name || ''}
                                placeholder="Name"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="department" className="form-label-hidden">Department</label>
                            <input
                                type="text"
                                id="department"
                                className="suggestion-input autofill-look"
                                defaultValue={user?.department || ''}
                                placeholder="Department"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="to" className="form-label-hidden">To</label>
                            <input
                                type="text"
                                id="to"
                                className="suggestion-input"
                                placeholder="Recipient"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="cc" className="form-label-hidden">CC</label>
                            <input
                                type="text"
                                id="cc"
                                className="suggestion-input"
                                placeholder="CC"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="suggestion" className="form-label-hidden">Suggestion</label>
                            <textarea
                                id="suggestion"
                                className="suggestion-textarea"
                                placeholder="Enter your suggestion here..."
                                rows={8}
                            ></textarea>
                        </div>

                        <div className="form-submit-container">
                            <button type="submit" className="suggestion-submit-btn">
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <style>{`
        .suggestions-root {
          background-color: #f8fafc;
          min-height: 100%;
          width: 100%;
          padding: 3rem 1.5rem;
          display: flex;
          justify-content: center;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
        }

        .suggestions-container {
          width: 100%;
          max-width: 680px;
        }

        .suggestions-card {
          background-color: #ffffff;
          border-radius: 24px;
          padding: 3.5rem;
          border: 1px solid #edf2f7;
        }

        .shadow-soft {
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.04), 
                      0 8px 10px -6px rgba(0, 0, 0, 0.02);
        }

        .suggestions-header {
          text-align: left;
          margin-bottom: 2.5rem;
        }

        .suggestions-title {
          font-size: 2rem;
          font-weight: 800;
          color: #1e293b;
          margin: 0 0 0.5rem 0;
          letter-spacing: -0.01em;
        }

        .suggestions-underline {
          width: 60px;
          height: 4px;
          background-color: #1e3a8a; /* Dark Blue */
          border-radius: 2px;
        }

        .suggestions-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-label-hidden {
          display: none;
        }

        .suggestion-input, 
        .suggestion-textarea {
          width: 100%;
          padding: 0.85rem 1.25rem;
          border: 1px solid #1e3a8a; /* Dark Blue border as requested */
          border-radius: 12px;
          font-size: 1rem;
          font-family: inherit;
          color: #334155;
          background-color: #ffffff;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .suggestion-input::placeholder, 
        .suggestion-textarea::placeholder {
          color: #94a3b8;
        }

        .suggestion-input:focus, 
        .suggestion-textarea:focus {
          box-shadow: 0 0 0 4px rgba(30, 58, 138, 0.05);
        }

        .autofill-look {
          background-color: #f8fafc;
          border-color: #e2e8f0;
          color: #64748b;
        }

        .suggestion-textarea {
          resize: none;
          line-height: 1.6;
        }

        .form-submit-container {
          display: flex;
          justify-content: center;
          margin-top: 1.5rem;
        }

        .suggestion-submit-btn {
          background-color: #ffffff;
          border: 2px solid #1e3a8a;
          color: #1e3a8a;
          padding: 0.85rem 3.5rem;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s ease;
          text-transform: none;
        }

        .suggestion-submit-btn:hover {
          background-color: #eff6ff;
          transform: translateY(-2px);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }

        .suggestion-submit-btn:active {
          transform: translateY(0);
        }

        @media (max-width: 480px) {
          .suggestions-card {
            padding: 2rem 1.5rem;
          }
          
          .suggestions-title {
            font-size: 1.5rem;
          }
        }
      `}</style>
        </div>
    );
};

export default SuggestionsSection;
