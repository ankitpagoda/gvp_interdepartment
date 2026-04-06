import React, { useState } from 'react';
import { Plus, Save, Send, Printer } from 'lucide-react';

const PurchaseOrderForm: React.FC = () => {
    const [items, setItems] = useState([
        { id: 1, description: '', qty: '', rate: '', per: '', amount: 0 }
    ]);

    const addRow = () => {
        setItems([...items, { id: items.length + 1, description: '', qty: '', rate: '', per: '', amount: 0 }]);
    };

    const calculateTotal = () => {
        return items.reduce((acc, item) => acc + (parseFloat(item.amount as any) || 0), 0).toFixed(2);
    };

    return (
        <div className="po-form-root">
            <div className="po-document">
                {/* Header Section */}
                <header className="po-header">
                    <div className="header-top">
                        <div className="org-logo-placeholder">
                            <div className="logo-box">GVP</div>
                        </div>
                        <div className="org-address-block">
                            <h2 className="org-name">Global Vitarka Platform</h2>
                            <p className="org-subtext">123 Wisdom Path, Dhamma Sector</p>
                            <p className="org-subtext">Maharashtra, India - 400001</p>
                            <p className="org-subtext">Phone: +91 22 1234 5678</p>
                        </div>
                    </div>
                    <div className="po-title-bar">
                        <h1>PURCHASE ORDER</h1>
                    </div>
                </header>

                <div className="po-content">
                    {/* Meta Information */}
                    <section className="info-grid">
                        <div className="grid-col">
                            <div className="info-field">
                                <label>PO No:</label>
                                <input type="text" value="PO/2026/0442" readOnly className="read-only-input" />
                            </div>
                            <div className="info-field">
                                <label>Quotation Ref:</label>
                                <input type="text" placeholder="Enter Ref No" />
                            </div>
                            <div className="info-field">
                                <label>Site / Location:</label>
                                <input type="text" placeholder="Main Campus" />
                            </div>
                        </div>
                        <div className="grid-col">
                            <div className="info-field">
                                <label>Date:</label>
                                <input type="text" value="08/02/2026" readOnly className="read-only-input" />
                            </div>
                            <div className="info-field">
                                <label>Project Name:</label>
                                <input type="text" placeholder="Library Expansion" />
                            </div>
                        </div>
                    </section>

                    <div className="section-divider"></div>

                    {/* Vendor Information */}
                    <section className="vendor-section">
                        <h3 className="section-title">Vendor Information</h3>
                        <div className="vendor-grid">
                            <div className="grid-col">
                                <div className="info-field">
                                    <label>Company Name:</label>
                                    <input type="text" placeholder="Enter Vendor Name" />
                                </div>
                                <div className="info-field">
                                    <label>Address:</label>
                                    <textarea rows={3} placeholder="Vendor Address"></textarea>
                                </div>
                            </div>
                            <div className="grid-col">
                                <div className="info-field">
                                    <label>Contact Number:</label>
                                    <input type="text" placeholder="+91" />
                                </div>
                                <div className="info-field">
                                    <label>Email ID:</label>
                                    <input type="email" placeholder="vendor@example.com" />
                                </div>
                                <div className="info-field">
                                    <label>Website:</label>
                                    <input type="text" placeholder="www.vendor.com" />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Items Table */}
                    <section className="table-section">
                        <table className="po-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '50px' }}>Sr.</th>
                                    <th>Description of Goods</th>
                                    <th style={{ width: '80px' }}>Qty</th>
                                    <th style={{ width: '100px' }}>Rate</th>
                                    <th style={{ width: '80px' }}>Per</th>
                                    <th style={{ width: '120px' }}>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item, index) => (
                                    <tr key={item.id}>
                                        <td className="text-center">{index + 1}</td>
                                        <td><input type="text" className="table-input" /></td>
                                        <td><input type="text" className="table-input text-center" /></td>
                                        <td><input type="text" className="table-input text-right" /></td>
                                        <td><input type="text" className="table-input text-center" /></td>
                                        <td><input type="text" className="table-input text-right font-bold" /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button className="add-row-btn" onClick={addRow}>
                            <Plus size={16} /> Add Item Row
                        </button>
                        <div className="total-display">
                            <span className="total-label">Total Amount:</span>
                            <span className="total-val">₹ {calculateTotal()}</span>
                        </div>
                    </section>

                    {/* Delivery & Terms */}
                    <section className="terms-grid">
                        <div className="grid-col">
                            <div className="info-field">
                                <label>Delivery Address:</label>
                                <textarea rows={2} placeholder="Same as org address"></textarea>
                            </div>
                            <div className="info-field">
                                <label>Transport Clarification:</label>
                                <input type="text" placeholder="Self Pick-up / Delivery" />
                            </div>
                            <div className="info-field">
                                <label>Tax Details:</label>
                                <input type="text" placeholder="GST 18% Exclusive" />
                            </div>
                        </div>
                        <div className="grid-col">
                            <div className="info-field">
                                <label>Billing Address:</label>
                                <textarea rows={2} placeholder="Central Accounts Dept"></textarea>
                            </div>
                            <div className="info-field">
                                <label>Payment Terms:</label>
                                <input type="text" placeholder="30 Days Credit" />
                            </div>
                            <div className="info-field">
                                <label>Damage Terms:</label>
                                <input type="text" placeholder="Immediate Replacement" />
                            </div>
                        </div>
                    </section>

                    {/* Approval Section */}
                    <footer className="po-footer">
                        <div className="approval-row">
                            <div className="approval-col">
                                <p className="sign-line"></p>
                                <p className="sign-label">Prepared By</p>
                                <p className="sign-sub">Name & Mobile</p>
                            </div>
                            <div className="approval-col">
                                <p className="sign-line"></p>
                                <p className="sign-label">Checked By</p>
                                <p className="sign-sub">Name & Mobile</p>
                            </div>
                            <div className="approval-col">
                                <p className="sign-line"></p>
                                <p className="sign-label">Passed By</p>
                                <p className="sign-sub">Name & Mobile</p>
                            </div>
                        </div>
                    </footer>
                </div>

                <div className="form-actions">
                    <button className="btn-secondary"><Printer size={18} /> Print Draft</button>
                    <button className="btn-secondary"><Save size={18} /> Save as Draft</button>
                    <button className="btn-primary"><Send size={18} /> Submit Purchase Order</button>
                </div>
            </div>

            <style>{`
                .po-form-root {
                    background-color: #f1f5f9;
                    min-height: 100%;
                    padding: 3rem 2rem;
                    display: flex;
                    justify-content: center;
                    font-family: 'Inter', system-ui, sans-serif;
                }

                .po-document {
                    background: #ffffff;
                    width: 100%;
                    max-width: 1000px;
                    border-radius: 12px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.08);
                    padding: 4rem;
                    position: relative;
                }

                .po-header {
                    margin-bottom: 2rem;
                }

                .header-top {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 2rem;
                }

                .logo-box {
                    width: 70px;
                    height: 70px;
                    background: #1e3a8a;
                    color: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 900;
                    border-radius: 8px;
                    font-size: 1.25rem;
                }

                .org-address-block {
                    text-align: right;
                    color: #475569;
                }

                .org-name {
                    font-size: 1.5rem;
                    font-weight: 800;
                    color: #0f172a;
                    margin: 0 0 0.5rem 0;
                }

                .org-subtext {
                    font-size: 0.85rem;
                    margin: 2px 0;
                    line-height: 1.4;
                }

                .po-title-bar {
                    background: #1e3a8a;
                    color: #ffffff;
                    text-align: center;
                    padding: 0.75rem;
                    margin-top: 2rem;
                    border-radius: 4px;
                }

                .po-title-bar h1 {
                    margin: 0;
                    font-size: 1.25rem;
                    letter-spacing: 0.2em;
                    font-weight: 700;
                }

                .info-grid, .vendor-grid, .terms-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 3rem;
                    margin: 2rem 0;
                }

                .info-field {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                    margin-bottom: 1.25rem;
                }

                .info-field label {
                    font-size: 0.8rem;
                    font-weight: 700;
                    color: #1e3a8a;
                    text-transform: uppercase;
                }

                .info-field input, .info-field textarea {
                    border: 1px solid #cbd5e1;
                    padding: 0.6rem 0.8rem;
                    border-radius: 6px;
                    font-size: 0.95rem;
                    color: #334155;
                    outline: none;
                    transition: border-color 0.2s;
                }

                .info-field input:focus {
                    border-color: #1e3a8a;
                }

                .read-only-input {
                    background-color: #f8fafc;
                    font-weight: 700;
                }

                .section-divider {
                    height: 1px;
                    background: #e2e8f0;
                    margin: 2rem 0;
                }

                .section-title {
                    font-size: 1rem;
                    font-weight: 800;
                    color: #0f172a;
                    margin-bottom: 0;
                    border-left: 4px solid #d4af37; /* Gold accent */
                    padding-left: 1rem;
                }

                .po-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 2rem 0 1rem 0;
                    border: 1px solid #e2e8f0;
                }

                .po-table th {
                    background: #f1f5f9;
                    color: #475569;
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    padding: 0.75rem;
                    border: 1px solid #e2e8f0;
                    text-align: left;
                }

                .po-table td {
                    border: 1px solid #e2e8f0;
                    padding: 0;
                }

                .table-input {
                    width: 100%;
                    border: none;
                    padding: 0.75rem;
                    font-size: 0.9rem;
                    outline: none;
                    background: transparent;
                }

                .table-input:focus {
                    background: #f8fafc;
                }

                .text-center { text-align: center; }
                .text-right { text-align: right; }
                .font-bold { font-weight: 700; }

                .add-row-btn {
                    padding: 0.5rem 1rem;
                    background: #f8fafc;
                    border: 1px dashed #cbd5e1;
                    border-radius: 6px;
                    color: #64748b;
                    font-size: 0.85rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .total-display {
                    display: flex;
                    justify-content: flex-end;
                    gap: 2rem;
                    margin-top: 2rem;
                    padding-top: 1rem;
                    border-top: 2px solid #1e3a8a;
                }

                .total-label {
                    font-weight: 800;
                    color: #1e3a8a;
                    font-size: 1.1rem;
                }

                .total-val {
                    font-weight: 900;
                    color: #0f172a;
                    font-size: 1.1rem;
                }

                .po-footer {
                    margin-top: 5rem;
                    border-top: 1px solid #e2e8f0;
                    padding-top: 3rem;
                }

                .approval-row {
                    display: flex;
                    justify-content: space-around;
                    text-align: center;
                }

                .sign-line {
                    width: 150px;
                    height: 1px;
                    background: #000;
                    margin-bottom: 0.75rem;
                }

                .sign-label {
                    font-weight: 800;
                    font-size: 0.9rem;
                    margin: 0;
                }

                .sign-sub {
                    font-size: 0.7rem;
                    color: #64748b;
                    margin: 4px 0 0 0;
                }

                .form-actions {
                    position: absolute;
                    bottom: -5rem;
                    right: 0;
                    display: flex;
                    gap: 1rem;
                }

                .btn-primary {
                    background: #1e3a8a;
                    color: #fff;
                    border: none;
                    padding: 0.8rem 2rem;
                    border-radius: 8px;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    cursor: pointer;
                    box-shadow: 0 4px 10px rgba(30, 58, 138, 0.2);
                }

                .btn-secondary {
                    background: #fff;
                    color: #1e3a8a;
                    border: 2px solid #1e3a8a;
                    padding: 0.8rem 1.5rem;
                    border-radius: 8px;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    cursor: pointer;
                }

                @media (max-width: 768px) {
                    .info-grid, .vendor-grid, .terms-grid {
                        grid-template-columns: 1fr;
                        gap: 1rem;
                    }
                    .po-document {
                        padding: 2rem;
                    }
                    .form-actions {
                        flex-direction: column;
                        bottom: -15rem;
                        width: 100%;
                    }
                }
            `}</style>
        </div>
    );
};

export default PurchaseOrderForm;
