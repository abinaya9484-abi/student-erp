// mockData.js - Initial seed data for the ERP Student Management System

const DEFAULT_DEPARTMENTS = [
  { id: 'CS', name: 'Computer Science & Engineering' },
  { id: 'EE', name: 'Electrical & Electronics Engineering' },
  { id: 'ME', name: 'Mechanical Engineering' },
  { id: 'BU', name: 'Business Administration' }
];

const DEFAULT_COURSES = [
  { id: 'BTECH_CS', name: 'B.Tech - Computer Science', deptId: 'CS', semesters: 8 },
  { id: 'MTECH_CS', name: 'M.Tech - Software Engineering', deptId: 'CS', semesters: 4 },
  { id: 'BTECH_EE', name: 'B.Tech - Electrical Engineering', deptId: 'EE', semesters: 8 },
  { id: 'BTECH_ME', name: 'B.Tech - Mechanical Engineering', deptId: 'ME', semesters: 8 },
  { id: 'MBA', name: 'Master of Business Administration', deptId: 'BU', semesters: 4 }
];

const DEFAULT_SUBJECTS = [
  // Computer Science Sem 1 & 2
  { code: 'CS101', name: 'Introduction to Programming', deptId: 'CS', courseId: 'BTECH_CS', semester: 1, credits: 4 },
  { code: 'CS102', name: 'Digital Electronics', deptId: 'CS', courseId: 'BTECH_CS', semester: 1, credits: 3 },
  { code: 'MA101', name: 'Mathematics I', deptId: 'CS', courseId: 'BTECH_CS', semester: 1, credits: 4 },
  { code: 'CS201', name: 'Data Structures & Algorithms', deptId: 'CS', courseId: 'BTECH_CS', semester: 2, credits: 4 },
  { code: 'CS202', name: 'Object Oriented Programming', deptId: 'CS', courseId: 'BTECH_CS', semester: 2, credits: 4 },
  { code: 'MA102', name: 'Mathematics II', deptId: 'CS', courseId: 'BTECH_CS', semester: 2, credits: 4 },
  
  // Electrical Sem 1 & 2
  { code: 'EE101', name: 'Basic Electrical Science', deptId: 'EE', courseId: 'BTECH_EE', semester: 1, credits: 4 },
  { code: 'MA101', name: 'Mathematics I', deptId: 'EE', courseId: 'BTECH_EE', semester: 1, credits: 4 },
  { code: 'EE201', name: 'Network Analysis', deptId: 'EE', courseId: 'BTECH_EE', semester: 2, credits: 4 },
  { code: 'EE202', name: 'Electrical Machines I', deptId: 'EE', courseId: 'BTECH_EE', semester: 2, credits: 4 },

  // MBA Sem 1
  { code: 'MB101', name: 'Organizational Behavior', deptId: 'BU', courseId: 'MBA', semester: 1, credits: 3 },
  { code: 'MB102', name: 'Financial Accounting', deptId: 'BU', courseId: 'MBA', semester: 1, credits: 3 }
];

const DEFAULT_FACULTY = [
  {
    id: 'FAC001',
    name: 'Dr. Alan Turing',
    email: 'alan.turing@university.edu',
    deptId: 'CS',
    designation: 'Professor & HOD',
    subjects: ['CS101', 'CS201']
  },
  {
    id: 'FAC002',
    name: 'Dr. Grace Hopper',
    email: 'grace.hopper@university.edu',
    deptId: 'CS',
    designation: 'Associate Professor',
    subjects: ['CS202']
  },
  {
    id: 'FAC003',
    name: 'Dr. Nikola Tesla',
    email: 'nikola.tesla@university.edu',
    deptId: 'EE',
    designation: 'Professor',
    subjects: ['EE101', 'EE201']
  },
  {
    id: 'FAC004',
    name: 'Dr. Katherine Johnson',
    email: 'katherine.j@university.edu',
    deptId: 'CS',
    designation: 'Assistant Professor',
    subjects: ['MA101', 'MA102']
  }
];

