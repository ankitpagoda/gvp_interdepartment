/**
 * API Client — typed wrapper around fetch for RBAC backend calls.
 * All methods include the JWT token from localStorage automatically.
 */

const BASE_URL = 'http://localhost:3001';

function getToken(): string | null {
  return localStorage.getItem('gvp_rbac_token');
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data.message || 'Request failed');
    (err as any).status = res.status;
    (err as any).code = data.error;
    throw err;
  }
  return data as T;
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export interface LoginResponse {
  success: boolean;
  token: string;
  user: RBACUser;
  roles: string[];
  permissions: string[];
}

export interface RBACUser {
  id: number;
  name: string;
  email: string;
  mobile?: string;
  employee_id?: string;
  department?: string;
  department_id?: number;
  primary_department_id?: number;
  assigned_departments?: { id: number; name: string }[];
  profile_sections?: string[];
  department_sections?: string[];
  report_sections?: string[];
  assignment_sections?: string[];
  cctv_sections?: string[];
  created_at: string;
}

export interface MeResponse {
  success: boolean;
  user: RBACUser;
  roles: string[];
  permissions: string[];
}

export async function apiLogin(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return handleResponse<LoginResponse>(res);
}

export async function apiGetMe(): Promise<MeResponse> {
  const res = await fetch(`${BASE_URL}/me`, {
    headers: authHeaders()
  });
  return handleResponse<MeResponse>(res);
}

// ── Members ───────────────────────────────────────────────────────────────────

export interface Member {
  id: number;
  name: string;
  email: string;
  mobile?: string;
  employee_id?: string;
  department?: string;
  department_id?: number;
  primary_department_id?: number;
  assigned_departments?: string; // string representation for table
  roles?: string;   // comma-separated for list view
  profile_sections?: string[];
  department_sections?: string[];
  report_sections?: string[];
  assignment_sections?: string[];
  cctv_sections?: string[];
  created_at: string;
}

export interface Department {
  id: number;
  name: string;
}

export interface Role {
  id: number;
  name: string;
}

export interface MembersListResponse {
  success: boolean;
  members: Member[];
}

export async function apiGetMembers(): Promise<MembersListResponse> {
  const res = await fetch(`${BASE_URL}/members`, { headers: authHeaders() });
  return handleResponse<MembersListResponse>(res);
}

export async function apiGetDepartments(): Promise<{ success: boolean; departments: Department[] }> {
  const res = await fetch(`${BASE_URL}/members/departments`, { headers: authHeaders() });
  return handleResponse(res);
}

export async function apiGetRoles(): Promise<{ success: boolean; roles: Role[] }> {
  const res = await fetch(`${BASE_URL}/members/roles`, { headers: authHeaders() });
  return handleResponse(res);
}

export async function apiCreateMember(data: {
  name: string;
  email: string;
  mobile?: string;
  employee_id?: string;
  department_id?: number;
  role_id?: number;
  password?: string;
}): Promise<{ success: boolean; member: Member }> {
  const res = await fetch(`${BASE_URL}/members`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data)
  });
  return handleResponse(res);
}

export async function apiUpdateMember(id: number, data: {
  name?: string;
  mobile?: string;
  employee_id?: string;
  department_id?: number;
  role_id?: number;
}): Promise<{ success: boolean; member: Member }> {
  const res = await fetch(`${BASE_URL}/members/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data)
  });
  return handleResponse(res);
}

export async function apiDeleteMember(id: number): Promise<{ success: boolean }> {
  const res = await fetch(`${BASE_URL}/members/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
  return handleResponse(res);
}

export async function apiUpdateUserDepartments(id: number, data: {
  departmentIds?: number[];
  primaryDepartmentId?: number;
  profileSections?: string[];
  departmentSections?: string[];
  reportSections?: string[];
  assignmentSections?: string[];
  cctvSections?: string[];
}): Promise<{ success: boolean; member: Member }> {
  const res = await fetch(`${BASE_URL}/members/${id}/departments`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data)
  });
  return handleResponse(res);
}

// ── Password Reset ───────────────────────────────────────────────────────────

export async function apiForgotPassword(identifier: string): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Forgot password request failed.');
  return data;
}

export async function apiResetPasswordSelf(data: {
  identifier: string;
  tempPassword: string;
  newPassword: string;
}): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${BASE_URL}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const resData = await res.json();
  if (!res.ok) throw new Error(resData.message || 'Password reset failed.');
  return resData;
}

export async function apiResetPassword(id: number, newPassword: string): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${BASE_URL}/members/${id}/reset-password`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ newPassword })
  });
  return handleResponse(res);
}

export interface ResetRequest {
  id: number;
  user_id: number;
  identifier: string;
  requested_at: string;
  user_name: string;
  user_email: string;
}

export async function apiGetResetRequests(): Promise<{ success: boolean; requests: ResetRequest[] }> {
  const res = await fetch(`${BASE_URL}/members/reset-requests`, { headers: authHeaders() });
  return handleResponse(res);
}

export async function apiDeleteResetRequest(id: number): Promise<{ success: boolean }> {
  const res = await fetch(`${BASE_URL}/members/reset-requests/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
  return handleResponse(res);
}
