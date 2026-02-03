import { useState, useEffect } from 'react';
import type { Role, Department, TrustId, GVPRequest } from './types.ts';
import Navbar from './components/Navbar.tsx';
import VisitorForm from './components/VisitorForm.tsx';
import RequirementForm from './components/RequirementForm.tsx';
import DepartmentDashboard from './components/DepartmentDashboard.tsx';
import AdminDashboard from './components/AdminDashboard.tsx';
import { checkSLAs } from './lib/slaService.ts';
import { getRequests, getRequestsByDepartment } from './lib/mockDb.ts';
import DailyReportWidget from './components/DailyReportWidget.tsx';
import ChatSection from './components/ChatSection.tsx';
import AttendanceSection from './components/AttendanceSection.tsx';
import CCTVSection from './components/CCTVSection.tsx';
import DailyReportSection from './components/DailyReportSection.tsx';
import MeditationSection from './components/MeditationSection.tsx';
import MeditationWindowSection from './components/MeditationWindowSection.tsx';
import AnnouncementSection from './components/AnnouncementSection.tsx';
import AnnouncementsWindowSection from './components/AnnouncementsWindowSection.tsx';
import BillSubSection from './components/BillSubSection.tsx';
import TaskSection from './components/TaskSection.tsx';
import CourseRequestSection from './components/CourseRequestSection.tsx';
import MaterialRequestSection from './components/MaterialRequestSection.tsx';
import MealRequestSection from './components/MealRequestSection.tsx';
import VehicleRequestSection from './components/VehicleRequestSection.tsx';
import GuestRequestSection from './components/GuestRequestSection.tsx';
import RoomRequestSection from './components/RoomRequestSection.tsx';
import LeaveRequestSection from './components/LeaveRequestSection.tsx';
import MovementSection from './components/MovementSection.tsx';
import VisitorRecordSection from './components/VisitorRecordSection.tsx';
import ConsumptionSection from './components/ConsumptionSection.tsx';
import RepairRequestSection from './components/RepairRequestSection.tsx';
import FeedbackCategorySection from './components/FeedbackCategorySection.tsx';
import StaffStatusSection from './components/StaffStatusSection.tsx';
import TaskReportsSection from './components/TaskReportsSection.tsx';
import InProgressSection from './components/InProgressSection.tsx';
import MovementViewSection from './components/MovementViewSection.tsx';
import VoucherWindowSection from './components/VoucherWindowSection.tsx';
import IssueSubmissionSection from './components/IssueSubmissionSection.tsx';
import IssueWindowSection from './components/IssueWindowSection.tsx';
import VisitorReportWindowSection from './components/VisitorReportWindowSection.tsx';
import ConsumptionReportWindowSection from './components/ConsumptionReportWindowSection.tsx';
import ReceivedRequestsSection from './components/ReceivedRequestsSection.tsx';
import AnalyticsSection from './components/AnalyticsSection.tsx';

