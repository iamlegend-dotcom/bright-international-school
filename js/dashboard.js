(function() {
  // ---------- Retrieve stored student data ----------
  const userRole = sessionStorage.getItem('bright_user_role') || 'student';
  const identifier = sessionStorage.getItem('bright_user_identifier') || 'N/A';

  // Redirect if no identifier (not logged in)
  if (!identifier || identifier === 'N/A') {
    window.location.href = 'login.html';
    return;
  }

  // ---------- Helper to safely set text ----------
  const safeSet = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };

  // ---------- Generate or retrieve student name ----------
  const STORED_NAME_KEY = 'bright_student_name';
  let studentName = sessionStorage.getItem(STORED_NAME_KEY);
  if (!studentName) {
    const firstNames = ['Chidinma', 'Emeka', 'Amina', 'David', 'Blessing', 'Tolu', 'Zainab', 'Obinna'];
    const lastNames = ['Okonkwo', 'Adeyemi', 'Ibrahim', 'Nwosu', 'Eze', 'Bello', 'Okafor', 'Yusuf'];
    const randomFirst = firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomLast = lastNames[Math.floor(Math.random() * lastNames.length)];
    studentName = `${randomFirst} ${randomLast}`;
    sessionStorage.setItem(STORED_NAME_KEY, studentName);
  }

  const displayName = studentName;

  // ---------- Class & Department ----------
  const studentClass = 'JSS 1A';
  const department = studentClass.startsWith('JSS') ? 'Junior Secondary' : 'Science';

  // ---------- Populate basic info ----------
  safeSet('displayName', displayName);
  safeSet('userAvatar', displayName.charAt(0).toUpperCase());

  // ---------- Profile section ----------
  // Header card
  safeSet('profileAvatarLarge', displayName.charAt(0).toUpperCase());
  safeSet('profileFullName', displayName);
  safeSet('profileAdmission', identifier);
  safeSet('profileClass', studentClass);

  // Student Information Card
  safeSet('infoFullName', displayName);
  safeSet('infoAdmission', identifier);
  safeSet('infoClass', studentClass);
  safeSet('infoDepartment', department);

  // Account Information Card
  safeSet('accountIdentifier', identifier);
  safeSet('accountRole', userRole.charAt(0).toUpperCase() + userRole.slice(1));
  const loginTimeRaw = sessionStorage.getItem('bright_login_time');
  const loginDate = loginTimeRaw ? new Date(loginTimeRaw) : new Date();
  safeSet('accountLastLogin', loginDate.toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  }));

  // ---------- Welcome Hero ----------
  safeSet('heroStudentName', displayName);
  const now = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  safeSet('currentDate', now.toLocaleDateString('en-US', options));

  // ---------- Sidebar navigation ----------
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.querySelectorAll('.sidebar-nav a[data-section]');
  const sections = document.querySelectorAll('.dash-section');

  function showSection(sectionId) {
    sections.forEach(sec => sec.classList.remove('active'));
    const target = document.getElementById('section-' + sectionId);
    if (target) target.classList.add('active');
    navLinks.forEach(link => link.classList.remove('active'));
    const activeLink = document.querySelector(`.sidebar-nav a[data-section="${sectionId}"]`);
    if (activeLink) activeLink.classList.add('active');
    closeSidebar();
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.style.display = 'none';
  }

  function openSidebar() {
    sidebar.classList.add('open');
    overlay.style.display = 'block';
  }

  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const section = this.getAttribute('data-section');
      showSection(section);
    });
  });

  menuToggle.addEventListener('click', openSidebar);
  overlay.addEventListener('click', closeSidebar);

  // ---------- Logout ----------
  document.getElementById('logoutBtn').addEventListener('click', function(e) {
    e.preventDefault();
    // Clear all stored data
    sessionStorage.clear();
    localStorage.removeItem('bright_remembered_login');
    window.location.href = 'login.html';
  });

  // ---------- Responsive sidebar ----------
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024) {
      sidebar.classList.remove('open');
      overlay.style.display = 'none';
    }
  });

  // ---------- Micro-interactions ----------
  document.querySelectorAll('.sidebar-nav a').forEach(link => {
    link.addEventListener('mouseenter', () => {
      link.style.transition = 'all 0.2s ease';
    });
  });

  window.addEventListener('hashchange', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Highlight today's day in timetable
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const timetableHeaders = document.querySelectorAll('.timetable-grid th');
  timetableHeaders.forEach(th => {
    if (th.textContent.trim() === today) {
      th.style.background = 'var(--accent)';
      th.style.color = '#fff';
    }
  });

    // ---------- Subject Detail Modal ----------
  const modal = document.getElementById('subjectModal');
  const modalContent = document.getElementById('modalContent');
  const modalClose = document.getElementById('modalClose');
  const modalBackdrop = document.getElementById('modalBackdrop');

  // Mock data for each subject
  const subjectData = {
    mathematics: {
      title: 'Mathematics',
      teacher: 'Mr. Okonkwo',
      description: 'Algebra, geometry, and problem-solving skills.',
      schedule: 'Mon, Wed, Fri (8:00–8:50 AM)',
      resources: 'Textbook: New General Mathematics, Calculator, Graph book',
      progress: 78
    },
    english: {
      title: 'English Language',
      teacher: 'Mrs. Adeyemi',
      description: 'Grammar, comprehension, and creative writing.',
      schedule: 'Tue, Thu (8:50–9:40 AM)',
      resources: 'Textbook: Brighter Grammar, A Tale of Two Cities',
      progress: 85
    },
    physics: {
      title: 'Physics',
      teacher: 'Mr. Ibrahim',
      description: 'Mechanics, optics, electricity, and magnetism.',
      schedule: 'Mon, Wed (10:00–10:50 AM)',
      resources: 'Textbook: New School Physics, lab coat',
      progress: 60
    },
    chemistry: {
      title: 'Chemistry',
      teacher: 'Mrs. Nwosu',
      description: 'Organic, inorganic, and physical chemistry.',
      schedule: 'Tue, Thu (12:30–13:20 PM)',
      resources: 'Textbook: Lamlard Chemistry, lab coat, goggles',
      progress: 72
    },
    biology: {
      title: 'Biology',
      teacher: 'Dr. Eze',
      description: 'Human anatomy, genetics, and ecology.',
      schedule: 'Fri (12:30–13:20 PM)',
      resources: 'Textbook: Modern Biology, dissection kit',
      progress: 68
    },
    civic: {
      title: 'Civic Education',
      teacher: 'Ms. Chioma',
      description: 'Rights, responsibilities, and government.',
      schedule: 'Wed (10:50–11:40 AM)',
      resources: 'Textbook: Civic Education for Schools',
      progress: 80
    },
    computer: {
      title: 'Computer Science',
      teacher: 'Mr. Kenneth',
      description: 'Programming, algorithms, and digital literacy.',
      schedule: 'Mon, Thu (10:50–11:40 AM)',
      resources: 'Textbook: Introduction to Computer Science, Python IDE',
      progress: 75
    },
    furthermath: {
      title: 'Further Mathematics',
      teacher: 'Mr. Okonkwo',
      description: 'Advanced calculus, matrices, and statistics.',
      schedule: 'Tue (10:00–10:50 AM)',
      resources: 'Textbook: Further Mathematics for Senior Secondary',
      progress: 55
    }
  };

  // Open modal when a subject card is clicked
  const subjectCards = document.querySelectorAll('.subject-card-premium');
  subjectCards.forEach(card => {
    card.addEventListener('click', () => {
      const subjectKey = card.getAttribute('data-subject');
      const data = subjectData[subjectKey];
      if (!data) return;

      modalContent.innerHTML = `
        <h2>${data.title}</h2>
        <div class="modal-section">
          <h4>👨‍🏫 Teacher</h4>
          <p>${data.teacher}</p>
        </div>
        <div class="modal-section">
          <h4>📖 Description</h4>
          <p>${data.description}</p>
        </div>
        <div class="modal-section">
          <h4>📅 Weekly Schedule</h4>
          <p>${data.schedule}</p>
        </div>
        <div class="modal-section">
          <h4>📊 Academic Progress</h4>
          <div class="progress-bar-bg" style="margin-top:8px;"><div class="progress-bar-fill" style="width:${data.progress}%"></div></div>
          <p style="margin-top:4px; font-size:0.8rem;">${data.progress}% complete</p>
        </div>
        <div class="modal-section">
          <h4>📚 Recommended Resources</h4>
          <p>${data.resources}</p>
        </div>
      `;

      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close modal
  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  modalClose.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // ---------- Subject Filtering ----------
  const filterButtons = document.querySelectorAll('.filter-btn');
  const allSubjectCards = document.querySelectorAll('.subject-card-premium');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      allSubjectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden-by-filter');
        } else {
          card.classList.add('hidden-by-filter');
        }
      });
    });
  });


    // ---------- Timetable Enhancements ----------
  const todayDayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  
  // Highlight today's day card
  const dayCards = document.querySelectorAll('.day-card');
  dayCards.forEach(card => {
    if (card.getAttribute('data-day') === todayDayName) {
      card.classList.add('today');
    }
  });

  // Update current day badge
  const currentDayBadge = document.getElementById('currentDayBadge');
  if (currentDayBadge) {
    currentDayBadge.textContent = todayDayName;
  }

  // Build Today's Classes list
  const todayCard = document.querySelector(`.day-card[data-day="${todayDayName}"]`);
  const todayClassList = document.getElementById('todayClassList');
  if (todayCard && todayClassList) {
    const periods = todayCard.querySelectorAll('.period-item');
    todayClassList.innerHTML = '';
    periods.forEach(period => {
      const time = period.querySelector('.period-time').textContent;
      const subject = period.querySelector('.period-subject').textContent;
      const teacher = period.querySelector('.period-teacher').textContent;
      const item = document.createElement('div');
      item.className = 'today-class-item';
      item.innerHTML = `
        <div class="class-info">
          <span class="class-subject">${subject}</span>
          <span class="class-time">${time}</span>
          <span class="class-teacher">${teacher}</span>
        </div>
        <span class="class-status">Upcoming</span>
      `;
      todayClassList.appendChild(item);
    });
    document.getElementById('todayClassesCount').textContent = periods.length;
  }

  // Simple upcoming class widget (just show the first period of today as next)
  if (todayCard) {
    const firstPeriod = todayCard.querySelector('.period-item');
    if (firstPeriod) {
      const subject = firstPeriod.querySelector('.period-subject').textContent;
      const time = firstPeriod.querySelector('.period-time').textContent;
      const teacher = firstPeriod.querySelector('.period-teacher').textContent;
      const upcomingDetails = document.getElementById('upcomingDetails');
      if (upcomingDetails) {
        upcomingDetails.innerHTML = `
          <span class="upcoming-subject">${subject}</span>
          <span class="upcoming-time">${time}</span>
          <span class="upcoming-teacher">${teacher}</span>
          <span class="upcoming-room">Room 101</span>
        `;
      }
    }
  }

  // ---------- Announcements Filter ----------
  const annFilterBtns = document.querySelectorAll('.ann-filter-btn');
  const annCards = document.querySelectorAll('.ann-card');

  annFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      annFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      annCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('filtered-hidden');
        } else {
          card.classList.add('filtered-hidden');
        }
      });
    });
  });

  // ---------- Read More Toggle ----------
  const readMoreBtns = document.querySelectorAll('.ann-readmore');
  readMoreBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.ann-card');
      const fullDiv = card.querySelector('.ann-full');
      if (fullDiv.style.display === 'none' || fullDiv.style.display === '') {
        fullDiv.style.display = 'block';
        btn.textContent = 'Read less';
      } else {
        fullDiv.style.display = 'none';
        btn.textContent = 'Read more';
      }
    });
  });


    // ---------- Topbar Enhancements ----------
  // Real date
  const topbarDateEl = document.getElementById('topbarDate');
  if (topbarDateEl) {
    const now = new Date();
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    topbarDateEl.textContent = now.toLocaleDateString('en-US', dateOptions);
  }

  // Update welcome name (the dashboard‑wide displayName already holds the student's name)
  const welcomeNameEl = document.getElementById('topbarWelcomeName');
  if (welcomeNameEl) {
    welcomeNameEl.textContent = displayName;   // 'displayName' is already defined earlier in dashboard.js
  }


  // ---------- Student Assignments ----------
  const allAssignments = JSON.parse(localStorage.getItem('bright_assignments') || '[]');
  const assignmentsContainer = document.getElementById('studentAssignmentsList');
  const noAssignmentsMsg = document.getElementById('noAssignmentsMsg');

  if (assignmentsContainer) {
    const myAssignments = allAssignments.filter(a => a.class === studentClass);

    if (myAssignments.length === 0) {
      noAssignmentsMsg.style.display = 'block';
    } else {
      noAssignmentsMsg.style.display = 'none';
      myAssignments.forEach(assignment => {
        const card = document.createElement('div');
        card.className = 'assignment-student-card';
        card.innerHTML = `
          <h4 class="assignment-student-title">${assignment.title}</h4>
          <div class="assignment-student-meta">
            <span>📅 Due: ${assignment.dueDate}</span>
            <span>👨‍🏫 ${assignment.teacher}</span>
            <span>📚 ${assignment.class}</span>
          </div>
          <div class="assignment-student-instructions">
            ${assignment.instructions || 'No additional instructions.'}
          </div>
        `;
        assignmentsContainer.appendChild(card);
      });
    }
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
      // Reset badge count
      notificationBadge.textContent = '0';
      notificationBadge.setAttribute('data-count', '0');
      // Remove unread styling from all items
      document.querySelectorAll('.notification-item.unread').forEach(item => {
        item.classList.remove('unread');
      });
      // Close dropdown
      notificationDropdown.style.display = 'none';
    });
  }
})();