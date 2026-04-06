import { useState } from 'react';
import type { Role, Department, TrustId } from '../types';
import { createRequest } from '../lib/mockDb';
import { Car, Home, Send, CheckCircle } from 'lucide-react';

interface VisitorFormProps {
    role: Role;
}

const VisitorForm = ({ role }: VisitorFormProps) => {
    const [type, setType] = useState<'Transport' | 'Accommodation'>('Transport');
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        from: '',
        to: '',
        dateTime: '',
        startDate: '',
        endDate: '',
        notes: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        let targetTrust: TrustId = 'GVP';
        let targetDept: Department = 'Transport';

        if (type === 'Accommodation') {
            targetTrust = 'DPVT';
            targetDept = 'Dhammalay';
        }

        createRequest({
            trustId: targetTrust,
            department: targetDept,
            requesterId: formData.phone,
            requesterName: formData.name,
            type: type,
            title: type === 'Transport' ? `Car from ${formData.from}` : 'Accommodation Request',
            description: type === 'Transport'
                ? `Ride Request: ${formData.from} to ${formData.to}. Time: ${formData.dateTime}`
                : `Stay Request: ${formData.startDate} to ${formData.endDate}. Notes: ${formData.notes}`,
            priority: 'Medium',
        });

        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 5000);
    };

    if (submitted) {
        return (
            <div className="glass-card p-12 text-center fade-in">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-200">
                    <CheckCircle className="text-green-600" size={40} />
                </div>
                <h2 className="text-2xl font-bold mb-2">Request Submitted!</h2>
                <p className="text-text-muted mb-6">Your request has been logged. You will receive a WhatsApp and Email confirmation shortly.</p>
                <button onClick={() => setSubmitted(false)} className="btn-primary mx-auto">
                    New Request
                </button>
            </div>
        );
    }

    return (
        <div className="grid md:grid-cols-3 gap-8 fade-in">
            <div className="md:col-span-1 space-y-6">
                <h2 className="text-3xl font-bold leading-tight text-primary-dark">
                    {role === 'Super Admin' ? 'Admin Mode' : 'Visitor'} <br />
                    <span className="text-accent underline decoration-primary/20 underline-offset-8">Requests</span>
                </h2>
                <p className="text-text-muted text-lg">Place your request for official services. All requests are tracked in real-time with SLA monitoring.</p>

                <div className="space-y-3 pt-4">
                    <button
                        onClick={() => setType('Transport')}
                        className={`w-full p-4 rounded-xl flex items-center gap-4 transition-all border ${type === 'Transport' ? 'bg-primary/10 border-primary shadow-md' : 'bg-white border-transparent hover:border-primary/30'}`}
                    >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${type === 'Transport' ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-gray-100'}`}>
                            <Car size={24} />
                        </div>
                        <div className="text-left">
                            <p className="font-bold text-primary-dark">Official Car Ride</p>
                            <p className="text-xs text-text-muted">Transport Desk</p>
                        </div>
                    </button>

                    <button
                        onClick={() => setType('Accommodation')}
                        className={`w-full p-4 rounded-xl flex items-center gap-4 transition-all border ${type === 'Accommodation' ? 'bg-primary/10 border-primary shadow-md' : 'bg-white border-transparent hover:border-primary/30'}`}
                    >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${type === 'Accommodation' ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-gray-100'}`}>
                            <Home size={24} />
                        </div>
                        <div className="text-left">
                            <p className="font-bold text-primary-dark">Sevak Accommodation</p>
                            <p className="text-xs text-text-muted">Dammalaya / Paryati</p>
                        </div>
                    </button>
                </div>
            </div>

            <div className="md:col-span-2">
                <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6 text-left">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-primary-dark">Full Name</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 outline-none focus:border-primary focus:bg-white transition-all shadow-sm"
                                placeholder="Enter your name"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-primary-dark">WhatsApp Number</label>
                            <input
                                type="tel"
                                required
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 outline-none focus:border-primary focus:bg-white transition-all shadow-sm"
                                placeholder="+91 00000 00000"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                    </div>

                    {type === 'Transport' ? (
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-primary-dark">From Location</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 outline-none focus:border-primary focus:bg-white transition-all shadow-sm"
                                    placeholder="e.g. Gorai Jetty"
                                    value={formData.from}
                                    onChange={e => setFormData({ ...formData, from: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-primary-dark">To Location</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 outline-none focus:border-primary focus:bg-white transition-all shadow-sm"
                                    placeholder="e.g. Global Pagoda"
                                    value={formData.to}
                                    onChange={e => setFormData({ ...formData, to: e.target.value })}
                                />
                            </div>
                            <div className="col-span-2 space-y-2">
                                <label className="text-sm font-semibold text-primary-dark">Date & Time</label>
                                <input
                                    type="datetime-local"
                                    required
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 outline-none focus:border-primary focus:bg-white transition-all shadow-sm"
                                    value={formData.dateTime}
                                    onChange={e => setFormData({ ...formData, dateTime: e.target.value })}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-primary-dark">Check-in Date</label>
                                <input
                                    type="date"
                                    required
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 outline-none focus:border-primary focus:bg-white transition-all shadow-sm"
                                    value={formData.startDate}
                                    onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-primary-dark">Check-out Date</label>
                                <input
                                    type="date"
                                    required
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 outline-none focus:border-primary focus:bg-white transition-all shadow-sm"
                                    value={formData.endDate}
                                    onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                                />
                            </div>
                            <div className="col-span-2 space-y-2">
                                <label className="text-sm font-semibold text-primary-dark">Seva Department</label>
                                <select className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 outline-none focus:border-primary focus:bg-white transition-all shadow-sm">
                                    <option>Marketing</option>
                                    <option>Gardening</option>
                                    <option>Kitchen</option>
                                    <option>Maintenance</option>
                                </select>
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-primary-dark">Special Notes</label>
                        <textarea
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 outline-none focus:border-primary focus:bg-white transition-all shadow-sm h-24"
                            placeholder="Any additional information..."
                            value={formData.notes}
                            onChange={e => setFormData({ ...formData, notes: e.target.value })}
                        />
                    </div>

                    <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 py-4">
                        <Send size={20} />
                        Submit Request
                    </button>
                </form>
            </div>
        </div>
    );
};

export default VisitorForm;
