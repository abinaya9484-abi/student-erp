// state.js - Simulated Database Layer with localStorage Persistence

const DB_KEY = 'student_erp_db_v2';
// Increment this version number whenever departments, courses, subjects, or timetables change.
// The app will auto-refresh static data while preserving students, faculty, and invoices.
const SCHEMA_VERSION = '4';

class ERPDatabase {
  constructor() {
    this.data = this.load();
  }

  load() {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) {
      try {
        const stored = JSON.parse(raw);

        // ── Schema Version Check ──────────────────────────────────────
        // If the stored schema version doesn't match the current one,
        // refresh all static/seed data (departments, courses, subjects,
        // timetables) but KEEP all dynamic user data safe.
        if (stored._schemaVersion !== SCHEMA_VERSION) {
          console.info(
            `[ERP] Schema updated from v${stored._schemaVersion || '?'} → v${SCHEMA_VERSION}. ` +
            'Refreshing static data. Your students, faculty & invoices are preserved.'
          );
          const seed = window.ERP_MOCK_DATA;
          const migrated = {
            _schemaVersion:  SCHEMA_VERSION,
            // ── Refreshed static seed data ──
            departments:     JSON.parse(JSON.stringify(seed.departments)),
            courses:         JSON.parse(JSON.stringify(seed.courses)),
            subjects:        JSON.parse(JSON.stringify(seed.subjects)),
            timetables:      JSON.parse(JSON.stringify(seed.timetables)),
            // ── Preserved dynamic user data ──
            students:        stored.students        || [],
            faculty:         stored.faculty         || [],
            invoices:        stored.invoices        || [],
            books:           stored.books           || JSON.parse(JSON.stringify(seed.books)),
            issuedBooks:     stored.issuedBooks     || [],
            announcements:   stored.announcements   || [],
            messages:        stored.messages        || []
          };
          localStorage.setItem(DB_KEY, JSON.stringify(migrated));
          return migrated;
        }

        return stored;
      } catch (e) {
        console.error('Error parsing local storage database, reseeding...', e);
      }
    }

