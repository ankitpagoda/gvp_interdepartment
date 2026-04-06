# User-Department Mapping System Documentation

## Overview

The User-Department Mapping System provides **strict view-level access control** based on department assignments. This is not just filtering—entire UI sections are hidden if a user doesn't have access.

---

## Core Principle

**No Department = No Access. No Exceptions.**

- Users see **only** what their department mapping allows
- Unauthorized sections **never appear** in navigation (not disabled, fully hidden)
- UI feels intentional, not restricted

---

## Components

### 1. UserDepartmentMappingAdmin
**File:** `src/components/UserDepartmentMappingAdmin.tsx`

**Purpose:** Admin/Authority panel for managing user-department assignments

**Features:**
- **User Search:** Search by name, staff ID, or email
- **User List:** Scrollable list with department count indicators
- **Profile Card:** Shows user identity (name, staff ID, email, designation, role)
- **Department Grid:** Visual selection with checkboxes and color coding
- **Primary Department:** Set one department as primary
- **Access Rules Display:** Shows what access user will have
- **Save Mapping:** Persist changes with visual feedback

**Usage:**
```tsx
import UserDepartmentMappingAdmin from './components/UserDepartmentMappingAdmin';

<UserDepartmentMappingAdmin />
```

**Access Rules Displayed:**
- 0 departments → Warning: "No access to any views"
- 1 department → "User will see only [Dept] menus, dashboards, and data"
- 2+ departments → "User will see merged views from N departments"

---

### 2. DepartmentSwitcher
**File:** `src/components/DepartmentSwitcher.tsx`

**Purpose:** Header component for switching between assigned departments

**Features:**
- Shows current department context
- Dropdown with all assigned departments
- "All Departments" option (if user has 2+)
- Active indicator (blue dot)
- Instant context switching

**Usage:**
```tsx
import DepartmentSwitcher from './components/DepartmentSwitcher';

const [currentDept, setCurrentDept] = useState<string | null>(null);

<DepartmentSwitcher
  assignedDepartments={userDepartments}
  currentDepartment={currentDept}
  onSwitch={(deptId) => setCurrentDept(deptId)}
  showAllOption={true}
/>
```

**Behavior:**
- Hidden if user has 0 departments
- Hidden if user has 1 department (unless `showAllOption=true`)
- Switching updates UI context immediately
- No page reload required

---

### 3. UserDepartmentIndicator
**File:** `src/components/UserDepartmentIndicator.tsx`

**Purpose:** Display assigned departments in user profile

**Features:**
- Shows all assigned departments as colored tags
- Primary department badge
- Empty state for no departments
- Compact mode option
- Info note for multiple departments

**Usage:**
```tsx
import UserDepartmentIndicator from './components/UserDepartmentIndicator';

<UserDepartmentIndicator
  assignedDepartments={[
    { id: 'kitchen', name: 'Kitchen', color: '#f97316' },
    { id: 'housekeeping', name: 'Housekeeping', color: '#14b8a6' }
  ]}
  primaryDepartment="kitchen"
  compact={false}
/>
```

**Display:**
- 0 departments → Red warning box
- 1+ departments → Colored tags with primary badge
- Multiple departments → Info note about combined views

---

### 4. AccessDenied
**File:** `src/components/AccessDenied.tsx`

**Purpose:** Clean empty state when user lacks department access

**Features:**
- Lock icon in red circle
- "Access Restricted" title
- Custom message support
- Optional "Request Access" button

**Usage:**
```tsx
import AccessDenied from './components/AccessDenied';

<AccessDenied
  departmentName="Kitchen"
  message="You don't have access to Kitchen department"
  showRequestButton={true}
  onRequestAccess={() => console.log('Request access')}
/>
```

---

## Implementation Guide

### Step 1: Define User Department Mapping

```typescript
interface UserDepartmentMapping {
  userId: string;
  assignedDepartments: string[]; // ['kitchen', 'housekeeping']
  primaryDepartment: string | null; // 'kitchen'
}
```

### Step 2: Filter Navigation Based on Departments

```typescript
const getVisibleMenuItems = (userDepartments: string[]) => {
  const allMenuItems = [
    { id: 'kitchen-dashboard', department: 'kitchen', label: 'Kitchen Dashboard' },
    { id: 'housekeeping-dashboard', department: 'housekeeping', label: 'Housekeeping' },
    { id: 'security-dashboard', department: 'security', label: 'Security' }
  ];

  // Filter to show only items for assigned departments
  return allMenuItems.filter(item => 
    userDepartments.includes(item.department)
  );
};
```

### Step 3: Implement Department Switching

