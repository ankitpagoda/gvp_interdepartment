import React, { useState } from 'react';

interface MeditatorRequestFormProps {
    user?: { name: string } | null;
}

const MeditatorRequestForm: React.FC<MeditatorRequestFormProps> = ({ user }) => {
    const [formData, setFormData] = useState({
        name: user?.name || '',
        day: '',
        roomNo: '',
        requirements: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Meditator request submitted:', formData);
    };

    return (
        <div className="meditator-request-root">
            <div className="meditator-request-container">
                <div className="meditator-request-card">
                    <h1 className="form-title">Meditator Request</h1>

                    <form onSubmit={handleSubmit} className="request-form">
                        <div className="form-field">
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Name"
                                className="form-input"
                            />
                        </div>

                        <div className="form-field">
                            <input
                                type="text"
                                value={formData.day}
                                onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                                placeholder="Day"
                                className="form-input"
                            />
                        </div>

                        <div className="form-field">
                            <input
                                type="text"
                                value={formData.roomNo}
                                onChange={(e) => setFormData({ ...formData, roomNo: e.target.value })}
                                placeholder="Room No"
                                className="form-input"
                            />
                        </div>

                        <div className="form-field">
                            <textarea
                                value={formData.requirements}
                                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                                placeholder="Requirements"
                                rows={8}
                                className="form-textarea"
                            />
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="submit-btn">
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <style>{`
        .meditator-request-root {
          background-color: #f8fafc;
          min-height: 100%;
          width: 100%;
          padding: 3rem 1.5rem;
          display: flex;
          justify-content: center;
          font-family: 'Inter', system-ui, sans-serif;
        }

        .meditator-request-container {
          width: 100%;
          max-width: 600px;
        }

        .meditator-request-card {
          background: #ffffff;
          border-radius: 20px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
          padding: 3rem 2.5rem;
        }

        .form-title {
          font-size: 2rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 2.5rem 0;
          text-align: center;
          letter-spacing: -0.02em;
        }

        .request-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-field {
          display: flex;
          flex-direction: column;
        }

        .form-input,
        .form-textarea {
          width: 100%;
          padding: 1rem 1.25rem;
          border: 2px solid #3b82f6;
          border-radius: 12px;
          font-size: 1rem;
          color: #1e293b;
          background: #ffffff;
          outline: none;
          transition: all 0.2s;
          font-family: inherit;
        }

        .form-input:focus,
        .form-textarea:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }

        .form-input::placeholder,
        .form-textarea::placeholder {
          color: #94a3b8;
        }

        .form-textarea {
          resize: vertical;
          min-height: 160px;
          line-height: 1.6;
        }

        .form-actions {
          display: flex;
          justify-content: center;
          margin-top: 1rem;
        }

        .submit-btn {
          background: #ffffff;
          color: #3b82f6;
          border: 2px solid #3b82f6;
          padding: 1rem 4rem;
          border-radius: 12px;
          font-size: 1.05rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }

        .submit-btn:hover {
          background: #3b82f6;
          color: #ffffff;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
        }

        .submit-btn:active {
          transform: scale(0.98);
        }

        @media (max-width: 640px) {
          .meditator-request-card {
            padding: 2rem 1.5rem;
          }

          .form-title {
            font-size: 1.5rem;
          }

          .submit-btn {
            width: 100%;
          }
        }
      `}</style>
        </div>
    );
};

export default MeditatorRequestForm;