const DEFAULT_STUDENTS = [
  {
    id: 'STD101',
    rollNo: '2026CSE001',
    name: 'Alice Johnson',
    email: 'alice.johnson@student.edu',
    phone: '+1 555-0100',
    deptId: 'CS',
    courseId: 'BTECH_CS',
    semester: 2,
    admissionDate: '2025-08-12',
    status: 'Active',
    documentVerified: true,
    parentName: 'Robert Johnson',
    parentEmail: 'robert.j@parent.com',
    parentPhone: '+1 555-0199',
    attendance: {
      'CS201': { attended: 36, total: 40 },
      'CS202': { attended: 38, total: 40 },
      'MA102': { attended: 28, total: 40 }
    },
    grades: [
      { code: 'CS101', name: 'Introduction to Programming', sem: 1, marks: 92, grade: 'A+', gpa: 4.0 },
      { code: 'CS102', name: 'Digital Electronics', sem: 1, marks: 85, grade: 'A', gpa: 4.0 },
      { code: 'MA101', name: 'Mathematics I', sem: 1, marks: 74, grade: 'B', gpa: 3.0 }
    ]
  },
  {
    id: 'STD102',
    rollNo: '2026CSE002',
    name: 'Bob Smith',
    email: 'bob.smith@student.edu',
    phone: '+1 555-0101',
    deptId: 'CS',
    courseId: 'BTECH_CS',
    semester: 2,
    admissionDate: '2025-08-15',
    status: 'Active',
    documentVerified: true,
    parentName: 'Sarah Smith',
    parentEmail: 'sarah.s@parent.com',
    parentPhone: '+1 555-0198',
    attendance: {
      'CS201': { attended: 27, total: 40 }, // Under 75% (67.5%)
      'CS202': { attended: 35, total: 40 },
      'MA102': { attended: 32, total: 40 }
    },
    grades: [
      { code: 'CS101', name: 'Introduction to Programming', sem: 1, marks: 78, grade: 'B+', gpa: 3.3 },
      { code: 'CS102', name: 'Digital Electronics', sem: 1, marks: 65, grade: 'C+', gpa: 2.3 },
      { code: 'MA101', name: 'Mathematics I', sem: 1, marks: 82, grade: 'A-', gpa: 3.7 }
    ]
  },
  {
    id: 'STD103',
    rollNo: '2026EE001',
    name: 'Charlie Brown',
    email: 'charlie.brown@student.edu',
    phone: '+1 555-0102',
    deptId: 'EE',
    courseId: 'BTECH_EE',
    semester: 2,
    admissionDate: '2025-08-18',
    status: 'Active',
    documentVerified: true,
    parentName: 'Linus Brown',
    parentEmail: 'linus.b@parent.com',
    parentPhone: '+1 555-0197',
    attendance: {
      'EE201': { attended: 39, total: 40 },
      'EE202': { attended: 37, total: 40 }
    },
    grades: [
      { code: 'EE101', name: 'Basic Electrical Science', sem: 1, marks: 95, grade: 'O', gpa: 4.0 },
      { code: 'MA101', name: 'Mathematics I', sem: 1, marks: 88, grade: 'A', gpa: 4.0 }
    ]
  }
];

const DEFAULT_INVOICES = [
  {
    id: 'INV001',
    studentId: 'STD101',
    studentName: 'Alice Johnson',
    semester: 2,
    amount: 1500,
    dueDate: '2026-07-01',
    status: 'Paid',
    paidDate: '2026-06-10',
    paymentMethod: 'Credit Card',
    type: 'Tuition Fee'
  },
  {
    id: 'INV002',
    studentId: 'STD101',
    studentName: 'Alice Johnson',
    semester: 2,
    amount: 250,
    dueDate: '2026-07-15',
    status: 'Unpaid',
    paidDate: null,
    paymentMethod: null,
    type: 'Hostel Fee'
  },
  {
    id: 'INV003',
    studentId: 'STD102',
    studentName: 'Bob Smith',
    semester: 2,
    amount: 1500,
    dueDate: '2026-07-01',
    status: 'Unpaid',
    paidDate: null,
    paymentMethod: null,
    type: 'Tuition Fee'
  },
  {
    id: 'INV004',
    studentId: 'STD103',
    studentName: 'Charlie Brown',
    semester: 2,
    amount: 1750,
    dueDate: '2026-07-01',
    status: 'Paid',
    paidDate: '2026-06-12',
    paymentMethod: 'Net Banking',
    type: 'Tuition + Lab Fee'
  }
];

