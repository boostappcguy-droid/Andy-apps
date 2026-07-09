(function () {
  'use strict';

  /* Footer year */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Mobile nav toggle */
  var hamburger = document.getElementById('hamburger');
  var mobileNav = document.getElementById('mobileNav');

  function closeMobileNav() {
    hamburger.classList.remove('is-active');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('is-open');
  }

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () {
      var isOpen = mobileNav.classList.toggle('is-open');
      hamburger.classList.toggle('is-active', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMobileNav);
    });
  }

  /* Scroll reveal */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* Zip code coverage checker (front-end demo) */
  var zipBtn = document.getElementById('zipBtn');
  var zipInput = document.getElementById('zipInput');
  var zipResult = document.getElementById('zipResult');

  var coveredPrefixes = ['770', '773', '774', '775', '776', '777']; // Greater Houston / Tomball / Conroe / The Woodlands area

  if (zipBtn && zipInput && zipResult) {
    zipBtn.addEventListener('click', function () {
      var zip = zipInput.value.trim();
      zipResult.classList.remove('is-success', 'is-warn');

      if (!/^\d{5}$/.test(zip)) {
        zipResult.textContent = 'Please enter a valid 5-digit zip code.';
        zipResult.classList.add('is-warn');
        return;
      }

      var prefix = zip.substring(0, 3);
      var isCovered = coveredPrefixes.indexOf(prefix) !== -1;

      if (isCovered) {
        zipResult.textContent = 'Good news! We likely service ' + zip + '. Call (832) 713-5266 to confirm and schedule.';
        zipResult.classList.add('is-success');
      } else {
        zipResult.textContent = 'We may still be able to help in ' + zip + ' — give us a call at (832) 713-5266 to confirm coverage.';
        zipResult.classList.add('is-warn');
      }
    });

    zipInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') zipBtn.click();
    });
  }

  /* Contact form validation + simulated submit */
  var form = document.getElementById('contactForm');
  var formSuccess = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;

      var name = document.getElementById('name');
      var phone = document.getElementById('phone');
      var email = document.getElementById('email');
      var service = document.getElementById('service');

      function toggleField(field, condition) {
        var group = field.closest('.form-group');
        if (condition) {
          group.classList.remove('is-invalid');
        } else {
          group.classList.add('is-invalid');
          valid = false;
        }
      }

      toggleField(name, name.value.trim().length > 1);
      toggleField(phone, /^[\d\s\-\(\)\+]{7,}$/.test(phone.value.trim()));
      toggleField(email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()));
      toggleField(service, service.value !== '');

      if (!valid) {
        formSuccess.classList.remove('is-visible');
        return;
      }

      formSuccess.textContent = 'Thanks, ' + name.value.trim().split(' ')[0] + '! Your request has been received. Our team will contact you shortly, or call us now at (832) 713-5266.';
      formSuccess.classList.add('is-visible');
      form.reset();
    });
  }

  /* Header shadow on scroll */
  var header = document.getElementById('header');
  if (header) {
    var lastScroll = 0;
    window.addEventListener('scroll', function () {
      var current = window.pageYOffset;
      if (current > 10) {
        header.style.boxShadow = '0 6px 24px rgba(11,31,51,0.08)';
      } else {
        header.style.boxShadow = 'none';
      }
      lastScroll = current;
    });
  }
})();
