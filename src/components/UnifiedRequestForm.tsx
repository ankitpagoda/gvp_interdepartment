import React, { useState } from 'react';
import {
    Search,
    Calendar,
    Upload,
    FileText,
    Clock,
    CheckCircle2,
    Paperclip,
    Trash2,
    FileIcon,
    Send,
    Save,
    RotateCcw,
    AlertCircle,
    Plus,
    X
} from 'lucide-react';
import { createRequest } from '../lib/mockDb';
import type { TrustId, User as AuthUser } from '../types';

interface UnifiedRequestFormProps {
    user: AuthUser | null;
    onCancel?: () => void;
}

const UnifiedRequestForm: React.FC<UnifiedRequestFormProps> = ({
    user: passedUser
}) => {
    const user = passedUser || {
        staffId: 'GVP-101',
        name: "Siddharth Gautam",
        role: "Staff",
        department: "IT-Dept",
        email: 'sid@gvp.org',
        trustId: 'GPT'
    };
    // --- Constants ---
    const REQUEST_TYPES = [
        "Courses", "Material", "Meals", "Vehicles", "Guest", "Rooms",
        "Leave", "Repair", "Labour", "Housekeeping", "Security",
        "Gift", "Tea", "Buy", "Swipe"
    ];

    const PRIORITIES = ["Normal", "Urgent", "Critical"] as const;

    const DEPARTMENTS = [
        { id: 'DPVT', name: 'DPVT - Dhamma-Pattana' },
        { id: 'SVCT', name: 'SVCT - Food-Court / Souvenir / Dhammalay' },
        { id: 'VRI', name: 'VRI - Library / Academic / Publication / Pala' },
        { id: 'GVP', name: 'GVP - Reception / Museum / PR / Maintains / Electrical / Water / Civil / Kitchen / One-Day / Garden / Housekeeping / Security / Accounts / IT / Purchase / Store' }
    ];

    const CC_OPTIONS = ["Manager", "General Manager", "Department Trustee", "Main Trustee", "Chairman"];

    const PEOPLE: Record<string, string[]> = {
        'DPVT': ['Dr. Mehta', 'Mrs. Patil', 'Mr. Shah'],
        'SVCT': ['Vipul Bhai', 'Anil Ji', 'Suman Tai'],
        'VRI': ['Dr. Angraj Chaudhary', 'Ashwini Pethe', 'Pradeep Bhagwat'],
        'GVP': ['Mahendra Bhai', 'Kirti Ji', 'Venu Gopal Ji', 'Rahul Deshpande', 'Receptionist-1', 'Manager-1']
    };

    // --- State ---
    const [formData, setFormData] = useState({
        requestType: "",
        priority: "Normal" as typeof PRIORITIES[number],
        startDate: "",
        endDate: "",
        toDept: "",
        toPerson: "",
        description: "",
    });

    const [ccList, setCcList] = useState<string[]>([]);
    const [ccNameInput, setCcNameInput] = useState("");
    const [ccDesignationInput, setCcDesignationInput] = useState("");
    const [customCcList, setCustomCcList] = useState<{ name: string; designation: string }[]>([]);
    const [attachments, setAttachments] = useState<File[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showPersonDropdown, setShowPersonDropdown] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // --- Handlers ---
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCcToggle = (option: string) => {
        setCcList(prev =>
            prev.includes(option)
                ? prev.filter(item => item !== option)
                : [...prev, option]
        );
    };

    const addCustomCc = () => {
        if (ccNameInput.trim() || ccDesignationInput.trim()) {
            setCustomCcList(prev => [...prev, { name: ccNameInput.trim(), designation: ccDesignationInput.trim() }]);
            setCcNameInput("");
            setCcDesignationInput("");
        }
    };

    const removeCustomCc = (index: number) => {
        setCustomCcList(prev => prev.filter((_, i) => i !== index));
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setAttachments(prev => [...prev, ...newFiles]);
        }
    };

    const removeAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Save to mockDb
        const newRequest = createRequest({
            trustId: (formData.toDept === 'SVCT' ? 'SVCT' : formData.toDept === 'VRI' ? 'VRI' : 'GPT') as TrustId,
            department: formData.toDept,
            requesterId: user.staffId || 'SYS-001',
            requesterName: user.name,
            requesterRole: user.role,
            requesterDept: user.department,
            type: formData.requestType,
            title: `${formData.requestType} Request - ${new Date().toLocaleDateString()}`,
            description: formData.description,
            priority: formData.priority === 'Normal' ? 'Medium' : formData.priority === 'Urgent' ? 'High' : 'Emergency',
            assignedToDept: formData.toDept,
            assignedToPerson: formData.toPerson,
            cc: [
                ...ccList.map(role => ({ name: role, role: role })),
                ...customCcList.map(c => ({ name: c.name, role: c.designation }))
            ],
            attachments: attachments.map(f => ({ type: 'document', name: f.name }))
        });

        console.log("Request created:", newRequest);
        setIsSubmitted(true);
    };

    const resetForm = () => {
        setFormData({
            requestType: "",
            priority: "Normal",
            startDate: "",
            endDate: "",
            toDept: "",
            toPerson: "",
            description: "",
        });
        setCcList([]);
        setCustomCcList([]);
        setCcNameInput("");
        setCcDesignationInput("");
        setAttachments([]);
        setSearchTerm("");
        setIsSubmitted(false);
    };

    const filteredPeople = (formData.toDept && PEOPLE[formData.toDept])
        ? PEOPLE[formData.toDept].filter(p => p.toLowerCase().includes(searchTerm.toLowerCase()))
        : [];

    const isFormValid = formData.requestType && formData.toDept && formData.toPerson && formData.startDate && formData.description;

    const canCCChairman = ["GM", "Trustee", "Chairman"].includes(user.role);
    const visibleCcOptions = CC_OPTIONS.filter(option => {
        if (option === "Chairman") return canCCChairman;
        return true;
    });

    if (isSubmitted) {
        return (
            <div className="confirmation-view glass-card fade-in">
                <div className="success-icon-wrapper">
                    <CheckCircle2 size={48} />
                </div>
                <h2 style={{ fontSize: '2rem', color: 'var(--primary-dark)', marginBottom: '1rem' }}>Request Submitted!</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', lineHeight: '1.6' }}>
                    Your request (ID: REQ-{Math.floor(Math.random() * 90000 + 10000)}) has been successfully filed.
                    Target Department: {formData.toDept}
                </p>
                <button onClick={() => setIsSubmitted(false)} className="btn-primary" style={{ padding: '1rem 3rem' }}>
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div style={{ padding: '0 1rem' }}>
            <div className="form-container-card fade-in">
                <header className="form-header">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-dark)', margin: 0 }}>Unified Request Form</h1>
                            <p style={{ color: 'var(--text-muted)', fontWeight: 500, marginTop: '0.25rem' }}>Inter-Department Request Submission</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--primary)', background: '#eff6ff', padding: '0.25rem 0.75rem', borderRadius: '50px', border: '1px solid #dbeafe', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                System v2.4
                            </span>
                        </div>
                    </div>
                </header>

                <form onSubmit={handleSubmit} className="form-body">
                    {/* Section 1: Auto-filled Information (Read-Only) */}
                    <section className="form-section">
                        <div className="form-section-title">
                            <Clock size={16} /> Requester Information (Auto-Bound)
                        </div>
                        <div className="form-grid" style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                            <div className="form-group">
                                <label className="form-label" style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>Requester Full Name</label>
                                <input className="form-control" value={user.name} readOnly style={{ background: '#f1f5f9', fontWeight: 600 }} title="Auto-filled from profile" />
                            </div>
                            <div className="form-group">
                                <label className="form-label" style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>Designation / Role</label>
                                <input className="form-control" value={user.role} readOnly style={{ background: '#f1f5f9', fontWeight: 600 }} />
                            </div>
                            <div className="form-group">
                                <label className="form-label" style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>Department</label>
                                <input className="form-control" value={user.department} readOnly style={{ background: '#f1f5f9', fontWeight: 600 }} />
                            </div>
                            <div className="form-group">
                                <label className="form-label" style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>Staff ID</label>
                                <input className="form-control" value={user.staffId || 'N/A'} readOnly style={{ background: '#f1f5f9', fontWeight: 600 }} />
                            </div>
                        </div>
                    </section>

                    {/* Section 2: Request Details */}
                    <section className="form-section">
                        <div className="form-section-title">
                            <FileText size={16} /> Request Details
                        </div>
                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">Request Type <span>*</span></label>
                                <select
                                    name="requestType"
                                    className="form-control"
                                    value={formData.requestType}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="" disabled>Select type...</option>
                                    {REQUEST_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Priority</label>
                                <div className="priority-pill-group">
                                    {PRIORITIES.map(p => (
                                        <button
                                            key={p}
                                            type="button"
                                            className={`priority-pill ${formData.priority === p ? `active ${p}` : ''}`}
                                            onClick={() => setFormData(prev => ({ ...prev, priority: p }))}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Requested Start Date <span>*</span></label>
                                <div className="form-input-wrapper">
                                    <Calendar className="form-icon-left" size={18} />
                                    <input
                                        type="date"
                                        name="startDate"
                                        className="form-control with-icon"
                                        value={formData.startDate}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Expected End Date</label>
                                <div className="form-input-wrapper">
                                    <Calendar className="form-icon-left" size={18} />
                                    <input
                                        type="date"
                                        name="endDate"
                                        className="form-control with-icon"
                                        value={formData.endDate}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 3: Recipients */}
                    <section className="form-section">
                        <div className="form-section-title">
                            <Send size={16} /> Destination Selection
                        </div>
                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">Request To - Department <span>*</span></label>
                                <select
                                    name="toDept"
                                    className="form-control"
                                    value={formData.toDept}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="" disabled>Select department...</option>
                                    {DEPARTMENTS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                </select>
                            </div>
                            <div className="form-group" style={{ position: 'relative' }}>
                                <label className="form-label">Request To - Person <span>*</span></label>
                                <div className="form-input-wrapper">
                                    <Search className="form-icon-left" size={18} />
                                    <input
                                        type="text"
                                        className="form-control with-icon"
                                        placeholder={formData.toDept ? "Search staff..." : "Select dept first"}
                                        disabled={!formData.toDept}
                                        value={formData.toPerson || searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            if (formData.toPerson) setFormData(prev => ({ ...prev, toPerson: "" }));
                                            setShowPersonDropdown(true);
                                        }}
                                        onFocus={() => setShowPersonDropdown(true)}
                                    />
                                </div>
                                {showPersonDropdown && filteredPeople.length > 0 && (
                                    <div style={{ position: 'absolute', top: '100%', left: 0, width: '100%', background: 'white', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 100, marginTop: '0.5rem', maxHeight: '200px', overflowY: 'auto', border: '1px solid #f1f5f9' }}>
                                        {filteredPeople.map(p => (
                                            <div
                                                key={p}
                                                style={{ padding: '0.75rem 1rem', cursor: 'pointer', fontSize: '0.9rem', borderBottom: '1px solid #f8fafc' }}
                                                className="hover-blue"
                                                onClick={() => {
                                                    setFormData(prev => ({ ...prev, toPerson: p }));
                                                    setSearchTerm(p);
                                                    setShowPersonDropdown(false);
                                                }}
                                            >
                                                {p}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {showPersonDropdown && (
                                    <div
                                        style={{ position: 'fixed', inset: 0, zIndex: 90 }}
                                        onClick={() => setShowPersonDropdown(false)}
                                    />
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Section 4: CC */}
                    <section className="form-section">
                        <div className="form-section-title">
                            <AlertCircle size={16} /> CC / Escalation
                        </div>
                        <div className="cc-pill-group">
                            {visibleCcOptions.map(opt => (
                                <button
                                    key={opt}
                                    type="button"
                                    className={`cc-pill ${ccList.includes(opt) ? 'active' : ''}`}
                                    onClick={() => handleCcToggle(opt)}
                                >
                                    <div className="dot" /> {opt}
                                </button>
                            ))}
                        </div>

                        {/* Add Custom Member */}
                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                            <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
                                <label className="form-label" style={{ fontSize: '0.75rem' }}>Add Member Name</label>
                                <input
                                    className="form-control"
                                    placeholder="e.g. Rahul Sharma"
                                    value={ccNameInput}
                                    onChange={(e) => setCcNameInput(e.target.value)}
                                />
                            </div>
                            <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
                                <label className="form-label" style={{ fontSize: '0.75rem' }}>Designation</label>
                                <input
                                    className="form-control"
                                    placeholder="e.g. Senior Manager"
                                    value={ccDesignationInput}
                                    onChange={(e) => setCcDesignationInput(e.target.value)}
                                />
                            </div>
                            <button
                                type="button"
                                className="btn-primary"
                                style={{ height: '44px', width: '44px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', flexShrink: 0 }}
                                onClick={addCustomCc}
                            >
                                <Plus size={20} />
                            </button>
                        </div>

                        {customCcList.length > 0 && (
                            <div className="cc-pill-group" style={{ marginTop: '1rem' }}>
                                {customCcList.map((m, i) => (
                                    <div key={i} className="cc-pill active" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f1f5f9', borderColor: '#e2e8f0', color: '#475569' }}>
                                        <div className="dot" style={{ background: '#94a3b8' }} />
                                        <span style={{ fontSize: '0.75rem' }}>
                                            <strong>{m.name || 'Sevak'}</strong> {m.designation ? `(${m.designation})` : ''}
                                        </span>
                                        <X
                                            size={14}
                                            style={{ cursor: 'pointer', marginLeft: '0.25rem', opacity: 0.6 }}
                                            className="hover-red"
                                            onClick={() => removeCustomCc(i)}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Section 5: Description */}
                    <section className="form-section">
                        <div className="form-section-title">
                            <Paperclip size={16} /> Description
                        </div>
                        <div className="form-group">
                            <textarea
                                name="description"
                                className="form-control"
                                rows={5}
                                style={{ resize: 'none' }}
                                placeholder="Clearly describe the request, context, quantity, urgency, and any special instructions."
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </section>

                    {/* Section 6: Attachments */}
                    <section className="form-section">
                        <div className="form-section-title">
                            <Upload size={16} /> Attachments
                        </div>
                        <div className="upload-zone" onClick={() => document.getElementById('file-upload')?.click()}>
                            <input
                                id="file-upload"
                                type="file"
                                multiple
                                hidden
                                onChange={handleFileUpload}
                            />
                            <Upload size={32} style={{ color: '#cbd5e1', marginBottom: '1rem' }} />
                            <p style={{ fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>Drag & Drop or Click to Upload</p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Images, PDF, Docx, Audio, Video (Max 25MB)</p>
                        </div>
                        {attachments.length > 0 && (
                            <div className="attachment-list">
                                {attachments.map((file, i) => (
                                    <div key={i} className="attachment-card fade-in">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{ background: '#eff6ff', padding: '0.5rem', borderRadius: '8px', color: 'var(--primary)' }}>
                                                <FileIcon size={18} />
                                            </div>
                                            <div style={{ overflow: 'hidden' }}>
                                                <p style={{ fontSize: '0.85rem', fontWeight: 700, margin: 0, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '180px' }}>{file.name}</p>
                                                <p style={{ fontSize: '0.65rem', color: '#94a3b8', margin: 0 }}>{(file.size / 1024).toFixed(1)} KB</p>
                                            </div>
                                        </div>
                                        <button type="button" onClick={() => removeAttachment(i)} className="btn-ghost" style={{ color: '#cbd5e1' }}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </form>

                <footer className="form-footer">
                    <button type="button" className="btn-ghost" onClick={resetForm}>
                        <RotateCcw size={18} /> Reset Form
                    </button>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button type="button" className="btn-secondary">
                            <Save size={18} style={{ marginRight: '0.5rem' }} /> Save Draft
                        </button>
                        <button
                            type="submit"
                            className={`btn-primary ${!isFormValid ? 'disabled' : ''}`}
                            onClick={handleSubmit}
                            disabled={!isFormValid}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: isFormValid ? 1 : 0.5 }}
                        >
                            <Send size={18} /> Submit Request
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default UnifiedRequestForm;
