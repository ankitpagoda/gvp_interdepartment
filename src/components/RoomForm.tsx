import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { createRequest } from '../lib/mockDb';

interface RoomFormProps {
    user?: { name: string; department?: string; staffId?: string; role?: string; trustId?: string } | null;
}

const RoomForm: React.FC<RoomFormProps> = ({ user }) => {
    const [formData, setFormData] = useState({
        name: user?.name || '',
        department: user?.department || '',
        status: '',
        checkIn: '',
        checkOut: '',
        justification: ''
    });

    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');
        // Basic validation
        if (!formData.name.trim()) { setErrorMsg('Name is required'); return; }
        if (!formData.checkIn || !formData.checkOut) { setErrorMsg('Check-in and check-out dates are required'); return; }
        if (formData.checkIn > formData.checkOut) { setErrorMsg('Check-out must be after check-in'); return; }
        const today = new Date().toISOString().slice(0,10);
        if (formData.checkIn < today) { setErrorMsg('Check-in cannot be in the past'); return; }

        try {
            const req = createRequest({
                trustId: user?.trustId || 'GVP',
                department: formData.department || user?.department || 'General',
                requesterId: (user as any)?.staffId || `anon-${Date.now()}`,
                requesterName: formData.name,
                requesterRole: (user as any)?.role || 'Staff',
                type: 'Room Booking',
                title: `Room request by ${formData.name}`,
                description: `Check-in: ${formData.checkIn}\nCheck-out: ${formData.checkOut}\nJustification: ${formData.justification}`,
                priority: 'Medium',
                assignedToDept: 'Admin',
                checkIn: formData.checkIn,
                checkOut: formData.checkOut
            });
            setSuccessMsg(`Request submitted: ${req.id}`);
            setFormData({ name: user?.name || '', department: user?.department || '', status: '', checkIn: '', checkOut: '', justification: '' });
        } catch (err: any) {
            setErrorMsg(err?.message || 'Failed to submit request');
        }
    };

    return (
        <div className="room-form-root">
            <div className="room-form-container">
                <div className="room-form-card">
                    <h1 className="form-title">Room Form</h1>

                    {errorMsg && <div style={{background:'#fee2e2', color:'#b91c1c', padding:'0.75rem', borderRadius:'8px', marginBottom:'1rem'}}>{errorMsg}</div>}
                    {successMsg && <div style={{background:'#ecfccb', color:'#65a30d', padding:'0.75rem', borderRadius:'8px', marginBottom:'1rem'}}>{successMsg}</div>}

                    <form onSubmit={handleSubmit} className="form-content">
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
                            <label htmlFor="status">Status</label>
                            <div className="select-wrapper">
                                <select
                                    id="status"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="form-select"
                                >
                                    <option value="">Select Status</option>
                                    <option value="Dhammasevak">Dhammasevak</option>
                                    <option value="Teacher">Teacher</option>
                                    <option value="Guest">Guest</option>
                                    <option value="Others">Others</option>
                                </select>
                                <ChevronDown className="select-icon" size={18} />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-field">
                                <label htmlFor="checkIn">Check-in</label>
                                <input
                                    type="date"
                                    id="checkIn"
                                    value={formData.checkIn}
                                    onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                                    className="form-input"
                                />
                            </div>

                            <div className="form-field">
                                <label htmlFor="checkOut">Check-out</label>
                                <input
                                    type="date"
                                    id="checkOut"
                                    value={formData.checkOut}
                                    onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                                    className="form-input"
                                />
                            </div>
                        </div>

                        <div className="form-field">
                            <label htmlFor="justification">Justification</label>
                            <textarea
                                id="justification"
                                value={formData.justification}
                                onChange={(e) => setFormData({ ...formData, justification: e.target.value })}
                                placeholder="Enter justification for room request"
                                rows={6}
                                className="form-textarea"
                            />
                        </div>

                        <div className="form-submit">
                            <button type="submit" className="submit-btn">
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <style>{`
        .room-form-root {
          background-color: #f8fafc;
          min-height: 100%;
          width: 100%;
          padding: 3rem 1.5rem;
          display: flex;
          justify-content: center;
          font-family: 'Inter', 'Poppins', system-ui, sans-serif;
        }

        .room-form-container {
          width: 100%;
          max-width: 650px;
        }

        .room-form-card {
          background: #ffffff;
          border-radius: 20px;
          box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.06);
          padding: 3rem 2.5rem;
          border: 1px solid #e2e8f0;
        }

        .form-title {
          font-size: 2rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 2.5rem 0;
          text-align: center;
          letter-spacing: -0.02em;
        }

        .form-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-field label {
          font-size: 0.875rem;
          font-weight: 700;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .form-input,
        .form-select,
        .form-textarea {
          width: 100%;
          padding: 0.85rem 1.25rem;
          border: 1.5px solid #cbd5e1;
          border-radius: 12px;
          font-size: 1rem;
          color: #1e293b;
          background: #ffffff;
          outline: none;
          transition: all 0.2s;
          font-family: inherit;
        }

        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-input::placeholder,
        .form-textarea::placeholder {
          color: #94a3b8;
        }

        .select-wrapper {
          position: relative;
        }

        .form-select {
          appearance: none;
          cursor: pointer;
          padding-right: 3rem;
        }

        .select-icon {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
          pointer-events: none;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .form-textarea {
          resize: vertical;
          min-height: 120px;
          line-height: 1.6;
        }

        .form-submit {
          display: flex;
          justify-content: center;
          margin-top: 1rem;
        }

        .submit-btn {
          background: #3b82f6;
          color: #ffffff;
          border: none;
          padding: 0.9rem 3.5rem;
          border-radius: 999px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
        }

        .submit-btn:hover {
          background: #2563eb;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
        }

        .submit-btn:active {
          transform: translateY(0);
        }

        @media (max-width: 640px) {
          .room-form-card {
            padding: 2rem 1.5rem;
          }

          .form-title {
            font-size: 1.5rem;
          }

          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </div>
    );
};

export default RoomForm;
