import { useState, useEffect } from 'react';
import type { Role, Department, TrustId, GVPRequest } from './types.ts';
import Navbar from './components/Navbar.tsx';
import DepartmentDashboard from './components/DepartmentDashboard.tsx';
import { checkSLAs } from './lib/slaService.ts';
import { getRequests } from './lib/mockDb.ts';
import DailyReportWidget from './components/DailyReportWidget.tsx';
import ChatSection from './components/ChatSection.tsx';
import AttendanceSection from './components/AttendanceSection.tsx';
import CCTVSection from './components/CCTVSection.tsx';
import DailyReportSection from './components/DailyReportSection.tsx';
import MeditationSection from './components/MeditationSection.tsx';
import AnalyticsDashboard from './components/AnalyticsDashboard.tsx';
import AnnouncementSection from './components/AnnouncementSection.tsx';

import LeaveRequestSection from './components/LeaveRequestSection.tsx';
import MovementSection from './components/MovementSection.tsx';
import RepairRequestSection from './components/RepairRequestSection.tsx';
import StaffStatusSection from './components/StaffStatusSection.tsx';
import InProgressSection from './components/InProgressSection.tsx';
import VoucherWindowSection from './components/VoucherWindowSection.tsx';
import IssueSubmissionSection from './components/IssueSubmissionSection.tsx';
import ReceivedRequestsSection from './components/ReceivedRequestsSection.tsx';
import UnifiedRequestForm from './components/UnifiedRequestForm.tsx';
import LoginPortal from './components/LoginPortal.tsx';
import TaskStatusDashboard from './components/TaskStatusDashboard.tsx';
import AskAI from './components/AskAI.tsx';
import OperationalMenu from './components/OperationalMenu.tsx';
import AllFeedbackSection from './components/AllFeedbackSection.tsx';
import SurveyBuilder from './components/SurveyBuilder.tsx';
import SurveyReport from './components/SurveyReport.tsx';
import AnnouncementFeed from './components/AnnouncementFeed.tsx';
import SuggestionsSection from './components/SuggestionsSection.tsx';
import PurchaseOrderForm from './components/PurchaseOrderForm.tsx';
import PurchaseOrderFeed from './components/PurchaseOrderFeed.tsx';
import MeditationDashboard from './components/MeditationDashboard.tsx';
import HousekeepingFeed from './components/HousekeepingFeed.tsx';
import RoomForm from './components/RoomForm.tsx';
import RoomDashboard from './components/RoomDashboard.tsx';
import CourseSummaryForm from './components/CourseSummaryForm.tsx';
import MeditatorRequestForm from './components/MeditatorRequestForm.tsx';
import MeditatorDashboard from './components/MeditatorDashboard.tsx';
import BillSubmitForm from './components/BillSubmitForm.tsx';
import type { User as AuthUser } from './types.ts';
import { useRBACAuth } from './hooks/useRBACAuth.ts';
import ManageMembers from './components/ManageMembers.tsx';
import DepartmentSwitcher from './components/DepartmentSwitcher.tsx';
import UserDepartmentMappingAdmin from './components/UserDepartmentMappingAdmin.tsx';
import AccessDenied from './components/AccessDenied.tsx';

import { DEPARTMENT_ACTIVITIES } from './lib/activities.ts';

const SIDEBAR_DEPARTMENTS: Record<TrustId, Department[]> = {
  'DPVT': ['Dhamma-Pattana'],
  'SVCT': ['Food-Court', 'Souvenir', 'Dhammalay'],
  'VRI': ['Library', 'Academic', 'Pariyatti', 'Publication', 'Archive', 'Conservation', 'Preservation'],
  'GVP': ['Reception', 'Museum', 'PR', 'Maintains', 'Electrical', 'Water', 'Civil', 'Kitchen', 'One-Day', 'Garden', 'Housekeeping', 'Security', 'Accounts', 'IT', 'Purchase', 'Store'],
  'GPT': [],
  'DPT': []
};

// Nav Sub-options for special views
const SPECIAL_SUB_OPTIONS: Record<string, string[]> = {
  'Visitor / Sevak': ['All Feedback', 'Analytic'],
  'Todays Report': ['Daily Report', 'Analytics'],
  'My Profile': ['My Task', 'Unified Request', 'Task Status', 'Bill Submit', 'Room Form', 'Meditator Request', 'Course Summary', 'Schedule', 'Meditation', 'Survey', 'Purchase Order', 'Pay-slip', 'Announcements', 'Feedback', 'Suggestion', 'Chat', 'Leave', 'Movement'],
};

