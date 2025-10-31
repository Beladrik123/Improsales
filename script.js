// включаем режим анимаций
document.documentElement.classList.add('anim');

const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');

/* ===== тема: автодетект + переключатель с текстом ===== */
(function initTheme(){
  const saved = localStorage.getItem('theme'); // 'light' | 'dark' | null
  if (saved === 'dark') root.classList.add('theme-dark');
  if (saved === 'light') root.classList.remove('theme-dark');
  updateThemeLabel();
})();
function updateThemeLabel(){
  if (!themeToggle) return;
  const isDark = root.classList.contains('theme-dark');
  themeToggle.textContent = isDark ? 'Тёмная' : 'Светлая';   // ← видимая надпись
  themeToggle.title = 'Переключить тему';
}
function switchTheme(){
  const isDark = root.classList.toggle('theme-dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  updateThemeLabel();
}
if (themeToggle){
  themeToggle.addEventListener('click', switchTheme);
}

/* ===== шапка: бургер и тень при скролле ===== */
const header = document.querySelector('.site-header');
const burger = document.getElementById('burger');
const mainNav = document.getElementById('mainNav');

if (burger && mainNav) {
  burger.addEventListener('click', () => mainNav.classList.toggle('open'));
  mainNav.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => mainNav.classList.remove('open'))
  );
}
function onScrollHeader() {
  if (!header) return;
  header.classList.toggle('scrolled', window.scrollY > 6);
}
onScrollHeader();
addEventListener('scroll', onScrollHeader);

/* ===== год в подвале ===== */
const y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();

/* ===== кейсы ===== */
const CASES = [
  { title:'Dress Code — спецодежда', niche:'B2B', result:'Повторные продажи +32% за 3 мес', img:'img/case1.jpeg', excerpt:'CRM-связки, WhatsApp-автоворонки, регламенты 1:1.', link:'#contacts', isLogo:true },
  { title:'INTANT', niche:'B2B', result:'Цикл сделки −21%', img:'img/case2.png',  excerpt:'Стандартизация прайсов, аналитика, KPI.', link:'#contacts', isLogo:true },
  { title:'Allergo Clinic', niche:'Медицина', result:'Запись на приём +24%', img:'img/case3.jpeg', excerpt:'Скрипты кол-центра, напоминания, корректные ответы о квалификации.', link:'#contacts', isLogo:true },
  { title:'Центр молекулярной медицины', niche:'Медицина', result:'Конверсия консультаций +18%', img:'img/case4.jpeg', excerpt:'Онлайн-заявки, маршрут пациента, отчётность по каналам.', link:'#contacts', isLogo:true }
];
const CASE_CATEGORIES = ['Все','B2B','Медицина'];
const filtersWrap = document.getElementById('caseFilters');
const grid = document.getElementById('casesGrid');

function renderFilters(active='Все'){
  if(!filtersWrap) return;
  filtersWrap.innerHTML = CASE_CATEGORIES.map(cat =>
    `<button class="tag ${cat===active?'active':''}" data-cat="${cat}">${cat}</button>`
  ).join('');
}
function renderCases(activeCat='Все'){
  if(!grid) return;
  if(filtersWrap){[...filtersWrap.children].forEach(b=>b.classList.toggle('active', b.dataset.cat===activeCat));}
  grid.innerHTML = CASES
    .filter(c=>activeCat==='Все'||c.niche===activeCat)
    .map(c=>{
      const imgClass = c.isLogo ? 'logo' : '';
      return `
        <article class="case-card">
          <div class="thumb">
            <img src="${c.img}" alt="${c.title}" class="${imgClass}" loading="lazy">
          </div>
          <h3>${c.title}</h3>
          <p class="muted">${c.niche} • ${c.result}</p>
          <p>${c.excerpt}</p>
          <a class="link" href="${c.link}">Подробнее →</a>
        </article>`;
    }).join('');
}
renderFilters();
renderCases('Все');
if (filtersWrap){
  filtersWrap.addEventListener('click',(e)=>{
    const btn = e.target.closest('button.tag'); if(!btn) return;
    const cat = btn.dataset.cat; renderFilters(cat); renderCases(cat);
  });
}

/* ===== ripple ===== */
document.querySelectorAll('.btn, .btn-outline').forEach(btn=>{
  btn.addEventListener('pointerdown',(e)=>{
    const rect = btn.getBoundingClientRect();
    btn.style.setProperty('--x', `${e.clientX - rect.left}px`);
    btn.style.setProperty('--y', `${e.clientY - rect.top}px`);
  });
});

/* ===== появление секций ===== */
const io = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{ if(entry.isIntersecting) entry.target.classList.add('in'); });
},{threshold:.15});
document.querySelectorAll('[data-animate]').forEach(el=>io.observe(el));

/* ===== подсветка активного пункта меню ===== */
const sections = Array.from(document.querySelectorAll('main > section[id]'));
const navLinks = Array.from(document.querySelectorAll('#mainNav a[href^="#"]'));
function highlightNav(){
  const y = window.scrollY + 120;
  let currentId = '';
  for (const sec of sections){ if (sec.offsetTop <= y) currentId = sec.id; }
  navLinks.forEach(a=>a.classList.toggle('active', a.getAttribute('href') === `#${currentId}`));
}
highlightNav();
addEventListener('scroll', highlightNav);
addEventListener('resize', highlightNav);