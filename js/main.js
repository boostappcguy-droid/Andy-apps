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

  /* Contact form validation + Netlify Forms submit */
  var form = document.getElementById('contactForm');
  var formSuccess = document.getElementById('formSuccess');

  function encodeFormData(data) {
    return Object.keys(data)
      .map(function (key) { return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]); })
      .join('&');
  }

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

      formSuccess.classList.remove('is-visible', 'is-error');

      if (!valid) {
        return;
      }

      var submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;

      var formData = new FormData(form);
      var payload = {};
      formData.forEach(function (value, key) { payload[key] = value; });

      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encodeFormData(payload)
      })
        .then(function (response) {
          submitBtn.disabled = false;
          if (!response.ok) throw new Error('Bad response: ' + response.status);
          formSuccess.textContent = 'Thanks, ' + name.value.trim().split(' ')[0] + '! Your request has been received. Our team will contact you shortly, or call us now at (832) 713-5266.';
          formSuccess.classList.add('is-visible');
          form.reset();
        })
        .catch(function () {
          submitBtn.disabled = false;
          formSuccess.textContent = 'Sorry, something went wrong sending your request. Please call us directly at (832) 713-5266.';
          formSuccess.classList.add('is-visible', 'is-error');
        });
    });
  }

  /* Google reviews (served by Netlify function so the API key stays server-side) */
  var gBox = document.getElementById('googleReviews');
  if (gBox && window.fetch) {
    var starString = function (n) {
      var full = Math.round(n);
      var s = '';
      for (var i = 0; i < 5; i++) s += i < full ? '★' : '☆';
      return s;
    };

    fetch('/.netlify/functions/reviews')
      .then(function (r) {
        if (!r.ok) throw new Error('reviews unavailable: ' + r.status);
        return r.json();
      })
      .then(function (data) {
        if (!data || !data.reviews || !data.reviews.length) return;

        document.getElementById('gStars').textContent = starString(data.rating);
        document.getElementById('gMeta').textContent =
          data.rating.toFixed(1) + ' rating · ' + data.total + ' Google reviews';

        var grid = document.getElementById('gGrid');
        data.reviews.forEach(function (v) {
          var card = document.createElement('div');
          card.className = 'greview';

          var head = document.createElement('div');
          head.className = 'greview__head';
          if (v.photo) {
            var img = document.createElement('img');
            img.src = v.photo;
            img.alt = '';
            img.loading = 'lazy';
            img.referrerPolicy = 'no-referrer';
            head.appendChild(img);
          }
          var who = document.createElement('div');
          var name = document.createElement('strong');
          name.textContent = v.author || 'Google user';
          var when = document.createElement('span');
          when.textContent = v.when || '';
          who.appendChild(name);
          who.appendChild(when);
          head.appendChild(who);

          var stars = document.createElement('div');
          stars.className = 'greview__stars';
          stars.textContent = starString(v.rating);

          var text = document.createElement('p');
          var t = v.text || '';
          if (t.length > 220) t = t.slice(0, 217).replace(/\s+\S*$/, '') + '…';
          text.textContent = t;

          card.appendChild(head);
          card.appendChild(stars);
          card.appendChild(text);
          grid.appendChild(card);
        });

        gBox.hidden = false;
      })
      .catch(function () {
        /* Not configured yet or running without Netlify functions — section stays hidden. */
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