const DEFAULT_BOOKS = [
  { id: 'BK001', title: 'Introduction to Algorithms', author: 'Cormen, Leiserson, Rivest, Stein', category: 'Computer Science', qty: 5, available: 3 },
  { id: 'BK002', title: 'Design Patterns', author: 'Erich Gamma, Richard Helm', category: 'Software Engineering', qty: 3, available: 3 },
  { id: 'BK003', title: 'Standard Handbook for Electrical Engineers', author: 'Donald G. Fink', category: 'Electrical', qty: 2, available: 1 },
  { id: 'BK004', title: 'Calculus and Analytic Geometry', author: 'George B. Thomas', category: 'Mathematics', qty: 4, available: 4 },
  { id: 'BK005', title: 'Principles of Marketing', author: 'Philip Kotler', category: 'Business', qty: 3, available: 2 }
];

const DEFAULT_ISSUED_BOOKS = [
  {
    id: 'ISS001',
    bookId: 'BK001',
    bookTitle: 'Introduction to Algorithms',
    studentId: 'STD101',
    studentName: 'Alice Johnson',
    issueDate: '2026-06-05',
    dueDate: '2026-06-20',
    returnDate: null,
    fine: 0,
    status: 'Issued'
  },
  {
    id: 'ISS002',
    bookId: 'BK003',
    bookTitle: 'Standard Handbook for Electrical Engineers',
    studentId: 'STD103',
    studentName: 'Charlie Brown',
    issueDate: '2026-05-15',
    dueDate: '2026-05-30', // Overdue
    returnDate: null,
    fine: 16, // $1 per day overdue since May 30 (assuming June 15 current date)
    status: 'Overdue'
  }
];

const DEFAULT_TIMETABLES = {
  'BTECH_CS': {
    2: {
      'Monday': [
        { period: 1, time: '09:00 - 10:00', subject: 'CS201', room: 'LH-301', faculty: 'Dr. Alan Turing' },
        { period: 2, time: '10:00 - 11:00', subject: 'CS202', room: 'LH-301', faculty: 'Dr. Grace Hopper' },
        { period: 3, time: '11:15 - 12:15', subject: 'MA102', room: 'LH-302', faculty: 'Dr. Katherine Johnson' },
        { period: 4, time: '12:15 - 01:15', subject: 'Library/Self Study', room: 'Library', faculty: '-' },
        { period: 5, time: '02:00 - 04:00', subject: 'CS201 Lab', room: 'CS-Lab 2', faculty: 'Dr. Alan Turing' }
      ],
      'Tuesday': [
        { period: 1, time: '09:00 - 10:00', subject: 'MA102', room: 'LH-302', faculty: 'Dr. Katherine Johnson' },
        { period: 2, time: '10:00 - 11:00', subject: 'CS201', room: 'LH-301', faculty: 'Dr. Alan Turing' },
        { period: 3, time: '11:15 - 12:15', subject: 'CS202', room: 'LH-301', faculty: 'Dr. Grace Hopper' },
        { period: 4, time: '12:15 - 01:15', subject: 'Seminar', room: 'Seminar Hall', faculty: '-' },
        { period: 5, time: '02:00 - 04:00', subject: 'CS202 Lab', room: 'CS-Lab 1', faculty: 'Dr. Grace Hopper' }
      ],
      'Wednesday': [
        { period: 1, time: '09:00 - 10:00', subject: 'CS202', room: 'LH-301', faculty: 'Dr. Grace Hopper' },
        { period: 2, time: '10:00 - 11:00', subject: 'MA102', room: 'LH-302', faculty: 'Dr. Katherine Johnson' },
        { period: 3, time: '11:15 - 12:15', subject: 'CS201', room: 'LH-301', faculty: 'Dr. Alan Turing' },
        { period: 4, time: '12:15 - 01:15', subject: 'Placement Guidance', room: 'LH-301', faculty: 'Placement Cell' },
        { period: 5, time: '02:00 - 04:00', subject: 'Sports/Club', room: 'Playground', faculty: '-' }
      ],
      'Thursday': [
        { period: 1, time: '09:00 - 10:00', subject: 'CS201', room: 'LH-301', faculty: 'Dr. Alan Turing' },
        { period: 2, time: '10:00 - 11:00', subject: 'CS202', room: 'LH-301', faculty: 'Dr. Grace Hopper' },
        { period: 3, time: '11:15 - 12:15', subject: 'MA102', room: 'LH-302', faculty: 'Dr. Katherine Johnson' },
        { period: 4, time: '12:15 - 01:15', subject: 'Mentorship Session', room: 'LH-301', faculty: 'Dr. Grace Hopper' },
        { period: 5, time: '02:00 - 04:00', subject: 'Remedial Classes', room: 'LH-302', faculty: '-' }
      ],
      'Friday': [
        { period: 1, time: '09:00 - 10:00', subject: 'MA102', room: 'LH-302', faculty: 'Dr. Katherine Johnson' },
        { period: 2, time: '10:00 - 11:00', subject: 'CS201', room: 'LH-301', faculty: 'Dr. Alan Turing' },
        { period: 3, time: '11:15 - 12:15', subject: 'CS202', room: 'LH-301', faculty: 'Dr. Grace Hopper' },
        { period: 4, time: '12:15 - 01:15', subject: 'Weekly Assessment', room: 'LH-301', faculty: '-' },
        { period: 5, time: '02:00 - 04:00', subject: 'Co-curricular Activity', room: 'Auditorium', faculty: '-' }
      ]
    }
  },
  'BTECH_EE': {
    2: {
      'Monday': [
        { period: 1, time: '09:00 - 10:00', subject: 'EE201', room: 'LH-201', faculty: 'Dr. Nikola Tesla' },
        { period: 2, time: '10:00 - 11:00', subject: 'EE202', room: 'LH-201', faculty: 'Dr. Nikola Tesla' },
        { period: 3, time: '11:15 - 12:15', subject: 'Library', room: 'Library', faculty: '-' }
      ]
    }
  }
};

