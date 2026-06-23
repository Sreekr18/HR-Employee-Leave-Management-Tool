import React, { useState, useEffect } from 'react';
import { 
  INITIAL_EMPLOYEES, 
  INITIAL_LEAVES, 
  INITIAL_HOLIDAYS 
} from './data';

// Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import ApplyLeaveForm from './components/ApplyLeaveForm';
import LeavesHistoryView from './components/LeavesHistoryView';
import ManagerApprovalView from './components/ManagerApprovalView';
import EmployeeDirectoryView from './components/EmployeeDirectoryView';
import HolidaysView from './components/HolidaysView';
import SettingsView from './components/SettingsView';
import LoginView from './components/LoginView';

export default function App() {
  // Helper to check if stored employees have old names
  const checkHasOldNames = (parsedEmployees) => {
    if (!parsedEmployees || !Array.isArray(parsedEmployees)) return true;
    return parsedEmployees.some(emp => 
      emp.name && (
        emp.name.includes('Chris') || 
        emp.name.includes('Tony') || 
        emp.name.includes('Bruce') || 
        emp.name.includes('Natasha') || 
        emp.name.includes('Wanda') ||
        emp.name.includes('Arjun') ||
        emp.name.includes('Vikram') ||
        emp.name.includes('Rahul') ||
        emp.name.includes('Neha') ||
        emp.name.includes('Meera')
      )
    );
  };

  // 1. Core State with Lazy Initializers
  const [employees, setEmployees] = useState(() => {
    try {
      const stored = localStorage.getItem('hr_tracker_employees');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (!checkHasOldNames(parsed)) {
          return parsed;
        }
      }
    } catch (e) {}
    // If none found or contains old names, reset to defaults
    return INITIAL_EMPLOYEES;
  });

  const [leaveRequests, setLeaveRequests] = useState(() => {
    try {
      // Check if employees were reset to prevent inconsistent cross-references
      const empStored = localStorage.getItem('hr_tracker_employees');
      let employeesOk = false;
      if (empStored) {
        const parsedEmp = JSON.parse(empStored);
        if (!checkHasOldNames(parsedEmp)) {
          employeesOk = true;
        }
      }
      
      const stored = localStorage.getItem('hr_tracker_leaves');
      if (stored && employeesOk) {
        return JSON.parse(stored);
      }
    } catch (e) {}
    return INITIAL_LEAVES;
  });

  const [holidays, setHolidays] = useState(() => {
    try {
      const stored = localStorage.getItem('hr_tracker_holidays');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {}
    return INITIAL_HOLIDAYS;
  });

  const [currentEmployeeId, setCurrentEmployeeId] = useState(() => {
    try {
      const empStored = localStorage.getItem('hr_tracker_employees');
      let employeesOk = false;
      if (empStored) {
        const parsedEmp = JSON.parse(empStored);
        if (!checkHasOldNames(parsedEmp)) {
          employeesOk = true;
        }
      }
      const storedActiveUser = localStorage.getItem('hr_tracker_active_user');
      if (storedActiveUser && employeesOk) {
        return storedActiveUser;
      }
    } catch (e) {}
    return '154'; // Default: Karthik Chidambaram
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      const storedVal = localStorage.getItem('hr_tracker_is_logged_in');
      return storedVal === 'true';
    } catch (e) {}
    return false;
  });

  // 2. Synchronize current state to localStorage on any state changes
  useEffect(() => {
    localStorage.setItem('hr_tracker_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('hr_tracker_leaves', JSON.stringify(leaveRequests));
  }, [leaveRequests]);

  useEffect(() => {
    localStorage.setItem('hr_tracker_holidays', JSON.stringify(holidays));
  }, [holidays]);

  useEffect(() => {
    localStorage.setItem('hr_tracker_active_user', currentEmployeeId);
  }, [currentEmployeeId]);

  // Find active employee record
  const currentEmployee = employees.find(emp => emp.id === currentEmployeeId) || employees[0];

  // Check if active user has HR or Manager privileges
  const isManagerOrHR = currentEmployee ? (
    currentEmployee.department === 'Human Resources' || 
    (currentEmployee.role && currentEmployee.role.toLowerCase().includes('director')) ||
    (currentEmployee.role && currentEmployee.role.toLowerCase().includes('lead')) ||
    currentEmployee.id === '201' ||
    currentEmployee.id === '102'
  ) : false;

  // Enforce access control: If standard worker is on an admin-only tab, redirect them to dashboard
  useEffect(() => {
    if (isLoggedIn && !isManagerOrHR && ['manager', 'employee', 'settings'].includes(activeTab)) {
      setActiveTab('dashboard');
    }
  }, [activeTab, isManagerOrHR, isLoggedIn]);

  const handleLoginSuccess = (employeeId) => {
    setCurrentEmployeeId(employeeId);
    setIsLoggedIn(true);
    localStorage.setItem('hr_tracker_is_logged_in', 'true');
    localStorage.setItem('hr_tracker_active_user', employeeId);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem('hr_tracker_is_logged_in', 'false');
    setActiveTab('dashboard');
  };

  // Switch employee (preserved for backwards-compatibility or internal switches)
  const handleSwitchEmployee = (id) => {
    setCurrentEmployeeId(id);
  };

  // Global pending approvals count
  const pendingCount = leaveRequests.filter(req => req.status === 'Pending').length;

  // 3. Action: Apply for a new leave
  const handleApplyLeave = (newRequest) => {
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];
    const newId = `LR-${Math.floor(100 + Math.random() * 900)}`;

    const fullRequest = {
      ...newRequest,
      id: newId,
      status: 'Pending',
      appliedDate: formattedToday
    };

    const updatedLeaves = [fullRequest, ...leaveRequests];
    setLeaveRequests(updatedLeaves);
    localStorage.setItem('hr_tracker_leaves', JSON.stringify(updatedLeaves));
  };

  // 4. Action: Cancel owned pending request
  const handleCancelRequest = (requestId) => {
    const updatedLeaves = leaveRequests.filter(req => req.id !== requestId);
    setLeaveRequests(updatedLeaves);
    localStorage.setItem('hr_tracker_leaves', JSON.stringify(updatedLeaves));
  };

  // 5. Action: Process leave request (Approve / Reject)
  const handleProcessRequest = (requestId, status, note) => {
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];

    // Find the request first
    const targetRequest = leaveRequests.find(req => req.id === requestId);
    if (!targetRequest) return;

    // Update the leave list
    const updatedRequests = leaveRequests.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          status,
          managerNote: note,
          processedDate: formattedToday
        };
      }
      return req;
    });

    setLeaveRequests(updatedRequests);
    localStorage.setItem('hr_tracker_leaves', JSON.stringify(updatedRequests));

    // If approved, subtract the leave from the employee's available balance!
    if (status === 'Approved') {
      const updatedEmployees = employees.map(emp => {
        if (emp.id === targetRequest.employeeId) {
          const balance = emp.balances[targetRequest.leaveCategory];
          if (balance) {
            const updatedTaken = balance.taken + targetRequest.totalDays;
            const updatedAvailable = Math.max(0, balance.total - updatedTaken);
            return {
              ...emp,
              balances: {
                ...emp.balances,
                [targetRequest.leaveCategory]: {
                  ...balance,
                  taken: updatedTaken,
                  available: updatedAvailable
                }
              }
            };
          }
        }
        return emp;
      });

      setEmployees(updatedEmployees);
      localStorage.setItem('hr_tracker_employees', JSON.stringify(updatedEmployees));
    }
  };

  // 6. Action: Reset to baseline defaults
  const handleResetData = () => {
    setEmployees(INITIAL_EMPLOYEES);
    setLeaveRequests(INITIAL_LEAVES);
    setHolidays(INITIAL_HOLIDAYS);
    setCurrentEmployeeId('154');
    setActiveTab('dashboard');

    localStorage.setItem('hr_tracker_employees', JSON.stringify(INITIAL_EMPLOYEES));
    localStorage.setItem('hr_tracker_leaves', JSON.stringify(INITIAL_LEAVES));
    localStorage.setItem('hr_tracker_holidays', JSON.stringify(INITIAL_HOLIDAYS));
    localStorage.setItem('hr_tracker_active_user', '154');
  };

  // 7. Action: Update global annual allocations
  const handleUpdateAllocations = (category, newTotal) => {
    const updatedEmployees = employees.map(emp => {
      const balance = emp.balances[category];
      if (balance) {
        const updatedAvailable = Math.max(0, newTotal - balance.taken);
        return {
          ...emp,
          balances: {
            ...emp.balances,
            [category]: {
              ...balance,
              total: newTotal,
              available: updatedAvailable
            }
          }
        };
      }
      return emp;
    });

    setEmployees(updatedEmployees);
    localStorage.setItem('hr_tracker_employees', JSON.stringify(updatedEmployees));
  };

  // 8. Action: Generate Mock Pending Requests for Sandbox
  const handleGenerateMockRequests = () => {
    const mockPending = [
      {
        id: `LR-G${Math.floor(100 + Math.random() * 900)}`,
        employeeId: '105',
        employeeName: 'Madhavan Krishnan',
        employeeRole: 'Senior Biophysicist',
        avatarColor: 'bg-emerald-500',
        type: 'Full Day',
        leaveCategory: 'Privilege Leave',
        fromDate: '2026-08-10',
        toDate: '2026-08-14',
        totalDays: 5,
        reason: 'Biophysics research consultation with external laboratories.',
        status: 'Pending',
        appliedDate: '2026-06-23'
      },
      {
        id: `LR-G${Math.floor(100 + Math.random() * 900)}`,
        employeeId: '102',
        employeeName: 'Senthil Kumar',
        employeeRole: 'Principal Architect & Director',
        avatarColor: 'bg-red-500',
        type: 'Half Day',
        leaveCategory: 'Compensatory Leave',
        fromDate: '2026-07-15',
        toDate: '2026-07-15',
        totalDays: 0.5,
        reason: 'Personal exhibition opening preview.',
        status: 'Pending',
        appliedDate: '2026-06-23'
      }
    ];

    const updatedLeaves = [...mockPending, ...leaveRequests];
    setLeaveRequests(updatedLeaves);
    localStorage.setItem('hr_tracker_leaves', JSON.stringify(updatedLeaves));
  };

  // Render correct active tab layout label
  const getTabLabel = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard Overview';
      case 'apply-leave': return 'Apply Leave';
      case 'requested-leaves': return 'Requested Leaves Queue';
      case 'approved-leaves': return 'Approved Leave Records';
      case 'rejected-leaves': return 'Rejected Leave Records';
      case 'holidays': return 'Corporate Holidays Directory';
      case 'employee': return 'Employee Directory';
      case 'manager': return 'Manager Control Console';
      case 'settings': return 'System Settings';
      default: return 'HR Portal';
    }
  };

  // Render view
  const renderActiveView = () => {
    if (employees.length === 0 || !currentEmployee) {
      return (
        <div id="loading-fallback" className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center space-y-2">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-semibold">Initializing HR leave database...</p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView 
            currentEmployee={currentEmployee}
            allEmployees={employees}
            leaveRequests={leaveRequests}
            holidays={holidays}
            onApplyLeave={handleApplyLeave}
            onSwitchEmployee={handleSwitchEmployee}
          />
        );
      case 'apply-leave':
        return (
          <div id="wrapper-apply-leave" className="max-w-2xl mx-auto py-2">
            <ApplyLeaveForm 
              currentEmployee={currentEmployee}
              allEmployees={employees}
              onApplyLeave={handleApplyLeave}
              onSwitchEmployee={handleSwitchEmployee}
            />
          </div>
        );
      case 'requested-leaves':
        return (
          <LeavesHistoryView 
            currentEmployee={currentEmployee}
            allEmployees={employees}
            leaveRequests={leaveRequests}
            onCancelRequest={handleCancelRequest}
            initialStatusFilter="Pending"
          />
        );
      case 'approved-leaves':
        return (
          <LeavesHistoryView 
            currentEmployee={currentEmployee}
            allEmployees={employees}
            leaveRequests={leaveRequests}
            onCancelRequest={handleCancelRequest}
            initialStatusFilter="Approved"
          />
        );
      case 'rejected-leaves':
        return (
          <LeavesHistoryView 
            currentEmployee={currentEmployee}
            allEmployees={employees}
            leaveRequests={leaveRequests}
            onCancelRequest={handleCancelRequest}
            initialStatusFilter="Rejected"
          />
        );
      case 'holidays':
        return <HolidaysView holidays={holidays} />;
      case 'employee':
        return (
          <EmployeeDirectoryView 
            allEmployees={employees}
            currentEmployee={currentEmployee}
            onSwitchEmployee={handleSwitchEmployee}
          />
        );
      case 'manager':
        return (
          <ManagerApprovalView 
            currentEmployee={currentEmployee}
            allEmployees={employees}
            leaveRequests={leaveRequests}
            onProcessRequest={handleProcessRequest}
            onSwitchEmployee={handleSwitchEmployee}
          />
        );
      case 'settings':
        return (
          <SettingsView 
            allEmployees={employees}
            onResetData={handleResetData}
            onUpdateAllocations={handleUpdateAllocations}
            onGenerateMockRequests={handleGenerateMockRequests}
          />
        );
      default:
        return <div className="text-gray-500">View not found</div>;
    }
  };

  if (!isLoggedIn) {
    return (
      <LoginView 
        allEmployees={employees}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  return (
    <div id="app-root-shell" className="flex flex-col h-screen bg-slate-50 overflow-hidden font-sans antialiased text-slate-900">
      
      {/* Top Main Header */}
      {employees.length > 0 && currentEmployee && (
        <Header 
          currentEmployee={currentEmployee}
          allEmployees={employees}
          pendingCount={pendingCount}
          activeTabLabel={getTabLabel()}
          onLogout={handleLogout}
        />
      )}

      {/* Main Container: Sidebar + Content */}
      <div id="app-body-container" className="flex flex-1 min-h-0 overflow-hidden">
        
        {/* Sidebar Left */}
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          pendingCount={pendingCount}
          currentEmployee={currentEmployee}
        />

        {/* Scrollable View Panel Right */}
        <main id="app-content-panel" className="flex-1 p-6 md:p-8 overflow-y-auto bg-slate-50">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
}
