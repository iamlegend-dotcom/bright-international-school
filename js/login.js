(function() {
  // ---------- DOM Elements ----------
  const studentCard = document.getElementById('studentCard');
  const teacherCard = document.getElementById('teacherCard');
  const identifierLabel = document.getElementById('identifierLabel');
  const identifierInput = document.getElementById('loginIdentifier');
  const registerLink = document.getElementById('registerLink');
  const loginForm = document.getElementById('loginForm');
  const submitBtn = document.getElementById('loginSubmitBtn');
  const passwordInput = document.getElementById('loginPassword');
  const passwordToggle = document.getElementById('passwordToggle');
  const rememberCheck = document.getElementById('rememberMe');
  const successModal = document.getElementById('successModal');
  const successMessage = document.getElementById('successMessage');
  const successSubMessage = document.getElementById('successSubMessage');

  let selectedRole = 'student'; // updated by portal card clicks

  // ---------- Show/Hide Password ----------
  if (passwordToggle) {
    passwordToggle.addEventListener('click', () => {
      const type = passwordInput.type === 'password' ? 'text' : 'password';
      passwordInput.type = type;
      const eyeOpen = document.querySelector('.eye-icon-open');
      const eyeOff = document.querySelector('.eye-icon-off');
      if (type === 'text') {
        eyeOpen.style.display = 'none';
        eyeOff.style.display = 'block';
        passwordToggle.setAttribute('aria-label', 'Hide password');
      } else {
        eyeOpen.style.display = 'block';
        eyeOff.style.display = 'none';
        passwordToggle.setAttribute('aria-label', 'Show password');
      }
    });
  }

  // ---------- Update UI based on active portal card ----------
  function updateUIFromActiveCard() {
    if (teacherCard.classList.contains('active')) {
      identifierLabel.textContent = 'Staff ID';
      identifierInput.placeholder = 'Enter your staff ID';
      registerLink.style.display = 'none';
      selectedRole = 'teacher';
    } else {
      identifierLabel.textContent = 'Admission Number';
      identifierInput.placeholder = 'Enter your admission number';
      registerLink.style.display = 'block';
      selectedRole = 'student';
    }
  }

  [studentCard, teacherCard].forEach(card => {
    card.addEventListener('click', () => {
      // Global script toggles active class, then we update UI after a tick
      setTimeout(updateUIFromActiveCard, 0);
    });
  });

  // Initial UI
  updateUIFromActiveCard();

  // ---------- Remember Me: load saved credentials ----------
  function loadRememberedCredentials() {
    if (!rememberCheck) return;
    const saved = localStorage.getItem('bright_remembered_login');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.role) {
          if (data.role === 'teacher') {
            teacherCard.classList.add('active');
            studentCard.classList.remove('active');
          } else {
            studentCard.classList.add('active');
            teacherCard.classList.remove('active');
          }
          updateUIFromActiveCard();
        }
        if (data.identifier) {
          identifierInput.value = data.identifier;
        }
        rememberCheck.checked = true;
      } catch (e) {}
    }
  }

  function saveRememberedCredentials() {
    if (!rememberCheck || !rememberCheck.checked) {
      localStorage.removeItem('bright_remembered_login');
      return;
    }
    const data = {
      role: teacherCard.classList.contains('active') ? 'teacher' : 'student',
      identifier: identifierInput.value.trim()
    };
    localStorage.setItem('bright_remembered_login', JSON.stringify(data));
  }

  loadRememberedCredentials();

  // ---------- Form Validation & Submission ----------
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Clear previous errors
    loginForm.querySelectorAll('.form-control').forEach(f => f.classList.remove('error'));
    loginForm.querySelectorAll('.error-msg').forEach(m => m.classList.remove('show'));

    let isValid = true;

    // Validate identifier (non-empty)
    const identifier = identifierInput.value.trim();
    if (!identifier) {
      identifierInput.classList.add('error');
      const parentGroup = identifierInput.closest('.form-group');
      if (parentGroup) {
        const err = parentGroup.querySelector('.error-msg');
        if (err) {
          err.textContent = selectedRole === 'student' ? 'Please enter your admission number' : 'Please enter your staff ID';
          err.classList.add('show');
        }
      }
      isValid = false;
    }

    // Validate password (min 6 chars)
    const password = passwordInput.value;
    if (password.length < 6) {
      passwordInput.classList.add('error');
      const parentGroup = passwordInput.closest('.form-group');
      if (parentGroup) {
        const err = parentGroup.querySelector('.error-msg');
        if (err) {
          err.classList.add('show');
        }
      }
      isValid = false;
    }

    if (!isValid) return;

    // Save remember me state
    saveRememberedCredentials();

    // ---------- Loading state ----------
    submitBtn.classList.add('loading');
    submitBtn.querySelector('.btn-text').textContent = 'Signing In...';
    submitBtn.querySelector('.btn-spinner').style.display = 'inline-block';
    submitBtn.disabled = true;

    // Simulate authentication delay (front-end only)
    setTimeout(() => {
      // Success
      submitBtn.classList.remove('loading');
      submitBtn.querySelector('.btn-text').textContent = 'Sign In';
      submitBtn.querySelector('.btn-spinner').style.display = 'none';
      submitBtn.disabled = false;

      // Store session data
      sessionStorage.setItem('bright_user_role', selectedRole);
      sessionStorage.setItem('bright_user_identifier', identifier);
      sessionStorage.setItem('bright_login_time', new Date().toISOString());

      // Show success modal
      const roleDisplay = selectedRole === 'student' ? 'Student' : 'Teacher';
      successMessage.textContent = 'Authentication Successful';
      successSubMessage.textContent = `Welcome back, ${roleDisplay}. Preparing your dashboard...`;
      successModal.classList.add('active');
      successModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      // Prepare redirection after a short delay
      setTimeout(() => {
        document.body.style.overflow = '';
        if (selectedRole === 'student') {
          window.location.href = 'student-dashboard.html';
        } else {
          window.location.href = 'teacher-dashboard.html';
        }
      }, 2500);
    }, 1500);
  });
})();