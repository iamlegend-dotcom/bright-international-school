(function() {
  // ---------- DOM Elements ----------
  const form = document.getElementById('adminLoginForm');
  const adminIdInput = document.getElementById('adminId');
  const passwordInput = document.getElementById('adminPassword');
  const togglePasswordBtn = document.getElementById('togglePassword');
  const eyeOpen = document.querySelector('.eye-open');
  const eyeClosed = document.querySelector('.eye-closed');
  const generalError = document.getElementById('generalError');
  const adminIdError = document.getElementById('adminIdError');
  const adminPasswordError = document.getElementById('adminPasswordError');
  const submitBtn = document.getElementById('adminLoginBtn');
  const rememberCheck = document.getElementById('rememberAdmin');

  // ---------- Hardcoded admin credentials ----------
  const VALID_ID = 'ADMIN001';
  const VALID_PASSWORD = 'admin123';

  // ---------- Show/Hide Password (correct icon mapping) ----------
  if (togglePasswordBtn && passwordInput && eyeOpen && eyeClosed) {
    // Remove old listeners by cloning
    const newBtn = togglePasswordBtn.cloneNode(true);
    togglePasswordBtn.parentNode.replaceChild(newBtn, togglePasswordBtn);

    const freshBtn = document.getElementById('togglePassword');
    const freshEyeOpen = freshBtn.querySelector('.eye-open');
    const freshEyeClosed = freshBtn.querySelector('.eye-closed');

    // Start with password hidden → show closed‑eye icon
    passwordInput.setAttribute('type', 'password');
    freshEyeOpen.style.display = 'none';
    freshEyeClosed.style.display = 'block';
    freshBtn.setAttribute('aria-label', 'Show password');

    freshBtn.addEventListener('click', function () {
      const isPassword = passwordInput.getAttribute('type') === 'password';
      passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
      if (isPassword) {
        // password hidden → now visible → show open‑eye
        freshEyeOpen.style.display = 'block';
        freshEyeClosed.style.display = 'none';
        freshBtn.setAttribute('aria-label', 'Hide password');
      } else {
        // password visible → now hidden → show closed‑eye
        freshEyeOpen.style.display = 'none';
        freshEyeClosed.style.display = 'block';
        freshBtn.setAttribute('aria-label', 'Show password');
      }
    });
  }

  // ---------- Load remembered credentials ----------
  const saved = localStorage.getItem('bright_admin_remember');
  if (saved) {
    try {
      const data = JSON.parse(saved);
      if (data.adminId) adminIdInput.value = data.adminId;
      rememberCheck.checked = true;
    } catch (e) {}
  }

  // ---------- Form Submission ----------
  form.addEventListener('submit', function(e) {
    e.preventDefault();

    adminIdInput.classList.remove('error');
    passwordInput.classList.remove('error');
    adminIdError.classList.remove('show');
    adminPasswordError.classList.remove('show');
    generalError.classList.remove('show');
    generalError.textContent = '';

    const adminId = adminIdInput.value.trim();
    const password = passwordInput.value;

    let isValid = true;

    if (!adminId) {
      adminIdInput.classList.add('error');
      adminIdError.textContent = 'Admin ID is required';
      adminIdError.classList.add('show');
      isValid = false;
    }

    if (!password) {
      passwordInput.classList.add('error');
      adminPasswordError.textContent = 'Password is required';
      adminPasswordError.classList.add('show');
      isValid = false;
    }

    if (!isValid) return;

    submitBtn.querySelector('.btn-text').textContent = 'Signing In…';
    submitBtn.querySelector('.btn-spinner').style.display = 'inline-block';
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.querySelector('.btn-text').textContent = 'Sign In';
      submitBtn.querySelector('.btn-spinner').style.display = 'none';
      submitBtn.disabled = false;

      if (adminId.toUpperCase() === VALID_ID && password === VALID_PASSWORD) {
        if (rememberCheck.checked) {
          localStorage.setItem('bright_admin_remember', JSON.stringify({ adminId: adminId.toUpperCase() }));
        } else {
          localStorage.removeItem('bright_admin_remember');
        }

        sessionStorage.setItem('bright_user_role', 'admin');
        sessionStorage.setItem('bright_user_identifier', adminId.toUpperCase());
        sessionStorage.setItem('bright_login_time', new Date().toISOString());

        window.location.href = 'admin-dashboard.html';
      } else {
        generalError.textContent = 'Invalid administrator credentials';
        generalError.classList.add('show');
      }
    }, 1200);
  });
})();