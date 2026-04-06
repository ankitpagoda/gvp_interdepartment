# RBAC Implementation Testing Checklist

## 1. Authentication Layer (Base Security)
- [x] **Valid Login**: Login with `admin@gvp.org` / `admin@123` returns a valid JWT.
- [x] **Invalid Login**: Login with incorrect password returns 401.
- [x] **No Token**: Accessing `/members` without an Authorization header returns 401.
- [x] **Malformed Token**: Accessing `/members` with an invalid token (garbage string) returns 401.
- [x] **Expired Token**: Verify that `TokenExpiredError` is handled gracefully. (Implemented in middleware and frontend catch logic)

## 2. Permission-Based Access (Granular Control)
- [x] **Admin Full Access**: Verified Admin can access all member CRUD endpoints.
- [x] **Manager Restricted Access**:
    - [x] Can access `VIEW_USER_BASIC` routes (list, read).
    - [x] Cannot access `ADD_MEMBER` (POST /members) - returns 403.
    - [x] Cannot access `DELETE_MEMBER` (DELETE /members) - returns 403.
- [x] **Staff Minimal Access**:
    - [x] Cannot access list of members (requires `VIEW_USER_BASIC`).
    - [x] Returns 403 on `/members`.
- [x] **"OR" Logic (checkAnyPermission)**:
    - [x] Verify `PUT /members/:id` (requires `ASSIGN_ROLE` OR `ASSIGN_DEPARTMENT`) works for Admin.
    - [x] Verify it fails (403) for Manager (has neither).

## 3. UI Consistency (Frontend RBAC)
- [x] **Access Denied Page**: Verified `ManageMembers` shows access restricted view for users without permissions.
- [x] **Conditional Rendering**: Verified "Add Member", "Delete", and special fields (Department/Role) are hidden based on permissions in `ManageMembers.tsx` and `App.tsx`.

## 4. Database Integrity
- [x] **Role-Permission Linkage**: Verified in `db.js`. Admin has 10/10, Manager has 4/10, Staff has 2/10.
- [x] **User-Role Mapping**: Verified permissions are correctly inherited by checking login responses.

## 5. Deployment / Security
- [x] **JWT Secret**: `server/index.js` uses `process.env.JWT_SECRET` with a fallback. Recommended to ensure env var is set in production.
- [x] **Traceability**: `req.user` is attached to every protected request via `authenticate` middleware.
