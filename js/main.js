/* ===================================================
   Cayao Nieto – Portfolio JavaScript
   =================================================== */

'use strict';

// ── Navbar: scroll shadow & active link highlighting ──────────────────────────
(function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id], header[id]');
  const toggle   = document.getElementById('nav-toggle');
  const linkList = document.getElementById('nav-links');

  // Sticky shadow on scroll
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
    highlightActiveLink();
  }, { passive: true });

  // Highlight nav link matching current section
  function highlightActiveLink() {
    let current = '';
    sections.forEach((sec) => {
      const top = sec.offsetTop - 90;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });
    navLinks.forEach((link) => {
      link.classList.toggle(
        'active',
        link.getAttribute('href') === '#' + current
      );
    });
  }

  // Mobile menu toggle
  toggle.addEventListener('click', () => {
    const isOpen = linkList.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close mobile menu when a link is clicked
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      linkList.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}());


// ── Animated stat counters ────────────────────────────────────────────────────
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        animateCounter(entry.target);
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((el) => observer.observe(el));

  function animateCounter(el) {
    const target   = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1200;
    const step     = 16;
    const steps    = Math.ceil(duration / step);
    let   current  = 0;

    const timer = setInterval(() => {
      current += Math.ceil(target / steps);
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = current;
    }, step);
  }
}());


// ── Skill bar fill animation ──────────────────────────────────────────────────
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-fill[data-width]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        entry.target.style.width = entry.target.getAttribute('data-width') + '%';
      });
    },
    { threshold: 0.4 }
  );

  bars.forEach((bar) => observer.observe(bar));
}());


// ── Add-goal form (persisted in localStorage) ─────────────────────────────────
(function initGoalForm() {
  const form      = document.getElementById('goal-form');
  const input     = document.getElementById('goal-input');
  const errorMsg  = document.getElementById('goal-error');
  const goalsList = document.getElementById('user-goals');
  const STORAGE_KEY = 'cn_user_goals';

  // Load saved goals
  loadGoals();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();

    if (!text) {
      showError('Please enter a goal before adding.');
      return;
    }

    clearError();
    addGoal(text);
    saveGoals();
    input.value = '';
    input.focus();
  });

  function addGoal(text) {
    const li = document.createElement('li');
    li.className = 'goal-item user-added';
    li.dataset.text = text;

    const check = document.createElement('span');
    check.className = 'goal-check';
    check.textContent = '★';

    const textNode = document.createTextNode(' ' + text);

    const removeBtn = document.createElement('button');
    removeBtn.className = 'goal-remove';
    removeBtn.setAttribute('aria-label', 'Remove goal: ' + text);
    removeBtn.textContent = '×';
    removeBtn.style.cssText = [
      'margin-left:auto',
      'background:none',
      'border:none',
      'color:var(--color-text-muted)',
      'cursor:pointer',
      'font-size:1.1rem',
      'line-height:1',
      'flex-shrink:0',
    ].join(';');

    removeBtn.addEventListener('click', () => {
      li.remove();
      saveGoals();
    });

    li.appendChild(check);
    li.appendChild(textNode);
    li.appendChild(removeBtn);
    goalsList.appendChild(li);
  }

  function saveGoals() {
    const texts = Array.from(goalsList.querySelectorAll('.goal-item.user-added'))
      .map((li) => li.dataset.text)
      .filter(Boolean);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(texts));
    } catch (_) {
      // localStorage may be unavailable in some contexts – fail silently
    }
  }

  function loadGoals() {
    let saved;
    try {
      saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch (_) {
      saved = [];
    }
    if (Array.isArray(saved)) {
      saved.forEach((text) => {
        if (typeof text === 'string') {
          const trimmed = text.trim();
          if (trimmed) addGoal(trimmed);
        }
      });
    }
  }

  function showError(msg) {
    errorMsg.textContent = msg;
    input.setAttribute('aria-invalid', 'true');
  }

  function clearError() {
    errorMsg.textContent = '';
    input.removeAttribute('aria-invalid');
  }
}());


// ── Scroll-reveal for cards ───────────────────────────────────────────────────
(function initScrollReveal() {
  const targets = document.querySelectorAll(
    '.project-card, .contact-card, .about-card, .skill-item'
  );

  // Start hidden
  targets.forEach((el) => {
    el.style.opacity  = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach((el) => observer.observe(el));
}());
