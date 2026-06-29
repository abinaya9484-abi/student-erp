// app.js - ERP System Main Controller and Dynamic UI Binder

// Global state trackers
let currentUser = null;
let currentRole = 'admin'; // active switcher profile
let activeView = 'dashboard';
let tempCheckoutInvoiceId = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  // Clear any potential leftovers
  signOut();
  
  // Set initial login role dropdown
  setLoginRole('admin');

  // Bind forms
  document.getElementById('login-form').addEventListener('submit', handleLoginForm);
});

// ==================== AUTHENTICATION & PROFILE CONTROL ====================

function setLoginRole(role) {
  currentRole = role;
  
  // Update button highlights
  const btns = document.querySelectorAll('.role-select-btn');
  btns.forEach(btn => btn.classList.remove('active'));
  
  const targetBtn = Array.from(btns).find(btn => btn.innerText.toLowerCase().includes(role === 'finance' ? 'finance' : role));
  if (targetBtn) targetBtn.classList.add('active');

  // Fill in helper mock credentials
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  
  usernameInput.placeholder = "Enter Username / ID";
  usernameInput.disabled = false;
  passwordInput.disabled = false;

  if (role === 'admin') {
    usernameInput.value = 'admin';
    passwordInput.value = 'admin123';
  } else if (role === 'faculty') {
    const facultyList = db.getFaculty();
    if (facultyList.length > 0) {
      usernameInput.value = facultyList[0].id;
      passwordInput.value = 'faculty123';
    } else {
      usernameInput.value = '';
      usernameInput.placeholder = "No faculty. Register one as Admin.";
      passwordInput.value = '';
    }
  } else if (role === 'student') {
    const studentList = db.getStudents();
    if (studentList.length > 0) {
      usernameInput.value = studentList[0].rollNo;
      passwordInput.value = 'student123';
    } else {
      usernameInput.value = '';
      usernameInput.placeholder = "No students. Register one as Admin.";
      passwordInput.value = '';
    }
  } else if (role === 'parent') {
    const studentList = db.getStudents();
    if (studentList.length > 0) {
      usernameInput.value = studentList[0].rollNo + '_parent';
      passwordInput.value = 'parent123';
    } else {
      usernameInput.value = '';
      usernameInput.placeholder = "No students. Register one as Admin.";
      passwordInput.value = '';
    }
  } else if (role === 'accountant') {
    usernameInput.value = 'finance_office';
    passwordInput.value = 'finance123';
  } else if (role === 'librarian') {
    usernameInput.value = 'library_office';
    passwordInput.value = 'library123';
  }
}

function handleLoginForm(event) {
  event.preventDefault();
  const username = document.getElementById('username').value.trim();

  // Create simulated current user session details
  if (currentRole === 'admin') {
    currentUser = { id: 'ADM001', name: 'Campus Registrar', role: 'admin', deptId: null };
  } else if (currentRole === 'faculty') {
    const f = db.getFacultyById(username) || db.getFaculty().find(fac => fac.id === username);
    if (!f) {
      alert("Faculty profile not found. Please log in as Admin and register a faculty profile first.");
      return;
    }
    currentUser = { id: f.id, name: f.name, role: 'faculty', deptId: f.deptId, subjects: f.subjects };
  } else if (currentRole === 'student') {
    const s = db.getStudentById(username) || db.getStudents().find(std => std.id === username || std.rollNo === username);
    if (!s) {
      alert("Student profile not found. Please log in as Admin and register a student profile first.");
      return;
    }
    currentUser = { id: s.id, name: s.name, role: 'student', deptId: s.deptId, courseId: s.courseId, semester: s.semester };
  } else if (currentRole === 'parent') {
    const studentId = username.replace('_parent', '');
    const s = db.getStudentById(studentId) || db.getStudents().find(std => std.id === studentId || std.rollNo === studentId);
    if (!s) {
      alert("Associated Student profile not found. Please register the student under the Admin panel first.");
      return;
    }
    currentUser = { id: s.id + '_parent', name: `${s.parentName || 'Parent of ' + s.name}`, role: 'parent', studentId: s.id, studentName: s.name, deptId: s.deptId, courseId: s.courseId, semester: s.semester };
  } else if (currentRole === 'accountant') {
    currentUser = { id: 'ACC001', name: 'Finance Controller', role: 'accountant' };
  } else if (currentRole === 'librarian') {
    currentUser = { id: 'LIB001', name: 'Chief Librarian', role: 'librarian' };
  }

  // Swap Screens
  document.getElementById('login-view').style.display = 'none';
  document.getElementById('app-view').style.display = 'flex';

  // Load User Shell Details
  const initial = currentUser.name.split(' ').map(n => n[0]).join('');
  document.getElementById('profile-avatar').innerText = initial;
  document.getElementById('profile-name').innerText = currentUser.name;
  document.getElementById('profile-role').innerText = currentUser.role;
  document.getElementById('header-role-tag').innerText = `${currentUser.role} View`;

  // Check announcement counts for bell badge
  const unreadCount = db.getAnnouncements().length;
  const bell = document.getElementById('announcement-bell-badge');
  bell.innerText = unreadCount;
  bell.style.display = unreadCount > 0 ? 'inline-block' : 'none';

  // Build Sidebar & Dashboard
  buildSidebarMenu();
  showModule('dashboard');
}

function signOut() {
  currentUser = null;
  document.getElementById('app-view').style.display = 'none';
  document.getElementById('login-view').style.display = 'flex';
}

// ==================== SIDEBAR GENERATOR BY ROLE ====================

