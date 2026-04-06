import React, { useState } from 'react';
import { Upload } from 'lucide-react';

interface BillSubmitFormProps {
    user?: { name: string; department?: string } | null;
}

const BillSubmitForm: React.FC<BillSubmitFormProps> = ({ user }) => {
    const [formData, setFormData] = useState({
        name: user?.name || '',
        department: user?.department || '',
        items: '',
        justification: ''
    });

    const [fileName, setFileName] = useState<string>('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Bill submitted:', { formData, fileName });
    };

    return (
        <div className="bill-submit-root">
            <div className="bill-submit-container">
                <div className="bill-submit-card">
                    <h1 className="form-title">Bill Submit</h1>

                    <form onSubmit={handleSubmit} className="bill-form">
                        <div className="form-field">
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Enter your name"
                                className="form-input"
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="department">Department</label>
                            <input
                                type="text"
                                id="department"
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                placeholder="Enter department"
                                className="form-input"
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="items">Items</label>
                            <input
                                type="text"
                                id="items"
                                value={formData.items}
                                onChange={(e) => setFormData({ ...formData, items: e.target.value })}
                                placeholder="Enter items"
                                className="form-input"
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="justification">Justification</label>
                            <textarea
                                id="justification"
                                value={formData.justification}
                                onChange={(e) => setFormData({ ...formData, justification: e.target.value })}
                                placeholder="Enter justification for bill submission"
                                rows={6}
                                className="form-textarea"
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="file-upload">Upload Bill / Receipt</label>
                            <div className="upload-container">
                                <input
                                    type="file"
                                    id="file-upload"
                                    onChange={handleFileChange}
                                    className="file-input"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                />
                                <label htmlFor="file-upload" className="upload-label">
                                    <Upload size={20} className="upload-icon" />
                                    <span className="upload-text">
                                        {fileName || 'Upload bill / receipt'}
                                    </span>
                                </label>
                            </div>
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
        .bill-submit-root {
          background-color: #f8fafc;
          min-height: 100%;
          width: 100%;
          padding: 3rem 1.5rem;
          display: flex;
          justify-content: center;
          font-family: 'Inter', system-ui, sans-serif;
        }

        .bill-submit-container {
          width: 100%;
          max-width: 650px;
        }

        .bill-submit-card {
          background: #ffffff;
          border-radius: 20px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
          padding: 3rem 2.5rem;
          border: 2px solid #1e40af;
        }

        .form-title {
          font-size: 2rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 2.5rem 0;
          text-align: center;
          letter-spacing: -0.02em;
        }

        .bill-form {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-field label {
          font-size: 0.9rem;
          font-weight: 700;
          color: #1e293b;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .form-input,
        .form-textarea {
          width: 100%;
          padding: 0.9rem 1.25rem;
          border: 2px solid #cbd5e1;
          border-radius: 10px;
          font-size: 0.95rem;
          color: #1e293b;
          background: #ffffff;
          outline: none;
          transition: all 0.2s;
          font-family: inherit;
        }

        .form-input:hover,
        .form-textarea:hover {
          border-color: #94a3b8;
        }

        .form-input:focus,
        .form-textarea:focus {
          border-color: #1e40af;
          box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.1);
        }

        .form-input::placeholder,
        .form-textarea::placeholder {
          color: #94a3b8;
        }

        .form-textarea {
          resize: vertical;
          min-height: 120px;
          line-height: 1.6;
        }

        .upload-container {
          position: relative;
        }

        .file-input {
          position: absolute;
          width: 0.1px;
          height: 0.1px;
          opacity: 0;
          overflow: hidden;
          z-index: -1;
        }

        .upload-label {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.25rem 1.5rem;
          border: 2px dashed #cbd5e1;
          border-radius: 10px;
          background: #f8fafc;
          cursor: pointer;
          transition: all 0.2s;
        }

        .upload-label:hover {
          border-color: #1e40af;
          background: #eff6ff;
        }

        .file-input:focus + .upload-label {
          border-color: #1e40af;
          box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.1);
        }

        .upload-icon {
          color: #64748b;
          flex-shrink: 0;
        }

        .upload-label:hover .upload-icon {
          color: #1e40af;
        }

        .upload-text {
          font-size: 0.95rem;
          color: #64748b;
          font-weight: 500;
        }

        .upload-label:hover .upload-text {
          color: #1e40af;
        }

        .form-actions {
          display: flex;
          justify-content: center;
          margin-top: 1rem;
        }

        .submit-btn {
          background: #ffffff;
          color: #1e40af;
          border: 2px solid #1e40af;
          padding: 0.9rem 3.5rem;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .submit-btn:hover {
          background: #1e40af;
          color: #ffffff;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(30, 64, 175, 0.25);
        }

        .submit-btn:active {
          transform: translateY(0);
        }

        .submit-btn:disabled {
          background: #f1f5f9;
          color: #94a3b8;
          border-color: #cbd5e1;
          cursor: not-allowed;
          transform: none;
        }

        @media (max-width: 640px) {
          .bill-submit-card {
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

export default BillSubmitForm;
