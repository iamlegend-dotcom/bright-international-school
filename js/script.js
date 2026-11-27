/* ============================================
   BRIGHT INTERNATIONAL SECONDARY SCHOOL
   Global JavaScript – Modernised (with Alumni)
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {

  // ==========================================
  // PRELOADER
  // ==========================================
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add('hidden');
    }, 3000);
  }

  // ==========================================
  // MOBILE NAVIGATION TOGGLE
  // ==========================================
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', function() {
      this.classList.toggle('open');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('open');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ==========================================
  // NAVBAR SCROLL EFFECT
  // ==========================================
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', function() {
    if (navbar) {
      if (window.pageYOffset > 30) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  });

  // ==========================================
  // SCROLL REVEAL ANIMATIONS
  // ==========================================
  const fadeElements = document.querySelectorAll('.fade-in');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  fadeElements.forEach(el => revealObserver.observe(el));

  /* ============================================
     PREMIUM LIGHTBOX CAROUSEL (only on pages with lightbox HTML)
     ============================================ */
  (function() {
    const galleryItems = document.querySelectorAll('.gallery-item img');
    if (galleryItems.length === 0) return;

    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.getElementById('lightbox-close');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');
    const counter = document.getElementById('lightbox-counter');
    const overlay = document.querySelector('.lightbox-overlay');

    if (!lightbox || !lightboxImg || !closeBtn || !prevBtn || !nextBtn || !counter || !overlay) return;

    const images = Array.from(galleryItems).map(img => ({
      src: img.getAttribute('src'),
      alt: img.getAttribute('alt') || 'Gallery image'
    }));

    let currentIndex = 0;
    let isOpen = false;

    function showImage(index) {
      if (index < 0) index = images.length - 1;
      if (index >= images.length) index = 0;
      currentIndex = index;
      const image = images[currentIndex];
      lightboxImg.src = image.src;
      lightboxImg.alt = image.alt;
      counter.textContent = `${currentIndex + 1} / ${images.length}`;
    }

    function openLightbox(index) {
      showImage(index);
      lightbox.classList.add('active');
      lightbox.setAttribute('aria-hidden', 'false');
      isOpen = true;
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      lightbox.setAttribute('aria-hidden', 'true');
      isOpen = false;
      document.body.style.overflow = '';
    }

    function prevImage() { showImage(currentIndex - 1); }
    function nextImage() { showImage(currentIndex + 1); }

    galleryItems.forEach((img, index) => {
      img.parentElement.addEventListener('click', (e) => {
        e.preventDefault();
        openLightbox(index);
      });
    });

    closeBtn.addEventListener('click', closeLightbox);
    overlay.addEventListener('click', closeLightbox);

    prevBtn.addEventListener('click', (e) => { e.stopPropagation(); prevImage(); });
    nextBtn.addEventListener('click', (e) => { e.stopPropagation(); nextImage(); });

    document.addEventListener('keydown', (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowLeft') prevImage();
      else if (e.key === 'ArrowRight') nextImage();
    });

    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener('touchstart', (e) => {
      if (!isOpen) return;
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
      if (!isOpen) return;
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? nextImage() : prevImage();
      }
    });
  })();


  // ==========================================
  // ADMISSION FORM – WITH DIRECT PAYMENT & RECEIPT (AUTO-PRINT)
  // ==========================================
  const admissionForm = document.getElementById('admissionForm');
  const classSelect = document.getElementById('classSelect');
  const amountDisplay = document.getElementById('amountDisplay');

  const fees = {
    'JSS1': 45000,
    'JSS2': 45000,
    'JSS3': 45000,
    'SS1': 55000,
    'SS2': 55000,
    'SS3': 55000
  };

  // ---------- Payment Gateway Configuration ----------
  const paymentConfig = {
    paystackPublicKey: 'pk_test_c6b0ea8e76f4cbf88f4805965547bc46825d1c50',          // ← Your Paystack test key
    flutterwavePublicKey: 'FLWPUBK_TEST-f222c3f132825150aa2d39c9e3e77ab3-X' // ← Your Flutterwave test key
  };

  // UI elements (only on admission page)
  const paystackBtn = document.getElementById('payWithPaystack');
  const flutterwaveBtn = document.getElementById('payWithFlutterwave');
  const receiptModal = document.getElementById('receiptModal');
  const receiptBody = document.getElementById('receiptBody');
  const receiptClose = document.getElementById('receiptClose');
  const receiptPrint = document.getElementById('receiptPrint');

  // Amount display logic
  if (classSelect && amountDisplay) {
    classSelect.addEventListener('change', function() {
      const selected = this.value;
      const amount = fees[selected] || 0;
      if (amount > 0) {
        amountDisplay.style.display = 'block';
        amountDisplay.innerHTML = `
          <div class="label">Payment Amount for ${selected}</div>
          <div class="value">₦${amount.toLocaleString()}</div>
        `;
      } else {
        amountDisplay.style.display = 'none';
        amountDisplay.innerHTML = '';
      }
    });
  }

  // ---------- HELPERS ----------
  function generateEmail(parentName) {
    return parentName.replace(/\s+/g, '.').toLowerCase() + '@parent.com';
  }

  function saveApplication(application) {
    const apps = JSON.parse(localStorage.getItem('bright_admission_applications')) || [];
    apps.push(application);
    localStorage.setItem('bright_admission_applications', JSON.stringify(apps));
  }

  function validateForm() {
    const parentName = document.getElementById('parentName');
    const childName = document.getElementById('childName');
    let valid = true;
    // Clear previous errors
    document.querySelectorAll('.form-control').forEach(f => f.classList.remove('error'));
    document.querySelectorAll('.error-msg').forEach(m => m.classList.remove('show'));

    if (!parentName || parentName.value.trim().length < 3) {
      showError(parentName, 'Please enter a valid parent name');
      valid = false;
    }
    if (!childName || childName.value.trim().length < 3) {
      showError(childName, 'Please enter a valid child name');
      valid = false;
    }
    if (!classSelect || classSelect.value === '') {
      showError(classSelect, 'Please select a class');
      valid = false;
    }
    return valid;
  }

  function showReceipt(application) {
    if (!receiptBody) return;
    const amountFormatted = '₦' + application.amount.toLocaleString();
    const date = new Date(application.submittedAt).toLocaleString();
    receiptBody.innerHTML = `
      <div class="receipt-details">
        <div class="receipt-row"><span class="receipt-label">Student Name:</span> <span>${application.childName}</span></div>
        <div class="receipt-row"><span class="receipt-label">Parent/Guardian:</span> <span>${application.parentName}</span></div>
        <div class="receipt-row"><span class="receipt-label">Class:</span> <span>${application.class}</span></div>
        <div class="receipt-row"><span class="receipt-label">Amount Paid:</span> <span class="receipt-amount">${amountFormatted}</span></div>
        <div class="receipt-row"><span class="receipt-label">Transaction Ref:</span> <span>${application.transactionRef}</span></div>
        <div class="receipt-row"><span class="receipt-label">Gateway:</span> <span>${application.gateway}</span></div>
        <div class="receipt-row"><span class="receipt-label">Date:</span> <span>${date}</span></div>
      </div>
      <div class="receipt-status">Payment Successful ✓</div>
    `;
    if (receiptModal) {
      receiptModal.classList.add('active');
      receiptModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeReceipt() {
    if (receiptModal) {
      receiptModal.classList.remove('active');
      receiptModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  // Receipt modal controls (ONLY if elements exist)
  if (receiptClose && receiptModal && receiptPrint) {
    receiptClose.addEventListener('click', closeReceipt);
    receiptModal.addEventListener('click', (e) => {
      if (e.target === receiptModal || e.target.classList.contains('review-backdrop')) closeReceipt();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && receiptModal.classList.contains('active')) closeReceipt();
    });
    receiptPrint.addEventListener('click', () => window.print());
  }

  // ---------- PAYSTACK PAYMENT (with auto-print) ----------
  if (paystackBtn) {
    paystackBtn.addEventListener('click', () => {
      if (!validateForm()) return;

      const parentName = document.getElementById('parentName').value.trim();
      const childName = document.getElementById('childName').value.trim();
      const selectedClass = classSelect.value;
      const fee = fees[selectedClass];
      const email = generateEmail(parentName);
      const txRef = 'BISS-PS-' + Date.now();

      if (typeof PaystackPop === 'undefined') {
        alert('Paystack is not available. Please check your connection.');
        return;
      }

      const handler = PaystackPop.setup({
        key: paymentConfig.paystackPublicKey,
        email: email,
        amount: fee * 100,
        ref: txRef,
        currency: 'NGN',
        label: 'Bright International School',
        metadata: {
          custom_fields: [
            { display_name: 'Student', variable_name: 'student_name', value: childName },
            { display_name: 'Class', variable_name: 'class', value: selectedClass }
          ]
        },
        callback: function(response) {
          const application = {
            id: Date.now(),
            parentName,
            childName,
            class: selectedClass,
            amount: fee,
            paymentMethod: 'Card',
            gateway: 'Paystack',
            transactionRef: txRef,
            submittedAt: new Date().toISOString(),
            status: 'Paid'
          };
          saveApplication(application);
          showReceipt(application);
          if (typeof updateStepper === 'function') updateStepper();
          setTimeout(() => window.print(), 500);
        },
        onClose: function() {}
      });
      handler.openIframe();
    });
  }

  // ---------- FLUTTERWAVE PAYMENT (with auto-print) ----------
  if (flutterwaveBtn) {
    flutterwaveBtn.addEventListener('click', () => {
      if (!validateForm()) return;

      const parentName = document.getElementById('parentName').value.trim();
      const childName = document.getElementById('childName').value.trim();
      const selectedClass = classSelect.value;
      const fee = fees[selectedClass];
      const email = generateEmail(parentName);
      const txRef = 'BISS-FW-' + Date.now();

      if (typeof FlutterwaveCheckout === 'undefined') {
        alert('Flutterwave is not available. Please check your connection.');
        return;
      }

      FlutterwaveCheckout({
        public_key: paymentConfig.flutterwavePublicKey,
        tx_ref: txRef,
        amount: fee,
        currency: 'NGN',
        payment_options: 'card',
        customer: {
          email: email,
          name: parentName
        },
        callback: function(data) {
          // Check all possible success indicators
          const isSuccess = data.status === 'successful' || 
                            data.status === 'completed' ||
                            data.txRef === txRef;

          if (isSuccess) {
            const application = {
              id: Date.now(),
              parentName,
              childName,
              class: selectedClass,
              amount: fee,
              paymentMethod: 'Card',
              gateway: 'Flutterwave',
              transactionRef: txRef,
              submittedAt: new Date().toISOString(),
              status: 'Paid'
            };
            saveApplication(application);
            // Delay showing receipt to allow Flutterwave modal to close
            setTimeout(() => {
              showReceipt(application);
              if (typeof updateStepper === 'function') updateStepper();
              setTimeout(() => window.print(), 500);
            }, 1200);
          } else {
            alert('Payment was not successful. Please try again.');
          }
        },
        onclose: function() {},
        customizations: {
          title: 'Bright International School',
          description: 'Admission fee for ' + selectedClass,
          logo: 'https://i.imgur.com/0r3Qy5p.png'
        }
      });
    });
  }

  // Helper: show error
  function showError(field, message) {
    if (!field) return;
    field.classList.add('error');
    const formGroup = field.closest('.form-group');
    if (formGroup) {
      const errorMsg = formGroup.querySelector('.error-msg');
      if (errorMsg) {
        errorMsg.textContent = message;
        errorMsg.classList.add('show');
      }
    }
  }

  // ==========================================
  // LOGIN FORM
  // ==========================================
  const loginForm = document.getElementById('loginForm');
  const roleBtns = document.querySelectorAll('.role-btn');
  let selectedRole = 'student';

  if (roleBtns.length > 0) {
    roleBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        roleBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        selectedRole = this.dataset.role;
      });
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      let isValid = true;

      loginForm.querySelectorAll('.form-control').forEach(field => field.classList.remove('error'));
      loginForm.querySelectorAll('.error-msg').forEach(msg => msg.classList.remove('show'));

      const email = document.getElementById('loginEmail');
      const password = document.getElementById('loginPassword');

      if (!email || !email.value.trim() || !email.value.includes('@')) {
        showError(email, 'Please enter a valid email address');
        isValid = false;
      }
      if (!password || password.value.length < 6) {
        showError(password, 'Password must be at least 6 characters');
        isValid = false;
      }

      if (isValid) {
        alert(
          `Login Successful!\n\n` +
          `Role: ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}\n` +
          `Email: ${email.value.trim()}\n\n` +
          `Welcome to Bright International Secondary School!`
        );
        loginForm.reset();
      }
    });
  }

  // ==========================================
  // CONTACT FORM
  // ==========================================
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = document.getElementById('contactName');
      const email = document.getElementById('contactEmail');
      const subject = document.getElementById('contactSubject');
      const message = document.getElementById('contactMessage');

      if (!name.value.trim() || !email.value.trim() || !subject.value.trim() || !message.value.trim()) {
        alert('Please fill in all fields before sending your message.');
        return;
      }

      alert(
        `Thank you, ${name.value.trim()}!\n\n` +
        `Your message has been received. We will get back to you at ${email.value.trim()} shortly.`
      );
      contactForm.reset();
    });
  }

  // ==========================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = navbar ? navbar.offsetHeight : 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ==========================================
  // ACTIVE NAV LINK HIGHLIGHTING
  // ==========================================
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ==========================================
  // STATISTICS COUNTER ANIMATION (GLOBAL)
  // ==========================================
  const statNumbers = document.querySelectorAll('.stat-number');
  if (statNumbers.length) {
    const animateCounter = (el) => {
      const target = parseInt(el.getAttribute('data-target')) || 0;
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 2000;
      const startTime = performance.now();

      const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentValue = Math.floor(progress * target);
        el.textContent = currentValue + suffix;
        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          el.textContent = target + suffix;
        }
      };

      requestAnimationFrame(updateCounter);
    };

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => counterObserver.observe(el));
  }

  // ==========================================
  // HERO VIDEO FALLBACK – hide broken video
  // ==========================================
  const heroVideo = document.querySelector('.hero-video');
  if (heroVideo) {
    heroVideo.addEventListener('error', function() {
      heroVideo.style.display = 'none';
    });
  }

  // ==========================================
  // TYPING ANIMATION FOR HERO SLOGAN
  // ==========================================
  const typingText = document.querySelector('.hero-slogan .typing-text');
  if (typingText) {
    const fullText = "Building Future Leaders Through Quality Education &amp; Character Development";
    let charIndex = 0;
    const typingSpeed = 50;

    function typeChar() {
      if (charIndex < fullText.length) {
        typingText.innerHTML = fullText.substring(0, charIndex + 1);
        charIndex++;
        setTimeout(typeChar, typingSpeed);
      } else {
        const cursor = document.querySelector('.hero-slogan .cursor');
        if (cursor) {
          setTimeout(() => {
            cursor.style.display = 'none';
          }, 2000);
        }
      }
    }

    typeChar();
  }

  // ==========================================
  // PREMIUM SCROLL‑TO‑TOP WITH PROGRESS RING
  // ==========================================
  const scrollToTop = document.getElementById('scrollToTop');
  if (scrollToTop) {
    window.addEventListener('scroll', function () {
      const winScroll = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (winScroll / height) * 100;

      if (winScroll > 300) {
        scrollToTop.classList.add('active');
      } else {
        scrollToTop.classList.remove('active');
      }

      scrollToTop.style.setProperty('--scroll-progress', Math.round(scrolled));
    });

    scrollToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ==========================================
  // CAROUSEL FACTORY FUNCTION
  // ==========================================
  function initializeCarousel(carouselId) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;

    const slides = carousel.querySelectorAll('.carousel-slide');
    const dots = carousel.querySelectorAll('.carousel-dot');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    let currentIndex = 0;
    let autoPlayInterval;

    function showSlide(index) {
      slides.forEach(s => s.classList.remove('active'));
      dots.forEach(d => d.classList.remove('active'));
      slides[index].classList.add('active');
      dots[index].classList.add('active');
      currentIndex = index;
    }

    function nextSlide() {
      const next = (currentIndex + 1) % slides.length;
      showSlide(next);
    }

    function prevSlide() {
      const prev = (currentIndex - 1 + slides.length) % slides.length;
      showSlide(prev);
    }

    function startAutoPlay() {
      autoPlayInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoPlay() {
      clearInterval(autoPlayInterval);
    }

    if (nextBtn) nextBtn.addEventListener('click', () => { stopAutoPlay(); nextSlide(); startAutoPlay(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { stopAutoPlay(); prevSlide(); startAutoPlay(); });

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const slideIndex = parseInt(dot.getAttribute('data-slide'));
        stopAutoPlay();
        showSlide(slideIndex);
        startAutoPlay();
      });
    });

    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);

    showSlide(0);
    startAutoPlay();
  }

  initializeCarousel('testimonialCarousel');
  initializeCarousel('alumniTestimonialCarousel');

  // ==========================================
  // ADMISSION PROGRESS INDICATOR (3 steps)
  // ==========================================
  (function() {
    const form = document.getElementById('admissionForm');
    if (!form) return;

    const steps = {
      parent: false,
      child: false,
      class: false,
      payment: false
    };

    const parentInput = document.getElementById('parentName');
    const childInput = document.getElementById('childName');
    const classSelect = document.getElementById('classSelect');

    const stepperSteps = document.querySelectorAll('.stepper-step');
    const stepperLines = document.querySelectorAll('.stepper-line');

    if (!stepperSteps.length || !stepperLines.length) return;

    function updateStepper() {
      steps.parent = parentInput && parentInput.value.trim().length >= 3;
      steps.child = childInput && childInput.value.trim().length >= 3;
      steps.class = classSelect && classSelect.value !== '';

      const stepArray = [steps.parent, steps.child, steps.class, steps.payment];

      stepperSteps.forEach((step, index) => {
        step.classList.remove('active', 'completed');

        if (index === 0) {
          if (steps.parent && steps.child) {
            step.classList.add('completed');
          } else if (steps.parent || steps.child) {
            step.classList.add('active');
          } else {
            step.classList.add('active');
          }
        } else {
          const prevDone = stepArray[index - 1];
          const currentDone = stepArray[index];

          if (currentDone) {
            step.classList.add('completed');
          } else if (prevDone) {
            step.classList.add('active');
          }
        }
      });

      stepperLines.forEach((line, i) => {
        if (stepArray[i]) {
          line.classList.add('completed');
        } else {
          line.classList.remove('completed');
        }
      });
    }

    updateStepper();

    if (parentInput) parentInput.addEventListener('input', updateStepper);
    if (childInput) childInput.addEventListener('input', updateStepper);
    if (classSelect) classSelect.addEventListener('change', updateStepper);

    form.addEventListener('reset', () => {
      setTimeout(updateStepper, 0);
    });

    window.markPaymentCompleted = function() {
      steps.payment = true;
      updateStepper();
    };
  })();