const DEFAULT_ANNOUNCEMENTS = [
  {
    id: 'ANN001',
    title: 'Mid-Semester Examinations Schedule Out',
    content: 'The Mid-Semester examinations for all semesters are scheduled to commence from July 10, 2026. The detailed subject-wise schedule is available in the Timetable module. Attendance of at least 75% is mandatory to sit for exams.',
    date: '2026-06-14',
    author: 'Academic Registrar',
    category: 'Academic'
  },
  {
    id: 'ANN002',
    title: 'Annual Tech Fest "Antigravity 2026" Registration Open',
    content: 'Registration for Antigravity 2026, our annual technical symposium, is now open. Events include Hackathon, Robo-Wars, Paper Presentation, and UI Design. Register online before June 25.',
    date: '2026-06-12',
    author: 'Student Council',
    category: 'Event'
  },
  {
    id: 'ANN003',
    title: 'Scholarship Applications for Academic Year 2026-27',
    content: 'Applications are invited for merit-cum-means scholarships. Eligible students must submit their income certificates and previous semester grade sheets to the accountant office before June 30.',
    date: '2026-06-08',
    author: 'Scholarship Section',
    category: 'Financial'
  }
];

const DEFAULT_MESSAGES = [
  {
    id: 'MSG001',
    senderId: 'STD101',
    senderName: 'Alice Johnson',
    receiverId: 'FAC001',
    receiverName: 'Dr. Alan Turing',
    subject: 'Doubt in CS201 Assignment 2',
    content: 'Dear Professor, I am facing an issue with resolving average case complexity in red-black trees. Could you please clarify if we can use recurrence relations or if we should prove it inductively?',
    timestamp: '2026-06-14T14:30:00Z',
    read: false
  },
  {
    id: 'MSG002',
    senderId: 'FAC001',
    senderName: 'Dr. Alan Turing',
    receiverId: 'STD101',
    receiverName: 'Alice Johnson',
    subject: 'Re: Doubt in CS201 Assignment 2',
    content: 'Alice, both approaches are acceptable. Inductive proof provides a more rigorous derivation, whereas recurrence relations are quicker to present. I recommend utilizing the inductive method for higher grading accuracy.',
    timestamp: '2026-06-15T09:15:00Z',
    read: true
  }
];

// Helper to export or bind globally
window.ERP_MOCK_DATA = {
  departments: DEFAULT_DEPARTMENTS,
  courses: DEFAULT_COURSES,
  subjects: DEFAULT_SUBJECTS,
  faculty: DEFAULT_FACULTY,
  students: DEFAULT_STUDENTS,
  invoices: DEFAULT_INVOICES,
  books: DEFAULT_BOOKS,
  issuedBooks: DEFAULT_ISSUED_BOOKS,
  timetables: DEFAULT_TIMETABLES,
  announcements: DEFAULT_ANNOUNCEMENTS,
  messages: DEFAULT_MESSAGES
};
