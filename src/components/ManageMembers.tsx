/**
 * ManageMembers — RBAC-controlled admin panel for member management.
 *
 * All data fetched from backend. All buttons conditioned on real permissions
 * from /me API. Backend ALSO enforces permissions for every request.
 */
import React, { useState, useEffect, useCallback } from 'react';
import {
  UserPlus, Users, Pencil, Trash2, X, Check, AlertCircle,
  Shield, RefreshCw, Search, ChevronDown, Lock
} from 'lucide-react';
import {
  apiGetMembers, apiGetDepartments, apiGetRoles,
  apiCreateMember, apiUpdateMember, apiDeleteMember,
  apiResetPassword, apiGetResetRequests, apiDeleteResetRequest,
  type Member, type Department, type Role, type ResetRequest
} from '../api/rbacApi';

interface ManageMembersProps {
  permissions: string[];
}

const PERM = {
  ADD_MEMBER: 'ADD_MEMBER',
  VIEW_USER_BASIC: 'VIEW_USER_BASIC',
  ASSIGN_DEPARTMENT: 'ASSIGN_DEPARTMENT',
  ASSIGN_ROLE: 'ASSIGN_ROLE',
  VIEW_EMPLOYEE_ID: 'VIEW_EMPLOYEE_ID',
  VIEW_DEPARTMENT: 'VIEW_DEPARTMENT',
  DELETE_MEMBER: 'DELETE_MEMBER',
  EDIT_MEMBER: 'EDIT_MEMBER',
  RESET_PASSWORD: 'RESET_PASSWORD',
};

const emptyForm = {
  name: '', email: '', mobile: '', employee_id: '', department_id: '', role_id: '', password: ''
};

