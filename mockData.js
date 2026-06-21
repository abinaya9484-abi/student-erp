// mockData.js - Updated seed data with 12 Engineering Departments and 8 Semesters

const DEFAULT_DEPARTMENTS = [
  { id: 'CSE', name: 'Computer Science and Engineering' },
  { id: 'IT', name: 'Information Technology' },
  { id: 'ECE', name: 'Electronics and Communication Engineering' },
  { id: 'EEE', name: 'Electrical and Electronics Engineering' },
  { id: 'MECH', name: 'Mechanical Engineering' },
  { id: 'CIVIL', name: 'Civil Engineering' },
  { id: 'AIDS', name: 'Artificial Intelligence and Data Science' },
  { id: 'AIML', name: 'Artificial Intelligence and Machine Learning' },
  { id: 'BME', name: 'Biomedical Engineering' },
  { id: 'CHEM', name: 'Chemical Engineering' },
  { id: 'AERO', name: 'Aeronautical Engineering' },
  { id: 'ROBO', name: 'Robotics and Automation Engineering' }
];

const DEFAULT_COURSES = [
  { id: 'BTECH_CSE', name: 'B.Tech - Computer Science and Engineering', deptId: 'CSE', semesters: 8 },
  { id: 'BTECH_IT', name: 'B.Tech - Information Technology', deptId: 'IT', semesters: 8 },
  { id: 'BTECH_ECE', name: 'B.Tech - Electronics and Communication Engineering', deptId: 'ECE', semesters: 8 },
  { id: 'BTECH_EEE', name: 'B.Tech - Electrical and Electronics Engineering', deptId: 'EEE', semesters: 8 },
  { id: 'BTECH_MECH', name: 'B.Tech - Mechanical Engineering', deptId: 'MECH', semesters: 8 },
  { id: 'BTECH_CIVIL', name: 'B.Tech - Civil Engineering', deptId: 'CIVIL', semesters: 8 },
  { id: 'BTECH_AIDS', name: 'B.Tech - Artificial Intelligence and Data Science', deptId: 'AIDS', semesters: 8 },
  { id: 'BTECH_AIML', name: 'B.Tech - Artificial Intelligence and Machine Learning', deptId: 'AIML', semesters: 8 },
  { id: 'BTECH_BME', name: 'B.Tech - Biomedical Engineering', deptId: 'BME', semesters: 8 },
  { id: 'BTECH_CHEM', name: 'B.Tech - Chemical Engineering', deptId: 'CHEM', semesters: 8 },
  { id: 'BTECH_AERO', name: 'B.Tech - Aeronautical Engineering', deptId: 'AERO', semesters: 8 },
  { id: 'BTECH_ROBO', name: 'B.Tech - Robotics and Automation Engineering', deptId: 'ROBO', semesters: 8 }
];

// Helper to generate a generic set of subjects across 8 semesters for each B.Tech course program
const generateMockSubjects = () => {
  const list = [];
  const courseIds = DEFAULT_COURSES.map(c => c.id);
  
  courseIds.forEach(courseId => {
    const deptId = courseId.replace('BTECH_', '');
    
    // Semester 1
    list.push(
      { code: `${deptId}101`, name: 'Engineering Mathematics I', deptId, courseId, semester: 1, credits: 4 },
      { code: `${deptId}102`, name: 'Engineering Physics', deptId, courseId, semester: 1, credits: 3 },
      { code: `${deptId}103`, name: 'Basic Computer Programming', deptId, courseId, semester: 1, credits: 4 }
    );
    // Semester 2
    list.push(
      { code: `${deptId}201`, name: 'Engineering Mathematics II', deptId, courseId, semester: 2, credits: 4 },
      { code: `${deptId}202`, name: 'Engineering Chemistry', deptId, courseId, semester: 2, credits: 3 },
      { code: `${deptId}203`, name: 'Object Oriented Programming', deptId, courseId, semester: 2, credits: 4 }
    );
    // Semester 3
    list.push(
      { code: `${deptId}301`, name: 'Data Structures and Algorithms', deptId, courseId, semester: 3, credits: 4 },
      { code: `${deptId}302`, name: 'Digital Logic and Systems', deptId, courseId, semester: 3, credits: 3 },
      { code: `${deptId}303`, name: 'Discrete Structures', deptId, courseId, semester: 3, credits: 3 }
    );
    // Semester 4
    list.push(
      { code: `${deptId}401`, name: 'Database Management Systems', deptId, courseId, semester: 4, credits: 4 },
      { code: `${deptId}402`, name: 'Operating Systems', deptId, courseId, semester: 4, credits: 4 },
      { code: `${deptId}403`, name: 'Computer Networks', deptId, courseId, semester: 4, credits: 3 }
    );
    // Semester 5
    list.push(
      { code: `${deptId}501`, name: 'Software Engineering Design', deptId, courseId, semester: 5, credits: 4 },
      { code: `${deptId}502`, name: 'Formal Languages and Automata', deptId, courseId, semester: 5, credits: 3 },
      { code: `${deptId}503`, name: 'Professional Elective I', deptId, courseId, semester: 5, credits: 3 }
    );
    // Semester 6
    list.push(
      { code: `${deptId}601`, name: 'Design and Analysis of Algorithms', deptId, courseId, semester: 6, credits: 4 },
      { code: `${deptId}602`, name: 'Compiler Construction', deptId, courseId, semester: 6, credits: 3 },
      { code: `${deptId}603`, name: 'Professional Elective II', deptId, courseId, semester: 6, credits: 3 }
    );
    // Semester 7
    list.push(
      { code: `${deptId}701`, name: 'Cloud Infrastructure and Computing', deptId, courseId, semester: 7, credits: 4 },
      { code: `${deptId}702`, name: 'Cyber Security and Cryptography', deptId, courseId, semester: 7, credits: 3 },
      { code: `${deptId}703`, name: 'Open Elective', deptId, courseId, semester: 7, credits: 3 }
    );
    // Semester 8
    list.push(
      { code: `${deptId}801`, name: 'Major Capstone Project', deptId, courseId, semester: 8, credits: 8 },
      { code: `${deptId}802`, name: 'Professional Ethics and Values', deptId, courseId, semester: 8, credits: 2 }
    );
  });

  return list;
};

const DEFAULT_SUBJECTS = generateMockSubjects();
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

// Helper to generate a baseline weekly timetable for B.Tech CSE (8 semesters)
const generateMockTimetables = () => {
  const tt = {};
  DEFAULT_COURSES.forEach(c => {
    tt[c.id] = {};
    for (let sem = 1; sem <= 8; sem++) {
      const deptId = c.id.replace('BTECH_', '');
      tt[c.id][sem] = {
        'Monday': [
          { period: 1, time: '09:00 - 10:00', subject: `${deptId}${sem}01`, room: 'LH-301', faculty: 'TBD' },
          { period: 2, time: '10:00 - 11:00', subject: `${deptId}${sem}02`, room: 'LH-301', faculty: 'TBD' },
          { period: 3, time: '11:15 - 12:15', subject: `${deptId}${sem}03`, room: 'LH-302', faculty: 'TBD' }
        ],
        'Tuesday': [
          { period: 1, time: '09:00 - 10:00', subject: `${deptId}${sem}03`, room: 'LH-302', faculty: 'TBD' },
          { period: 2, time: '10:00 - 11:00', subject: `${deptId}${sem}01`, room: 'LH-301', faculty: 'TBD' }
        ]
      };
    }
  });
  return tt;
};

const DEFAULT_TIMETABLES = generateMockTimetables();
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
