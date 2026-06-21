// mockData.js - Initial seed data for the ERP Student Management System (Cleared Roster Version)

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

const DEFAULT_FACULTY = [];
const DEFAULT_STUDENTS = [];
const DEFAULT_INVOICES = [];
const DEFAULT_BOOKS = [
  { id: 'BK001', title: 'Introduction to Algorithms', author: 'Cormen, Leiserson, Rivest, Stein', category: 'Computer Science', qty: 5, available: 5 },
  { id: 'BK002', title: 'Design Patterns', author: 'Erich Gamma, Richard Helm', category: 'Software Engineering', qty: 3, available: 3 },
  { id: 'BK003', title: 'Standard Handbook for Electrical Engineers', author: 'Donald G. Fink', category: 'Electrical', qty: 2, available: 2 },
  { id: 'BK004', title: 'Calculus and Analytic Geometry', author: 'George B. Thomas', category: 'Mathematics', qty: 4, available: 4 },
  { id: 'BK005', title: 'Principles of Marketing', author: 'Philip Kotler', category: 'Business', qty: 3, available: 3 }
];
const DEFAULT_ISSUED_BOOKS = [];
const DEFAULT_TIMETABLES = {
  'BTECH_CS': {
    2: {
      'Monday': [
        { period: 1, time: '09:00 - 10:00', subject: 'CS201', room: 'LH-301', faculty: 'TBD' },
        { period: 2, time: '10:00 - 11:00', subject: 'CS202', room: 'LH-301', faculty: 'TBD' },
        { period: 3, time: '11:15 - 12:15', subject: 'MA102', room: 'LH-302', faculty: 'TBD' }
      ]
    }
  }
};
const DEFAULT_ANNOUNCEMENTS = [];
const DEFAULT_MESSAGES = [];

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