const ManageMembers: React.FC<ManageMembersProps> = ({ permissions }) => {
  const can = (p: string) => permissions.includes(p);

  const [members, setMembers]           = useState<Member[]>([]);
  const [departments, setDepartments]   = useState<Department[]>([]);
  const [roles, setRoles]               = useState<Role[]>([]);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState<string | null>(null);
  const [success, setSuccess]           = useState<string | null>(null);
  const [search, setSearch]             = useState('');
  const [showForm, setShowForm]         = useState(false);
  const [editingId, setEditingId]       = useState<number | null>(null);
  const [form, setForm]                 = useState({ ...emptyForm });
  const [formError, setFormError]       = useState<string | null>(null);
  const [submitting, setSubmitting]     = useState(false);
  const [deleting, setDeleting]         = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  // Password Reset State
  const [resetRequests, setResetRequests] = useState<ResetRequest[]>([]);
  const [showResetModal, setShowResetModal] = useState<number | null>(null);
  const [resetPasswordVal, setResetPasswordVal] = useState('');
  const [resetting, setResetting] = useState(false);
  const [showRequestsView, setShowRequestsView] = useState(false);

  const flashSuccess = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 3500);
  };

  const flashError = (msg: string) => {
    setError(msg);
    setTimeout(() => setError(null), 5000);
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const promises: Promise<any>[] = [];

      if (can(PERM.VIEW_USER_BASIC))   promises.push(apiGetMembers().then(r => setMembers(r.members)));
      else                              promises.push(Promise.resolve());

      if (can(PERM.VIEW_DEPARTMENT))   promises.push(apiGetDepartments().then(r => setDepartments(r.departments)));
      else                             promises.push(Promise.resolve());

      if (can(PERM.VIEW_USER_BASIC))   promises.push(apiGetRoles().then(r => setRoles(r.roles)));
      else                             promises.push(Promise.resolve());

      if (can(PERM.VIEW_USER_BASIC))   promises.push(apiGetResetRequests().then(r => setResetRequests(r.requests)));
      else                             promises.push(Promise.resolve());

      await Promise.all(promises);
    } catch (err: any) {
      flashError(err.message || 'Failed to load data. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }, [permissions]);

  useEffect(() => { loadData(); }, [loadData]);

  const openAddForm = () => {
    setEditingId(null);
    setForm({ ...emptyForm });
    setFormError(null);
    setShowForm(true);
  };

  const openEditForm = (m: Member) => {
    setEditingId(m.id);
    setForm({
      name: m.name || '',
      email: m.email || '',
      mobile: m.mobile || '',
      employee_id: m.employee_id || '',
      department_id: String(m.department_id || ''),
      role_id: '',
      password: ''
    });
    setFormError(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormError(null);
    setForm({ ...emptyForm });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);

    try {
      const payload: any = {
        name: form.name.trim(),
        email: form.email.trim(),
        mobile: form.mobile.trim() || undefined,
        employee_id: form.employee_id.trim() || undefined,
        department_id: form.department_id ? Number(form.department_id) : undefined,
        role_id: form.role_id ? Number(form.role_id) : undefined
      };

      if (editingId !== null) {
        await apiUpdateMember(editingId, {
          name: payload.name,
          mobile: payload.mobile,
          employee_id: payload.employee_id,
          department_id: can(PERM.ASSIGN_DEPARTMENT) ? payload.department_id : undefined,
          role_id: can(PERM.ASSIGN_ROLE) ? payload.role_id : undefined
        });
        flashSuccess('Member updated successfully.');
      } else {
        await apiCreateMember({ ...payload, password: form.password.trim() || undefined });
        flashSuccess(form.password.trim() 
          ? 'Member added with specified password.' 
          : `Member added. Default password: ${form.email.split('@')[0]}@gvp`
        );
      }

      closeForm();
      loadData();
    } catch (err: any) {
      setFormError(err.message || 'Operation failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeleting(id);
    try {
      await apiDeleteMember(id);
      flashSuccess('Member deleted.');
      setConfirmDelete(null);
      loadData();
    } catch (err: any) {
      flashError(err.message || 'Delete failed.');
    } finally {
      setDeleting(null);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showResetModal) return;
    setResetting(true);
    try {
      await apiResetPassword(showResetModal, resetPasswordVal);
      flashSuccess('Password reset successfully.');
      setShowResetModal(null);
      setResetPasswordVal('');
      loadData();
    } catch (err: any) {
      flashError(err.message || 'Reset failed.');
    } finally {
      setResetting(false);
    }
  };

  const handleDeleteRequest = async (id: number) => {
    try {
      await apiDeleteResetRequest(id);
      loadData();
    } catch (err: any) {
      flashError('Failed to remove request.');
    }
  };

  const filtered = members.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase()) ||
    (m.department || '').toLowerCase().includes(search.toLowerCase()) ||
    (m.employee_id || '').toLowerCase().includes(search.toLowerCase())
  );

  // ── No permission at all ──────────────────────────────────────────────────
  if (!can(PERM.VIEW_USER_BASIC) && !can(PERM.ADD_MEMBER)) {
    return (
      <div style={styles.root}>
        <div style={styles.accessDenied}>
          <Lock size={48} style={{ color: '#ef4444', marginBottom: '1rem' }} />
          <h2 style={{ margin: 0, color: '#1e293b' }}>Access Restricted</h2>
          <p style={{ color: '#64748b', marginTop: '0.5rem' }}>
            You don't have permission to access Member Management.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.root}>
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>
            <Shield size={24} style={{ color: '#3b82f6', marginRight: '0.5rem' }} />
            Manage Members
          </h1>
          <p style={styles.subtitle}>
            Role-Based Access Control · Permissions enforced at backend level
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {/* Permission Badges */}
          <div style={styles.permBadges}>
            {permissions.map(p => (
              <span key={p} style={styles.permBadge}>{p}</span>
            ))}
          </div>
          <button style={styles.refreshBtn} onClick={loadData} title="Refresh">
            <RefreshCw size={16} className={loading ? 'spin' : ''} />
          </button>
          
          {resetRequests.length > 0 && (
            <button 
              style={{ ...styles.refreshBtn, position: 'relative', borderColor: '#f87171', color: '#ef4444' }} 
              onClick={() => setShowRequestsView(true)}
              title="View Reset Requests"
            >
              <AlertCircle size={16} />
              <span style={{ 
                position: 'absolute', top: '-6px', right: '-6px', background: '#ef4444', 
                color: 'white', fontSize: '10px', padding: '2px 5px', borderRadius: '10px', fontWeight: 900 
              }}>
                {resetRequests.length}
              </span>
            </button>
          )}

          {can(PERM.ADD_MEMBER) && (
            <button style={styles.addBtn} onClick={openAddForm}>
              <UserPlus size={18} /> Add Member
            </button>
          )}
        </div>
      </div>

      {/* ── Alerts ─────────────────────────────────────────────────────────── */}
      {error && (
        <div style={styles.alert('error')}>
          <AlertCircle size={16} /> {error}
        </div>
      )}
      {success && (
        <div style={styles.alert('success')}>
          <Check size={16} /> {success}
        </div>
      )}

      {/* ── Add / Edit Form Modal ───────────────────────────────────────────── */}
      {showForm && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>
                {editingId ? 'Edit Member' : 'Add New Member'}
              </h2>
              <button style={styles.closeBtn} onClick={closeForm}><X size={20} /></button>
            </div>

            {formError && (
              <div style={{ ...styles.alert('error'), margin: '1rem 1.5rem 0' }}>
                <AlertCircle size={14} /> {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} style={styles.form}>
              {/* Name */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Full Name *</label>
                <input
                  style={styles.input}
                  required
                  placeholder="e.g. Priya Sharma"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                />
              </div>

              {/* Email */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Email ID *</label>
                <input
                  style={styles.input}
                  required
                  type="email"
                  placeholder="e.g. priya@gvp.org"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  disabled={!!editingId}
                />
                {!editingId && (
                  <span style={styles.hint}>Default password will be: {form.email ? form.email.split('@')[0] + '@gvp' : '(email-prefix)@gvp'}</span>
                )}
              </div>

              {/* Password - Only for new members */}
              {!editingId && (
                <div style={styles.formGroup}>
                  <label style={styles.label}>Password (Optional)</label>
                  <input
                    style={styles.input}
                    type="text"
                    placeholder="Leave blank for default password"
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  />
                  <span style={styles.hint}>If left blank, the default password logic above applies.</span>
                </div>
              )}

              {/* Mobile */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Mobile No.</label>
                <input
                  style={styles.input}
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={form.mobile}
                  onChange={e => setForm(f => ({ ...f, mobile: e.target.value }))}
                />
              </div>

              {/* Employee ID */}
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Employee ID
                  {!can(PERM.VIEW_EMPLOYEE_ID) && <span style={styles.lockedBadge}><Lock size={10} /> Restricted</span>}
                </label>
                <input
                  style={styles.input}
                  placeholder="e.g. GVP-IT-002"
                  value={form.employee_id}
                  onChange={e => setForm(f => ({ ...f, employee_id: e.target.value }))}
                />
              </div>

              {/* Department — only if ASSIGN_DEPARTMENT permission */}
              {can(PERM.ASSIGN_DEPARTMENT) && (
                <div style={styles.formGroup}>
                  <label style={styles.label}>Department</label>
                  <div style={styles.selectWrapper}>
                    <select
                      style={styles.select}
                      value={form.department_id}
                      onChange={e => setForm(f => ({ ...f, department_id: e.target.value }))}
                    >
                      <option value="">— Select Department —</option>
                      {departments.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} style={styles.selectIcon} />
                  </div>
                </div>
              )}

              {/* Role — only if ASSIGN_ROLE permission */}
              {can(PERM.ASSIGN_ROLE) && (
                <div style={styles.formGroup}>
                  <label style={styles.label}>Role</label>
                  <div style={styles.selectWrapper}>
                    <select
                      style={styles.select}
                      value={form.role_id}
                      onChange={e => setForm(f => ({ ...f, role_id: e.target.value }))}
                    >
                      <option value="">— Select Role —</option>
                      {roles.map(r => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} style={styles.selectIcon} />
                  </div>
                </div>
              )}

              <div style={styles.formActions}>
                <button type="button" style={styles.cancelBtn} onClick={closeForm}>Cancel</button>
                <button type="submit" style={styles.submitBtn} disabled={submitting}>
                  {submitting ? <RefreshCw size={16} className="spin" /> : <Check size={16} />}
                  {editingId ? 'Save Changes' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* ── Reset Password Modal ───────────────────────────────────────────── */}
      {showResetModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Reset user Password</h2>
              <button style={styles.closeBtn} onClick={() => setShowResetModal(null)}><X size={20} /></button>
            </div>
            <form onSubmit={handleResetPassword} style={styles.form}>
              <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
                Resetting password for <strong>{members.find(m => m.id === showResetModal)?.name}</strong>
              </p>
              <div style={styles.formGroup}>
                <label style={styles.label}>New Password</label>
                <input 
                  style={styles.input}
                  type="text"
                  placeholder="Minimum 4 characters"
                  required
                  value={resetPasswordVal}
                  onChange={e => setResetPasswordVal(e.target.value)}
                />
              </div>
              <div style={styles.formActions}>
                <button type="button" style={styles.cancelBtn} onClick={() => setShowResetModal(null)}>Cancel</button>
                <button type="submit" style={styles.submitBtn} disabled={resetting || resetPasswordVal.length < 4}>
                  {resetting ? <RefreshCw size={16} className="spin" /> : <Check size={16} />}
                  Confirm Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Reset Requests Side Panel/Overlay ───────────────────────────────── */}
      {showRequestsView && (
        <div style={styles.modalOverlay}>
          <div style={{ ...styles.modal, maxWidth: '600px' }}>
            <div style={styles.modalHeader}>
              <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Password Reset Requests</h2>
              <button style={styles.closeBtn} onClick={() => setShowRequestsView(false)}><X size={20} /></button>
            </div>
            <div style={{ padding: '1.5rem' }}>
              {resetRequests.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#64748b' }}>No pending requests.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {resetRequests.map(req => (
                    <div key={req.id} style={{ 
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                      background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' 
                    }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{req.user_name}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{req.user_email}</div>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                          Requested at: {new Date(req.requested_at).toLocaleString()}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          style={{ ...styles.addBtn, padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}
                          onClick={() => {
                            setShowRequestsView(false);
                            setShowResetModal(req.user_id);
                            setResetPasswordVal('');
                          }}
                        >
                          Reset
                        </button>
                        <button 
                          style={styles.actionBtn('delete')}
                          onClick={() => handleDeleteRequest(req.id)}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {can(PERM.VIEW_USER_BASIC) && (
        <div style={styles.tableCard}>
          {/* Search */}
          <div style={styles.tableToolbar}>
            <div style={styles.searchBox}>
              <Search size={16} style={{ color: '#94a3b8' }} />
              <input
                style={styles.searchInput}
                placeholder="Search by name, email, department..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <span style={styles.countBadge}>
              <Users size={14} /> {filtered.length} member{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>

          {loading ? (
            <div style={styles.loading}>
              <RefreshCw size={24} className="spin" style={{ color: '#3b82f6' }} />
              <span>Loading members...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div style={styles.empty}>
              <Users size={40} style={{ opacity: 0.3 }} />
              <p>{search ? 'No members match your search.' : 'No members found.'}</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Mobile</th>
                    {can(PERM.VIEW_EMPLOYEE_ID) && <th style={styles.th}>Employee ID</th>}
                    {can(PERM.VIEW_DEPARTMENT) && <th style={styles.th}>Department</th>}
                    <th style={styles.th}>Role(s)</th>
                    <th style={styles.th}>Joined</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((m, idx) => (
                    <tr key={m.id} style={{ background: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                      <td style={styles.td}>
                        <div style={styles.nameCell}>
                          <div style={styles.avatar}>{m.name[0]}</div>
                          <span style={{ fontWeight: 600 }}>{m.name}</span>
                        </div>
                      </td>
                      <td style={styles.td}>{m.email}</td>
                      <td style={styles.td}>{m.mobile || '—'}</td>
                      {can(PERM.VIEW_EMPLOYEE_ID) && (
                        <td style={styles.td}>
                          <code style={styles.code}>{m.employee_id || '—'}</code>
                        </td>
                      )}
                      {can(PERM.VIEW_DEPARTMENT) && (
                        <td style={styles.td}>{m.department || '—'}</td>
                      )}
                      <td style={styles.td}>
                        {m.roles ? (
                          m.roles.split(', ').map(r => (
                            <span key={r} style={styles.rolePill(r)}>{r}</span>
                          ))
                        ) : '—'}
                      </td>
                      <td style={styles.td} className="text-muted">
                        {new Date(m.created_at).toLocaleDateString('en-IN')}
                      </td>
                      <td style={styles.td}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          {(can(PERM.ASSIGN_DEPARTMENT) || can(PERM.ASSIGN_ROLE)) && (
                            <button
                              style={styles.actionBtn('edit')}
                              onClick={() => openEditForm(m)}
                              title="Edit member"
                            >
                              <Pencil size={14} />
                            </button>
                          )}
                          {can(PERM.DELETE_MEMBER) && (
                            confirmDelete === m.id ? (
                              <div style={{ display: 'flex', gap: '0.25rem' }}>
                                <button
                                  style={styles.actionBtn('confirm')}
                                  onClick={() => handleDelete(m.id)}
                                  disabled={deleting === m.id}
                                >
                                  {deleting === m.id ? <RefreshCw size={12} className="spin" /> : <Check size={12} />}
                                </button>
                                <button
                                  style={styles.actionBtn('cancel')}
                                  onClick={() => setConfirmDelete(null)}
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            ) : (
                              <button
                                style={styles.actionBtn('delete')}
                                onClick={() => setConfirmDelete(m.id)}
                                title="Delete member"
                              >
                                <Trash2 size={14} />
                              </button>
                            )
                          )}
                          {can(PERM.RESET_PASSWORD) && (
                            <button
                              style={styles.actionBtn('reset')}
                              onClick={() => {
                                setShowResetModal(m.id);
                                setResetPasswordVal('');
                              }}
                              title="Reset Password"
                            >
                              <Lock size={14} />
                              <span style={{ marginLeft: '4px', fontSize: '11px', fontWeight: 700 }}>Reset</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 0.8s linear infinite; }
      `}</style>
    </div>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────
const styles: Record<string, any> = {
  root: {
    padding: '1.5rem',
    maxWidth: '1400px',
    margin: '0 auto',
    fontFamily: "'Inter', system-ui, sans-serif",
    minHeight: '100%'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  title: {
    fontSize: '1.6rem',
    fontWeight: 800,
    color: '#0f172a',
    margin: 0,
    display: 'flex',
    alignItems: 'center'
  },
  subtitle: {
    color: '#64748b',
    fontSize: '0.85rem',
    margin: '0.25rem 0 0 0',
    paddingLeft: '1.75rem'
  },
  permBadges: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.25rem',
    maxWidth: '400px'
  },
  permBadge: {
    background: '#eff6ff',
    color: '#2563eb',
    padding: '0.15rem 0.45rem',
    borderRadius: '4px',
    fontSize: '0.6rem',
    fontWeight: 700,
    border: '1px solid #bfdbfe'
  },
  refreshBtn: {
    background: '#f1f5f9',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '0.5rem',
    cursor: 'pointer',
    color: '#475569',
    display: 'flex',
    alignItems: 'center'
  },
  addBtn: {
    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    color: 'white',
    border: 'none',
    padding: '0.6rem 1.25rem',
    borderRadius: '8px',
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontSize: '0.9rem',
    boxShadow: '0 4px 12px rgba(59,130,246,0.3)'
  },
  alert: (type: 'error' | 'success') => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontWeight: 600,
    marginBottom: '1rem',
    background: type === 'error' ? '#fef2f2' : '#f0fdf4',
    color: type === 'error' ? '#991b1b' : '#166534',
    border: `1px solid ${type === 'error' ? '#fecaca' : '#bbf7d0'}`
  }),
  tableCard: {
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
    border: '1px solid #e2e8f0',
    overflow: 'hidden'
  },
  tableToolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 1.5rem',
    borderBottom: '1px solid #f1f5f9'
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '0.5rem 0.75rem',
    width: '280px'
  },
  searchInput: {
    border: 'none',
    background: 'none',
    outline: 'none',
    fontSize: '0.875rem',
    width: '100%',
    color: '#1e293b'
  },
  countBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
    background: '#f1f5f9',
    padding: '0.4rem 0.75rem',
    borderRadius: '6px',
    fontSize: '0.8rem',
    fontWeight: 700,
    color: '#475569'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  th: {
    textAlign: 'left' as const,
    padding: '0.75rem 1rem',
    fontSize: '0.7rem',
    fontWeight: 700,
    color: '#64748b',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    background: '#f8fafc',
    borderBottom: '1px solid #e2e8f0',
    whiteSpace: 'nowrap' as const
  },
  td: {
    padding: '0.75rem 1rem',
    fontSize: '0.875rem',
    color: '#1e293b',
    borderBottom: '1px solid #f1f5f9',
    verticalAlign: 'middle' as const
  },
  nameCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.8rem',
    fontWeight: 700,
    flexShrink: 0
  },
  code: {
    background: '#f1f5f9',
    padding: '0.15rem 0.4rem',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontFamily: 'monospace',
    color: '#475569'
  },
  rolePill: (role: string) => ({
    display: 'inline-block',
    padding: '0.15rem 0.5rem',
    borderRadius: '50px',
    fontSize: '0.7rem',
    fontWeight: 700,
    marginRight: '0.25rem',
    background: role === 'Admin' ? '#fef3c7' : role === 'Manager' ? '#e0e7ff' : '#f1f5f9',
    color: role === 'Admin' ? '#92400e' : role === 'Manager' ? '#3730a3' : '#475569'
  }),
  actionBtn: (type: 'edit' | 'delete' | 'confirm' | 'cancel' | 'reset') => ({
    background: type === 'edit' ? '#eff6ff' : type === 'delete' ? '#fef2f2' : type === 'confirm' ? '#f0fdf4' : type === 'reset' ? '#f5f3ff' : '#f1f5f9',
    color: type === 'edit' ? '#3b82f6' : type === 'delete' ? '#ef4444' : type === 'confirm' ? '#16a34a' : type === 'reset' ? '#8b5cf6' : '#64748b',
    border: 'none',
    padding: '0.35rem',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    transition: 'all 0.15s'
  }),
  loading: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '0.75rem',
    padding: '3rem',
    color: '#64748b',
    fontSize: '0.9rem'
  },
  empty: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '0.5rem',
    padding: '3rem',
    color: '#94a3b8'
  },
  accessDenied: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center' as const,
    padding: '5rem 2rem',
    background: 'white',
    borderRadius: '16px',
    border: '2px dashed #fecaca'
  },
  // Modal
  modalOverlay: {
    position: 'fixed' as const,
    inset: 0,
    background: 'rgba(15,23,42,0.6)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(4px)'
  },
  modal: {
    background: 'white',
    borderRadius: '20px',
    width: '100%',
    maxWidth: '520px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
    maxHeight: '90vh',
    overflowY: 'auto' as const
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem',
    borderBottom: '1px solid #f1f5f9'
  },
  closeBtn: {
    background: '#f1f5f9',
    border: 'none',
    borderRadius: '8px',
    padding: '0.4rem',
    cursor: 'pointer',
    color: '#64748b',
    display: 'flex'
  },
  form: {
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.4rem'
  },
  label: {
    fontSize: '0.8rem',
    fontWeight: 700,
    color: '#475569',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem'
  },
  input: {
    padding: '0.65rem 0.9rem',
    border: '1.5px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'border-color 0.2s',
    width: '100%',
    boxSizing: 'border-box' as const
  },
  hint: {
    fontSize: '0.72rem',
    color: '#94a3b8',
    fontStyle: 'italic'
  },
  selectWrapper: {
    position: 'relative' as const
  },
  select: {
    padding: '0.65rem 0.9rem',
    border: '1.5px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '0.9rem',
    outline: 'none',
    width: '100%',
    appearance: 'none' as const,
    background: 'white',
    cursor: 'pointer'
  },
  selectIcon: {
    position: 'absolute' as const,
    right: '0.75rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#94a3b8',
    pointerEvents: 'none' as const
  },
  lockedBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.2rem',
    background: '#fef3c7',
    color: '#92400e',
    padding: '0.1rem 0.4rem',
    borderRadius: '4px',
    fontSize: '0.65rem',
    fontWeight: 700
  },
  formActions: {
    display: 'flex',
    gap: '0.75rem',
    justifyContent: 'flex-end',
    marginTop: '0.5rem'
  },
  cancelBtn: {
    background: '#f1f5f9',
    color: '#475569',
    border: 'none',
    padding: '0.65rem 1.5rem',
    borderRadius: '8px',
    fontWeight: 600,
    cursor: 'pointer'
  },
  submitBtn: {
    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    color: 'white',
    border: 'none',
    padding: '0.65rem 1.5rem',
    borderRadius: '8px',
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem'
  }
};

export default ManageMembers;
