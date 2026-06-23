export const INITIAL_EMPLOYEES = [
  {
    id: '154',
    name: 'Karthik Chidambaram',
    role: 'Senior Software Engineer',
    email: 'karthik.chidambaram@company.com',
    department: 'Engineering',
    avatarColor: 'bg-blue-500',
    gender: 'Male',
    dob: '1992-05-12',
    balances: {
      'Casual Leave': { category: 'Casual Leave', total: 15, taken: 7, available: 8 },
      'Maternity Leave': { category: 'Maternity Leave', total: 184, taken: 0, available: 184 },
      'Sick Leave': { category: 'Sick Leave', total: 12, taken: 11, available: 1 },
      'Privilege Leave': { category: 'Privilege Leave', total: 20, taken: 5, available: 15 },
      'Compensatory Leave': { category: 'Compensatory Leave', total: 5, taken: 2, available: 3 }
    }
  },
  {
    id: '102',
    name: 'Senthil Kumar',
    role: 'Principal Architect & Director',
    email: 'senthil.kumar@company.com',
    department: 'Research & Dev',
    avatarColor: 'bg-red-500',
    gender: 'Male',
    dob: '1980-08-24',
    balances: {
      'Casual Leave': { category: 'Casual Leave', total: 15, taken: 3, available: 12 },
      'Maternity Leave': { category: 'Maternity Leave', total: 184, taken: 0, available: 184 },
      'Sick Leave': { category: 'Sick Leave', total: 12, taken: 4, available: 8 },
      'Privilege Leave': { category: 'Privilege Leave', total: 20, taken: 10, available: 10 },
      'Compensatory Leave': { category: 'Compensatory Leave', total: 5, taken: 0, available: 5 }
    }
  },
  {
    id: '105',
    name: 'Madhavan Krishnan',
    role: 'Senior Biophysicist',
    email: 'madhavan.krishnan@company.com',
    department: 'Research & Dev',
    avatarColor: 'bg-emerald-500',
    gender: 'Male',
    dob: '1988-11-03',
    balances: {
      'Casual Leave': { category: 'Casual Leave', total: 15, taken: 5, available: 10 },
      'Maternity Leave': { category: 'Maternity Leave', total: 184, taken: 0, available: 184 },
      'Sick Leave': { category: 'Sick Leave', total: 12, taken: 8, available: 4 },
      'Privilege Leave': { category: 'Privilege Leave', total: 20, taken: 2, available: 18 },
      'Compensatory Leave': { category: 'Compensatory Leave', total: 5, taken: 1, available: 4 }
    }
  },
  {
    id: '201',
    name: 'Priya Ramaswamy',
    role: 'HR Director',
    email: 'priya.ramaswamy@company.com',
    department: 'Human Resources',
    avatarColor: 'bg-pink-500',
    gender: 'Female',
    dob: '1985-03-15',
    balances: {
      'Casual Leave': { category: 'Casual Leave', total: 15, taken: 4, available: 11 },
      'Maternity Leave': { category: 'Maternity Leave', total: 184, taken: 20, available: 164 },
      'Sick Leave': { category: 'Sick Leave', total: 12, taken: 2, available: 10 },
      'Privilege Leave': { category: 'Privilege Leave', total: 20, taken: 8, available: 12 },
      'Compensatory Leave': { category: 'Compensatory Leave', total: 5, taken: 3, available: 2 }
    }
  },
  {
    id: '110',
    name: 'Abirami Sundaram',
    role: 'UX Researcher',
    email: 'abirami.sundaram@company.com',
    department: 'Product Design',
    avatarColor: 'bg-purple-500',
    gender: 'Female',
    dob: '1995-09-21',
    balances: {
      'Casual Leave': { category: 'Casual Leave', total: 15, taken: 10, available: 5 },
      'Maternity Leave': { category: 'Maternity Leave', total: 184, taken: 0, available: 184 },
      'Sick Leave': { category: 'Sick Leave', total: 12, taken: 6, available: 6 },
      'Privilege Leave': { category: 'Privilege Leave', total: 20, taken: 15, available: 5 },
      'Compensatory Leave': { category: 'Compensatory Leave', total: 5, taken: 4, available: 1 }
    }
  }
];