interface ActiveContext {
  label: string;
  role: Role;
  department: Department;
  trust: TrustId;
  type?: 'special' | 'dept';
}
function App() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const {
    rbacUser,
    roles,
    permissions,
    setRBACSession,
    clearRBACSession,
    can,
    isLoading: isRBACLoading,
    assignedDepartments,
    primaryDepartmentId,
    profileSections,
    departmentSections
  } = useRBACAuth();

  const [activeContext, setActiveContext] = useState<ActiveContext>({
    label: 'My Profile',
    role: 'Staff',
    department: 'IT',
    trust: 'GVP',
    type: 'special'
  });

  const [activeSubOption, setActiveSubOption] = useState<string>('My Task');
  const [activeActivity, setActiveActivity] = useState<string>('Dashboard');
  const [requests, setRequests] = useState<GVPRequest[]>([]);
  const [currentDepartmentId, setCurrentDepartmentId] = useState<number | null>(null);

  useEffect(() => {
    if (primaryDepartmentId) {
      setCurrentDepartmentId(primaryDepartmentId);
    }
  }, [primaryDepartmentId]);

  // Simulation settings (for demo purposes)
  const simulationOptions: { label: string; role: Role; type: 'special' | 'dept'; trust?: TrustId; department?: Department }[] = [
    { label: 'Visitor / Sevak', role: 'Sevak', type: 'special' },
    { label: 'Todays Report', role: 'Manager', type: 'special' },
    { label: 'My Profile', role: 'Staff', type: 'special' },
  ];

  useEffect(() => {
    // Check for existing session (LEGACY - keep for compat, but prioritize RBAC)
    const stored = localStorage.getItem('gvp_user');
    if (stored && !rbacUser) {
      const userData = JSON.parse(stored);
      setUser(userData);
      setActiveContext({
        label: 'My Profile',
        role: userData.role,
        department: userData.department,
        trust: userData.trustId,
        type: 'special'
      });
      setActiveSubOption('My Task');
    }

    const poll = () => {
      const data = getRequests();
      setRequests(data);
      checkSLAs();
    };

    poll();
    const interval = setInterval(poll, 5000);
    return () => clearInterval(interval);
  }, [rbacUser]);

  // Merge regular user with RBAC user
  const currentUser = rbacUser ? {
    id: String(rbacUser.id),
    name: rbacUser.name,
    email: rbacUser.email,
    role: (roles?.[0] || 'Staff') as Role, // Use roles from hook
    department: (rbacUser.department as Department) || 'IT',
    staffId: rbacUser.employee_id || 'N/A',
    trustId: 'GPT' as TrustId,
    profile_sections: rbacUser.profile_sections || [],
    department_sections: rbacUser.department_sections || [],
    report_sections: rbacUser.report_sections || [],
    assignment_sections: rbacUser.assignment_sections || [],
    cctv_sections: rbacUser.cctv_sections || []
  } : user;

  if (isRBACLoading) {
    return <div className="flex h-screen items-center justify-center">Loading Authority...</div>;
  }

  const getSpecialSubOptions = (label: string) => {
    const base = SPECIAL_SUB_OPTIONS[label] || [];
    if (label === 'My Profile') {
      const perms = permissions || [];
      // Filter base options by user's enabled profile sections if the mapping exists
      let baseOptions = (profileSections && profileSections.length > 0)
        ? base.filter(section => profileSections.includes(section))
        : [...base];
      
      if (perms.includes('VIEW_USER_BASIC') || perms.includes('ADD_MEMBER')) {
        baseOptions.push('Manage Members');
      }
      if (perms.includes('ASSIGN_DEPARTMENT')) {
        baseOptions.push('Department Mapping');
      }
      return baseOptions;
    }
    return base;
  };

  const handleContextClick = (ctx: any) => {
    setActiveContext(ctx);
    const subOptions = (ctx.type === 'special'
      ? getSpecialSubOptions(ctx.label)
      : DEPARTMENT_ACTIVITIES[ctx.department as Department]) || [];
    setActiveSubOption(subOptions[0] || 'Dashboard');
    setActiveActivity('Dashboard');
  };

  const renderContent = () => {
    // Determine the current "Module" or "Focus"
    // Use type field to distinguish between special views (My Profile, etc.) and actual department views
    const isDeptView = activeContext.type === 'dept';
    const currentView = isDeptView ? activeActivity : activeSubOption;

    // RBAC: Check for department access
    if (isDeptView && !roles.includes('Admin') && assignedDepartments.length > 0) {
      const hasAccess = assignedDepartments.some(ad => ad.name === activeContext.department);
      if (!hasAccess) {
        return <AccessDenied departmentName={activeContext.department} />;
      }
    }

    // Mapping for modules
    if (currentView === 'Unified Request') {
      return <UnifiedRequestForm user={currentUser} onCancel={() => setActiveSubOption('My Task')} />;
    }

    if (currentView === 'My Task' || currentView === 'Task Status') {
      return <TaskStatusDashboard user={currentUser} />;
    }

    if (currentView === 'Manage Members') {
      return <ManageMembers permissions={permissions} />;
    }

    if (currentView === 'Department Mapping') {
      if (!can('ASSIGN_DEPARTMENT')) return <AccessDenied message="You don't have permission to manage mappings." />;
      return <UserDepartmentMappingAdmin />;
    }

    if (currentView === 'Chat') {
      return <ChatSection user={currentUser} />;
    }

    if (currentView === 'Dashboard') {
      return <DepartmentDashboard role={activeContext.role} requests={requests} user={currentUser} />;
    }

    if (currentView === 'Attendance') {
      return <AttendanceSection />;
    }

    if (currentView === 'CCTV') {
      return <CCTVSection />;
    }

    if (currentView === 'Daily Report') {
      return <DailyReportSection />;
    }

    if (currentView === 'Purchase Order') {
      return isDeptView ? <PurchaseOrderFeed /> : <PurchaseOrderForm />;
    }

    if (currentView === 'Meditation' || currentView === 'Meditation Done') {
      return isDeptView ? <MeditationDashboard /> : <MeditationSection />;
    }

    if (currentView === 'Analytics') {
      return <AnalyticsDashboard />;
    }

    if (currentView === 'Housekeeping Maintenance Dashboard') {
      return <HousekeepingFeed />;
    }

    if (currentView === 'Room Form') {
      return <RoomForm user={currentUser} />;
    }

    if (currentView === 'Room Dashboard') {
      return <RoomDashboard />;
    }

    if (currentView === 'Course Summary') {
      return <CourseSummaryForm />;
    }

    if (currentView === 'Meditator Request') {
      return isDeptView ? <MeditatorDashboard /> : <MeditatorRequestForm user={currentUser} />;
    }

    if (currentView === 'Bill Submit' || currentView === 'Bill Sub') {
      return <BillSubmitForm user={currentUser} />;
    }

    if (currentView === 'Announcements') {
      return isDeptView ? <AnnouncementFeed /> : <AnnouncementSection />;
    }

    if (currentView === 'Leave') {
      return <LeaveRequestSection />;
    }

    if (currentView === 'Movement') {
      return <MovementSection />;
    }

    if (currentView === 'Staff Status') {
      return <StaffStatusSection user={currentUser} />;
    }

    if (currentView === 'In-Progress') {
      return <InProgressSection />;
    }

    if (currentView === 'Issue') {
      return <IssueSubmissionSection />;
    }

    if (currentView === 'Voucher') {
      return <VoucherWindowSection />;
    }

    if (currentView === 'Maintains') {
      return <RepairRequestSection />;
    }

    if (currentView === 'Staff Resume') {
      return (
        <div className="p-8">
          <div className="glass-card p-12 text-center border-2 border-dashed border-gray-200">
            <h3 className="text-2xl font-bold text-primary-dark mb-4">Staff Resume Vault</h3>
            <p className="text-text-muted">Repository of staff profiles for {activeSubOption}.</p>
          </div>
        </div>
      );
    }

    if (currentView === 'Swipe Request') {
      return (
        <div className="p-8">
          <div className="glass-card p-12 text-center border-2 border-dashed border-gray-200">
            <h3 className="text-2xl font-bold text-primary-dark mb-4">Manual Swipe Approval</h3>
            <p className="text-text-muted">Manage attendance swipe regularizations here.</p>
          </div>
        </div>
      );
    }

    if (currentView === 'Policies') {
      return (
        <div className="p-8">
          <div className="glass-card p-12 text-center border-2 border-dashed border-gray-200">
            <h3 className="text-2xl font-bold text-primary-dark mb-4">Department Policies</h3>
            <p className="text-text-muted">Standard Operating Procedures for {activeSubOption}.</p>
          </div>
        </div>
      );
    }

    if (currentView === 'Received Request' || currentView === 'Requests' || currentView === 'Received Requests') {
      const dept = ['GVP', 'DPVT', 'SVCT', 'VRI'].includes(activeContext.label) ? activeSubOption : activeContext.department;
      return <ReceivedRequestsSection department={dept as Department} user={currentUser} />;
    }

    if (currentView === 'All Feedback') {
      return <AllFeedbackSection />;
    }

    if (currentView === 'Survey') {
      return isDeptView ? <SurveyReport /> : <SurveyBuilder />;
    }

    if (currentView === 'Suggestion') {
      return <SuggestionsSection user={currentUser} />;
    }

    // Default Fallback for generic/new labels
    return (
      <div style={{ padding: '2rem' }}>
        <div className="glass-card p-12 text-center border-2 border-dashed border-gray-200">
          <h3 className="text-2xl font-bold text-primary-dark mb-4">{currentView} Module</h3>
          <p className="text-text-muted mb-8">
            Accessing {currentView.toLowerCase()} for {activeSubOption} Dept under {activeContext.label}.
          </p>
          <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 inline-block text-sm font-semibold text-primary">
            Activity recorded in {activeSubOption} audit timeline.
          </div>
        </div>
      </div>
    );
  };

  if (!currentUser) {
    return <LoginPortal
      onLogin={(userData) => {
        setUser(userData);
        localStorage.setItem('gvp_user', JSON.stringify(userData));
        setActiveContext({
          label: 'My Profile',
          role: userData.role,
          department: userData.department,
          trust: userData.trustId,
          type: 'special'
        });
        setActiveSubOption('My Task');
      }}
      onRBACLogin={(token, rbacUser, rbacRoles, rbacPerms) => {
        setRBACSession(token, rbacUser, rbacRoles, rbacPerms);
        setActiveContext({
          label: 'My Profile',
          role: (rbacRoles[0] as Role) || 'Staff',
          department: (rbacUser.department as Department) || 'IT',
          trust: 'GVP',
          type: 'special'
        });
        setActiveSubOption('My Task');
      }}
    />;
  }

    const handleDeptSwitch = (id: number | null) => {
      setCurrentDepartmentId(id);
      if (id) {
        const dept = assignedDepartments.find(d => d.id === id);
        if (dept) {
          // Find which trust this department belongs to
          let trust: TrustId = 'GVP';
          for (const [tid, depts] of Object.entries(SIDEBAR_DEPARTMENTS)) {
            if (depts.includes(dept.name as Department)) {
              trust = tid as TrustId;
              break;
            }
          }
          handleContextClick({
            label: dept.name,
            role: (roles?.[0] || 'Staff') as Role,
            type: 'dept',
            trust: trust,
            department: dept.name
          });
        }
      } else {
        handleContextClick({
          label: 'My Profile',
          role: (roles?.[0] || 'Staff') as Role,
          type: 'special'
        });
      }
    };

    return (
      <div id="root">
        <Navbar user={currentUser} onLogout={() => { setUser(null); clearRBACSession(); }} />

        <main className="main-container">
          {/* Left Sidebar - Acts as "Role/Context Switcher" for Demo */}
          <aside className="sidebar-left">
            <div className="sidebar-heading">Portal Switcher</div>

            <div className="mb-6 space-y-1">
              {simulationOptions.map((ctx, index) => (
                <button
                  key={index}
                  onClick={() => handleContextClick(ctx)}
                  className={`dept-btn ${activeContext.label === ctx.label ? 'active' : ''}`}
                  style={{ fontWeight: 700 }}
                >
                  {ctx.label}
                </button>
              ))}
            </div>

            {(['GVP', 'DPVT', 'SVCT', 'VRI'] as TrustId[]).map(trustId => {
              const depts = SIDEBAR_DEPARTMENTS[trustId].filter(dept => {
                // If Super Admin (role Admin from mock) or no explicit departments assigned, show all
                if (roles.includes('Admin') || assignedDepartments.length === 0) return true;
                // Otherwise show only assigned ones
                return assignedDepartments.some(ad => ad.name === dept);
              });

              if (depts.length === 0) return null;

              return (
                <div key={trustId} className="mb-4">
                  <div className="px-3 py-2 text-[10px] font-black text-primary uppercase tracking-widest opacity-60">
                    {trustId} Departments
                  </div>
                  <div className="space-y-1">
                    {depts.map((dept: Department) => (
                      <button
                        key={dept}
                        onClick={() => handleContextClick({ label: dept, role: 'Staff', type: 'dept', trust: trustId, department: dept })}
                        className={`dept-btn ${activeContext.department === dept ? 'active' : ''}`}
                        style={{ fontSize: '0.8rem', paddingLeft: '1.5rem' }}
                      >
                        {dept}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </aside>

          {/* Center Content */}
          <section className="content-area">
            {/* Horizontal Nav - For Special Views only or title only */}
            <div className="horizontal-nav" style={{ padding: '0 1.5rem', display: 'flex', alignItems: 'center', minHeight: '48px', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {activeContext.type === 'special' ? (
                  getSpecialSubOptions(activeContext.label)?.map((sub: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setActiveSubOption(sub)}
                      className={`nav-item-h ${activeSubOption === sub ? 'active' : ''}`}
                    >
                      {sub}
                    </button>
                  ))
                ) : (
                  <span className="text-primary font-bold">{activeContext.department} Operations</span>
                )}
              </div>
              {assignedDepartments.length > 0 && (
                <DepartmentSwitcher
                  assignedDepartments={assignedDepartments.map(d => ({ id: String(d.id), name: d.name }))}
                  currentDepartment={currentDepartmentId ? String(currentDepartmentId) : null}
                  onSwitch={(id) => handleDeptSwitch(id ? Number(id) : null)}
                />
              )}
            </div>

          {/* Operational Menu Bar (Control Console) */}
          {activeContext.type === 'dept' && (
            <OperationalMenu
              activeActivity={activeActivity}
              onActivityChange={setActiveActivity}
              activities={(DEPARTMENT_ACTIVITIES[activeContext.department as Department] || []).filter(act => {
                // If mapping is not set or empty, show all (for backward compat)
                if (!departmentSections || departmentSections.length === 0) return true;
                
                // New Granular Check: ${trust}-${dept}:${act}
                const granularKey = `${activeContext.trust}-${activeContext.department}:${act}`;
                if (departmentSections.includes(granularKey)) return true;
                
                // Special case for matching granular "Reception Bills" toggle to any department's "XXXX Bills" activity
                if (act.toLowerCase().includes('bills')) {
                  const billKey = `${activeContext.trust}-${activeContext.department}:Reception Bills`;
                  if (departmentSections.includes(billKey)) return true;
                }
                
                // Legacy support (if no colon in string, treat as global)
                if (departmentSections.includes(act)) return true;
                
                return false;
              })}
            />
          )}

          <div className={`workspace-container ${['CCTV', 'Chat', 'Daily Report', 'Analytics', 'Meditation', 'Meditation Window', 'Announcements', 'Announcements Window', 'Bill Sub', 'My Task', 'Unified Request', 'Courses', 'Material', 'Repair', 'Meals', 'Vehicles', 'Guest', 'Rooms', 'Leave', 'Movement', 'Issue', 'Issue Window', 'Visitor', 'Visitor Window', 'Consumption', 'Consumption Report', 'Received Requests', 'All Feedback', 'Staff Status', 'Task Reports', 'In-Progress', 'MV', 'Voucher Window'].includes(activeSubOption || '') ? 'p-0 flex flex-col' : ''}`}>
            {renderContent()}
          </div>
        </section>

        {/* Right Sidebar */}
        <aside className="sidebar-right">
          <div className="glass-card p-4">
            <p className="widget-title">Current Context</p>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-main)', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>User:</span>
                <span style={{ fontWeight: 600 }}>{currentUser?.name || 'Guest'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Staff ID:</span>
                <span style={{ fontWeight: 600 }}>{currentUser?.staffId || 'N/A'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Role:</span>
                <span style={{ fontWeight: 600 }}>{activeContext.role}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Dept:</span>
                <span style={{ fontWeight: 600 }}>{activeContext.department || 'N/A'}</span>
              </div>
            </div>
          </div>

          <DailyReportWidget />
        </aside>
      </main>

      {/* Footer */}
      <footer className="footer-container">
        <div className="footer-links">
          <a href="#" className="footer-link">About Us</a>
          <span className="footer-divider"></span>
          <a href="#" className="footer-link">Terms of Use</a>
          <span className="footer-divider"></span>
          <a href="#" className="footer-link">Contact Us</a>
          <span className="footer-divider"></span>
          <a href="#" className="footer-link">Privacy Policy</a>
        </div>

        <div className="footer-motto">
          Serving with Dhamma, Discipline, and Clarity
        </div>

        <div className="copyright">
          © 2010 Global Vipassana Pagoda<br />
          All Rights Reserved
        </div>
      </footer>
      <AskAI user={currentUser} />
    </div>
  );
}

export default App;