// Nav Sub-options (Placeholder for standard department tools)
const DEPARTMENT_SUB_OPTIONS: Record<string, string[]> = {
  'Visitor / Sevak': ['All Feedback', 'DPVT', 'Food Court', 'Souvenir', 'Museum', 'Dhammalay'],
  'Todays Report': ['Daily Report', 'Analytics'],
  'My Profile': ['My Task', 'Announcements', 'Bill Sub', 'Attendance', 'Meditation', 'Chat', 'Courses', 'Material', 'Meals', 'Vehicles', 'Guest', 'Rooms', 'Leave', 'Movement', 'Issue', 'Bill Sub', 'Repair', 'Visitor', 'Consumption', 'CCTV'],
  'Reception': ['Staff Status', 'Meditation Window', 'Received Requests', 'Issue Window', 'Announcements Window', 'MV', 'Voucher Window', 'Task Reports', 'In-Progress', 'Policies'],
  'Transport': ['Staff Status', 'Meditation Window', 'Received Requests', 'Issue Window', 'Announcements Window', 'MV', 'Voucher Window', 'Task Reports', 'In-Progress', 'Policies'],
  'IT-Dept': ['Staff Status', 'Meditation Window', 'Received Requests', 'Issue Window', 'Announcements Window', 'MV', 'Voucher Window', 'Task Reports', 'In-Progress', 'Policies'],
  'Account': ['Staff Status', 'Meditation Window', 'Received Requests', 'Issue Window', 'Announcements Window', 'MV', 'Voucher Window', 'Task Reports', 'In-Progress', 'Policies'],
  'Dhammalay': ['Staff Status', 'Consumption Report', 'Visitor Window', 'Meditation Window', 'Received Requests', 'Issue Window', 'Announcements Window', 'MV', 'Voucher Window', 'Task Reports', 'In-Progress', 'Policies'],
  'DPVT': ['Staff Status', 'Consumption Report', 'Meditation Window', 'Received Requests', 'Issue Window', 'Announcements Window', 'MV', 'Voucher Window', 'Task Reports', 'In-Progress', 'Policies'],
  'Museum': ['Staff Status', 'Consumption Report', 'Visitor Window', 'Meditation Window', 'Received Requests', 'Issue Window', 'Announcements Window', 'MV', 'Voucher Window', 'Task Reports', 'In-Progress', 'Policies'],
  'VRI': ['Staff Status', 'Consumption Report', 'Meditation Window', 'Received Requests', 'Issue Window', 'Announcements Window', 'MV', 'Voucher Window', 'Task Reports', 'In-Progress', 'Policies'],
  'Pala': ['Staff Status', 'Meditation Window', 'Received Requests', 'Issue Window', 'Announcements Window', 'MV', 'Voucher Window', 'Task Reports', 'In-Progress', 'Policies'],
  'Souvenir': ['Staff Status', 'Meditation Window', 'Received Requests', 'Issue Window', 'Announcements Window', 'MV', 'Voucher Window', 'Task Reports', 'In-Progress', 'Policies'],
  'PR': ['Staff Status', 'Visitor Window', 'Meditation Window', 'Received Requests', 'Issue Window', 'Announcements Window', 'MV', 'Voucher Window', 'Task Reports', 'In-Progress', 'Policies'],
  'Purchase': ['Staff Status', 'Meditation Window', 'Received Requests', 'Issue Window', 'Announcements Window', 'MV', 'Voucher Window', 'Task Reports', 'In-Progress', 'Policies'], // This should be a full Purchase module later
  'Store': ['Staff Status', 'Meditation Window', 'Received Requests', 'Issue Window', 'Announcements Window', 'MV', 'Voucher Window', 'Task Reports', 'In-Progress', 'Policies'],
  'Maintenance': ['Staff Status', 'Meditation Window', 'Received Requests', 'Issue Window', 'Announcements Window', 'MV', 'Voucher Window', 'Task Reports', 'In-Progress', 'Policies'],
  'Food Court': ['Staff Status', 'Consumption Report', 'Meditation Window', 'Received Requests', 'Issue Window', 'Announcements Window', 'MV', 'Voucher Window', 'Task Reports', 'In-Progress', 'Policies'],
  'Kitchen': ['Staff Status', 'Meditation Window', 'Received Requests', 'Issue Window', 'Announcements Window', 'MV', 'Voucher Window', 'Task Reports', 'In-Progress', 'Policies'],
  'Garden': ['Staff Status', 'Meditation Window', 'Received Requests', 'Issue Window', 'Announcements Window', 'MV', 'Voucher Window', 'Task Reports', 'In-Progress', 'Policies'],
  'Electrician': ['Staff Status', 'Meditation Window', 'Received Requests', 'Issue Window', 'Announcements Window', 'MV', 'Voucher Window', 'Task Reports', 'In-Progress', 'Policies'],
  'Water Man': ['Staff Status', 'Meditation Window', 'Received Requests', 'Issue Window', 'Announcements Window', 'MV', 'Voucher Window', 'Task Reports', 'In-Progress', 'Policies'],
  'Security': ['Staff Status', 'Meditation Window', 'Received Requests', 'Issue Window', 'Announcements Window', 'MV', 'Voucher Window', 'Task Reports', 'In-Progress', 'Policies'],
  'Housekeeping': ['Staff Status', 'Meditation Window', 'Received Requests', 'Issue Window', 'Announcements Window', 'MV', 'Voucher Window', 'Task Reports', 'In-Progress', 'Policies']
};