export const INITIAL_LEAVES = [
  {
    id: 'LR-001',
    employeeId: '154',
    employeeName: 'Karthik Chidambaram',
    employeeRole: 'Senior Software Engineer',
    avatarColor: 'bg-blue-500',
    type: 'Full Day',
    leaveCategory: 'Casual Leave',
    fromDate: '2026-04-10',
    toDate: '2026-04-12',
    totalDays: 3,
    reason: 'Family trip to Yosemite',
    status: 'Approved',
    appliedDate: '2026-04-01',
    managerNote: 'Approved. Enjoy your vacation!',
    processedDate: '2026-04-02'
  },
  {
    id: 'LR-002',
    employeeId: '154',
    employeeName: 'Karthik Chidambaram',
    employeeRole: 'Senior Software Engineer',
    avatarColor: 'bg-blue-500',
    type: 'Full Day',
    leaveCategory: 'Sick Leave',
    fromDate: '2026-05-18',
    toDate: '2026-05-18',
    totalDays: 1,
    reason: 'Dental appointment and checkup',
    status: 'Approved',
    appliedDate: '2026-05-17',
    managerNote: 'Hope it goes well.',
    processedDate: '2026-05-17'
  },
  {
    id: 'LR-003',
    employeeId: '102',
    employeeName: 'Senthil Kumar',
    employeeRole: 'Principal Architect & Director',
    avatarColor: 'bg-red-500',
    type: 'Full Day',
    leaveCategory: 'Privilege Leave',
    fromDate: '2026-07-01',
    toDate: '2026-07-10',
    totalDays: 10,
    reason: 'Annual technology retreat and personal projects',
    status: 'Approved',
    appliedDate: '2026-06-15',
    managerNote: 'Well deserved break Senthil. R&D will be fine.',
    processedDate: '2026-06-16'
  },
  {
    id: 'LR-004',
    employeeId: '105',
    employeeName: 'Madhavan Krishnan',
    employeeRole: 'Senior Biophysicist',
    avatarColor: 'bg-emerald-500',
    type: 'Full Day',
    leaveCategory: 'Sick Leave',
    fromDate: '2026-06-10',
    toDate: '2026-06-14',
    totalDays: 5,
    reason: 'Rest recommended after intense laboratory exposure',
    status: 'Approved',
    appliedDate: '2026-06-09',
    managerNote: 'Take all the rest you need Madhavan.',
    processedDate: '2026-06-09'
  },
  {
    id: 'LR-005',
    employeeId: '110',
    employeeName: 'Abirami Sundaram',
    employeeRole: 'UX Researcher',
    avatarColor: 'bg-purple-500',
    type: 'Full Day',
    leaveCategory: 'Casual Leave',
    fromDate: '2026-06-25',
    toDate: '2026-06-26',
    totalDays: 2,
    reason: 'Moving to a new apartment',
    status: 'Pending',
    appliedDate: '2026-06-21'
  },
  {
    id: 'LR-006',
    employeeId: '154',
    employeeName: 'Karthik Chidambaram',
    employeeRole: 'Senior Software Engineer',
    avatarColor: 'bg-blue-500',
    type: 'Full Day',
    leaveCategory: 'Compensatory Leave',
    fromDate: '2026-06-29',
    toDate: '2026-06-30',
    totalDays: 2,
    reason: 'Compensatory leave for weekend server migration work',
    status: 'Pending',
    appliedDate: '2026-06-22'
  },
  {
    id: 'LR-007',
    employeeId: '105',
    employeeName: 'Madhavan Krishnan',
    employeeRole: 'Senior Biophysicist',
    avatarColor: 'bg-emerald-500',
    type: 'Half Day',
    leaveCategory: 'Casual Leave',
    fromDate: '2026-06-24',
    toDate: '2026-06-24',
    totalDays: 0.5,
    reason: 'Afternoon family function',
    status: 'Pending',
    appliedDate: '2026-06-22'
  },
  {
    id: 'LR-008',
    employeeId: '102',
    employeeName: 'Senthil Kumar',
    employeeRole: 'Principal Architect & Director',
    avatarColor: 'bg-red-500',
    type: 'Full Day',
    leaveCategory: 'Sick Leave',
    fromDate: '2026-03-12',
    toDate: '2026-03-14',
    totalDays: 3,
    reason: 'Severe cold & fever',
    status: 'Rejected',
    appliedDate: '2026-03-11',
    managerNote: 'We had an urgent product delivery deadline. Sick leave can only be approved with a prescription since balances were low.',
    processedDate: '2026-03-11'
  }
];

export const INITIAL_HOLIDAYS = [
  {
    id: 'H-01',
    name: 'New Year Day',
    date: '2026-01-01',
    dayOfWeek: 'Thursday',
    locations: ['Detroit', 'Grand Rapids city', 'Warren city']
  },
  {
    id: 'H-02',
    name: 'Independence Day',
    date: '2026-01-07',
    dayOfWeek: 'Wednesday',
    locations: ['Detroit', 'Grand Rapids city', 'Warren city']
  },
  {
    id: 'H-03',
    name: 'Labour Day',
    date: '2026-05-06',
    dayOfWeek: 'Wednesday',
    locations: ['Detroit', 'Grand Rapids city', 'Warren city']
  },
  {
    id: 'H-04',
    name: 'Memorial Day',
    date: '2026-05-25',
    dayOfWeek: 'Monday',
    locations: ['Detroit', 'Grand Rapids city', 'Warren city']
  },
  {
    id: 'H-05',
    name: 'Thanksgiving',
    date: '2026-11-26',
    dayOfWeek: 'Thursday',
    locations: ['Detroit', 'Grand Rapids city', 'Warren city']
  },
  {
    id: 'H-06',
    name: 'Diwali Eve',
    date: '2026-12-24',
    dayOfWeek: 'Thursday',
    locations: ['Detroit', 'Grand Rapids city', 'Warren city']
  },
  {
    id: 'H-07',
    name: 'Diwali Day',
    date: '2026-12-25',
    dayOfWeek: 'Friday',
    locations: ['Detroit', 'Grand Rapids city', 'Warren city']
  }
];