/* ============================================
   CHATBOT – Phase 1 (Modular Foundation)
   ============================================ */
(function() {
  'use strict';

  const toggleBtn = document.getElementById('chatbot-toggle');
  const windowEl = document.getElementById('chatbot-window');
  const closeBtn = document.getElementById('chatbot-close');
  const messagesContainer = document.getElementById('chatbot-messages');
  const inputEl = document.getElementById('chatbot-input');
  const sendBtn = document.getElementById('chatbot-send');

  // If chatbot elements don't exist, exit gracefully
  if (!toggleBtn || !windowEl) return;

  let isOpen = false;
  const STORAGE_KEY = 'bright_chatbot_history';

  const faq = [
    { keywords: ['admission', 'apply', 'enroll', 'enrol', 'register'], answer: 'Admission is open! Apply via our <a href="admission.html">Admission page</a>.' },
    { keywords: ['fee', 'fees', 'school fees', 'payment', 'cost'], answer: 'JSS 1‑3: ₦45,000; SS 1‑3: ₦55,000 per term.' },
    { keywords: ['subject', 'subjects', 'academic', 'curriculum'], answer: 'We offer Math, English, Sciences, ICT, etc.' },
    { keywords: ['gallery', 'photos'], answer: 'Visit our <a href="gallery.html">Gallery</a>.' },
    { keywords: ['contact', 'phone', 'email'], answer: 'Call +234 803 123 4567 or email info@brightinternationalschool.edu.ng' },
    { keywords: ['location', 'address', 'where'], answer: 'We are in Mbieri Mbitaolu, Imo State, Nigeria.' },
    { keywords: ['hello', 'hi', 'hey', 'greetings'], answer: "Hello! 👋 I'm the Bright International assistant. How can I help?" },
    { keywords: ['thank', 'thanks'], answer: "You're welcome! 😊" },
    { keywords: ['bye', 'goodbye'], answer: "Goodbye! 👋" }
  ];

  const fallbackAnswer = "I didn't understand. You can ask about admissions, fees, contact, etc.";

  function findAnswer(message) {
    const msg = message.toLowerCase().trim();
    for (let entry of faq) {
      for (let keyword of entry.keywords) {
        if (msg.includes(keyword)) {
          if (Array.isArray(entry.answer)) return entry.answer[Math.floor(Math.random() * entry.answer.length)];
          return entry.answer;
        }
      }
    }
    return fallbackAnswer;
  }

  function renderMessage(type, text) {
    const div = document.createElement('div');
    div.className = `message ${type}`;
    div.innerHTML = text;
    messagesContainer.appendChild(div);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function saveHistory() {
    const messages = [];
    document.querySelectorAll('.message').forEach(msg => {
      const type = msg.classList.contains('user') ? 'user' : 'bot';
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = msg.innerHTML;
      messages.push({ type, text: tempDiv.textContent.trim() });
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }

  function loadHistory() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    try { JSON.parse(saved).forEach(msg => renderMessage(msg.type, msg.text)); } catch(e) {}
  }

  function sendMessage() {
    const text = inputEl.value.trim();
    if (!text) return;
    renderMessage('user', text);
    inputEl.value = '';
    inputEl.focus();
    saveHistory();
    setTimeout(() => {
      renderMessage('bot', findAnswer(text));
      saveHistory();
    }, 600);
  }

  function openChat() {
    windowEl.classList.add('open');
    windowEl.setAttribute('aria-hidden', 'false');
    toggleBtn.style.display = 'none';
    inputEl.focus();
    isOpen = true;
  }

  function closeChat() {
    windowEl.classList.remove('open');
    windowEl.setAttribute('aria-hidden', 'true');
    toggleBtn.style.display = '';
    isOpen = false;
  }

  toggleBtn.addEventListener('click', openChat);
  closeBtn.addEventListener('click', closeChat);
  sendBtn.addEventListener('click', sendMessage);
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); sendMessage(); }
    if (e.key === 'Escape' && isOpen) closeChat();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && isOpen) closeChat(); });
  document.addEventListener('click', (e) => { if (isOpen && !windowEl.contains(e.target) && e.target !== toggleBtn) closeChat(); });

  const hasHistory = localStorage.getItem(STORAGE_KEY);
  if (hasHistory) loadHistory();
  else {
    renderMessage('bot', "Hello! 👋 I'm Bright International's assistant. Ask me about admissions, fees, etc.");
    saveHistory();
  }

  window.Chatbot = { open: openChat, close: closeChat, send: sendMessage, findAnswer, isOpen: () => isOpen };
})();