function buildSidebarMenu() {
  const menu = document.getElementById('sidebar-menu');
  menu.innerHTML = ''; // Clear items

  const role = currentUser.role;
  const items = [];

  // Core view available to all
  items.push({ id: 'dashboard', label: 'Dashboard', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>' });

  if (role === 'admin') {
    items.push(
      { id: 'admissions', label: 'Student Admissions', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" y1="8" x2="19" y2="14"></line><line x1="16" y1="11" x2="22" y2="11"></line></svg>' },
      { id: 'directory', label: 'Student Directory', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>' },
      { id: 'faculty', label: 'Faculty Roster', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a5 5 0 100 10 5 5 0 000-10z"></path><path d="M2 20a10 10 0 0120 0H2z"></path></svg>' },
      { id: 'courses', label: 'Curriculum & Courses', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>' },
      { id: 'enrolled', label: 'Enrolled Courses', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>' },
      { id: 'attendance', label: 'Attendance Ledger', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>' },
      { id: 'results', label: 'Exam & Result Registry', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>' },
      { id: 'fees', label: 'Billing Ledger', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>' },
      { id: 'library', label: 'Library Inventory', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>' },
      { id: 'timetable', label: 'Lecture Timetables', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>' },
      { id: 'announcements', label: 'Bulletins', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"></path></svg>' },
      { id: 'reports', label: 'Analytics Reports', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 17v-2m3 2v-4m3 4V9M9 3h6a2 2 0 012 2v14a2 2 0 01-2 2H9a2 2 0 01-2-2V5a2 2 0 012-2z"></path></svg>' }
    );
  } else if (role === 'faculty') {
    items.push(
      { id: 'directory', label: 'Student Directory', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>' },
      { id: 'enrolled', label: 'Enrolled Courses', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>' },
      { id: 'attendance', label: 'Class Attendance', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>' },
      { id: 'results', label: 'Grading Sheet', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>' },
      { id: 'timetable', label: 'My Schedule', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect></svg>' },
      { id: 'announcements', label: 'Bulletins', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9H18s-3-2-3-9"></path></svg>' }
    );
  } else if (role === 'student' || role === 'parent') {
    items.push(
      { id: 'enrolled', label: 'Enrolled Courses', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>' },
      { id: 'select-courses', label: 'Select Courses', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>' },
      { id: 'timetable', label: 'Weekly Schedule', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect></svg>' },
      { id: 'attendance', label: 'Attendance Tracker', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path></svg>' },
      { id: 'results', label: 'Grade Transcript', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12v-8z"></path></svg>' },
      { id: 'fees', label: 'Fee Payments', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>' },
      { id: 'library', label: 'Library Borrowing', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path></svg>' },
      { id: 'announcements', label: 'Bulletins', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9H18s-3-2-3-9"></path></svg>' }
    );
  } else if (role === 'accountant') {
    items.push(
      { id: 'fees', label: 'Billing Ledger', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>' },
      { id: 'directory', label: 'Student Directory', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path></svg>' },
      { id: 'courses', label: 'Curriculum & Courses', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path></svg>' },
      { id: 'announcements', label: 'Bulletins', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9H18s-3-2-3-9"></path></svg>' },
      { id: 'reports', label: 'Analytics Reports', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 17v-2m3 2v-4m3 4V9M9 3h6a2 2 0 012 2v14a2 2 0 01-2 2H9a2 2 0 01-2-2V5a2 2 0 012-2z"></path></svg>' }
    );
  } else if (role === 'librarian') {
    items.push(
      { id: 'library', label: 'Library Catalog', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>' },
      { id: 'directory', label: 'Student Directory', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path></svg>' },
      { id: 'timetable', label: 'Class Schedules', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect></svg>' },
      { id: 'announcements', label: 'Bulletins', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9H18s-3-2-3-9"></path></svg>' }
    );
  }

  // Inject elements
  items.forEach(item => {
    const li = document.createElement('li');
    li.className = `menu-item ${item.id === activeView ? 'active' : ''}`;
    li.id = `menu-item-${item.id}`;
    li.innerHTML = `
      <a onclick="showModule('${item.id}')">
        ${item.icon}
        <span>${item.label}</span>
      </a>
    `;
    menu.appendChild(li);
  });
}

// ==================== WORKSPACE ROUTER CONTROL ====================

function showModule(panelName) {
  activeView = panelName;

  // Toggle Sidebar active indicators
  const menuItems = document.querySelectorAll('.menu-item');
  menuItems.forEach(item => item.classList.remove('active'));
  const activeItem = document.getElementById(`menu-item-${panelName}`);
  if (activeItem) activeItem.classList.add('active');

  // Hide all panels
  const panels = document.querySelectorAll('.workspace-panel');
  panels.forEach(p => p.style.display = 'none');

  // Show target panel
  const targetPanel = document.getElementById(`panel-${panelName}`);
  if (targetPanel) {
    targetPanel.style.display = 'block';
  } else {
    console.error(`Panel ID panel-${panelName} not found.`);
  }

  // Invoke target renderers
  if (panelName === 'dashboard') renderDashboard();
  else if (panelName === 'admissions') renderAdmissionsModule();
  else if (panelName === 'directory') renderStudentDirectory();
  else if (panelName === 'faculty') renderFacultyDirectory();
  else if (panelName === 'courses') renderCoursesModule();
  else if (panelName === 'attendance') renderAttendanceModule();
  else if (panelName === 'results') renderResultsModule();
  else if (panelName === 'fees') renderFeesModule();
  else if (panelName === 'library') renderLibraryModule();
  else if (panelName === 'timetable') renderTimetableModule();
  else if (panelName === 'announcements') renderAnnouncementsModule();
  else if (panelName === 'reports') renderReportsModule();
  else if (panelName === 'enrolled') renderEnrolledCoursesModule();
  else if (panelName === 'select-courses') renderCourseSelectionModule();
}

// ==================== 1. DASHBOARD PANEL RENDERER ====================

function renderDashboard() {
  const welcome = document.getElementById('dashboard-welcome-msg');
  const subtitle = document.querySelector('#panel-dashboard .panel-subtitle');
  const role = currentUser.role;

  // Custom welcome message
  if (role === 'admin') {
    welcome.innerText = 'Hello, Admin';
    subtitle.innerText = 'System Status: Active. Review operational summaries below.';
  } else if (role === 'faculty') {
    welcome.innerText = `Welcome, ${currentUser.name}`;
    subtitle.innerText = `Department: ${currentUser.deptId} | Accessing Faculty gradebook and attendance registers.`;
  } else if (role === 'student') {
    welcome.innerText = `Hi, ${currentUser.name}`;
    subtitle.innerText = `Semester: ${currentUser.semester} | Roll: ${db.getStudentById(currentUser.id).rollNo}`;
  } else if (role === 'parent') {
    welcome.innerText = `Hello, Robert Johnson`;
    subtitle.innerText = `Monitoring child: ${currentUser.studentName}'s transcripts and fee balances.`;
  } else if (role === 'accountant') {
    welcome.innerText = 'Accounting Portal';
    subtitle.innerText = 'Manage university invoice collections and processing logs.';
  } else if (role === 'librarian') {
    welcome.innerText = 'Library Desk';
    subtitle.innerText = 'Catalog indexes, due checkout lists, and borrowing returns logs.';
  }

  // 1. Context shortcuts
  const actionDiv = document.getElementById('dashboard-role-action');
  actionDiv.innerHTML = '';
  if (role === 'admin') {
    actionDiv.innerHTML = `<button class="btn btn-primary btn-sm" onclick="showModule('admissions')">+ Admit Student</button>`;
  } else if (role === 'faculty') {
    actionDiv.innerHTML = `<button class="btn btn-primary btn-sm" onclick="openMarkAttendanceModal()">Log Class Attendance</button>`;
  } else if (role === 'student' || role === 'parent') {
    actionDiv.innerHTML = `<button class="btn btn-primary btn-sm" onclick="showModule('fees')">Pay Fees</button>`;
  } else if (role === 'accountant') {
    actionDiv.innerHTML = `<button class="btn btn-primary btn-sm" onclick="openCreateInvoiceModal()">Issue Invoice</button>`;
  } else if (role === 'librarian') {
    actionDiv.innerHTML = `<button class="btn btn-primary btn-sm" onclick="openIssueBookModal()">Issue Book</button>`;
  }

  // 2. Render Cards Metrics
  renderDashboardStats();

  // 3. Render Custom SVG Charts
  renderDashboardCharts();

  // 4. Render Announcements summary
  const annContainer = document.getElementById('dashboard-announcements');
  annContainer.innerHTML = '';
  const circulars = db.getAnnouncements().slice(0, 3);
  if (circulars.length === 0) {
    annContainer.innerHTML = '<p style="font-size:0.82rem; color:var(--text-muted); text-align:center; padding: 20px 0;">No announcements published.</p>';
  } else {
    circulars.forEach(c => {
      const categoryClass = c.category ? c.category.toLowerCase() : 'general';
      const div = document.createElement('div');
      div.className = `announcement-item ${categoryClass}`;
      div.innerHTML = `
        <div class="announce-header">
          <span class="announce-title" onclick="openAnnouncementDetailsModal('${c.id}')">${c.title}</span>
          <span class="announce-date">${c.date}</span>
        </div>
        <div class="announce-desc">${c.content}</div>
        <div class="announce-author">Published by: ${c.author}</div>
      `;
      annContainer.appendChild(div);
    });
  }
}

function renderDashboardStats() {
  const container = document.getElementById('dashboard-stats');
  container.innerHTML = '';

  const role = currentUser.role;
  const studentsCount = db.getStudents().length;
  const facultyCount = db.getFaculty().length;
  const booksCount = db.getBooks().reduce((acc, b) => acc + b.qty, 0);
  const paidFeesCount = db.getInvoices().filter(i => i.status === 'Paid').reduce((acc, i) => acc + i.amount, 0);

  let stats = [];

  if (role === 'admin') {
    stats = [
      { label: 'Active Students', value: studentsCount, icon: '👨‍🎓', theme: 'primary' },
      { label: 'Faculty Staff', value: facultyCount, icon: '👩‍🏫', theme: 'secondary' },
      { label: 'Library Books', value: booksCount, icon: '📚', theme: 'accent' },
      { label: 'Collected Fees', value: `$${paidFeesCount}`, icon: '💰', theme: 'info' }
    ];
  } else if (role === 'faculty') {
    const assignedCourses = currentUser.subjects.length;
    stats = [
      { label: 'Assigned Courses', value: assignedCourses, icon: '📋', theme: 'primary' },
      { label: 'Underrepresented Dept', value: currentUser.deptId, icon: '🏢', theme: 'secondary' },
      { label: 'System Announcements', value: db.getAnnouncements().length, icon: '📢', theme: 'accent' },
      { label: 'Active Roster Students', value: studentsCount, icon: '👨‍🎓', theme: 'info' }
    ];
  } else if (role === 'student' || role === 'parent') {
    const studentId = role === 'student' ? currentUser.id : currentUser.studentId;
    const studentObj = db.getStudentById(studentId);
    
    // Calculate GPA average
    let avgGpa = 0.0;
    if (studentObj.grades && studentObj.grades.length > 0) {
      const sum = studentObj.grades.reduce((acc, g) => acc + g.gpa, 0);
      avgGpa = (sum / studentObj.grades.length).toFixed(2);
    }
    // Calculate total unpaid bills
    const unpaid = db.getInvoicesForStudent(studentId)
      .filter(i => i.status === 'Unpaid')
      .reduce((acc, i) => acc + i.amount, 0);
    
    // Books Borrowed
    const activeBooks = db.getIssuedBooks().filter(i => i.studentId === studentId && i.returnDate === null).length;

    stats = [
      { label: 'Current Semester', value: studentObj.semester, icon: '🎓', theme: 'primary' },
      { label: 'GPA Average', value: avgGpa, icon: '📈', theme: 'secondary' },
      { label: 'Unpaid Fees', value: `$${unpaid}`, icon: '💳', theme: 'danger' },
      { label: 'Active Books Borrowed', value: activeBooks, icon: '📖', theme: 'info' }
    ];
  } else if (role === 'accountant') {
    const totalInvoiced = db.getInvoices().reduce((acc, i) => acc + i.amount, 0);
    const unpaidAmt = db.getInvoices().filter(i => i.status === 'Unpaid').reduce((acc, i) => acc + i.amount, 0);
    stats = [
      { label: 'Collected Fees', value: `$${paidFeesCount}`, icon: '💰', theme: 'secondary' },
      { label: 'Pending Receivables', value: `$${unpaidAmt}`, icon: '💳', theme: 'danger' },
      { label: 'Total Invoiced Bills', value: `$${totalInvoiced}`, icon: '📋', theme: 'primary' },
      { label: 'Total Invoices Count', value: db.getInvoices().length, icon: '🧾', theme: 'info' }
    ];
  } else if (role === 'librarian') {
    const totalCirculation = db.getIssuedBooks().filter(i => i.returnDate === null).length;
    const overdueCount = db.getIssuedBooks().filter(i => i.status === 'Overdue').length;
    stats = [
      { label: 'Total Book Inventory', value: booksCount, icon: '📚', theme: 'primary' },
      { label: 'Books In Circulation', value: totalCirculation, icon: '📖', theme: 'secondary' },
      { label: 'Overdue Warnings', value: overdueCount, icon: '⚠️', theme: 'danger' },
      { label: 'Pending Library Fines', value: `$${db.getIssuedBooks().reduce((acc, b) => acc + b.fine, 0)}`, icon: '💵', theme: 'accent' }
    ];
  }

  stats.forEach(s => {
    const card = document.createElement('div');
    card.className = 'stat-card';
    card.innerHTML = `
      <div class="stat-info">
        <span class="stat-label">${s.label}</span>
        <span class="stat-val">${s.value}</span>
      </div>
      <div class="stat-icon-container ${s.theme}">
        <span style="font-size: 1.5rem;">${s.icon}</span>
      </div>
    `;
    container.appendChild(card);
  });
}

function renderDashboardCharts() {
  const chartTitle = document.getElementById('chart-title');
  const viewport = document.getElementById('chart-viewport');
  const role = currentUser.role;

  viewport.innerHTML = '';

  if (role === 'admin' || role === 'accountant') {
    chartTitle.innerText = 'Fee Transactions Status Audit';
    
    // Gather statistics
    const invoices = db.getInvoices();
    let paidAmt = 0;
    let unpaidAmt = 0;
    invoices.forEach(i => {
      if (i.status === 'Paid') paidAmt += i.amount;
      else unpaidAmt += i.amount;
    });

    const maxAmt = Math.max(paidAmt, unpaidAmt, 100);
    const scale = 180 / maxAmt; // SVG height max 180

    viewport.innerHTML = `
      <svg class="svg-chart" viewBox="0 0 400 240">
        <!-- Grid lines -->
        <line x1="50" y1="20" x2="350" y2="20" class="chart-grid-line" />
        <line x1="50" y1="110" x2="350" y2="110" class="chart-grid-line" />
        <line x1="50" y1="200" x2="350" y2="200" class="chart-axis" />
        
        <!-- Y-Axis Labels -->
        <text x="10" y="25" class="chart-text">$${Math.round(maxAmt)}</text>
        <text x="10" y="115" class="chart-text">$${Math.round(maxAmt / 2)}</text>
        <text x="10" y="205" class="chart-text">$0</text>

        <!-- Bar 1: Paid -->
        <rect x="100" y="${200 - (paidAmt * scale)}" width="60" height="${paidAmt * scale}" rx="4" class="chart-bar chart-bar-secondary" />
        <text x="115" y="220" class="chart-text">Paid</text>
        <text x="110" y="${190 - (paidAmt * scale)}" class="chart-text" style="font-weight:700;">$${paidAmt}</text>
        
        <!-- Bar 2: Unpaid -->
        <rect x="240" y="${200 - (unpaidAmt * scale)}" width="60" height="${unpaidAmt * scale}" rx="4" class="chart-bar" style="fill:var(--danger);" />
        <text x="250" y="220" class="chart-text">Pending</text>
        <text x="250" y="${190 - (unpaidAmt * scale)}" class="chart-text" style="font-weight:700;">$${unpaidAmt}</text>
      </svg>
    `;
  } else if (role === 'faculty') {
    chartTitle.innerText = 'Assigned Classes Performance Distribution';
    
    // Build bar distribution of mock department students count
    const depts = db.getDepartments();
    const students = db.getStudents();
    
    const countByDept = {};
    depts.forEach(d => countByDept[d.id] = 0);
    students.forEach(s => {
      if (countByDept[s.deptId] !== undefined) countByDept[s.deptId]++;
    });

    const maxCount = Math.max(...Object.values(countByDept), 1);
    const scale = 180 / maxCount;

    let barsSVG = '';
    let textSVG = '';
    let xOffset = 80;

    depts.forEach((d) => {
      const count = countByDept[d.id];
      const barHeight = count * scale;
      barsSVG += `<rect x="${xOffset}" y="${200 - barHeight}" width="40" height="${barHeight}" rx="4" class="chart-bar" />`;
      barsSVG += `<text x="${xOffset + 12}" y="${190 - barHeight}" class="chart-text" style="font-weight:700;">${count}</text>`;
      textSVG += `<text x="${xOffset + 10}" y="220" class="chart-text">${d.id}</text>`;
      xOffset += 80;
    });

    viewport.innerHTML = `
      <svg class="svg-chart" viewBox="0 0 400 240">
        <line x1="50" y1="20" x2="350" y2="20" class="chart-grid-line" />
        <line x1="50" y1="110" x2="350" y2="110" class="chart-grid-line" />
        <line x1="50" y1="200" x2="350" y2="200" class="chart-axis" />
        
        <text x="15" y="25" class="chart-text">${Math.round(maxCount)}</text>
        <text x="15" y="115" class="chart-text">${Math.round(maxCount / 2)}</text>
        <text x="15" y="205" class="chart-text">0</text>
        ${barsSVG}
        ${textSVG}
      </svg>
    `;
  } else if (role === 'student' || role === 'parent') {
    chartTitle.innerText = 'Term Grade Letter Analytics';
    
    // circular chart view
    const studentId = role === 'student' ? currentUser.id : currentUser.studentId;
    const s = db.getStudentById(studentId);
    
    let sumGrades = 0;
    s.grades.forEach(g => sumGrades += g.marks);
    const avg = s.grades.length > 0 ? Math.round(sumGrades / s.grades.length) : 0;

    viewport.innerHTML = `
      <div style="display:flex; align-items:center; gap:40px; margin-top:20px;">
        <div class="progress-ring-container" style="width:140px; height:140px;">
          <svg width="140" height="140">
            <circle stroke="#cbd5e1" stroke-width="12" fill="transparent" r="50" cx="70" cy="70"/>
            <circle stroke="var(--primary)" stroke-width="12" fill="transparent" r="50" cx="70" cy="70" class="progress-ring-circle" stroke-dasharray="314.16" stroke-dashoffset="${314.16 - (314.16 * avg / 100)}"/>
          </svg>
          <div class="progress-text" style="font-size:1.4rem;">
            <strong>${avg}%</strong>
            <span>Avg Marks</span>
          </div>
        </div>
        
        <div style="display:flex; flex-direction:column; gap:10px;">
          <h4 style="font-size:1rem; font-weight:700;">Academic Progression Standings</h4>
          <p style="font-size:0.85rem; color:var(--text-muted); max-width:200px;">Your average grade is computed over ${s.grades.length} semester subjects.</p>
          <button class="btn btn-primary btn-sm" style="align-self:flex-start;" onclick="showModule('results')">View Report Card</button>
        </div>
      </div>
    `;
  } else if (role === 'librarian') {
    chartTitle.innerText = 'Overdue Alert Compliance Rate';
    
    const issued = db.getIssuedBooks();
    const overdue = issued.filter(i => i.status === 'Overdue').length;
    const returned = issued.filter(i => i.status === 'Returned').length;
    const active = issued.filter(i => i.status === 'Issued').length;

    viewport.innerHTML = `
      <svg class="svg-chart" viewBox="0 0 400 240">
        <line x1="50" y1="20" x2="350" y2="20" class="chart-grid-line" />
        <line x1="50" y1="200" x2="350" y2="200" class="chart-axis" />
        
        <!-- returned -->
        <rect x="80" y="${200 - (returned * 40)}" width="40" height="${returned * 40}" rx="4" class="chart-bar" style="fill:var(--secondary);" />
        <text x="80" y="220" class="chart-text">Returned (${returned})</text>
        
        <!-- active issue -->
        <rect x="180" y="${200 - (active * 40)}" width="40" height="${active * 40}" rx="4" class="chart-bar" style="fill:var(--primary);" />
        <text x="185" y="220" class="chart-text">Borrowed (${active})</text>
        
        <!-- overdue -->
        <rect x="280" y="${200 - (overdue * 40)}" width="40" height="${overdue * 40}" rx="4" class="chart-bar" style="fill:var(--danger);" />
        <text x="285" y="220" class="chart-text">Overdue (${overdue})</text>
      </svg>
    `;
  }
}

// ==================== 2. ADMISSIONS PANEL MODULE ====================

function renderAdmissionsModule() {
  // Populate dropdowns in the form
  const deptSelect = document.getElementById('adm-dept');
  deptSelect.innerHTML = '<option value="">Select Department</option>';
  
  db.getDepartments().forEach(d => {
    deptSelect.innerHTML += `<option value="${d.id}">${d.name}</option>`;
  });
}

function populateCourseDropdown(dropdownId, deptId) {
  const select = document.getElementById(dropdownId);
  select.innerHTML = '<option value="">Select Course</option>';
  
  if (!deptId) return;

  db.getCourses().filter(c => c.deptId === deptId).forEach(c => {
    select.innerHTML += `<option value="${c.id}">${c.name}</option>`;
  });
}

function submitAdmissionForm(event) {
  event.preventDefault();
  
  const name = document.getElementById('adm-name').value.trim();
  const email = document.getElementById('adm-email').value.trim();
  const phone = document.getElementById('adm-phone').value.trim();
  const deptId = document.getElementById('adm-dept').value;
  const courseId = document.getElementById('adm-course').value;
  const semester = document.getElementById('adm-sem').value;
  const parentName = document.getElementById('adm-parent').value.trim();
  const parentPhone = document.getElementById('adm-parent-phone').value.trim();
  const docVerified = document.getElementById('adm-doc').checked;

  const newStudent = db.addStudent({
    name, email, phone, deptId, courseId, semester, parentName, parentPhone, documentVerified: docVerified
  });

  alert(`Student registered successfully! Roll Number: ${newStudent.rollNo}`);
  document.getElementById('admission-form').reset();
  showModule('directory');
}

// ==================== 3. STUDENT DIRECTORY PANEL RENDERER ====================

function renderStudentDirectory() {
  const tbody = document.getElementById('student-directory-tbody');
  tbody.innerHTML = '';

  // Populate filter dropdown on first load
  const deptFilter = document.getElementById('student-dept-filter');
  if (deptFilter.options.length <= 1) {
    db.getDepartments().forEach(d => {
      deptFilter.innerHTML += `<option value="${d.id}">${d.id} - ${d.name}</option>`;
    });
  }

  // Get filter inputs
  const searchVal = document.getElementById('student-search-input').value.toLowerCase();
  const deptVal = document.getElementById('student-dept-filter').value;
  const semVal = document.getElementById('student-sem-filter').value;

  const students = db.getStudents();
  
  const filtered = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchVal) || s.rollNo.toLowerCase().includes(searchVal);
    const matchesDept = !deptVal || s.deptId === deptVal;
    const matchesSem = !semVal || s.semester === parseInt(semVal);
    return matchesSearch && matchesDept && matchesSem;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:var(--text-muted);">No students matching criteria found.</td></tr>`;
    return;
  }

  filtered.forEach(s => {
    const course = db.getCourses().find(c => c.id === s.courseId);
    const tr = document.createElement('tr');
    tr.className = 'animate-scale';
    
    let actionButtonsHtml = `<button class="btn btn-outline btn-sm" onclick="openStudentDetailsModal('${s.id}')">View Details</button>`;
    if (currentUser.role === 'admin') {
      actionButtonsHtml += ` <button class="btn btn-danger btn-sm" onclick="deleteStudentRoster('${s.id}')">Delete</button>`;
    }

    tr.innerHTML = `
      <td style="font-weight:700; color:var(--primary);">${s.rollNo}</td>
      <td>${s.name}</td>
      <td>${s.deptId}</td>
      <td>${course ? course.name : s.courseId}</td>
      <td>Sem ${s.semester}</td>
      <td><span class="badge badge-success">${s.status}</span></td>
      <td style="text-align: right;">
        ${actionButtonsHtml}
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function openStudentDetailsModal(studentId) {
  const modal = document.getElementById('modal-student-details');
  const body = document.getElementById('student-details-body');
  
  const s = db.getStudentById(studentId);
  if (!s) return;

  const course = db.getCourses().find(c => c.id === s.courseId);

  // Compute GPA summary
  let gpaTxt = 'N/A';
  if (s.grades && s.grades.length > 0) {
    const totalGpa = s.grades.reduce((acc, g) => acc + g.gpa, 0);
    gpaTxt = (totalGpa / s.grades.length).toFixed(2);
  }

  // Compute attendance
  let attTxt = '100%';
  let totalLogs = 0;
  let attendedLogs = 0;
  Object.values(s.attendance).forEach(a => {
    totalLogs += a.total;
    attendedLogs += a.attended;
  });
  if (totalLogs > 0) {
    attTxt = `${Math.round((attendedLogs / totalLogs) * 100)}%`;
  }

  body.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; border-bottom:1px solid var(--border-color); padding-bottom:15px;">
      <div>
        <h3 style="font-size:1.25rem; font-weight:800; color:var(--text-main);">${s.name}</h3>
        <p style="color:var(--text-muted); font-size:0.85rem;">Roll Number: ${s.rollNo} | Enrolled in ${course ? course.name : s.courseId}</p>
      </div>
      <span class="badge badge-success">${s.status}</span>
    </div>

    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; margin-bottom:24px;">
      <div>
        <h4 style="font-size:0.75rem; text-transform:uppercase; color:var(--text-light); margin-bottom:4px;">Academic Details</h4>
        <p style="font-size:0.88rem; margin-bottom:6px;"><strong>Semester:</strong> Sem ${s.semester}</p>
        <p style="font-size:0.88rem; margin-bottom:6px;"><strong>Cumulative GPA:</strong> ${gpaTxt}</p>
        <p style="font-size:0.88rem; margin-bottom:6px;"><strong>Aggregate Attendance:</strong> ${attTxt}</p>
        <p style="font-size:0.88rem; margin-bottom:6px;"><strong>Email:</strong> ${s.email}</p>
      </div>
      <div>
        <h4 style="font-size:0.75rem; text-transform:uppercase; color:var(--text-light); margin-bottom:4px;">Guardian Info</h4>
        <p style="font-size:0.88rem; margin-bottom:6px;"><strong>Name:</strong> ${s.parentName}</p>
        <p style="font-size:0.88rem; margin-bottom:6px;"><strong>Phone:</strong> ${s.parentPhone}</p>
        <p style="font-size:0.88rem; margin-bottom:6px;"><strong>Email:</strong> ${s.parentEmail}</p>
        <p style="font-size:0.88rem; margin-bottom:6px;"><strong>Admitted Date:</strong> ${s.admissionDate}</p>
      </div>
    </div>

    <div style="margin-bottom:20px;">
      <h4 style="font-size:0.9rem; font-weight:700; margin-bottom:10px;">Academic Performance Registry</h4>
      ${s.grades.length === 0 ? '<p style="font-size:0.82rem; color:var(--text-light);">No grades published for this student yet.</p>' : `
      <div class="table-container">
        <table class="data-table" style="font-size:0.82rem;">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Marks</th>
              <th>Grade</th>
              <th>GP</th>
            </tr>
          </thead>
          <tbody>
            ${s.grades.map(g => `
              <tr>
                <td>${g.name} (${g.code})</td>
                <td>${g.marks}</td>
                <td style="font-weight:700; color:var(--primary);">${g.grade}</td>
                <td>${g.gpa}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      `}
    </div>

    <div>
      <h4 style="font-size:0.9rem; font-weight:700; margin-bottom:10px;">Circulation Status (Library Books)</h4>
      ${db.getIssuedBooks().filter(b => b.studentId === s.id && b.returnDate === null).length === 0 ? '<p style="font-size:0.82rem; color:var(--text-light);">No active books currently borrowed.</p>' : `
      <div style="display:flex; flex-direction:column; gap:8px;">
        ${db.getIssuedBooks().filter(b => b.studentId === s.id && b.returnDate === null).map(b => `
          <div style="display:flex; justify-content:space-between; font-size:0.82rem; background-color:#f8fafc; padding:8px 12px; border-radius:6px; border-left:3px solid var(--accent);">
            <span>📖 <strong>${b.bookTitle}</strong></span>
            <span style="color:var(--danger)">Due: ${b.dueDate}</span>
          </div>
        `).join('')}
      </div>
      `}
    </div>
  `;

  openModal('modal-student-details');
}

// ==================== 4. FACULTY ROSTER RENDERER ====================

function renderFacultyDirectory() {
  const tbody = document.getElementById('faculty-directory-tbody');
  tbody.innerHTML = '';

  const actionDiv = document.getElementById('faculty-panel-action');
  if (actionDiv) {
    if (currentUser.role === 'admin') {
      actionDiv.innerHTML = `<button class="btn btn-primary btn-sm" onclick="openRegisterFacultyModal()">+ Register Faculty</button>`;
    } else {
      actionDiv.innerHTML = '';
    }
  }

  const facultyList = db.getFaculty();
  if (facultyList.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:var(--text-muted); padding: 20px 0;">No faculty registered in the roster yet.</td></tr>`;
    return;
  }

  facultyList.forEach(f => {
    const tr = document.createElement('tr');
    tr.className = 'animate-scale';

    let actionButtonsHtml = '';
    if (currentUser.role === 'admin') {
      actionButtonsHtml = `<button class="btn btn-danger btn-sm" onclick="deleteFacultyRoster('${f.id}')">Delete</button>`;
    } else {
      actionButtonsHtml = `<span style="font-size:0.8rem; color:var(--text-light)">-</span>`;
    }

    tr.innerHTML = `
      <td style="font-weight:700; color:var(--text-muted);">${f.id}</td>
      <td><strong>${f.name}</strong></td>
      <td>${f.deptId}</td>
      <td>${f.designation}</td>
      <td>${f.email}</td>
      <td>${f.subjects.map(s => `<span class="badge badge-info" style="margin-right:4px;">${s}</span>`).join('')}</td>
      <td style="text-align: right;">${actionButtonsHtml}</td>
    `;
    tbody.appendChild(tr);
  });
}

function openRegisterFacultyModal() {
  document.getElementById('fac-name').value = '';
  
  // Populate departments dropdown
  const deptSelect = document.getElementById('fac-dept');
  deptSelect.innerHTML = '<option value="">Select Department</option>';
  db.getDepartments().forEach(d => {
    deptSelect.innerHTML += `<option value="${d.id}">${d.name}</option>`;
  });

  document.getElementById('fac-subjects').innerHTML = '<option value="">Select Department First</option>';
  openModal('modal-register-faculty');
}

function populateFacultySubjectsDropdown(deptId) {
  const subjectsSelect = document.getElementById('fac-subjects');
  subjectsSelect.innerHTML = '';
  
  if (!deptId) return;

  const subjects = db.getSubjects().filter(s => s.deptId === deptId);
  if (subjects.length === 0) {
    subjectsSelect.innerHTML = '<option value="">No subjects in this department</option>';
    return;
  }

  // Deduplicate subjects by code
  const seenCodes = new Set();
  subjects.forEach(s => {
    if (!seenCodes.has(s.code)) {
      seenCodes.add(s.code);
      subjectsSelect.innerHTML += `<option value="${s.code}">${s.code} - ${s.name}</option>`;
    }
  });
}

function submitFacultyRegistration() {
  const name = document.getElementById('fac-name').value.trim();
  const deptId = document.getElementById('fac-dept').value;
  const designation = document.getElementById('fac-designation').value;
  
  const subjectsSelect = document.getElementById('fac-subjects');
  const subjects = Array.from(subjectsSelect.selectedOptions).map(opt => opt.value).filter(val => val !== '');

  if (!name || !deptId || !designation || subjects.length === 0) {
    alert('Please fill out all fields and assign at least one subject.');
    return;
  }

  const newFac = db.addFaculty({
    name, deptId, designation, subjects
  });

  alert(`Faculty registered successfully! ID: ${newFac.id}`);
  closeModal('modal-register-faculty');
  renderFacultyDirectory();
}

// ==================== 5. COURSES & REGISTRY RENDERER ====================

function renderCoursesModule() {
  // Courses Program Table
  const coursesTbody = document.getElementById('courses-tbody');
  coursesTbody.innerHTML = '';
  
  db.getCourses().forEach(c => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-weight:700; color:var(--primary);">${c.id}</td>
      <td>${c.name}</td>
      <td>${c.deptId}</td>
      <td>${c.semesters} Semesters</td>
    `;
    coursesTbody.appendChild(tr);
  });

  // Subjects dropdown selector
  const subjectSelect = document.getElementById('subject-course-select');
  if (subjectSelect.options.length === 0) {
    db.getCourses().forEach(c => {
      subjectSelect.innerHTML += `<option value="${c.id}">${c.name}</option>`;
    });
  }

  renderSubjectsTable();
}

function renderSubjectsTable() {
  const courseId = document.getElementById('subject-course-select').value;
  const tbody = document.getElementById('subjects-tbody');
  tbody.innerHTML = '';

  const subjects = db.getSubjects().filter(s => s.courseId === courseId);
  if (subjects.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:var(--text-muted);">No registry subjects listed.</td></tr>`;
    return;
  }

  subjects.forEach(s => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-weight:700; color:var(--text-muted);">${s.code}</td>
      <td><strong>${s.name}</strong></td>
      <td>Semester ${s.semester}</td>
      <td>${s.credits} Credits</td>
    `;
    tbody.appendChild(tr);
  });
}

// ==================== 6. ATTENDANCE LEDGER RENDERER ====================

function renderAttendanceModule() {
  const header = document.getElementById('attendance-table-header');
  const tbody = document.getElementById('attendance-tbody');
  const actionDiv = document.getElementById('attendance-panel-action');
  const studentSum = document.getElementById('student-attendance-summary');

  tbody.innerHTML = '';
  actionDiv.innerHTML = '';

  const role = currentUser.role;

  if (role === 'admin' || role === 'accountant') {
    studentSum.style.display = 'none';
    header.innerHTML = `
      <th>Roll No</th>
      <th>Student Name</th>
      <th>Course Program</th>
      <th>Sem</th>
      <th>Attendance Rates</th>
    `;

    db.getStudents().forEach(s => {
      // compute average attendance
      let total = 0;
      let attended = 0;
      Object.values(s.attendance).forEach(a => {
        total += a.total;
        attended += a.attended;
      });
      const pct = total > 0 ? Math.round((attended / total) * 100) : 100;
      const pctColor = pct < 75 ? 'var(--danger)' : 'var(--secondary)';

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-weight:700;">${s.rollNo}</td>
        <td>${s.name}</td>
        <td>${s.courseId}</td>
        <td>Sem ${s.semester}</td>
        <td>
          <div style="display:flex; align-items:center; gap:8px;">
            <div style="flex-grow:1; background-color:#e2e8f0; height:6px; border-radius:4px; max-width:120px; overflow:hidden;">
              <div style="background-color:${pctColor}; width:${pct}%; height:100%;"></div>
            </div>
            <span style="font-weight:700; color:${pctColor}">${pct}%</span>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } else if (role === 'faculty') {
    studentSum.style.display = 'none';
    actionDiv.innerHTML = `<button class="btn btn-primary" onclick="openMarkAttendanceModal()">Mark Class Session</button>`;
    
    header.innerHTML = `
      <th>Roll No</th>
      <th>Student Name</th>
      <th>Sub-registry</th>
      <th>Semester</th>
      <th>Sessions Attended</th>
      <th>Compliance Rate</th>
    `;

    // Render attendance details of students that match faculty subjects
    db.getStudents().forEach(s => {
      currentUser.subjects.forEach(subCode => {
        const record = s.attendance[subCode] || { attended: 0, total: 0 };
        const pct = record.total > 0 ? Math.round((record.attended / record.total) * 100) : 100;
        const pctColor = pct < 75 ? 'var(--danger)' : 'var(--secondary)';

        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${s.rollNo}</td>
          <td>${s.name}</td>
          <td><span class="badge badge-info">${subCode}</span></td>
          <td>Sem ${s.semester}</td>
          <td><strong>${record.attended} / ${record.total}</strong> sessions</td>
          <td style="font-weight:700; color:${pctColor}">${pct}%</td>
        `;
        tbody.appendChild(tr);
      });
    });
  } else if (role === 'student' || role === 'parent') {
    studentSum.style.display = 'block';
    
    const studentId = role === 'student' ? currentUser.id : currentUser.studentId;
    const s = db.getStudentById(studentId);

    // Compute circular gauge metrics
    let total = 0;
    let attended = 0;
    Object.values(s.attendance).forEach(a => {
      total += a.total;
      attended += a.attended;
    });
    const pct = total > 0 ? Math.round((attended / total) * 100) : 100;
    const circle = document.getElementById('attendance-progress-ring');
    // circle radius = 40, circum = 251.2
    const offset = 251.2 - (251.2 * pct) / 100;
    circle.style.strokeDashoffset = offset;
    document.getElementById('attendance-total-pct').innerText = `${pct}%`;

    const statusComment = document.getElementById('attendance-status-comment');
    if (pct < 75) {
      circle.style.stroke = 'var(--danger)';
      statusComment.innerHTML = `<span style="color:var(--danger); font-weight:700;">Critical Alert:</span> Aggregate attendance is under 75% (${pct}%). Student will be barred from final mid-term exams unless attendance increases.`;
    } else {
      circle.style.stroke = 'var(--secondary)';
      statusComment.innerHTML = `<span style="color:var(--secondary); font-weight:700;">In compliance:</span> Aggregate attendance satisfies academic requirements (${pct}%). Keep it up!`;
    }

    header.innerHTML = `
      <th>Subject Code</th>
      <th>Subject Title</th>
      <th>Assigned Faculty</th>
      <th>Attended / Total Sessions</th>
      <th>Subject Percentage</th>
    `;

    db.getSubjectsForCourse(s.courseId, s.semester).forEach(sub => {
      const attRecord = s.attendance[sub.code] || { attended: 0, total: 0 };
      const sPct = attRecord.total > 0 ? Math.round((attRecord.attended / attRecord.total) * 100) : 100;
      const sPctColor = sPct < 75 ? 'var(--danger)' : 'var(--secondary)';

      const faculty = db.getFaculty().find(f => f.subjects.includes(sub.code));

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-weight:700;">${sub.code}</td>
        <td><strong>${sub.name}</strong></td>
        <td>${faculty ? faculty.name : 'Unknown Faculty'}</td>
        <td><strong>${attRecord.attended} / ${attRecord.total}</strong> classes</td>
        <td style="font-weight:700; color:${sPctColor}">${sPct}%</td>
      `;
      tbody.appendChild(tr);
    });
  }
}

function openMarkAttendanceModal() {
  const modal = document.getElementById('modal-mark-attendance');
  const subSelect = document.getElementById('att-subject-select');
  
  subSelect.innerHTML = '';
  
  const subjects = currentUser.role === 'faculty' ? currentUser.subjects : db.getSubjects().map(s => s.code);
  subjects.forEach(code => {
    subSelect.innerHTML += `<option value="${code}">${code}</option>`;
  });

  // Set default date to today
  document.getElementById('att-date').value = new Date().toISOString().split('T')[0];

  loadAttendanceFormStudents();
  openModal('modal-mark-attendance');
}

function loadAttendanceFormStudents() {
  const list = document.getElementById('attendance-form-list');
  const subCode = document.getElementById('att-subject-select').value;
  list.innerHTML = '';

  const subject = db.getSubjects().find(s => s.code === subCode);
  if (!subject) return;

  const students = db.getStudents().filter(s => s.courseId === subject.courseId);
  if (students.length === 0) {
    list.innerHTML = '<p style="color:var(--text-muted); font-size:0.85rem;">No students registered in this course program.</p>';
    return;
  }

  students.forEach(s => {
    const div = document.createElement('div');
    div.className = 'attendance-row-item';
    div.innerHTML = `
      <div class="attendance-student-details">
        <span class="attendance-st-name">${s.name}</span>
        <span class="attendance-st-roll">${s.rollNo}</span>
      </div>
      <div class="switch-container">
        <span class="switch-label absent" id="switch-lbl-${s.id}">Absent</span>
        <label class="switch">
          <input type="checkbox" id="att-check-${s.id}" checked onchange="toggleAttendanceSwitchLabel('${s.id}')">
          <span class="slider"></span>
        </label>
        <span class="switch-label present" id="switch-lbl-pres-${s.id}">Present</span>
      </div>
    `;
    list.appendChild(div);
  });
}

function toggleAttendanceSwitchLabel(studentId) {
  const chk = document.getElementById(`att-check-${studentId}`);
  const absentLbl = document.getElementById(`switch-lbl-${studentId}`);
  const presentLbl = document.getElementById(`switch-lbl-pres-${studentId}`);
  
  if (chk.checked) {
    absentLbl.style.opacity = '0.3';
    presentLbl.style.opacity = '1';
  } else {
    absentLbl.style.opacity = '1';
    presentLbl.style.opacity = '0.3';
  }
}

function submitAttendanceSheet() {
  const subCode = document.getElementById('att-subject-select').value;
  const subject = db.getSubjects().find(s => s.code === subCode);
  
  if (!subject) return;

  const students = db.getStudents().filter(s => s.courseId === subject.courseId);
  const attendanceMap = {};
  
  students.forEach(s => {
    const chk = document.getElementById(`att-check-${s.id}`);
    attendanceMap[s.id] = chk ? chk.checked : false;
  });

  db.recordAttendance(subject.courseId, subCode, attendanceMap);
  
  alert('Attendance register updated successfully!');
  closeModal('modal-mark-attendance');
  renderAttendanceModule();
}

// ==================== 7. EXAMINATION & RESULT RENDERER ====================

function renderResultsModule() {
  const actionDiv = document.getElementById('results-panel-action');
  const transcriptCard = document.getElementById('student-transcript-card');
  const adminCard = document.getElementById('admin-results-card');

  actionDiv.innerHTML = '';
  transcriptCard.style.display = 'none';
  adminCard.style.display = 'none';

  const role = currentUser.role;

  if (role === 'admin' || role === 'faculty') {
    adminCard.style.display = 'block';
    if (role === 'faculty') {
      actionDiv.innerHTML = `<button class="btn btn-primary" onclick="openEnterGradesModal()">Enter Exam Grades</button>`;
    }

    const tbody = document.getElementById('admin-results-tbody');
    tbody.innerHTML = '';

    db.getStudents().forEach(s => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-weight:700;">${s.rollNo}</td>
        <td><strong>${s.name}</strong></td>
        <td>${s.courseId} Sem ${s.semester}</td>
        <td>${s.grades.map(g => `<span class="badge badge-success" style="margin-right:4px;">${g.code}: ${g.grade}</span>`).join('') || 'None'}</td>
        <td>
          <button class="btn btn-outline btn-sm" onclick="openStudentDetailsModal('${s.id}')">Transcript</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } else if (role === 'student' || role === 'parent') {
    transcriptCard.style.display = 'block';

    const studentId = role === 'student' ? currentUser.id : currentUser.studentId;
    const s = db.getStudentById(studentId);

    const tbody = document.getElementById('transcript-tbody');
    tbody.innerHTML = '';

    // Render CGPA GP
    let totalGpa = 0;
    s.grades.forEach(g => totalGpa += g.gpa);
    const gpaVal = s.grades.length > 0 ? (totalGpa / s.grades.length).toFixed(2) : '0.00';
    document.getElementById('student-gpa-val').innerText = gpaVal;

    s.grades.forEach(g => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-weight:700;">${g.code}</td>
        <td><strong>${g.name}</strong></td>
        <td>Sem ${g.sem}</td>
        <td><strong>${g.marks}</strong> / 100</td>
        <td style="font-weight:700; color:var(--primary); font-size:1rem;">${g.grade}</td>
        <td>${g.gpa}</td>
      `;
      tbody.appendChild(tr);
    });

    if (s.grades.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:var(--text-muted);">No official grade records posted yet.</td></tr>`;
    }
  }
}

function openEnterGradesModal() {
  const modal = document.getElementById('modal-enter-grades');
  const studentSelect = document.getElementById('gr-student-select');

  studentSelect.innerHTML = '';
  
  db.getStudents().forEach(s => {
    studentSelect.innerHTML += `<option value="${s.id}">${s.name} (${s.rollNo})</option>`;
  });

  loadStudentGradeSubjectOptions();
  openModal('modal-enter-grades');
}

function loadStudentGradeSubjectOptions() {
  const studentId = document.getElementById('gr-student-select').value;
  const subSelect = document.getElementById('gr-subject-select');
  subSelect.innerHTML = '';

  const s = db.getStudentById(studentId);
  if (!s) return;

  const subjects = db.getSubjectsForCourse(s.courseId, s.semester);
  subjects.forEach(sub => {
    subSelect.innerHTML += `<option value="${sub.code}">${sub.code} - ${sub.name}</option>`;
  });
}

function submitGradeEntry() {
  const studentId = document.getElementById('gr-student-select').value;
  const subCode = document.getElementById('gr-subject-select').value;
  const marks = document.getElementById('gr-marks').value;

  const subject = db.getSubjects().find(s => s.code === subCode);

  if (!subject || !marks) {
    alert('Invalid inputs');
    return;
  }

  db.recordGrade(studentId, subCode, subject.name, subject.semester, marks);
  alert('Exam grade recorded successfully!');
  closeModal('modal-enter-grades');
  renderResultsModule();
}

// ==================== 8. FEE & TRANSACTION LEDGER RENDERER ====================

function renderFeesModule() {
  const tbody = document.getElementById('fees-tbody');
  const actionDiv = document.getElementById('fees-panel-action');
  
  tbody.innerHTML = '';
  actionDiv.innerHTML = '';

  const role = currentUser.role;

  // Render options based on role
  if (role === 'accountant') {
    actionDiv.innerHTML = `<button class="btn btn-primary" onclick="openCreateInvoiceModal()">+ Issue New Invoice</button>`;
  }

  const studentId = (role === 'student' || role === 'parent') ? 
    (role === 'student' ? currentUser.id : currentUser.studentId) : null;

  const invoices = studentId ? db.getInvoicesForStudent(studentId) : db.getInvoices();

  if (invoices.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:var(--text-muted);">No transaction logs recorded.</td></tr>`;
    return;
  }

  invoices.forEach(i => {
    const tr = document.createElement('tr');
    tr.className = 'animate-scale';
    
    // Status badges styling
    const badgeClass = i.status === 'Paid' ? 'badge-success' : 'badge-danger';
    
    // Actions block: Pay button or print button
    let actionBtn = '';
    if (i.status === 'Unpaid') {
      if (role === 'student' || role === 'parent') {
        actionBtn = `<button class="btn btn-primary btn-sm" onclick="openCheckoutGateway('${i.id}', ${i.amount}, '${i.type}')">Pay Invoice</button>`;
      } else {
        actionBtn = `<span style="font-size:0.8rem; color:var(--text-muted)">Awaiting Collection</span>`;
      }
    } else {
      actionBtn = `<button class="btn btn-outline btn-sm" onclick="openReceiptModal('${i.id}')">Print Receipt</button>`;
    }

    tr.innerHTML = `
      <td style="font-weight:700; color:var(--text-muted);">${i.id}</td>
      <td>
        <div style="font-weight:700; color:var(--text-main);">${i.type}</div>
        <div style="font-size:0.75rem; color:var(--text-muted);">${studentId ? '' : 'Student: ' + i.studentName}</div>
      </td>
      <td>Sem ${i.semester}</td>
      <td>${i.dueDate}</td>
      <td style="font-weight:700; color:var(--text-main);">$${i.amount}</td>
      <td><span class="badge ${badgeClass}">${i.status}</span></td>
      <td style="text-align: right;">${actionBtn}</td>
    `;
    tbody.appendChild(tr);
  });
}

function openCreateInvoiceModal() {
  const modal = document.getElementById('modal-create-invoice');
  const stSelect = document.getElementById('inv-student-select');

  stSelect.innerHTML = '';
  db.getStudents().forEach(s => {
    stSelect.innerHTML += `<option value="${s.id}">${s.name} (${s.rollNo})</option>`;
  });

  openModal('modal-create-invoice');
}

function submitCreateInvoice() {
  const studentId = document.getElementById('inv-student-select').value;
  const type = document.getElementById('inv-type').value;
  const semester = document.getElementById('inv-sem').value;
  const amount = document.getElementById('inv-amount').value;
  const dueDate = document.getElementById('inv-due').value;

  if (!amount || !dueDate) {
    alert('Please fill out amount and deadline.');
    return;
  }

  db.addInvoice({ studentId, type, semester, amount, dueDate });
  alert('Invoice created successfully!');
  closeModal('modal-create-invoice');
  renderFeesModule();
}

function openCheckoutGateway(invoiceId, amount, type) {
  tempCheckoutInvoiceId = invoiceId;
  
  document.getElementById('checkout-amount-lbl').innerText = `$${amount}`;
  document.getElementById('checkout-desc-lbl').innerText = type;

  openModal('modal-checkout');
}

function submitPaymentGateway(event) {
  event.preventDefault();

  if (!tempCheckoutInvoiceId) return;

  const inv = db.payInvoice(tempCheckoutInvoiceId, 'Credit Card');
  
  alert(`Payment of $${inv.amount} successful! Receipt created.`);
  closeModal('modal-checkout');
  
  // Directly open receipt print preview
  openReceiptModal(tempCheckoutInvoiceId);
  tempCheckoutInvoiceId = null;
  renderFeesModule();
}

function openReceiptModal(invoiceId) {
  const container = document.getElementById('receipt-modal-container');
  const inv = db.getInvoices().find(i => i.id === invoiceId);
  
  if (!inv) return;

  const s = db.getStudentById(inv.studentId);
  
  container.innerHTML = `
    <div class="receipt-wrapper">
      <div class="receipt-stamp">PAID</div>
      
      <div class="receipt-header">
        <h3 class="receipt-title">Payment Receipt</h3>
        <p class="receipt-school">EDUMAX METROPOLITAN UNIVERSITY</p>
      </div>

      <div class="receipt-row">
        <span class="receipt-row-label">Transaction ID</span>
        <span class="receipt-row-val">${inv.id}</span>
      </div>
      <div class="receipt-row">
        <span class="receipt-row-label">Student Name</span>
        <span class="receipt-row-val">${inv.studentName}</span>
      </div>
      <div class="receipt-row">
        <span class="receipt-row-label">Roll Number</span>
        <span class="receipt-row-val">${s ? s.rollNo : 'N/A'}</span>
      </div>
      <div class="receipt-row">
        <span class="receipt-row-label">Fee Details</span>
        <span class="receipt-row-val">${inv.type} (Sem ${inv.semester})</span>
      </div>
      <div class="receipt-row">
        <span class="receipt-row-label">Payment Date</span>
        <span class="receipt-row-val">${inv.paidDate}</span>
      </div>
      <div class="receipt-row">
        <span class="receipt-row-label">Method</span>
        <span class="receipt-row-val">${inv.paymentMethod}</span>
      </div>

      <div class="receipt-row total">
        <span class="receipt-row-label">Total Amount Paid</span>
        <span class="receipt-row-val">$${inv.amount}</span>
      </div>
    </div>
  `;

  openModal('modal-receipt');
}

// ==================== 9. LIBRARY CATALOG MODULE RENDERER ====================

function renderLibraryModule() {
  const tbody = document.getElementById('library-catalog-tbody');
  const circulationList = document.getElementById('library-issues-list');
  const actionDiv = document.getElementById('library-panel-action');
  
  tbody.innerHTML = '';
  circulationList.innerHTML = '';
  actionDiv.innerHTML = '';

  const role = currentUser.role;

  if (role === 'librarian') {
    actionDiv.innerHTML = `<button class="btn btn-primary" onclick="openIssueBookModal()">Check Out Book</button>`;
  }

  // 1. Catalog inventory
  db.getBooks().forEach(b => {
    const tr = document.createElement('tr');
    tr.className = 'animate-scale';
    
    const badgeClass = b.available > 0 ? 'badge-success' : 'badge-danger';
    const statusTxt = b.available > 0 ? 'In Stock' : 'Out of Stock';

    tr.innerHTML = `
      <td>
        <div style="font-weight:700; color:var(--text-main);">${b.title}</div>
        <div style="font-size:0.75rem; color:var(--text-muted);">${b.author}</div>
      </td>
      <td>${b.category}</td>
      <td>${b.qty}</td>
      <td><strong>${b.available}</strong></td>
      <td><span class="badge ${badgeClass}">${statusTxt}</span></td>
    `;
    tbody.appendChild(tr);
  });

  // 2. Circulation logs
  const studentId = (role === 'student' || role === 'parent') ? 
    (role === 'student' ? currentUser.id : currentUser.studentId) : null;

  const logs = studentId ? 
    db.getIssuedBooks().filter(i => i.studentId === studentId) : 
    db.getIssuedBooks();

  if (logs.length === 0) {
    circulationList.innerHTML = '<p style="text-align:center; color:var(--text-muted); font-size:0.85rem; padding: 20px 0;">No library circulation records.</p>';
    return;
  }

  logs.forEach(log => {
    const div = document.createElement('div');
    div.style.padding = '14px';
    div.style.backgroundColor = '#f8fafc';
    div.style.borderRadius = '8px';
    div.style.border = '1px solid var(--border-color)';
    div.style.borderLeft = '4px solid ' + (log.status === 'Overdue' ? 'var(--danger)' : (log.status === 'Returned' ? 'var(--secondary)' : 'var(--primary)'));

    let returnBtn = '';
    if (log.status !== 'Returned' && role === 'librarian') {
      returnBtn = `<button class="btn btn-outline btn-sm" style="margin-top:6px;" onclick="triggerLibraryReturn('${log.id}')">Return Book</button>`;
    }

    div.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:4px;">
        <span style="font-weight:700; font-size:0.88rem;">${log.bookTitle}</span>
        <span class="badge ${log.status === 'Returned' ? 'badge-success' : (log.status === 'Overdue' ? 'badge-danger' : 'badge-info')}">${log.status}</span>
      </div>
      <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:4px;">
        ${studentId ? '' : 'Borrower: ' + log.studentName + ' | '} Due: ${log.dueDate}
      </div>
      ${log.fine > 0 ? `<div style="font-size:0.75rem; color:var(--danger); font-weight:700;">Pending Fine: $${log.fine}</div>` : ''}
      ${log.returnDate ? `<div style="font-size:0.75rem; color:var(--text-light)">Returned on: ${log.returnDate}</div>` : ''}
      ${returnBtn}
    `;
    circulationList.appendChild(div);
  });
}

function openIssueBookModal() {
  const modal = document.getElementById('modal-issue-book');
  const bookSelect = document.getElementById('lib-book-select');
  const stSelect = document.getElementById('lib-student-select');

  bookSelect.innerHTML = '';
  db.getBooks().filter(b => b.available > 0).forEach(b => {
    bookSelect.innerHTML += `<option value="${b.id}">${b.title}</option>`;
  });

  stSelect.innerHTML = '';
  db.getStudents().forEach(s => {
    stSelect.innerHTML += `<option value="${s.id}">${s.name} (${s.rollNo})</option>`;
  });

  // Default due date: 14 days from now
  const due = new Date();
  due.setDate(due.getDate() + 14);
  document.getElementById('lib-due').value = due.toISOString().split('T')[0];

  openModal('modal-issue-book');
}

function submitIssueBook() {
  const bookId = document.getElementById('lib-book-select').value;
  const studentId = document.getElementById('lib-student-select').value;
  const dueDate = document.getElementById('lib-due').value;

  if (!bookId || !studentId || !dueDate) {
    alert('Please fill out all fields.');
    return;
  }

  const issue = db.issueBook(bookId, studentId, dueDate);
  if (issue) {
    alert('Circulation logged successfully!');
    closeModal('modal-issue-book');
    renderLibraryModule();
  } else {
    alert('Checkout failed. Stock availability zero.');
  }
}

function triggerLibraryReturn(issueId) {
  if (confirm('Verify return of book in catalog?')) {
    const log = db.returnBook(issueId);
    alert(`Book returned! Collected Fine: $${log.fine}`);
    renderLibraryModule();
  }
}

// ==================== 10. TIMETABLE MODULE RENDERER ====================

function renderTimetableModule() {
  const selectorGroup = document.getElementById('timetable-selector-group');
  const container = document.getElementById('timetable-container');

  selectorGroup.innerHTML = '';
  container.innerHTML = '';

  const role = currentUser.role;
  const studentId = (role === 'student' || role === 'parent') ? 
    (role === 'student' ? currentUser.id : currentUser.studentId) : null;

  if (studentId) {
    // Render student fixed class schedule directly
    const s = db.getStudentById(studentId);
    generateTimetableGrid(s.courseId, s.semester);
  } else {
    // Render dropdown selectors for other views
    selectorGroup.innerHTML = `
      <select id="tt-course-select" class="filter-select" onchange="triggerTimetableGridRender()">
        <!-- options -->
      </select>
      <select id="tt-sem-select" class="filter-select" onchange="triggerTimetableGridRender()">
        <option value="1">Semester 1</option>
        <option value="2" selected>Semester 2</option>
        <option value="3">Semester 3</option>
        <option value="4">Semester 4</option>
        <option value="5">Semester 5</option>
        <option value="6">Semester 6</option>
        <option value="7">Semester 7</option>
        <option value="8">Semester 8</option>
      </select>
    `;

    const courseSel = document.getElementById('tt-course-select');
    db.getCourses().forEach(c => {
      courseSel.innerHTML += `<option value="${c.id}">${c.name}</option>`;
    });

    triggerTimetableGridRender();
  }
}

function triggerTimetableGridRender() {
  const courseId = document.getElementById('tt-course-select').value;
  const sem = document.getElementById('tt-sem-select').value;
  generateTimetableGrid(courseId, sem);
}

function generateTimetableGrid(courseId, semester) {
  const container = document.getElementById('timetable-container');
  container.innerHTML = '';

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const gridData = db.getTimetable(courseId, semester);

  // Headers
  let html = `<div class="timetable-header-cell">Day / Period</div>`;
  for (let i = 1; i <= 5; i++) {
    html += `<div class="timetable-header-cell">Period ${i}</div>`;
  }

  // Row by day
  days.forEach(day => {
    html += `<div class="timetable-row">`;
    html += `<div class="timetable-day-header">${day}</div>`;

    for (let p = 1; p <= 5; p++) {
      const lecture = gridData && gridData[day] ? gridData[day].find(l => l.period === p) : null;
      if (lecture) {
        html += `
          <div class="timetable-cell">
            <span class="timetable-subject">${lecture.subject}</span>
            <span class="timetable-time">${lecture.time}</span>
            <span class="timetable-room">${lecture.room}</span>
            <span class="timetable-fac">${lecture.faculty}</span>
          </div>
        `;
      } else {
        html += `
          <div class="timetable-cell" style="background-color:#fafafa; opacity:0.6; align-items:center; justify-content:center;">
            <span style="font-size:0.75rem; color:#b2bec3;">Free Slot</span>
          </div>
        `;
      }
    }
    html += `</div>`;
  });

  container.innerHTML = html;
}

// ==================== 11. ANNOUNCEMENTS BULLETINS ====================

function renderAnnouncementsModule() {
  const actionDiv = document.getElementById('announcements-panel-action');
  const container = document.getElementById('announcements-full-list');

  actionDiv.innerHTML = '';
  container.innerHTML = '';

  const role = currentUser.role;
  if (role === 'admin' || role === 'faculty') {
    actionDiv.innerHTML = `<button class="btn btn-primary" onclick="openAddAnnouncementModal()">+ Publish Circular</button>`;
  }

  const annList = db.getAnnouncements();
  if (annList.length === 0) {
    container.innerHTML = '<p style="text-align:center; color:var(--text-muted); font-size:0.85rem; padding: 40px 0;">No university announcements published yet.</p>';
    return;
  }

  annList.forEach(c => {
    const div = document.createElement('div');
    const categoryClass = c.category ? c.category.toLowerCase() : 'general';
    div.className = `announcement-item ${categoryClass} animate-scale`;
    div.innerHTML = `
      <div class="announce-header">
        <span class="announce-title" style="font-size:1.05rem;" onclick="openAnnouncementDetailsModal('${c.id}')">${c.title}</span>
        <span class="announce-date">${c.date}</span>
      </div>
      <p style="font-size:0.88rem; color:var(--text-muted); line-height:1.5; margin: 8px 0;">${c.content}</p>
      <div class="announce-author">Published by: <strong>${c.author}</strong> | Tag: <span class="badge ${c.category === 'Academic' ? 'badge-info' : (c.category === 'Financial' ? 'badge-warning' : 'badge-success')}">${c.category}</span></div>
    `;
    container.appendChild(div);
  });
}

function openAddAnnouncementModal() {
  document.getElementById('ann-title-in').value = '';
  document.getElementById('ann-content-in').value = '';
  openModal('modal-add-announcement');
}

function submitAnnouncement() {
  const title = document.getElementById('ann-title-in').value.trim();
  const category = document.getElementById('ann-cat-in').value;
  const content = document.getElementById('ann-content-in').value.trim();

  if (!title || !content) {
    alert('Heading and description cannot be empty.');
    return;
  }

  db.addAnnouncement({ title, category, content, author: currentUser.name });
  alert('Circular posted on ERP system!');
  closeModal('modal-add-announcement');
  renderAnnouncementsModule();
}

function openAnnouncementDetailsModal(annId) {
  const a = db.getAnnouncements().find(x => x.id === annId);
  if (!a) return;

  const title = document.getElementById('ann-modal-title');
  const body = document.getElementById('ann-modal-body');

  title.innerText = a.title;
  body.innerHTML = `
    <div style="font-size:0.75rem; color:var(--text-light); margin-bottom:12px;">Published Date: ${a.date} | Publisher: ${a.author}</div>
    <p style="font-size:0.92rem; color:var(--text-main); line-height:1.6; white-space:pre-wrap;">${a.content}</p>
  `;

  openModal('modal-announcement');
}

// ==================== 12. REPORTS & ANALYTICS MODULE ====================

function renderReportsModule() {
  document.getElementById('analytics-result-card').style.display = 'none';
}

function generateReport(type) {
  const card = document.getElementById('analytics-result-card');
  const title = document.getElementById('analytics-result-title');
  const body = document.getElementById('analytics-result-body');

  card.style.display = 'block';
  body.innerHTML = '';

  if (type === 'attendance') {
    title.innerText = 'Attendance Audit Analytics';
    
    // Average attendance by student list
    const list = db.getStudents().map(s => {
      let total = 0;
      let attended = 0;
      Object.values(s.attendance).forEach(a => {
        total += a.total;
        attended += a.attended;
      });
      const pct = total > 0 ? Math.round((attended / total) * 100) : 100;
      return { roll: s.rollNo, name: s.name, pct };
    });

    body.innerHTML = `
      <h3 style="font-size:1.1rem; margin-bottom:12px;">Student Compliance Logs (Under 75% Highlighted)</h3>
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Roll Number</th>
              <th>Student Name</th>
              <th>Compliance Status</th>
              <th>Attendance Rate</th>
            </tr>
          </thead>
          <tbody>
            ${list.map(l => `
              <tr style="${l.pct < 75 ? 'background-color:#fff1f2;' : ''}">
                <td>${l.roll}</td>
                <td><strong>${l.name}</strong></td>
                <td><span class="badge ${l.pct < 75 ? 'badge-danger' : 'badge-success'}">${l.pct < 75 ? 'DEBARRED WARNING' : 'COMPLIANT'}</span></td>
                <td style="font-weight:700; color:${l.pct < 75 ? 'var(--danger)' : 'var(--secondary)'}">${l.pct}%</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  } else if (type === 'grading') {
    title.innerText = 'Examinations Performance Distribution';
    
    // average GPA calculations
    const list = db.getStudents().map(s => {
      let sum = 0;
      s.grades.forEach(g => sum += g.gpa);
      const avg = s.grades.length > 0 ? (sum / s.grades.length).toFixed(2) : '0.00';
      return { roll: s.rollNo, name: s.name, course: s.courseId, avg };
    });

    body.innerHTML = `
      <h3 style="font-size:1.1rem; margin-bottom:12px;">Cumulative GPA Roster</h3>
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Roll</th>
              <th>Student Name</th>
              <th>Course Program</th>
              <th>Cumulative GPA</th>
            </tr>
          </thead>
          <tbody>
            ${list.map(l => `
              <tr>
                <td>${l.roll}</td>
                <td>${l.name}</td>
                <td>${l.course}</td>
                <td style="font-weight:800; color:var(--primary); font-size:1rem;">${l.avg}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  } else if (type === 'finances') {
    title.innerText = 'Financial Receivables Ledger Audit';

    const invoices = db.getInvoices();
    let totalAmt = 0;
    let paidAmt = 0;
    let unpaidAmt = 0;

    invoices.forEach(i => {
      totalAmt += i.amount;
      if (i.status === 'Paid') paidAmt += i.amount;
      else unpaidAmt += i.amount;
    });

    body.innerHTML = `
      <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:16px; margin-bottom:24px;">
        <div style="background-color:#f1f5f9; padding:16px; border-radius:8px;">
          <div style="font-size:0.75rem; color:var(--text-muted)">Total Receivables Issued</div>
          <div style="font-size:1.3rem; font-weight:800;">$${totalAmt}</div>
        </div>
        <div style="background-color:var(--secondary-glow); padding:16px; border-radius:8px;">
          <div style="font-size:0.75rem; color:var(--secondary)">Collected Cashflow</div>
          <div style="font-size:1.3rem; font-weight:800; color:var(--secondary);">$${paidAmt}</div>
        </div>
        <div style="background-color:var(--danger-glow); padding:16px; border-radius:8px;">
          <div style="font-size:0.75rem; color:var(--danger)">Pending Collectibles</div>
          <div style="font-size:1.3rem; font-weight:800; color:var(--danger);">$${unpaidAmt}</div>
        </div>
      </div>

      <h3 style="font-size:1.1rem; margin-bottom:12px;">All System Invoices Transaction Log</h3>
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Student Name</th>
              <th>Fee Category</th>
              <th>Amount</th>
              <th>Payment Status</th>
              <th>Log Date</th>
            </tr>
          </thead>
          <tbody>
            ${invoices.map(i => `
              <tr>
                <td>${i.id}</td>
                <td><strong>${i.studentName}</strong></td>
                <td>${i.type}</td>
                <td>$${i.amount}</td>
                <td><span class="badge ${i.status === 'Paid' ? 'badge-success' : 'badge-danger'}">${i.status}</span></td>
                <td>${i.status === 'Paid' ? i.paidDate : 'Awaiting Payment'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // Set export button listener
  document.getElementById('btn-export-excel').onclick = () => downloadReportExcel(type);

  // Scroll to results
  card.scrollIntoView({ behavior: 'smooth' });
}

// ==================== GLOBAL ACTIONS ====================

function handleGlobalSearch(event) {
  const val = event.target.value.toLowerCase().trim();
  if (!val) return;

  // Search through students, courses
  if (activeView === 'directory') {
    document.getElementById('student-search-input').value = val;
    renderStudentDirectory();
  }
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('active');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}

function deleteStudentRoster(id) {
  if (confirm("Are you sure you want to permanently delete this student record, along with their fee invoices and library circulation logs?")) {
    db.deleteStudent(id);
    alert("Student record deleted successfully.");
    renderStudentDirectory();
  }
}

function deleteFacultyRoster(id) {
  if (confirm("Are you sure you want to permanently delete this faculty profile?")) {
    db.deleteFaculty(id);
    alert("Faculty profile deleted successfully.");
    renderFacultyDirectory();
  }
}

function downloadReportExcel(type) {
  let csvContent = "";
  let fileName = "";
  
  if (type === 'attendance') {
    fileName = "Attendance_Audit_Report.csv";
    csvContent = "Roll Number,Student Name,Compliance Status,Attendance Rate\n";
    
    const list = db.getStudents().map(s => {
      let total = 0;
      let attended = 0;
      Object.values(s.attendance).forEach(a => {
        total += a.total;
        attended += a.attended;
      });
      const pct = total > 0 ? Math.round((attended / total) * 100) : 100;
      return { roll: s.rollNo, name: s.name, status: pct < 75 ? 'DEBARRED WARNING' : 'COMPLIANT', pct: `${pct}%` };
    });

    list.forEach(item => {
      csvContent += `"${item.roll}","${item.name.replace(/"/g, '""')}","${item.status}","${item.pct}"\n`;
    });
  } else if (type === 'grading') {
    fileName = "Grading_Performance_Report.csv";
    csvContent = "Roll Number,Student Name,Course Program,Cumulative GPA\n";

    const list = db.getStudents().map(s => {
      let sum = 0;
      s.grades.forEach(g => sum += g.gpa);
      const avg = s.grades.length > 0 ? (sum / s.grades.length).toFixed(2) : '0.00';
      return { roll: s.rollNo, name: s.name, course: s.courseId, avg };
    });

    list.forEach(item => {
      csvContent += `"${item.roll}","${item.name.replace(/"/g, '""')}","${item.course}","${item.avg}"\n`;
    });
  } else if (type === 'finances') {
    fileName = "Financial_Receivables_Ledger_Report.csv";
    csvContent = "Invoice ID,Student Name,Fee Category,Amount,Payment Status,Log Date\n";

    const invoices = db.getInvoices();
    invoices.forEach(i => {
      const logDate = i.status === 'Paid' ? i.paidDate : 'Awaiting Payment';
      csvContent += `"${i.id}","${i.studentName.replace(/"/g, '""')}","${i.type}","$${i.amount}","${i.status}","${logDate}"\n`;
    });
  }

  // Trigger file download in browser
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  if (navigator.msSaveBlob) { // IE 10+
    navigator.msSaveBlob(blob, fileName);
  } else {
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", fileName);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}

// ==================== 12. ENROLLED COURSES MODULE RENDERER ====================

function renderEnrolledCoursesModule() {
  const role = currentUser.role;
  const selectorBar = document.getElementById('enrolled-student-selector-bar');
  const studentSelect = document.getElementById('enrolled-student-select');

  if (role === 'admin' || role === 'faculty') {
    selectorBar.style.display = 'block';
    
    // Populate students dropdown
    const students = db.getStudents();
    studentSelect.innerHTML = '';
    
    if (students.length === 0) {
      studentSelect.innerHTML = '<option value="">No registered students found</option>';
      document.getElementById('enrolled-courses-grid').innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
          Please enroll or admit students in the system first.
        </div>
      `;
      return;
    }

    students.forEach(s => {
      studentSelect.innerHTML += `<option value="${s.id}">${s.name} (${s.rollNo}) - Sem ${s.semester}</option>`;
    });

    renderEnrolledCoursesForSelectedStudent();
  } else {
    // Student or parent role
    selectorBar.style.display = 'none';
    const targetStudentId = role === 'student' ? currentUser.id : currentUser.studentId;
    const student = db.getStudentById(targetStudentId);
    
    if (student) {
      renderEnrolledList(student);
    } else {
      document.getElementById('enrolled-courses-grid').innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
          Student record could not be found.
        </div>
      `;
    }
  }
}

function renderEnrolledCoursesForSelectedStudent() {
  const studentId = document.getElementById('enrolled-student-select').value;
  if (!studentId) return;
  const student = db.getStudentById(studentId);
  if (student) {
    renderEnrolledList(student);
  }
}

function renderEnrolledList(student) {
  const grid = document.getElementById('enrolled-courses-grid');
  grid.innerHTML = '';

  let subjects = [];
  if (student.selectedCourses && student.selectedCourses.length > 0) {
    // Load dynamically registered custom course list
    const allSubjects = db.getSubjects();
    subjects = student.selectedCourses.map(code => allSubjects.find(s => s.code === code)).filter(Boolean);
  } else {
    // Fallback to default semester mappings
    subjects = db.getSubjectsForCourse(student.courseId, student.semester);
  }

  if (subjects.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted); background: white; border-radius: 8px; border: 1px dashed var(--border-color);">
        No active course enrollments registered. Select courses first from the registration portal.
      </div>
    `;
    return;
  }

  subjects.forEach(sub => {
    // Attendance rates calculations
    let attended = 0;
    let total = 0;
    if (student.attendance && student.attendance[sub.code]) {
      attended = student.attendance[sub.code].attended;
      total = student.attendance[sub.code].total;
    }
    const attendanceRate = total > 0 ? Math.round((attended / total) * 100) : 100;
    
    // Status Badge check
    let badgeClass = 'badge-success';
    let statusText = 'Excellent';
    if (attendanceRate < 75) {
      badgeClass = 'badge-danger';
      statusText = 'Attendance Risk';
    } else if (attendanceRate < 85) {
      badgeClass = 'badge-warning';
      statusText = 'Borderline';
    }

    // Grade entry lookup
    const gradeRecord = student.grades ? student.grades.find(g => g.code === sub.code) : null;
    const gradeVal = gradeRecord ? `${gradeRecord.grade} (${gradeRecord.marks} Marks)` : 'Not Yet Graded';

    const card = document.createElement('div');
    card.className = 'dashboard-card';
    card.style.display = 'flex';
    card.style.flexDirection = 'column';
    card.style.justifyContent = 'space-between';
    card.style.padding = '20px';
    card.style.borderLeft = `5px solid ${attendanceRate < 75 ? 'var(--danger)' : 'var(--primary)'}`;

    card.innerHTML = `
      <div>
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
          <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--text-muted);">${sub.code}</span>
          <span class="badge ${badgeClass}">${statusText}</span>
        </div>
        <h3 style="font-size: 1.1rem; font-weight: 800; color: var(--text-main); margin-bottom: 6px; line-height: 1.3;">${sub.name}</h3>
        <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 16px;">Credits: ${sub.credits} Units</p>
      </div>

      <div style="border-top: 1px solid var(--border-color); padding-top: 14px; margin-top: 10px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
        <div>
          <span style="font-size: 0.7rem; text-transform: uppercase; color: var(--text-light); display: block; margin-bottom: 2px;">Attendance</span>
          <span style="font-weight: 800; font-size: 1rem; color: ${attendanceRate < 75 ? 'var(--danger)' : 'var(--text-main)'}">${attendanceRate}%</span>
          <span style="font-size: 0.7rem; color: var(--text-muted); display: block;">(${attended}/${total} classes)</span>
        </div>
        <div>
          <span style="font-size: 0.7rem; text-transform: uppercase; color: var(--text-light); display: block; margin-bottom: 2px;">Term Grade</span>
          <span style="font-weight: 800; font-size: 0.92rem; color: var(--text-main);">${gradeVal}</span>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// ==================== 13. SELF-SERVICE COURSE SELECTION MODULE RENDERER ====================

function renderCourseSelectionModule() {
  const tbody = document.getElementById('course-selection-tbody');
  tbody.innerHTML = '';

  const role = currentUser.role;
  const targetStudentId = (role === 'student') ? currentUser.id : (role === 'parent' ? currentUser.studentId : null);

  if (!targetStudentId) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" style="text-align: center; color: var(--text-muted); padding: 30px;">
          Note: Course Registration/Selection portal is only available when logged in as a Student or Parent.
        </td>
      </tr>
    `;
    document.getElementById('selection-status-label').innerText = 'Access Restricted';
    return;
  }

  // Update panel descriptive subtitle to offer dynamic template presets
  const subtitle = document.querySelector('#panel-select-courses .panel-subtitle');
  if (subtitle && !document.getElementById('auto-preset-btn')) {
    subtitle.innerHTML = `
      Select up to 10 course subjects to enroll in for your current active semester.
      <button id="auto-preset-btn" class="btn btn-outline btn-sm" style="margin-left: 12px; padding: 4px 10px; font-size: 0.75rem; vertical-align: middle;" onclick="autoSelectCoreTenPreset()">
        ✨ Auto-Select 10 Core Courses
      </button>
    `;
  }

  const student = db.getStudentById(targetStudentId);
  if (!student) return;

  // Fetch all course subjects mapped to this student's specific degree course
  const subjects = db.getSubjects().filter(s => s.courseId === student.courseId);

  if (subjects.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" style="text-align: center; color: var(--text-muted); padding: 30px;">
          No registration subjects mapped to program ${student.courseId}.
        </td>
      </tr>
    `;
    return;
  }

  // Pre-load already selected courses
  const selected = student.selectedCourses || [];

  subjects.forEach(sub => {
    const isChecked = selected.includes(sub.code) ? 'checked' : '';
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="text-align: center;">
        <input type="checkbox" class="course-select-cb" value="${sub.code}" ${isChecked} onchange="updateCourseSelectionCounter()">
      </td>
      <td><strong>${sub.code}</strong></td>
      <td>
        <div style="font-weight: 700; color: var(--text-main);">${sub.name}</div>
        <div style="font-size: 0.72rem; color: var(--text-muted);">Semester ${sub.semester}</div>
      </td>
      <td>${sub.credits} Credits</td>
    `;
    tbody.appendChild(tr);
  });

  updateCourseSelectionCounter();
}

function updateCourseSelectionCounter() {
  const checkboxes = document.querySelectorAll('.course-select-cb:checked');
  const count = checkboxes.length;
  const label = document.getElementById('selection-status-label');
  
  label.innerText = `Courses Selected: ${count} / 10`;
  
  if (count > 10) {
    label.style.color = 'var(--danger)';
    label.innerText += ' (Exceeded limit of 10!)';
  } else {
    label.style.color = 'var(--text-main)';
  }
}

function submitCourseEnrollmentSelection() {
  const role = currentUser.role;
  const targetStudentId = (role === 'student') ? currentUser.id : (role === 'parent' ? currentUser.studentId : null);

  if (!targetStudentId) {
    alert('Invalid Session. Login as a student to register.');
    return;
  }

  const checkboxes = document.querySelectorAll('.course-select-cb:checked');
  const selectedCodes = Array.from(checkboxes).map(cb => cb.value);

  if (selectedCodes.length === 0) {
    alert('Please select at least 1 course subject to proceed.');
    return;
  }

  if (selectedCodes.length > 10) {
    alert('Registration Failed: You cannot select more than 10 courses/subjects.');
    return;
  }

  const success = db.registerStudentSelectedCourses(targetStudentId, selectedCodes);
  if (success) {
    alert('Course Registration Updated Successfully!');
    showModule('enrolled');
  } else {
    alert('An error occurred during registration. Please try again.');
  }
}

function autoSelectCoreTenPreset() {
  const checkboxes = document.querySelectorAll('.course-select-cb');
  const targetSubjects = [
    'Programming in C',
    'Programming in C++',
    'Object-Oriented Programming (OOP)',
    'Programming in Java',
    'Data Structures and Algorithms',
    'Programming in Python',
    'Web Development (HTML, CSS & JavaScript)',
    'Database Management System (DBMS)',
    'Software Engineering',
    'Mobile Application Development (Android)'
  ];

  let selectCount = 0;
  checkboxes.forEach(cb => {
    const labelRow = cb.closest('tr');
    if (labelRow) {
      const subjectNameText = labelRow.querySelector('td:nth-child(3) div').innerText.trim();
      if (targetSubjects.includes(subjectNameText)) {
        cb.checked = true;
        selectCount++;
      } else {
        cb.checked = false;
      }
    }
  });

  updateCourseSelectionCounter();
  alert(`Auto-selected ${selectCount} core courses. Click "Confirm Registration" to save.`);
}



