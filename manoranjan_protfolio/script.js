/**
 * MANORANJAN L — CREATIVE 3D EDITORIAL PORTFOLIO
 * Vanilla JavaScript Engine: 3D Tilt, Particle Atmosphere, Cursor & Navigation
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Check user motion preferences and touch capability
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  /* --------------------------------------------------------------------------
     01. DYNAMIC METADATA & LIVE IST CLOCK
     -------------------------------------------------------------------------- */
  // Dynamic Current Year in Footer
  const yearElem = document.getElementById('current-year');
  if (yearElem) {
    yearElem.textContent = new Date().getFullYear();
  }

  // Live Indian Standard Time (IST) Clock in Contact Section
  const istClock = document.getElementById('live-ist-clock');
  function updateISTClock() {
    if (!istClock) return;
    const now = new Date();
    // Format to Indian Standard Time (Asia/Kolkata)
    const options = {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };
    try {
      const timeStr = new Intl.DateTimeFormat('en-GB', options).format(now);
      istClock.textContent = `${timeStr} IST`;
    } catch (e) {
      // Fallback
      istClock.textContent = `${now.toTimeString().split(' ')[0]} IST`;
    }
  }
  updateISTClock();
  setInterval(updateISTClock, 1000);

  /* --------------------------------------------------------------------------
     02. SCROLL PROGRESS BAR
     -------------------------------------------------------------------------- */
  const scrollProgress = document.getElementById('scroll-progress');
  function handleScrollProgress() {
    if (!scrollProgress) return;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (docHeight > 0) {
      const progressPercent = (scrollTop / docHeight) * 100;
      scrollProgress.style.width = `${progressPercent}%`;
    }
  }
  window.addEventListener('scroll', handleScrollProgress, { passive: true });

  /* --------------------------------------------------------------------------
     03. NAVIGATION & ACTIVE SECTION HIGHLIGHTING
     -------------------------------------------------------------------------- */
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const sections = document.querySelectorAll('section[id]');

  const sectionObserverOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          const href = link.getAttribute('href').replace('#', '');
          if (href === id) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, sectionObserverOptions);

  sections.forEach(sec => sectionObserver.observe(sec));

  /* --------------------------------------------------------------------------
     04. MOBILE DRAWER NAVIGATION
     -------------------------------------------------------------------------- */
  const menuToggle = document.getElementById('menu-toggle');
  const menuClose = document.getElementById('menu-close');
  const mobileNav = document.getElementById('mobile-nav');
  const navBackdrop = document.getElementById('nav-backdrop');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  function openMobileMenu() {
    if (!mobileNav || !navBackdrop) return;
    mobileNav.classList.add('active');
    navBackdrop.classList.add('active');
    mobileNav.setAttribute('aria-hidden', 'false');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (!mobileNav || !navBackdrop) return;
    mobileNav.classList.remove('active');
    navBackdrop.classList.remove('active');
    mobileNav.setAttribute('aria-hidden', 'true');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (menuToggle) menuToggle.addEventListener('click', openMobileMenu);
  if (menuClose) menuClose.addEventListener('click', closeMobileMenu);
  if (navBackdrop) navBackdrop.addEventListener('click', closeMobileMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav && mobileNav.classList.contains('active')) {
      closeMobileMenu();
    }
  });

  /* --------------------------------------------------------------------------
     05. MINIMAL EDITORIAL CURSOR (Desktop Only)
     -------------------------------------------------------------------------- */
  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');

  if (cursorDot && cursorRing && !isTouchDevice && !prefersReducedMotion) {
    let mouseX = -100, mouseY = -100;
    let ringX = -100, ringY = -100;
    let isVisible = false;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        cursorDot.style.opacity = '1';
        cursorRing.style.opacity = '1';
        ringX = mouseX;
        ringY = mouseY;
        isVisible = true;
      }

      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      cursorDot.style.opacity = '0';
      cursorRing.style.opacity = '0';
      isVisible = false;
    });

    // Smooth lerp loop for the outer trailing crosshair/ring
    function renderCursor() {
      if (isVisible) {
        const factor = 0.18;
        ringX += (mouseX - ringX) * factor;
        ringY += (mouseY - ringY) * factor;

        cursorRing.style.left = `${ringX}px`;
        cursorRing.style.top = `${ringY}px`;
      }
      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // Expand cursor ring on clickable or interactive elements
    const interactiveElements = document.querySelectorAll(
      'a, button, .hero-photo-frame, .project-3d-tilt-box, .skill-stamp-card, .leadership-card, .portrait-frame, .social-chip, .btn'
    );

    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  } else {
    // Hide custom cursor elements if on mobile or reduced-motion
    if (cursorDot) cursorDot.style.display = 'none';
    if (cursorRing) cursorRing.style.display = 'none';
  }

  /* --------------------------------------------------------------------------
     06. HERO 3D PERSPECTIVE TILT (Mouse-Responsive Vanilla JS)
     -------------------------------------------------------------------------- */
  const heroStage = document.getElementById('hero-stage');
  const heroCard = document.getElementById('hero-card');
  const outlineDepth = document.querySelector('.title-outline-depth');
  const brushForeground = document.querySelector('.title-brush-foreground');
  const heroPhotoFrame = document.querySelector('.hero-photo-frame');

  if (heroStage && heroCard && !isTouchDevice && !prefersReducedMotion) {
    let targetRotateX = 0;
    let targetRotateY = 0;
    let currentRotateX = 0;
    let currentRotateY = 0;
    let isMouseOver = false;

    heroStage.addEventListener('mousemove', (e) => {
      const rect = heroStage.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Normalized coordinates (-1 to 1)
      const normX = (e.clientX - centerX) / (rect.width / 2);
      const normY = (e.clientY - centerY) / (rect.height / 2);

      // Constrain rotation to subtle, refined values (max 8 degrees)
      targetRotateX = -normY * 6;
      targetRotateY = normX * 8;
      isMouseOver = true;
    }, { passive: true });

    heroStage.addEventListener('mouseleave', () => {
      targetRotateX = 0;
      targetRotateY = 0;
      isMouseOver = false;
    });

    function updateHeroTilt() {
      const lerp = 0.08;
      currentRotateX += (targetRotateX - currentRotateX) * lerp;
      currentRotateY += (targetRotateY - currentRotateY) * lerp;

      if (Math.abs(currentRotateX) > 0.01 || Math.abs(currentRotateY) > 0.01 || isMouseOver) {
        heroCard.style.transform = `rotateX(${currentRotateX.toFixed(2)}deg) rotateY(${currentRotateY.toFixed(2)}deg)`;

        // Parallax translation on outline lettering
        if (outlineDepth) {
          const depthX = -currentRotateY * 1.5;
          const depthY = -currentRotateX * 1.5;
          outlineDepth.style.transform = `translate(-50%, -50%) translate3d(${depthX.toFixed(1)}px, ${depthY.toFixed(1)}px, -35px)`;
        }

        // Parallax translation on front brush lettering
        if (brushForeground) {
          const frontX = currentRotateY * 0.8;
          const frontY = currentRotateX * 0.8;
          brushForeground.style.transform = `translate3d(${frontX.toFixed(1)}px, ${frontY.toFixed(1)}px, 45px)`;
        }

        // Parallax depth translation on hero photo frame
        if (heroPhotoFrame) {
          const photoX = currentRotateY * 1.0;
          const photoY = currentRotateX * 1.0;
          heroPhotoFrame.style.transform = `rotate(-1.5deg) translate3d(${photoX.toFixed(1)}px, ${photoY.toFixed(1)}px, 20px)`;
        }
      } else {
        heroCard.style.transform = 'rotateX(0deg) rotateY(0deg)';
        if (outlineDepth) outlineDepth.style.transform = 'translate(-50%, -50%) translateZ(-35px)';
        if (brushForeground) brushForeground.style.transform = 'translateZ(45px)';
        if (heroPhotoFrame) heroPhotoFrame.style.transform = 'rotate(-1.5deg) translate3d(0, 0, 0)';
      }

      requestAnimationFrame(updateHeroTilt);
    }
    requestAnimationFrame(updateHeroTilt);
  }

  /* --------------------------------------------------------------------------
     07. PROJECT ROWS 3D TILT EFFECT
     -------------------------------------------------------------------------- */
  const projectCards = document.querySelectorAll('.project-3d-tilt-box');

  if (!isTouchDevice && !prefersReducedMotion) {
    projectCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = -((y - centerY) / centerY) * 4;
        const rotateY = ((x - centerX) / centerX) * 4;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(8px)`;
      }, { passive: true });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
      });
    });
  }

  /* --------------------------------------------------------------------------
     08. COPY EMAIL TO CLIPBOARD
     -------------------------------------------------------------------------- */
  const copyBtn = document.getElementById('copy-email-btn');
  const copyFeedback = document.getElementById('copy-feedback');
  const targetEmail = 'manuaradhya2326@gmail.com';

  if (copyBtn && copyFeedback) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(targetEmail);
        copyFeedback.textContent = '✓ COPIED TO CLIPBOARD';
        copyFeedback.style.opacity = '1';
        copyBtn.style.backgroundColor = 'var(--ink-primary)';
        copyBtn.style.color = 'var(--bg-paper)';

        setTimeout(() => {
          copyFeedback.style.opacity = '0';
          copyBtn.style.backgroundColor = '';
          copyBtn.style.color = '';
          setTimeout(() => { copyFeedback.textContent = ''; }, 300);
        }, 2800);
      } catch (err) {
        // Fallback for older browsers
        const tempInput = document.createElement('input');
        tempInput.value = targetEmail;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        copyFeedback.textContent = '✓ COPIED';
        setTimeout(() => { copyFeedback.textContent = ''; }, 2800);
      }
    });
  }

  /* --------------------------------------------------------------------------
     09. AMBIENT DUST & INK PARTICLES CANVAS
     -------------------------------------------------------------------------- */
  const canvas = document.getElementById('ambient-canvas');
  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Subtle particles mimicking graphite flakes and paper dust
    const particleCount = Math.min(Math.floor(width / 35), 38);
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.4 + 0.6,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18 - 0.05,
        alpha: Math.random() * 0.22 + 0.06
      });
    }

    let isCanvasActive = true;
    document.addEventListener('visibilitychange', () => {
      isCanvasActive = !document.hidden;
    });

    function animateParticles() {
      if (!isCanvasActive) {
        requestAnimationFrame(animateParticles);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(17, 17, 17, ${p.alpha})`;
        ctx.fill();
      });

      requestAnimationFrame(animateParticles);
    }
    requestAnimationFrame(animateParticles);

    // Debounced Resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      }, 150);
    }, { passive: true });
  }

  /* --------------------------------------------------------------------------
     10. SCROLL REVEAL STAGGER ANIMATIONS (IntersectionObserver)
     -------------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll(
    '.project-editorial-row, .about-editorial-grid, .skill-category-block, .leadership-card, .contact-channel-card, .social-links-shelf'
  );

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1), transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)';
      revealObserver.observe(el);
    });
  }

  console.log('Manoranjan L Portfolio engine initialized successfully.');
});