/* ============================================
   CHATBOT PHASE 2 – Voice Input & Recognition
   ============================================ */
(function() {
  'use strict';
  const waitForChatbot = setInterval(() => {
    const footer = document.querySelector('.chatbot-footer');
    const messagesContainer = document.getElementById('chatbot-messages');
    if (footer && messagesContainer && window.Chatbot) {
      clearInterval(waitForChatbot);
      initVoiceInput(footer);
    }
  }, 50);

  function initVoiceInput(footer) {
    const micBtn = document.createElement('button');
    micBtn.className = 'chatbot-mic-btn';
    micBtn.setAttribute('aria-label', 'Start voice input');
    micBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>`;
    const statusLabel = document.createElement('span');
    statusLabel.className = 'chatbot-mic-status hidden';
    statusLabel.setAttribute('aria-live', 'polite');
    const inputField = document.getElementById('chatbot-input');
    footer.insertBefore(micBtn, inputField);
    footer.insertBefore(statusLabel, inputField.nextSibling);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      micBtn.disabled = true;
      statusLabel.textContent = 'Not supported';
      statusLabel.classList.remove('hidden');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    let isListening = false;

    recognition.onstart = () => {
      isListening = true;
      micBtn.classList.add('listening');
      statusLabel.textContent = 'Listening…';
      statusLabel.classList.remove('hidden');
    };
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim();
      if (transcript && inputField) inputField.value = transcript;
      statusLabel.textContent = 'Processing…';
    };
    recognition.onerror = () => {
      statusLabel.textContent = 'Voice input stopped';
      setTimeout(() => { statusLabel.textContent = ''; statusLabel.classList.add('hidden'); }, 2000);
      stopListening();
    };
    recognition.onend = () => {
      if (isListening) {
        statusLabel.textContent = 'Voice input stopped';
        setTimeout(() => { statusLabel.textContent = ''; statusLabel.classList.add('hidden'); }, 1500);
      }
      stopListening();
    };

    function startListening() { if (window.Chatbot.isOpen()) { try { recognition.start(); } catch(e) {} } }
    function stopListening() { isListening = false; micBtn.classList.remove('listening'); try { recognition.stop(); } catch(e) {} }

    micBtn.addEventListener('click', () => { if (window.Chatbot.isOpen()) { if (isListening) stopListening(); else startListening(); } });
    micBtn.addEventListener('keydown', (e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); micBtn.click(); } });

    const originalClose = window.Chatbot.close;
    window.Chatbot.close = function() { if (isListening) stopListening(); originalClose(); };
  }
})();

/* ============================================
   CHATBOT PHASE 3 – Text‑to‑Speech (TTS) – ENHANCED
   ============================================ */
(function() {
  'use strict';
  const waitForChatbot = setInterval(() => {
    const header = document.querySelector('.chatbot-header');
    const messagesContainer = document.getElementById('chatbot-messages');
    if (header && messagesContainer && window.Chatbot) {
      clearInterval(waitForChatbot);
      initTextToSpeech(header, messagesContainer);
    }
  }, 50);

  function initTextToSpeech(header, messagesContainer) {
    const synth = window.speechSynthesis;
    if (!synth) return;

    const voiceToggle = document.createElement('button');
    voiceToggle.className = 'chatbot-voice-toggle';
    voiceToggle.setAttribute('aria-label', 'Mute voice responses');
    voiceToggle.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`;
    header.insertBefore(voiceToggle, header.lastChild);

    const STORAGE_KEY_TTS = 'bright_chatbot_tts_muted';
    let muted = localStorage.getItem(STORAGE_KEY_TTS) === 'true';

    function updateToggleUI() {
      if (muted) {
        voiceToggle.classList.add('muted');
        voiceToggle.setAttribute('aria-label', 'Unmute voice responses');
        voiceToggle.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>`;
      } else {
        voiceToggle.classList.remove('muted');
        voiceToggle.setAttribute('aria-label', 'Mute voice responses');
        voiceToggle.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`;
      }
    }

    voiceToggle.addEventListener('click', () => {
      muted = !muted;
      localStorage.setItem(STORAGE_KEY_TTS, muted);
      updateToggleUI();
      if (muted) synth.cancel();
    });
    updateToggleUI();

    let bestVoice = null;
    const VOICE_CACHE_KEY = 'bright_chatbot_voice_name';
    function getPreferredVoice() {
      if (bestVoice) return bestVoice;
      const voices = synth.getVoices();
      if (!voices.length) return null;
      const priority = ['Microsoft Aria Online (Natural) - English (United States)', 'Microsoft Aria', 'Microsoft Jenny', 'Microsoft Guy', 'Google UK English Female', 'Google US English Female', 'Google US English', 'Samantha'];
      for (const name of priority) {
        const match = voices.find(v => v.name === name);
        if (match) { bestVoice = match; localStorage.setItem(VOICE_CACHE_KEY, bestVoice.name); return bestVoice; }
      }
      const natural = voices.find(v => v.lang.startsWith('en') && /natural|premium/i.test(v.name));
      if (natural) { bestVoice = natural; localStorage.setItem(VOICE_CACHE_KEY, bestVoice.name); return bestVoice; }
      const anyEn = voices.find(v => v.lang.startsWith('en'));
      if (anyEn) { bestVoice = anyEn; localStorage.setItem(VOICE_CACHE_KEY, bestVoice.name); return bestVoice; }
      return null;
    }
    const cachedName = localStorage.getItem(VOICE_CACHE_KEY);
    if (cachedName) {
      const voices = synth.getVoices();
      const found = voices.find(v => v.name === cachedName);
      if (found) bestVoice = found;
    }
    synth.addEventListener('voiceschanged', () => { if (!bestVoice) bestVoice = null; });

    const speechQueue = [];
    let speaking = false;
    function speakNext() {
      if (!speechQueue.length) { speaking = false; return; }
      speaking = true;
      const { text, tone } = speechQueue.shift();
      const utterance = new SpeechSynthesisUtterance(text);
      if (tone === 'greeting') { utterance.rate = 0.92; utterance.pitch = 1.06; }
      else if (tone === 'instruction') { utterance.rate = 0.88; utterance.pitch = 1.0; }
      else { utterance.rate = 0.9; utterance.pitch = 1.0; }
      utterance.volume = 1.0;
      const voice = getPreferredVoice();
      if (voice) utterance.voice = voice;
      utterance.onend = () => setTimeout(() => speakNext(), 200);
      utterance.onerror = () => speakNext();
      synth.speak(utterance);
    }

    function speakChunked(text, tone) {
      if (muted) return;
      synth.cancel();
      speechQueue.length = 0;
      speaking = false;
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = text;
      const plain = tempDiv.textContent.trim();
      if (!plain) return;
      const chunks = plain.match(/[^.!?\n]+[.!?\n]*/g) || [plain];
      chunks.forEach(chunk => speechQueue.push({ text: chunk.trim(), tone }));
      speakNext();
    }

    function detectTone(text) {
      const lower = text.toLowerCase();
      if (/(hello|hi|hey|greetings|welcome)/i.test(lower)) return 'greeting';
      if (/(step|steps|click|go to|please|instruction)/i.test(lower)) return 'instruction';
      return 'neutral';
    }

    let observerInitialised = false;
    function startObserving() {
      if (observerInitialised) return;
      observerInitialised = true;
      const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1 && node.classList.contains('message') && node.classList.contains('bot')) {
              speakChunked(node.innerHTML, detectTone(node.innerHTML));
            }
          });
        });
      });
      observer.observe(messagesContainer, { childList: true, subtree: false });
    }
    setTimeout(startObserving, 100);

    const originalClose = window.Chatbot.close;
    window.Chatbot.close = function() {
      synth.cancel();
      speechQueue.length = 0;
      speaking = false;
      originalClose();
    };

    window.Chatbot.tts = {
      mute: () => { if (!muted) { muted = true; localStorage.setItem(STORAGE_KEY_TTS, true); updateToggleUI(); synth.cancel(); } },
      unmute: () => { if (muted) { muted = false; localStorage.setItem(STORAGE_KEY_TTS, false); updateToggleUI(); } },
      isMuted: () => muted,
      speak: (text) => speakChunked(text, 'neutral')
    };
  }
})();

  // ==========================================
  // DARK MODE TOGGLE
  // ==========================================
  (function() {
    const toggleBtn = document.getElementById('theme-toggle');
    if (!toggleBtn) return;

    const html = document.documentElement;
    const sunIcon = document.querySelector('.theme-icon-sun');
    const moonIcon = document.querySelector('.theme-icon-moon');

    function setUI(isDark) {
      if (isDark) {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
        toggleBtn.setAttribute('aria-label', 'Switch to light mode');
        toggleBtn.setAttribute('aria-pressed', 'true');
      } else {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
        toggleBtn.setAttribute('aria-label', 'Switch to dark mode');
        toggleBtn.setAttribute('aria-pressed', 'false');
      }
    }

    setUI(html.classList.contains('dark'));

    toggleBtn.addEventListener('click', () => {
      const isDark = html.classList.toggle('dark');
      localStorage.setItem('bright_theme', isDark ? 'dark' : 'light');
      setUI(isDark);
    });

    toggleBtn.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        toggleBtn.click();
      }
    });
  })();
});