    // Seed database fresh if empty or corrupted
    const seed = window.ERP_MOCK_DATA;
    const freshData = { _schemaVersion: SCHEMA_VERSION, ...JSON.parse(JSON.stringify(seed)) };
    localStorage.setItem(DB_KEY, JSON.stringify(freshData));
    return freshData;
  }

  save() {
    localStorage.setItem(DB_KEY, JSON.stringify(this.data));
  }

  // --- Department, Course & Subject API ---
  getDepartments() {
    return this.data.departments || [];
  }

  getCourses() {
    return this.data.courses || [];
  }

  getSubjects() {
    return this.data.subjects || [];
  }

  getSubjectsForCourse(courseId, semester) {
    return this.getSubjects().filter(s => s.courseId === courseId && s.semester === parseInt(semester));
  }

  // --- Students API ---
  getStudents() {
    return this.data.students || [];
  }

  getStudentById(id) {
    return this.getStudents().find(s => s.id === id);
  }

  addStudent(student) {
    const newStudent = {
      id: 'STD' + (Date.now()),
      rollNo: student.rollNo || ('2026' + student.deptId + String(this.getStudents().length + 1).padStart(3, '0')),
      name: student.name,
      email: student.email || `${student.name.toLowerCase().replace(/\s+/g, '.')}@student.edu`,
      phone: student.phone || '+1 555-0199',
      deptId: student.deptId,
      courseId: student.courseId,
      semester: parseInt(student.semester) || 1,
      admissionDate: student.admissionDate || new Date().toISOString().split('T')[0],
      status: 'Active',
      documentVerified: student.documentVerified !== undefined ? student.documentVerified : true,
      parentName: student.parentName || 'Parent Name',
      parentEmail: student.parentEmail || 'parent@mail.com',
      parentPhone: student.parentPhone || '+1 555-0100',
      attendance: {},
      grades: []
    };

    // Initialize attendance map for default course subjects
    const subjects = this.getSubjectsForCourse(newStudent.courseId, newStudent.semester);
    subjects.forEach(sub => {
      newStudent.attendance[sub.code] = { attended: 0, total: 0 };
    });

    this.data.students.push(newStudent);
    this.save();
    return newStudent;
  }

  updateStudent(id, updatedData) {
    const idx = this.data.students.findIndex(s => s.id === id);
    if (idx !== -1) {
      this.data.students[idx] = { ...this.data.students[idx], ...updatedData };
      this.save();
      return this.data.students[idx];
    }
    return null;
  }

  // --- Faculty API ---
  getFaculty() {
    return this.data.faculty || [];
  }

  getFacultyById(id) {
    return this.getFaculty().find(f => f.id === id);
  }

  addFaculty(faculty) {
    const newFaculty = {
      id: 'FAC' + (Date.now()),
      name: faculty.name,
      email: faculty.email || `${faculty.name.toLowerCase().replace(/\s+/g, '.')}@university.edu`,
      deptId: faculty.deptId,
      designation: faculty.designation || 'Lecturer',
      subjects: faculty.subjects || []
    };
    this.data.faculty.push(newFaculty);
    this.save();
    return newFaculty;
  }

  // --- Attendance Logging API ---
  recordAttendance(courseId, subjectCode, attendanceMap) {
    // attendanceMap: { studentId: boolean (true = present, false = absent) }
    const students = this.getStudents().filter(s => s.courseId === courseId);
    
    students.forEach(student => {
      if (!student.attendance) student.attendance = {};
      if (!student.attendance[subjectCode]) {
        student.attendance[subjectCode] = { attended: 0, total: 0 };
      }
      
      student.attendance[subjectCode].total += 1;
      if (attendanceMap[student.id]) {
        student.attendance[subjectCode].attended += 1;
      }
    });

    this.save();
  }

  // --- Examination & Result API ---
  recordGrade(studentId, subjectCode, subjectName, semester, marks) {
    const student = this.getStudentById(studentId);
    if (!student) return false;

    if (!student.grades) student.grades = [];

    // Calculate Grade Letter & GPA
    let grade = 'F';
    let gpa = 0.0;
    const m = parseInt(marks);

    if (m >= 95) { grade = 'O'; gpa = 4.0; }
    else if (m >= 90) { grade = 'A+'; gpa = 4.0; }
    else if (m >= 80) { grade = 'A'; gpa = 3.7; }
    else if (m >= 70) { grade = 'B+'; gpa = 3.3; }
    else if (m >= 60) { grade = 'B'; gpa = 3.0; }
    else if (m >= 50) { grade = 'C'; gpa = 2.0; }
    else if (m >= 40) { grade = 'P'; gpa = 1.0; }

    const existingGradeIdx = student.grades.findIndex(g => g.code === subjectCode);
    const gradeEntry = { code: subjectCode, name: subjectName, sem: parseInt(semester), marks: m, grade, gpa };

    if (existingGradeIdx !== -1) {
      student.grades[existingGradeIdx] = gradeEntry;
    } else {
      student.grades.push(gradeEntry);
    }

    this.save();
    return true;
  }

  // --- Fee & Invoices API ---
  getInvoices() {
    return this.data.invoices || [];
  }

  getInvoicesForStudent(studentId) {
    return this.getInvoices().filter(i => i.studentId === studentId);
  }

  addInvoice(invoice) {
    const student = this.getStudentById(invoice.studentId);
    const newInvoice = {
      id: 'INV' + (Date.now()),
      studentId: invoice.studentId,
      studentName: student ? student.name : 'Unknown Student',
      semester: parseInt(invoice.semester) || 1,
      amount: parseFloat(invoice.amount),
      dueDate: invoice.dueDate,
      status: 'Unpaid',
      paidDate: null,
      paymentMethod: null,
      type: invoice.type || 'Tuition Fee'
    };
    this.data.invoices.push(newInvoice);
    this.save();
    return newInvoice;
  }

  payInvoice(invoiceId, paymentMethod) {
    const idx = this.data.invoices.findIndex(i => i.id === invoiceId);
    if (idx !== -1 && this.data.invoices[idx].status === 'Unpaid') {
      this.data.invoices[idx].status = 'Paid';
      this.data.invoices[idx].paidDate = new Date().toISOString().split('T')[0];
      this.data.invoices[idx].paymentMethod = paymentMethod;
      this.save();
      return this.data.invoices[idx];
    }
    return null;
  }

  // --- Library Management API ---
  getBooks() {
    return this.data.books || [];
  }

  getIssuedBooks() {
    return this.data.issuedBooks || [];
  }

  issueBook(bookId, studentId, dueDate) {
    const bookIdx = this.data.books.findIndex(b => b.id === bookId);
    const student = this.getStudentById(studentId);
    
    if (bookIdx === -1 || !student) return null;
    if (this.data.books[bookIdx].available <= 0) return null;

    // Decrement available count
    this.data.books[bookIdx].available -= 1;

    const newIssue = {
      id: 'ISS' + (Date.now()),
      bookId: bookId,
      bookTitle: this.data.books[bookIdx].title,
      studentId: studentId,
      studentName: student.name,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: dueDate,
      returnDate: null,
      fine: 0,
      status: 'Issued'
    };

    if (!this.data.issuedBooks) this.data.issuedBooks = [];
    this.data.issuedBooks.push(newIssue);
    this.save();
    return newIssue;
  }

  returnBook(issuedBookId) {
    const issueIdx = this.data.issuedBooks.findIndex(i => i.id === issuedBookId);
    if (issueIdx === -1 || this.data.issuedBooks[issueIdx].returnDate !== null) return null;

    const issue = this.data.issuedBooks[issueIdx];
    const bookIdx = this.data.books.findIndex(b => b.id === issue.bookId);

    // Increment available count
    if (bookIdx !== -1) {
      this.data.books[bookIdx].available = Math.min(this.data.books[bookIdx].available + 1, this.data.books[bookIdx].qty);
    }

    issue.returnDate = new Date().toISOString().split('T')[0];
    issue.status = 'Returned';
    
    // Calculate final fine if overdue
    const due = new Date(issue.dueDate);
    const ret = new Date(issue.returnDate);
    const diffDays = Math.ceil((ret - due) / (1000 * 60 * 60 * 24));
    issue.fine = diffDays > 0 ? diffDays * 1 : 0; // $1 fine per day

    this.save();
    return issue;
  }

  // --- Timetable API ---
  getTimetable(courseId, semester) {
    return (this.data.timetables[courseId] && this.data.timetables[courseId][semester]) || null;
  }

  // --- Announcements API ---
  getAnnouncements() {
    return this.data.announcements || [];
  }

  addAnnouncement(announcement) {
    const newAnnouncement = {
      id: 'ANN' + (Date.now()),
      title: announcement.title,
      content: announcement.content,
      date: new Date().toISOString().split('T')[0],
      author: announcement.author || 'Administrator',
      category: announcement.category || 'General'
    };
    this.data.announcements.unshift(newAnnouncement); // Newest first
    this.save();
    return newAnnouncement;
  }

  // --- Messages API ---
  getMessages() {
    return this.data.messages || [];
  }

  getMessagesForUser(userId) {
    return this.getMessages().filter(m => m.senderId === userId || m.receiverId === userId);
  }

  sendMessage(senderId, senderName, receiverId, receiverName, subject, content) {
    const newMsg = {
      id: 'MSG' + (Date.now()),
      senderId,
      senderName,
      receiverId,
      receiverName,
      subject,
      content,
      timestamp: new Date().toISOString(),
      read: false
    };
    this.data.messages.push(newMsg);
    this.save();
    return newMsg;
  }

  markMessageRead(messageId) {
    const idx = this.data.messages.findIndex(m => m.id === messageId);
    if (idx !== -1) {
      this.data.messages[idx].read = true;
      this.save();
    }
  }

  // --- Deletion API ---
  deleteStudent(id) {
    this.data.students = this.data.students.filter(s => s.id !== id);
    this.data.invoices = this.data.invoices.filter(i => i.studentId !== id);
    this.data.issuedBooks = this.data.issuedBooks.filter(ib => ib.studentId !== id);
    this.save();
    return true;
  }

  deleteFaculty(id) {
    this.data.faculty = this.data.faculty.filter(f => f.id !== id);
    this.save();
    return true;
  }

  // --- Reset Database helper ---
  reset() {
    localStorage.removeItem(DB_KEY);
    this.data = this.load();
  }
}

// Instantiate globally
window.db = new ERPDatabase();
