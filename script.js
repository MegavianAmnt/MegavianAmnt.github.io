// ============ EFEK MENGETIK ============
const roles = ['Business Intelligence', 'Data Analyst', 'BINUS TV Club'];
const typingEl = document.getElementById('typing');
let roleIdx = 0, charIdx = 0, deleting = false;

function type() {
  const current = roles[roleIdx];
  typingEl.textContent = current.substring(0, charIdx);
  if (!deleting && charIdx < current.length) charIdx++;
  else if (deleting && charIdx > 0) charIdx--;
  else {
    deleting = !deleting;
    if (!deleting) roleIdx = (roleIdx + 1) % roles.length;
    return setTimeout(type, deleting ? 1500 : 300);
  }
  setTimeout(type, deleting ? 50 : 100);
}
type();

// ============ NAVBAR & TOMBOL KE ATAS ============
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  backToTop.classList.toggle('show', window.scrollY > 500);

  let currentId = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) currentId = sec.id;
  });
  navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + currentId));
});
backToTop.addEventListener('click', () => window.scrollTo({ top: 0 }));

// ============ MENU MOBILE ============
const navLinks = document.getElementById('navLinks');
document.getElementById('hamburger').addEventListener('click', () => navLinks.classList.toggle('open'));
navAnchors.forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

// ============ MODE GELAP ============
const themeToggle = document.getElementById('themeToggle');
// localStorage bisa diblokir (mode private / file://), jadi dibungkus try-catch
const storage = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* abaikan */ } },
};
function setTheme(dark) {
  document.body.classList.toggle('dark', dark);
  themeToggle.textContent = dark ? '☀️' : '🌙';
  storage.set('theme', dark ? 'dark' : 'light');
}
setTheme(storage.get('theme') === 'dark');
themeToggle.addEventListener('click', () => setTheme(!document.body.classList.contains('dark')));

// ============ ANIMASI SAAT SCROLL ============
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    entry.target.querySelectorAll('[data-target]').forEach(animateCounter);
    observer.unobserve(entry.target);
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

function animateCounter(el) {
  const raw = el.dataset.target;
  // Placeholder seperti "3.xx" ditampilkan apa adanya
  if (!/^\d+(\.\d+)?$/.test(raw)) { el.textContent = raw; return; }
  const target = parseFloat(raw);
  const decimals = (raw.split('.')[1] || '').length;
  const suffix = decimals === 0 ? '+' : ''; // "5" -> "5+", IPK "3.75" -> "3.75"
  let start = null;
  function step(ts) {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / 1200, 1);
    el.textContent = (target * progress).toFixed(decimals) + (progress === 1 ? suffix : '');
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// ============ FILTER PROYEK ============
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('.filter-btn.active').classList.remove('active');
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.project-card').forEach(card => {
      card.classList.toggle('hide', filter !== 'all' && card.dataset.category !== filter);
    });
  });
});

// ============ FORM KONTAK (membuka aplikasi email) ============
document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;
  const subject = encodeURIComponent(`Pesan dari ${name} (Portofolio)`);
  const body = encodeURIComponent(`${message}\n\nDari: ${name} <${email}>`);
  window.location.href = `mailto:emailkamu@gmail.com?subject=${subject}&body=${body}`;
});

// ============ TAHUN FOOTER ============
document.getElementById('year').textContent = new Date().getFullYear();
