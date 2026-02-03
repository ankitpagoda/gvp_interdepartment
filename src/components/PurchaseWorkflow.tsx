import type { GVPRequest, Role, Quotation } from '../types';
import { updateRequestStatus } from '../lib/mockDb';
import { FileText, Upload, DollarSign, Truck, Package, UserCheck, ClipboardList, Info, CheckCircle } from 'lucide-react';

interface PurchaseWorkflowProps {
    request: GVPRequest;
    role: Role;
    onUpdate: () => void; // Callback to refresh data
}

const PurchaseWorkflow = ({ request, role, onUpdate }: PurchaseWorkflowProps) => {
    // Helper to check if current user can perform actions
    const canManagePurchase = role === 'Purchase Manager' || role === 'Super Admin';
    const canManageStore = role === 'Store Manager' || role === 'Super Admin';
    const canManageSecurity = role === 'Security User' || role === 'Super Admin';

    const getStageStatus = (stageId: string): 'pending' | 'current' | 'completed' => {
        const status = request.status;

        // Define sequential order of major statuses
        const flow = [
            'Draft',
            'Pending Approval',
            'Quotation Requested',
            'Quotations Received',
            'Approved',
            'Purchase Order Created',
            'Gate Pass Created',
            'Received at Store',
            'Issued'
        ];

        const currentIndex = flow.indexOf(status);

        // Map each visual stage to a generic index
        const stageIndices: Record<string, number> = { 'req': 0, 'quote': 2, 'approve': 4, 'po': 5, 'gate': 6, 'grn': 7, 'issue': 8 };
        const myIndex = stageIndices[stageId];

        if (currentIndex > myIndex) return 'completed';
        if (currentIndex === myIndex) return 'current';

        // Special handling for 'approve' which maps to 'Approved' (index 4)
        // If status is 'Quotations Received' (index 3), next is Approve.

        return 'pending';
    };

    // Mock stages for the workflow visualization
    const stages = [
        { id: 'req', label: 'Request', icon: FileText },
        { id: 'quote', label: 'Quotations', icon: DollarSign },
        { id: 'approve', label: 'Approval', icon: UserCheck },
        { id: 'po', label: 'PO Issued', icon: ClipboardList },
        { id: 'gate', label: 'Gate Entry', icon: Truck },
        { id: 'grn', label: 'GRN', icon: ClipboardList },
        { id: 'issue', label: 'Issued', icon: Package },
    ];

    // Mock function to add a quote
    const handleAddQuote = () => {
        const newQuote: Quotation = {
            id: `QT-${Date.now()}`,
            vendorName: 'Global Supplies Ltd',
            amount: 5000,
            currency: 'INR',
            attachmentUrl: '#',
            isApproved: false
        };

        console.log("Adding quote:", newQuote);
        // Simulate moving to 'Quotations Received'
        updateRequestStatus(request.id, 'Quotations Received', 'mock-user', role, 'System added mock quotation');
        onUpdate();
    };

    const handleApprove = () => {
        updateRequestStatus(request.id, 'Approved', 'mock-user', role, 'Purchase Approved by Manager');
        onUpdate();
    };

    const handleGeneratePO = () => {
        updateRequestStatus(request.id, 'Purchase Order Created', 'mock-user', role, 'PO Generated');
        onUpdate();
    };

    const handleGateEntry = () => {
        updateRequestStatus(request.id, 'Gate Pass Created', 'mock-user', role, 'Vehicle Entry Logged');
        onUpdate();
    };

    const handleGRN = () => {
        updateRequestStatus(request.id, 'Received at Store', 'mock-user', role, 'Goods Received Note Created');
        onUpdate();
    };

    const handleIssue = () => {
        updateRequestStatus(request.id, 'Issued', 'mock-user', role, 'Item Issued to Department');
        onUpdate();
    };

    return (
        <div className="space-y-6">
            {/* Workflow Stepper */}
            <div className="flex items-center justify-between relative overflow-x-auto pb-4">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-white/10 -z-10 min-w-[500px]"></div>
                {stages.map((stage, i) => {
                    const status = getStageStatus(stage.id);
                    const isCompleted = status === 'completed';
                    const isCurrent = status === 'current';
                    return (
                        <div key={i} className="flex flex-col items-center gap-2 bg-black px-2 min-w-[60px]">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${isCompleted ? 'bg-success border-success text-black' : isCurrent ? 'bg-primary border-primary text-white' : 'bg-black border-white/20 text-text-muted'}`}>
                                <stage.icon size={14} />
                            </div>
                            <span className={`text-[9px] font-bold uppercase tracking-wider text-center ${isCurrent ? 'text-primary' : 'text-text-muted'}`}>{stage.label}</span>
                        </div>
                    )
                })}
            </div>

            {/* Action Area based on Status */}
            <div className="glass-card p-6 bg-white/5 border border-white/10">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Info size={18} className="text-primary" />
                    Current Action Required
                </h3>

                {request.status === 'Pending Approval' && (
                    <div className="text-center py-6">
                        <p className="mb-4">This request is waiting for departmental approval.</p>
                    </div>
                )}

                {(request.status === 'Quotation Requested' || request.status === 'Quotations Received') && (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-sm text-text-muted">
                                {request.status === 'Quotation Requested' ? 'At least 3 quotations are required.' : 'Quotations received. Waiting for selection/approval.'}
                            </p>
                            {canManagePurchase && (
                                <div className="flex gap-2">
                                    <button onClick={handleAddQuote} className="btn btn-secondary text-xs">
                                        <Upload size={14} /> Upload Quote
                                    </button>
                                    {request.status === 'Quotations Received' && (
                                        <button onClick={handleApprove} className="btn btn-primary text-xs">
                                            <UserCheck size={14} /> Approve Purchase
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* List of Quotes - Mocked for visualization */}
                        <div className="space-y-2">
                            {(request.purchaseDetails?.quotations || []).length === 0 ? (
                                <p className="text-center text-text-muted italic text-sm py-4">No quotations uploaded yet.</p>
                            ) : (
                                request.purchaseDetails?.quotations.map(q => (
                                    <div key={q.id} className="flex justify-between bg-white/5 p-3 rounded">
                                        <span>{q.vendorName}</span>
                                        <span className="font-mono">{q.amount} {q.currency}</span>
                                    </div>
                                ))
                            )}
                            {/* Mock Item if status is Quotations Received but no real data */}
                            {request.status === 'Quotations Received' && (!request.purchaseDetails?.quotations?.length) && (
                                <div className="flex justify-between bg-white/5 p-3 rounded opacity-70">
                                    <span>Mock Vendor Inc.</span>
                                    <span className="font-mono">5000 INR</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {request.status === 'Approved' && (
                    <div className="text-center">
                        <p className="mb-4 text-success font-bold">Purchase Approved!</p>
                        {canManagePurchase && (
                            <button onClick={handleGeneratePO} className="btn btn-primary text-xs mx-auto">
                                <ClipboardList size={14} /> Generate PO
                            </button>
                        )}
                    </div>
                )}

                {request.status === 'Purchase Order Created' && (
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <Truck className="text-secondary" size={32} />
                        </div>
                        <p className="mb-4 text-text-muted">PO Issued. Waiting for delivery at Gate.</p>
                        {canManageSecurity && (
                            <button onClick={handleGateEntry} className="btn btn-secondary text-xs mx-auto">
                                <Truck size={14} /> Record Gate Entry
                            </button>
                        )}
                    </div>
                )}

                {request.status === 'Gate Pass Created' && (
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <ClipboardList className="text-secondary" size={32} />
                        </div>
                        <p className="mb-4 text-text-muted">Materials at Gate. Waiting for Store GRN.</p>
                        {canManageStore && (
                            <button onClick={handleGRN} className="btn btn-secondary text-xs mx-auto">
                                <ClipboardList size={14} /> Create GRN
                            </button>
                        )}
                    </div>
                )}

                {request.status === 'Received at Store' && (
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <Package className="text-success" size={32} />
                        </div>
                        <p className="mb-4 text-text-muted">Item in Stock. Ready to Issue.</p>
                        {canManageStore && (
                            <button onClick={handleIssue} className="btn btn-success text-xs mx-auto text-black font-bold">
                                <Package size={14} /> Issue to Dept
                            </button>
                        )}
                    </div>
                )}

                {request.status === 'Issued' && (
                    <div className="text-center py-6">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <CheckCircle className="text-success" size={48} />
                        </div>
                        <p className="font-bold text-success text-xl">Order Completed</p>
                        <p className="text-text-muted text-sm">Item has been issued to department.</p>
                    </div>
                )}

                {/* Fallback for other states */}
                {['Pending Approval', 'Quotation Requested', 'Quotations Received', 'Approved', 'Purchase Order Created', 'Gate Pass Created', 'Received at Store', 'Issued'].indexOf(request.status) === -1 && (
                    <p className="text-text-muted text-center py-4">
                        Current status: <span className="text-white font-bold">{request.status}</span>
                    </p>
                )}

            </div>
        </div>
    );
};

export default PurchaseWorkflow;
