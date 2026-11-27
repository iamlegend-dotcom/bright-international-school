(function() {
  // ---------- Retrieve stored teacher data ----------
  const userRole = sessionStorage.getItem('bright_user_role');
  const identifier = sessionStorage.getItem('bright_user_identifier') || 'N/A';

  if (userRole !== 'teacher' || !identifier || identifier === 'N/A') {
    window.location.href = 'login.html';
    return;
  }

  // ---------- Helper ----------
  const safeSet = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };

  // ---------- Generate teacher name (mock) ----------
  const STORED_NAME_KEY = 'bright_teacher_name';
  let teacherName = sessionStorage.getItem(STORED_NAME_KEY);
  if (!teacherName) {
    const first = ['Mr.', 'Mrs.', 'Dr.'];
    const last = ['Okonkwo', 'Adeyemi', 'Ibrahim', 'Nwosu'];
    const randomFirst = first[Math.floor(Math.random() * first.length)];
    const randomLast = last[Math.floor(Math.random() * last.length)];
    teacherName = `${randomFirst} ${randomLast}`;
    sessionStorage.setItem(STORED_NAME_KEY, teacherName);
  }
  const displayName = teacherName;

  // ---------- Populate UI ----------
  safeSet('displayName', displayName);
  safeSet('userAvatar', displayName.charAt(0).toUpperCase());
  safeSet('topbarWelcomeName', displayName);
  safeSet('heroTeacherName', displayName);
  safeSet('profileFullName', displayName);
  safeSet('profileStaffId', identifier);
  safeSet('infoFullName', displayName);
  safeSet('infoStaffId', identifier);

  const now = new Date();
  document.getElementById('currentDate').textContent = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  document.getElementById('topbarDate').textContent = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  // ---------- Sidebar navigation ----------
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.querySelectorAll('.sidebar-nav a[data-section]');
  const sections = document.querySelectorAll('.dash-section');

  function showSection(sectionId) {
    sections.forEach(s => s.classList.remove('active'));
    document.getElementById('section-' + sectionId)?.classList.add('active');
    navLinks.forEach(l => l.classList.remove('active'));
    document.querySelector(`.sidebar-nav a[data-section="${sectionId}"]`)?.classList.add('active');
    closeSidebar();
  }
  function closeSidebar() { sidebar.classList.remove('open'); overlay.style.display = 'none'; }
  function openSidebar() { sidebar.classList.add('open'); overlay.style.display = 'block'; }

  navLinks.forEach(link => link.addEventListener('click', function(e) {
    e.preventDefault();
    showSection(this.getAttribute('data-section'));
  }));
  menuToggle.addEventListener('click', openSidebar);
  overlay.addEventListener('click', closeSidebar);

  // ---------- Logout ----------
  document.getElementById('logoutBtn').addEventListener('click', function(e) {
    e.preventDefault();
    sessionStorage.clear();
    localStorage.removeItem('bright_remembered_login');
    window.location.href = 'login.html';
  });

  // ---------- Students page: generate mock student cards ----------
  const studentNames = ['Chidinma O.', 'Emeka N.', 'Amina B.', 'David E.', 'Blessing I.', 'Tolu Y.', 'Zainab U.', 'Obinna K.'];
  const studentClasses = ['JSS 1A', 'JSS 2A', 'SS 1 Science', 'SS 2 Science'];
  const studentsGrid = document.getElementById('studentsGrid');
  if (studentsGrid) {
    studentNames.forEach((name, i) => {
      const studentClass = studentClasses[i % studentClasses.length];
      const admission = 'BISS/' + (2020 + i) + '/' + (1000 + i);
      const status = Math.random() > 0.2 ? 'present' : 'absent';
      const card = document.createElement('div');
      card.className = 'student-card';
      card.innerHTML = `
        <div class="student-avatar">${name.charAt(0)}</div>
        <div class="student-info">
          <div class="student-name">${name}</div>
          <div class="student-admission" style="font-size:0.8rem;color:var(--text-tertiary);">${admission}</div>
          <div class="student-class">${studentClass}</div>
        </div>
        <span class="attendance-status ${status}">${status === 'present' ? 'Present' : 'Absent'}</span>
      `;
      studentsGrid.appendChild(card);
    });
  }

  // Student search & sort
  const searchInput = document.getElementById('studentSearch');
  const sortSelect = document.getElementById('studentSort');
  if (searchInput && sortSelect) {
    searchInput.addEventListener('input', filterStudents);
    sortSelect.addEventListener('change', filterStudents);
  }
  function filterStudents() {
    const query = searchInput.value.toLowerCase();
    const cards = [...document.querySelectorAll('.student-card')];
    cards.forEach(card => {
      const name = card.querySelector('.student-name').textContent.toLowerCase();
      const admission = card.querySelector('.student-admission').textContent.toLowerCase();
      card.style.display = (name.includes(query) || admission.includes(query)) ? 'flex' : 'none';
    });
  }

  // Announcements filter
  document.querySelectorAll('.ann-filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.ann-filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const filter = this.getAttribute('data-filter');
      document.querySelectorAll('.ann-card').forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Highlight today's day in timetable
  const todayDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  document.querySelectorAll('.day-card[data-day]').forEach(card => {
    if (card.getAttribute('data-day') === todayDay) {
      card.style.border = '2px solid var(--accent)';
    }
  });


  // ---------- Assignment Form – Save to localStorage ----------
  const assignmentForm = document.getElementById('assignmentForm');
  if (assignmentForm) {
    assignmentForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const title = assignmentForm.querySelector('input[type="text"]').value.trim();
      const className = assignmentForm.querySelector('select').value;
      const instructions = assignmentForm.querySelector('textarea').value.trim();
      const dueDate = assignmentForm.querySelector('input[type="date"]').value;

      if (!title || !dueDate) {
        alert('Please fill in the title and due date.');
        return;
      }

      const newAssignment = {
        id: Date.now(),
        title,
        class: className,
        instructions,
        dueDate,
        postedDate: new Date().toISOString().split('T')[0],
        teacher: sessionStorage.getItem('bright_teacher_name') || 'Unknown Teacher'
      };

      const stored = JSON.parse(localStorage.getItem('bright_assignments') || '[]');
      stored.unshift(newAssignment);
      localStorage.setItem('bright_assignments', JSON.stringify(stored));

      const successMsg = document.getElementById('assignmentSuccessMsg');
      if (successMsg) {
        successMsg.style.display = 'block';
        assignmentForm.reset();
        setTimeout(() => { successMsg.style.display = 'none'; }, 5000);
      }

      const recentList = document.querySelector('.assignment-list');
      if (recentList) {
        const card = document.createElement('div');
        card.className = 'ann-card';
        card.innerHTML = `
          <div class="ann-card-header">
            <span class="ann-category category-academic">Academic</span>
            <span class="ann-date">${newAssignment.postedDate}</span>
          </div>
          <h4>${newAssignment.title}</h4>
          <p>${newAssignment.class} – Due ${newAssignment.dueDate}</p>
        `;
        recentList.prepend(card);
      }
    });
  }

  // ---------- Notification Dropdown ----------
  const notificationBtn = document.getElementById('notificationBtn');
  const notificationDropdown = document.getElementById('notificationDropdown');
  const notificationWrapper = document.getElementById('notificationWrapper');
  const markReadBtn = document.getElementById('markReadBtn');
  const notificationBadge = document.getElementById('notificationBadge');

  // Toggle dropdown
  if (notificationBtn && notificationDropdown) {
    notificationBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      notificationDropdown.style.display =
        notificationDropdown.style.display === 'block' ? 'none' : 'block';
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (notificationWrapper && !notificationWrapper.contains(e.target)) {
        notificationDropdown.style.display = 'none';
      }
    });
  }

  // Mark as read
  if (markReadBtn && notificationBadge) {
    markReadBtn.addEventListener('click', () => {
      notificationBadge.textContent = '0';
      notificationBadge.setAttribute('data-count', '0');
      document.querySelectorAll('.notification-item.unread').forEach(item => {
        item.classList.remove('unread');
      });
      notificationDropdown.style.display = 'none';
    });
  }
})();