/**
 * useRBACAuth hook — manages RBAC auth state (token, user, permissions)
 * Exposes helpers like can(permission) for clean conditional rendering.
 */
import { useState, useEffect, useCallback } from 'react';
import { apiGetMe, type RBACUser, type MeResponse } from '../api/rbacApi';

export interface RBACAuthState {
  rbacUser: RBACUser | null;
  roles: string[];
  permissions: string[];
  isAdmin: boolean;
  isManager: boolean;
  assignedDepartments: { id: number; name: string }[];
  primaryDepartmentId?: number;
  profileSections: string[];
  departmentSections: string[];
  reportSections: string[];
  assignmentSections: string[];
  cctvSections: string[];
  isLoading: boolean;
  can: (permission: string) => boolean;
  setRBACSession: (token: string, user: RBACUser, roles: string[], permissions: string[]) => void;
  clearRBACSession: () => void;
}

export function useRBACAuth(): RBACAuthState {
  const [rbacUser, setRbacUser] = useState<RBACUser | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, restore session from localStorage and verify with /me
  useEffect(() => {
    const token = localStorage.getItem('gvp_rbac_token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    apiGetMe()
      .then((data: MeResponse) => {
        setRbacUser(data.user);
        setRoles(data.roles);
        setPermissions(data.permissions);
      })
      .catch(() => {
        // Token invalid/expired — clear session
        localStorage.removeItem('gvp_rbac_token');
        localStorage.removeItem('gvp_rbac_user');
      })
      .finally(() => setIsLoading(false));
  }, []);

  /**
   * Called after a successful login to store session data.
   */
  const setRBACSession = useCallback(
    (token: string, user: RBACUser, newRoles: string[], newPerms: string[]) => {
      localStorage.setItem('gvp_rbac_token', token);
      localStorage.setItem('gvp_rbac_user', JSON.stringify(user));
      setRbacUser(user);
      setRoles(newRoles);
      setPermissions(newPerms);
    },
    []
  );

  /**
   * Called on logout — clears all RBAC session data.
   */
  const clearRBACSession = useCallback(() => {
    localStorage.removeItem('gvp_rbac_token');
    localStorage.removeItem('gvp_rbac_user');
    setRbacUser(null);
    setRoles([]);
    setPermissions([]);
  }, []);

  /**
   * Check if the current user has a specific permission.
   * This is used for frontend conditional rendering.
   * NOTE: Backend STILL enforces it — this is only for UI hints.
   */
  const can = useCallback(
    (permission: string): boolean => permissions.includes(permission),
    [permissions]
  );

  return {
    rbacUser,
    roles,
    permissions,
    isAdmin: roles.includes('Admin'),
    isManager: roles.includes('Manager'),
    assignedDepartments: rbacUser?.assigned_departments || [],
    primaryDepartmentId: rbacUser?.primary_department_id,
    profileSections: rbacUser?.profile_sections || [],
    departmentSections: rbacUser?.department_sections || [],
    reportSections: rbacUser?.report_sections || [],
    assignmentSections: rbacUser?.assignment_sections || [],
    cctvSections: rbacUser?.cctv_sections || [],
    isLoading,
    can,
    setRBACSession,
    clearRBACSession
  };
}
