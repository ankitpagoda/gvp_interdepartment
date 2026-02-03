import React, { useState } from 'react';
import { Send, Calendar, ClipboardList, Info, Users, Bell, CheckCircle } from 'lucide-react';
import type { Department, TrustId, Role } from '../types';
import { createRequest } from '../lib/mockDb';

interface RequirementFormProps {
    department: Department;
    trustId?: TrustId;
    role: Role;
}

const RequirementForm: React.FC<RequirementFormProps> = ({ department, trustId = 'GPT' }) => {
    const [formData, setFormData] = useState({
        name: '',
        orderDate: new Date().toISOString().split('T')[0],
        requiredDate: '',
        itemDescription: '',
        quantity: '',
        purposes: '',
        reminder: '',
        status: 'Pending',
        clarification: '',
        viewPermissions: 'Department Only'
    });

    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Map form data to GVPRequest structure
        createRequest({
            trustId: trustId,
            department: department,
            requesterId: 'current-user-id', // Mock ID
            requesterName: formData.name,
            type: 'Purchase', // Defaulting to Purchase for this form for now
            title: `Requirement: ${formData.itemDescription.substring(0, 20)}...`,
            description: `${formData.itemDescription} (Qty: ${formData.quantity}). Purpose: ${formData.purposes}`,
            priority: 'Medium',
        });

        console.log('Requirement Submitted:', formData);
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    if (submitted) {
        return (
            <div className="flex flex-col items-center justify-center p-12 glass-card border-success/30 bg-success/10 animate-fade-in">
                <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mb-4 shadow-lg shadow-success/20">
                    <CheckCircle className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-success">Requirement Sent!</h3>
                <p className="text-text-muted mt-2">Your request has been logged and is being tracked in real-time.</p>
                <button onClick={() => setSubmitted(false)} className="btn btn-secondary mt-6">Submit Another</button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6 max-w-4xl mx-auto shadow-2xl relative overflow-hidden bg-white/40 backdrop-blur-md fade-in">
            <div className="absolute top-0 left-0 w-2 h-full bg-primary"></div>

            <div className="flex items-center gap-3 mb-6 border-b border-gray-200 pb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                    <ClipboardList className="text-primary" size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-800">New Requirement Form</h2>
                    <p className="text-[11px] text-gray-500 uppercase tracking-widest font-bold">Process Item Requisition ({trustId} - {department})</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal & Dept Info */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1.5 ml-1">Requester Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            placeholder="Full Name"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1.5 ml-1">Department</label>
                        <input
                            type="text"
                            name="department"
                            value={department}
                            readOnly
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed font-medium"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1.5 ml-1">Order Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                <input
                                    type="date"
                                    name="orderDate"
                                    value={formData.orderDate}
                                    className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary outline-none bg-white text-sm"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1.5 ml-1 font-bold text-primary">Required Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/50" size={14} />
                                <input
                                    type="date"
                                    name="requiredDate"
                                    required
                                    className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-primary/20 focus:border-primary outline-none bg-white text-sm border-2"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Item Details */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1.5 ml-1">Item Description</label>
                        <textarea
                            name="itemDescription"
                            required
                            rows={3}
                            placeholder="Detailed description of the requirement..."
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary outline-none bg-white resize-none text-sm"
                            onChange={handleChange}
                        ></textarea>
                    </div>
                    <div>
                        <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1.5 ml-1">Quantity</label>
                        <input
                            type="text"
                            name="quantity"
                            required
                            placeholder="e.g. 5 Units, 10 Packets"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary outline-none bg-white"
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-100">
                <div>
                    <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1.5 ml-1">Purpose of Requirement</label>
                    <input
                        type="text"
                        name="purposes"
                        required
                        placeholder="What will this be used for?"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary outline-none bg-white"
                        onChange={handleChange}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1.5 ml-1 flex items-center gap-1.5 text-primary">
                            <Bell size={12} /> Reminder
                        </label>
                        <select
                            name="reminder"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary outline-none bg-white text-sm"
                            onChange={handleChange}
                        >
                            <option value="">By task Creator</option>
                            <option value="daily">Daily Notification</option>
                            <option value="weekly">Weekly Status Report</option>
                            <option value="on_overdue">Only on Overdue</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1.5 ml-1 flex items-center gap-1.5">
                            <Users size={12} /> View Permission
                        </label>
                        <select
                            name="viewPermissions"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary outline-none bg-white text-sm"
                            onChange={handleChange}
                        >
                            <option value="Department Only">Only Dept Head</option>
                            <option value="All">Anyone can view status</option>
                            <option value="Private">Creator Only</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1.5 ml-1 flex items-center gap-1.5">
                            <Info size={12} /> Clarification / Comments
                        </label>
                        <textarea
                            name="clarification"
                            rows={1}
                            placeholder="Optional notes..."
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary outline-none bg-white resize-none text-sm italic text-gray-500"
                            onChange={handleChange}
                        ></textarea>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-6">
                <button
                    type="submit"
                    className="btn btn-primary !rounded-full py-4 px-10 shadow-xl shadow-primary/20 hover:shadow-primary/40 flex items-center gap-3 text-lg transition-all active:scale-95"
                >
                    <span className="font-bold">SEND REQUIREMENT</span>
                    <Send size={20} />
                </button>
            </div>
        </form>
    );
};

export default RequirementForm;