```typescript
const [currentDepartment, setCurrentDepartment] = useState<string | null>(null);

// When department switches, filter data
useEffect(() => {
  if (currentDepartment) {
    // Show only data for this department
    loadDepartmentData(currentDepartment);
  } else {
    // Show combined data from all assigned departments
    loadAllDepartmentsData(user.assignedDepartments);
  }
}, [currentDepartment]);
```

### Step 4: Handle Unauthorized Access

```typescript
const renderView = (viewName: string, userDepartments: string[]) => {
  const viewDepartment = getViewDepartment(viewName);
  
  if (!userDepartments.includes(viewDepartment)) {
    return <AccessDenied departmentName={viewDepartment} />;
  }
  
  return <ViewComponent />;
};
```

---

## Access Control Rules

### Rule 1: No Department = No Access
```typescript
if (user.assignedDepartments.length === 0) {
  return <AccessDenied message="No department assigned. Contact admin." />;
}
```

### Rule 2: Single Department = Only That Department's Views
```typescript
if (user.assignedDepartments.length === 1) {
  const dept = user.assignedDepartments[0];
  return renderDepartmentViews(dept);
}
```

### Rule 3: Multiple Departments = Merged Views
```typescript
if (user.assignedDepartments.length > 1) {
  const allViews = user.assignedDepartments.flatMap(dept => 
    getDepartmentViews(dept)
  );
  
  // Remove duplicates
  const uniqueViews = [...new Set(allViews)];
  return renderViews(uniqueViews);
}
```

### Rule 4: Primary Department = Default Context
```typescript
const defaultDepartment = user.primaryDepartment || user.assignedDepartments[0];
setCurrentDepartment(defaultDepartment);
```

---

## UI Behavior Matrix

| User Departments | Sidebar | Dashboards | Switcher | Empty State |
|-----------------|---------|------------|----------|-------------|
| 0 departments   | Hidden  | Hidden     | Hidden   | Shown       |
| 1 department    | Dept A only | Dept A only | Hidden* | Not shown |
| 2+ departments  | A + B merged | A + B merged | Shown | Not shown |

*Switcher can be shown if `showAllOption=true`

---

## Visual Design Principles

### Color Coding
Each department has a unique color:
- Kitchen: `#f97316` (Orange)
- Housekeeping: `#14b8a6` (Teal)
- Security: `#ef4444` (Red)
- Reception: `#6366f1` (Indigo)
- etc.

### Department Tags
- **Primary:** Thicker border (2.5px), shadow, "Primary" badge
- **Secondary:** Normal border (2px), no shadow

### Role Badges
- Staff: Grey (`#64748b`)
- Manager: Blue (`#3b82f6`)
- GM: Purple (`#8b5cf6`)
- Trustee: Orange (`#f59e0b`)
- Chairman: Red (`#ef4444`)

---

## Integration Checklist

- [x] Add `UserDepartmentMappingAdmin` to admin panel
- [x] Add `DepartmentSwitcher` to header/navbar
- [x] Add `UserDepartmentIndicator` to user profile
- [x] Implement department-based navigation filtering
- [x] Implement department-based data filtering
- [x] Add `AccessDenied` for unauthorized access
- [x] Test with 0, 1, and multiple department assignments
- [x] Verify UI updates on department switch
- [x] Verify no disabled/locked sections appear
- [x] Test primary department functionality (Implemented & Integrated)

---

## API Integration Points

### Get User Departments
```typescript
GET /api/users/{userId}/departments
Response: {
  assignedDepartments: string[];
  primaryDepartment: string | null;
}
```

### Update User Departments
```typescript
POST /api/users/{userId}/departments
Body: {
  departments: string[];
  primary: string | null;
}
```

### Get Department Views
```typescript
GET /api/departments/{deptId}/views
Response: {
  menus: MenuItem[];
  dashboards: Dashboard[];
  widgets: Widget[];
}
```

---

## Best Practices

1. **Never show disabled sections** - Hide them completely
2. **Update UI immediately** on department switch
3. **Show clear empty states** for no access
4. **Use color coding** for visual department identification
5. **Set primary department** as default context
6. **Merge views intelligently** - no duplicates
7. **Provide admin tools** for easy mapping management
8. **Log access attempts** for security auditing

---

## Security Notes

- Department mapping is **view-level access control**
- Backend must also enforce department-based permissions
- Never trust client-side filtering alone
- Validate department access on every API call
- Log unauthorized access attempts
- Implement role-based overrides (e.g., GM sees all)

---

## Future Enhancements

- [ ] Temporary department access (time-limited)
- [ ] Department access requests workflow
- [ ] Bulk user department assignment
- [ ] Department hierarchy (parent/child)
- [ ] Access audit logs
- [ ] Department-specific permissions (read/write)
- [ ] Department groups/teams

---

## Support

For questions or issues with the User-Department Mapping System, contact the development team.
