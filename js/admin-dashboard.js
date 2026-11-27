(function() {
  // ---------- Authentication Check ----------
  const userRole = sessionStorage.getItem('bright_user_role');
  const identifier = sessionStorage.getItem('bright_user_identifier');
  if (userRole !== 'admin' || !identifier || identifier === 'N/A') {
    window.location.href = 'admin-login.html';
    return;
  }

  // ---------- Helper ----------
  const safeSet = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };

  // ---------- Date ----------
  const now = new Date();
  document.getElementById('topbarDate').textContent = now.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  // ---------- Sidebar Navigation (event delegation) ----------
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const menuToggle = document.getElementById('menuToggle');
  const sections = document.querySelectorAll('.dash-section');
  const sidebarNav = document.querySelector('.sidebar-nav');

  function showSection(sectionId) {
    sections.forEach(s => s.classList.remove('active'));
    const target = document.getElementById('section-' + sectionId);
    if (target) target.classList.add('active');
    sidebarNav.querySelectorAll('a[data-section]').forEach(l => l.classList.remove('active'));
    const activeLink = sidebarNav.querySelector(`a[data-section="${sectionId}"]`);
    if (activeLink) activeLink.classList.add('active');
    closeSidebar();
  }

  function closeSidebar() { sidebar.classList.remove('open'); overlay.style.display = 'none'; }
  function openSidebar() { sidebar.classList.add('open'); overlay.style.display = 'block'; }

  sidebarNav.addEventListener('click', (e) => {
    const link = e.target.closest('a[data-section]');
    if (!link) return;
    e.preventDefault();
    showSection(link.getAttribute('data-section'));
  });

  menuToggle.addEventListener('click', openSidebar);
  overlay.addEventListener('click', closeSidebar);

  // ---------- Logout ----------
  document.getElementById('logoutBtn').addEventListener('click', function(e) {
    e.preventDefault();
    sessionStorage.clear();
    localStorage.removeItem('bright_admin_remember');
    window.location.href = 'admin-login.html';
  });

  // ---------- Responsive sidebar resize ----------
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024) {
      sidebar.classList.remove('open');
      overlay.style.display = 'none';
    }
  });

  // ========== MOCK DATA ==========

  // Students
  const students = [
    { id: 1, name: 'Chidinma Okonkwo', class: 'JSS 1A', admission: 'BISS/2020/1001' },
    { id: 2, name: 'Emeka Nwosu', class: 'JSS 2A', admission: 'BISS/2019/1002' },
    { id: 3, name: 'Amina Bello', class: 'SS 1 Science', admission: 'BISS/2018/1003' },
    { id: 4, name: 'David Ibrahim', class: 'SS 2 Science', admission: 'BISS/2017/1004' },
    { id: 5, name: 'Blessing Yusuf', class: 'JSS 1A', admission: 'BISS/2020/1005' },
  ];

  const studentTableBody = document.getElementById('studentTableBody');
  if (studentTableBody) {
    students.forEach(s => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${s.id}</td>
        <td>${s.name}</td>
        <td>${s.class}</td>
        <td>${s.admission}</td>
        <td>
          <span class="action-link" onclick="alert('View student')">View</span>
          <span class="action-link" onclick="alert('Edit student')">Edit</span>
          <span class="action-link" style="color:#EF4444" onclick="alert('Delete student')">Delete</span>
        </td>
      `;
      studentTableBody.appendChild(row);
    });
  }

  // Student search
  const studentSearch = document.getElementById('studentSearch');
  if (studentSearch) {
    studentSearch.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      studentTableBody.querySelectorAll('tr').forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(query) ? '' : 'none';
      });
    });
  }

  // Teachers
  const teachers = [
    { id: 'T001', name: 'Mr. Okonkwo', department: 'Science', subject: 'Mathematics' },
    { id: 'T002', name: 'Mrs. Adeyemi', department: 'Arts', subject: 'English' },
    { id: 'T003', name: 'Mr. Ibrahim', department: 'Science', subject: 'Physics' },
    { id: 'T004', name: 'Dr. Eze', department: 'Science', subject: 'Biology' },
  ];

  const teacherTableBody = document.getElementById('teacherTableBody');
  if (teacherTableBody) {
    teachers.forEach(t => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${t.id}</td>
        <td>${t.name}</td>
        <td>${t.department}</td>
        <td>${t.subject}</td>
        <td>
          <span class="action-link" onclick="alert('View teacher')">View</span>
          <span class="action-link" onclick="alert('Edit teacher')">Edit</span>
          <span class="action-link" style="color:#EF4444" onclick="alert('Delete teacher')">Delete</span>
        </td>
      `;
      teacherTableBody.appendChild(row);
    });
  }

  const teacherSearch = document.getElementById('teacherSearch');
  if (teacherSearch) {
    teacherSearch.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      teacherTableBody.querySelectorAll('tr').forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(query) ? '' : 'none';
      });
    });
  }

  // Classes
  const classesGrid = document.getElementById('classesGrid');
  if (classesGrid) {
    const classList = ['JSS 1A', 'JSS 2A', 'SS 1 Science', 'SS 2 Science'];
    classList.forEach(cls => {
      const card = document.createElement('div');
      card.className = 'class-card-admin';
      card.innerHTML = `
        <h3>${cls}</h3>
        <p>Students: 22</p>
        <p>Teacher: Mr. Okonkwo</p>
        <select class="assign-teacher-select">
          <option>Assign Teacher</option>
          <option>Mr. Okonkwo</option>
          <option>Mrs. Adeyemi</option>
          <option>Mr. Ibrahim</option>
          <option>Dr. Eze</option>
        </select>
      `;
      classesGrid.appendChild(card);
    });
  }

  // Assignments overview
  const assignmentsList = document.getElementById('assignmentsList');
  if (assignmentsList) {
    const assignments = JSON.parse(localStorage.getItem('bright_assignments') || '[]');
    if (assignments.length === 0) {
      assignmentsList.innerHTML = '<p style="color:var(--text-secondary)">No assignments posted yet.</p>';
    } else {
      assignments.forEach(a => {
        const card = document.createElement('div');
        card.className = 'assignment-admin-card';
        card.innerHTML = `
          <h4>${a.title}</h4>
          <p>${a.class} – Due ${a.dueDate} | Teacher: ${a.teacher}</p>
        `;
        assignmentsList.appendChild(card);
      });
    }
  }

  // Announcements
  const announcementsListAdmin = document.getElementById('announcementsListAdmin');
  if (announcementsListAdmin) {
    const announcements = [
      { title: 'Exam Schedule Released', body: 'End‑of‑term exams begin June 20th.', date: 'Jun 1, 2027' },
      { title: 'Mid‑Term Break', body: 'June 5–7. Classes resume June 8.', date: 'May 28, 2027' },
      { title: 'Sports Day', body: 'Inter‑house sports on Saturday, June 10.', date: 'May 15, 2027' },
    ];
    announcements.forEach(a => {
      const card = document.createElement('div');
      card.className = 'announcement-admin-card';
      card.innerHTML = `
        <h4>${a.title} <span style="font-weight:400;font-size:0.8rem;color:var(--text-tertiary)">${a.date}</span></h4>
        <p>${a.body}</p>
        <span class="action-link" onclick="alert('Edit announcement')">Edit</span>
        <span class="action-link" style="color:#EF4444" onclick="alert('Delete announcement')">Delete</span>
      `;
      announcementsListAdmin.appendChild(card);
    });
  }

  // Quick action buttons (just demo alerts)
  document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      alert('This feature will be available in the full system.');
    });
  });

    // ---------- Notification Dropdown ----------
  const notificationBtn = document.getElementById('notificationBtn');
  const notificationDropdown = document.getElementById('notificationDropdown');
  const notificationWrapper = document.getElementById('notificationWrapper');
  const markReadBtn = document.getElementById('markReadBtn');
  const notificationBadge = document.getElementById('notificationBadge');

  if (notificationBtn && notificationDropdown) {
    notificationBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      notificationDropdown.style.display =
        notificationDropdown.style.display === 'block' ? 'none' : 'block';
    });

    document.addEventListener('click', (e) => {
      if (notificationWrapper && !notificationWrapper.contains(e.target)) {
        notificationDropdown.style.display = 'none';
      }
    });
  }

  if (markReadBtn && notificationBadge) {
    markReadBtn.addEventListener('click', () => {
      notificationBadge.textContent = '0';            // still set to 0, but hidden by CSS
      notificationBadge.setAttribute('data-count', '0');  // triggers the CSS hide
      document.querySelectorAll('.notification-item.unread').forEach(item => {
        item.classList.remove('unread');
      });
      notificationDropdown.style.display = 'none';
    });
  }
})();