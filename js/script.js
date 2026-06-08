/* =========================================================
   SMA Nusantara - Vanilla JS
   - Toggle hamburger menu
   - Animasi counter statistik
   - Filter & lightbox galeri
   - Validasi form kontak
   - Tahun footer otomatis
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initStatsCounter();
  initGallery();
  initContactForm();
  initFooterYear();
  highlightActiveNav();
});

/* ---------- Navbar ---------- */
function initNavbar() {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  // Tutup menu saat klik link (mobile)
  menu.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.classList.remove('open');
    })
  );
}

/* ---------- Highlight active nav berdasarkan URL ---------- */
function highlightActiveNav() {
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-menu a').forEach(a => {
    const href = a.getAttribute('href').split('/').pop();
    if (href === path) a.classList.add('active');
  });
}

/* ---------- Counter animasi ---------- */
function initStatsCounter() {
  const els = document.querySelectorAll('.stat-card .num[data-target]');
  if (!els.length) return;

  const animate = el => {
    const target = +el.dataset.target;
    const dur = 1400;
    const start = performance.now();
    const step = now => {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.floor(p * target).toLocaleString('id-ID');
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString('id-ID');
    };
    requestAnimationFrame(step);
  };

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animate(e.target);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });

  els.forEach(el => io.observe(el));
}

/* ---------- Galeri (filter + lightbox) ---------- */
function initGallery() {
  const grid = document.querySelector('.gallery-grid');
  if (!grid) return;

  // Filter
  const buttons = document.querySelectorAll('.gallery-filter button');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      grid.querySelectorAll('.gallery-item').forEach(item => {
        const match = cat === 'all' || item.dataset.category === cat;
        item.style.display = match ? '' : 'none';
      });
    });
  });

  // Lightbox
  const lightbox = document.querySelector('.lightbox');
  const lightboxContent = document.querySelector('.lightbox-content');
  const lightboxClose = document.querySelector('.lightbox-close');

  grid.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const title = item.dataset.title || 'Galeri';
      const bg = item.querySelector('.ph').style.background;
      lightboxContent.innerHTML = `
        <div style="width:min(80vw,720px);height:min(60vh,480px);border-radius:12px;background:${bg};display:grid;place-items:center;color:#fff;font-size:1.4rem;font-weight:700;padding:24px;">
          ${title}
        </div>
        <p style="margin-top:14px;color:#1a2230;font-weight:600;">${title}</p>
      `;
      lightbox.classList.add('open');
    });
  });

  const close = () => lightbox.classList.remove('open');
  lightboxClose?.addEventListener('click', close);
  lightbox?.addEventListener('click', e => { if (e.target === lightbox) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}

/* ---------- Form Kontak ---------- */
function initContactForm() {
  const form = document.querySelector('#contact-form');
  if (!form) return;

  const success = form.querySelector('.form-success');

  const showError = (input, msg) => {
    input.classList.add('invalid');
    const err = input.parentElement.querySelector('.error-msg');
    if (err) err.textContent = msg;
  };
  const clearError = input => {
    input.classList.remove('invalid');
    const err = input.parentElement.querySelector('.error-msg');
    if (err) err.textContent = '';
  };

  form.addEventListener('submit', e => {
    e.preventDefault();
    success.classList.remove('show');

    const name = form.querySelector('[name="name"]');
    const email = form.querySelector('[name="email"]');
    const message = form.querySelector('[name="message"]');
    let valid = true;

    [name, email, message].forEach(clearError);

    if (!name.value.trim() || name.value.trim().length < 2) {
      showError(name, 'Nama minimal 2 karakter.');
      valid = false;
    }
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email.value.trim())) {
      showError(email, 'Masukkan email yang valid.');
      valid = false;
    }
    if (!message.value.trim() || message.value.trim().length < 10) {
      showError(message, 'Pesan minimal 10 karakter.');
      valid = false;
    }

    if (valid) {
      success.classList.add('show');
      form.reset();
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  // Live clear
  form.querySelectorAll('input, textarea').forEach(el =>
    el.addEventListener('input', () => clearError(el))
  );
}

/* ---------- Footer tahun otomatis ---------- */
function initFooterYear() {
  const el = document.querySelector('#year');
  if (el) el.textContent = new Date().getFullYear();
}