// Simulation Context: Maps sidebar button to a specific "User Role"
interface SimulationContext {
  label: string;
  role: Role;
  department?: Department;
  trustId?: TrustId;
}

function App() {
  // Default to Visitor as per "old code" feel or safer default? 
  // User complained about removal of VisitorForm, so making it default makes sense.
  const [activeContext, setActiveContext] = useState<SimulationContext>({ label: 'Visitor / Sevak', role: 'Department User' });
  const [activeSubOption, setActiveSubOption] = useState<string | null>('All Feedback');
  const [requests, setRequests] = useState<GVPRequest[]>([]);

  // Define the sidebar "User Switcher" items - RESTORED FULL LIST
  const simulationOptions: SimulationContext[] = [
    { label: 'Visitor / Sevak', role: 'Department User' },

    // GPT Departments
    { label: 'Todays Report', role: 'Department User', department: 'Relevent', trustId: 'GPT' },
    { label: 'My Profile', role: 'Self User', department: 'Relevent', trustId: 'GPT' },
    { label: 'Reception', role: 'Department User', department: 'Reception', trustId: 'GPT' },
    { label: 'Account', role: 'Accounts User', department: 'Account', trustId: 'GPT' },
    { label: 'IT-Dept', role: 'Department User', department: 'IT-Dept', trustId: 'GPT' },
    { label: 'PR', role: 'Department User', department: 'PR', trustId: 'GPT' },
    { label: 'Museum', role: 'Department User', department: 'Museum', trustId: 'GPT' },
    { label: 'Security', role: 'Security User', department: 'Security', trustId: 'GPT' },
    { label: 'Maintenance', role: 'Department User', department: 'Maintenance', trustId: 'GPT' },
    { label: 'Housekeeping', role: 'Department User', department: 'Housekeeping', trustId: 'GPT' },
    { label: 'Transport', role: 'Department User', department: 'Transport', trustId: 'GPT' },

    // SVCT Departments
    { label: 'Dhammalay', role: 'Department User', department: 'Dhammale', trustId: 'SVCT' },
    { label: 'Souvenir', role: 'Department User', department: 'Souvenir', trustId: 'SVCT' },

    // DPT Departments
    { label: 'DPVT', role: 'Department User', department: 'DPVT', trustId: 'DPT' },

    // VRI Departments
    { label: 'VRI', role: 'Department User', department: 'VRI Data Center', trustId: 'VRI' },
    { label: 'Pala', role: 'Department User', department: 'PALA', trustId: 'VRI' },

    // Management/Other
    { label: 'Purchase', role: 'Department User', department: 'Reception', trustId: 'GPT' },
    { label: 'Store', role: 'Department User', department: 'Reception', trustId: 'GPT' },
    { label: 'Food Court', role: 'Department User', department: 'Food Court', trustId: 'GPT' },
    { label: 'Kitchen', role: 'Department User', department: 'Kitchen', trustId: 'SVCT' },
    { label: 'Garden', role: 'Department User', department: 'Garden', trustId: 'GPT' },
    { label: 'Electrician', role: 'Department User', department: 'Electrician', trustId: 'GPT' },
    { label: 'Water Man', role: 'Department User', department: 'Water Man', trustId: 'GPT' },

    // Management Roles
    { label: 'Super Admin', role: 'Super Admin' },
    { label: 'Trustee', role: 'Trustee' },
    { label: 'Purchase Manager', role: 'Purchase Manager' },
    { label: 'Store Manager', role: 'Store Manager' },
  ];

  // Poll for updates (Simulation of socket)
  useEffect(() => {
    const refreshData = () => {
      const allReqs = getRequests();
      if (activeContext.role === 'Super Admin' || activeContext.role === 'Trustee') {
        setRequests(allReqs);
      } else if (activeContext.trustId && activeContext.department) {
        setRequests(getRequestsByDepartment(activeContext.department));
      } else {
        setRequests([]);
      }
      checkSLAs();
    };

    refreshData();
    const interval = setInterval(refreshData, 2000);
    return () => clearInterval(interval);
  }, [activeContext]);

  const handleContextClick = (context: SimulationContext) => {
    setActiveContext(context);
    const options = DEPARTMENT_SUB_OPTIONS[context.label];
    if (options && options.length > 0) {
      setActiveSubOption(options[0]);
    } else {
      setActiveSubOption(null);
    }
  };

  const renderContent = () => {
    // Check specific tool/reports first
    if (activeSubOption === 'Chat') {
      return <ChatSection />;
    }

    if (activeSubOption === 'All Feedback') {
      return <FeedbackCategorySection />;
    }

    if (activeSubOption === 'Staff Status') {
      return <StaffStatusSection />;
    }

    if (activeSubOption === 'Task Reports') {
      return <TaskReportsSection />;
    }

    if (activeSubOption === 'In-Progress') {
      return <InProgressSection />;
    }

    if (activeSubOption === 'MV') {
      return <MovementViewSection />;
    }

    if (activeSubOption === 'Voucher Window') {
      return <VoucherWindowSection />;
    }

    if (activeSubOption === 'Visitor Window') {
      return <VisitorReportWindowSection />;
    }

    if (activeSubOption === 'Consumption Report') {
      return <ConsumptionReportWindowSection />;
    }

    if (activeSubOption === 'Analytics') {
      return <AnalyticsSection />;
    }

    if (activeSubOption === 'Received Requests') {
      return <ReceivedRequestsSection department={activeContext.label} />;
    }

    // Role-based Dashboards
    if (activeContext.role === 'Super Admin' || activeContext.role === 'Trustee' || activeContext.role === 'Purchase Manager' || activeContext.role === 'Store Manager') {
      return <AdminDashboard role={activeContext.role} requests={requests} />;
    }

    // Default Visitor View
    if (activeContext.label === 'Visitor / Sevak') {
      return <VisitorForm role={activeContext.role} />;
    }

    if (activeSubOption === 'Attendance') {
      return <AttendanceSection />;
    }

    if (activeSubOption === 'CCTV') {
      return <CCTVSection />;
    }

    if (activeSubOption === 'Daily Report') {
      return <DailyReportSection />;
    }

    if (activeSubOption === 'Meditation') {
      return <MeditationSection />;
    }

    if (activeSubOption === 'Meditation Window') {
      return <MeditationWindowSection />;
    }

    if (activeSubOption === 'Announcements') {
      return <AnnouncementSection />;
    }

    if (activeSubOption === 'Announcements Window') {
      return <AnnouncementsWindowSection />;
    }

    if (activeSubOption === 'Bill Sub') {
      return <BillSubSection />;
    }

    if (activeSubOption === 'My Task') {
      return <TaskSection />;
    }

    if (activeSubOption === 'Courses') {
      return <CourseRequestSection />;
    }

    if (activeSubOption === 'Material') {
      return <MaterialRequestSection />;
    }

    if (activeSubOption === 'Meals') {
      return <MealRequestSection />;
    }

    if (activeSubOption === 'Vehicles') {
      return <VehicleRequestSection />;
    }

    if (activeSubOption === 'Guest') {
      return <GuestRequestSection />;
    }

    if (activeSubOption === 'Rooms') {
      return <RoomRequestSection />;
    }

    if (activeSubOption === 'Leave') {
      return <LeaveRequestSection />;
    }

    if (activeSubOption === 'Movement') {
      return <MovementSection />;
    }

    if (activeSubOption === 'Issue') {
      return <IssueSubmissionSection />;
    }

    if (activeSubOption === 'Issue Window') {
      return <IssueWindowSection />;
    }

    if (activeSubOption === 'Visitor') {
      return <VisitorRecordSection />;
    }

    if (activeSubOption === 'Consumption') {
      return <ConsumptionSection />;
    }

    if (activeSubOption === 'Repair') {
      return <RepairRequestSection />;
    }

    if (activeSubOption === 'Requirement') {
      return <RequirementForm
        department={activeContext.department || 'Reception'}
        trustId={activeContext.trustId}
        role={activeContext.role}
      />;
    }

    if (activeSubOption) {
      return (
        <div className="p-8 glass-card fade-in">
          <h2 className="text-2xl font-bold mb-4">{activeContext.label} - {activeSubOption}</h2>
          <div className="mt-6 p-12 border-2 border-dashed border-gray-300 rounded-xl text-center text-gray-400 bg-white/20">
            <h3 className="text-xl font-semibold text-gray-600 mb-2">{activeSubOption} Module</h3>
            <p>Ready to process {activeSubOption.toLowerCase()} for {activeContext.label}.</p>
          </div>
        </div>
      );
    }

    // Default Department Dashboard
    return <DepartmentDashboard role={activeContext.role} requests={requests} />;
  };

  return (
    <div id="root">
      <Navbar />

      <main className="main-container">
        {/* Left Sidebar - Acts as "Role/Context Switcher" for Demo */}
        <aside className="sidebar-left">
          <div className="sidebar-heading">
            Simulate As
          </div>
          {simulationOptions.map((ctx, index) => (
            <button
              key={index}
              onClick={() => handleContextClick(ctx)}
              className={`dept-btn ${activeContext.label === ctx.label ? 'active' : ''}`}
            >
              {ctx.label}
            </button>
          ))}
        </aside>

        {/* Center Content */}
        <section className="content-area">
          {/* Horizontal Sub-Navigation Bar */}
          <div className="horizontal-nav">
            {DEPARTMENT_SUB_OPTIONS[activeContext.label]?.map((sub: string, idx: number) => (
              <button
                key={idx}
                onClick={() => setActiveSubOption(sub)}
                className={`nav-item-h ${activeSubOption === sub ? 'active' : ''}`}
              >
                {sub}
              </button>
            ))}
          </div>

          <div className={`workspace-container ${['CCTV', 'Chat', 'Daily Report', 'Analytics', 'Meditation', 'Meditation Window', 'Announcements', 'Announcements Window', 'Bill Sub', 'My Task', 'Courses', 'Material', 'Repair', 'Meals', 'Vehicles', 'Guest', 'Rooms', 'Leave', 'Movement', 'Issue', 'Issue Window', 'Visitor', 'Visitor Window', 'Consumption', 'Consumption Report', 'Received Requests', 'All Feedback', 'Staff Status', 'Task Reports', 'In-Progress', 'MV', 'Voucher Window'].includes(activeSubOption || '') ? 'p-0 flex flex-col' : ''}`}>
            {renderContent()}
          </div>
        </section>

        {/* Right Sidebar */}
        <aside className="sidebar-right">
          <div className="glass-card p-4 mb-4">
            <p className="widget-title">Current Context</p>
            <div className="text-xs space-y-2 mt-2">
              <p><span className="text-text-muted">Role:</span> {activeContext.role}</p>
              <p><span className="text-text-muted">Trust:</span> {activeContext.trustId || 'N/A'}</p>
              <p><span className="text-text-muted">Dept:</span> {activeContext.department || 'N/A'}</p>
            </div>
          </div>

          <div>
            <DailyReportWidget />
          </div>
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
    </div>
  );
}

export default App;
