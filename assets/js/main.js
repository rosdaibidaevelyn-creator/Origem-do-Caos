/* ==========================================================================
   ORIGEM DO CAOS — utilitários globais de UI
   ========================================================================== */

/* ---------- Mancha de tinta (assinatura visual do site) ---------- */
function inkStainSVG(seed){
  // gera um blob orgânico e irregular via pontos aleatórios + curva suave
  const rand = mulberry32(seed || 1);
  const cx = 200, cy = 65, points = 16;
  function makePath(rxBase, ryBase, jitter, cxOff, cyOff){
    const pts = [];
    for(let i=0;i<points;i++){
      const angle = (i/points) * Math.PI*2;
      const rx = rxBase + rand()*jitter - jitter/2;
      const ry = ryBase + rand()*jitter*.5 - jitter/4;
      pts.push([cx+cxOff + Math.cos(angle)*rx, cy+cyOff + Math.sin(angle)*ry]);
    }
    let d = `M ${pts[0][0]},${pts[0][1]} `;
    for(let i=0;i<points;i++){
      const p0 = pts[i];
      const p1 = pts[(i+1)%points];
      const mx = (p0[0]+p1[0])/2 + (rand()*26-13);
      const my = (p0[1]+p1[1])/2 + (rand()*26-13);
      d += `Q ${mx},${my} ${p1[0]},${p1[1]} `;
    }
    return d + "Z";
  }
  const back = makePath(158, 50, 60, rand()*10-5, rand()*8-4);
  const front = makePath(150, 46, 56, 0, 0);
  return `<svg class="stain" viewBox="0 0 400 130" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path class="stain-fill fill-2" d="${back}"/>
    <path class="stain-fill" d="${front}"/>
  </svg>`;
}
function mulberry32(a){
  return function(){
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}
function applyInkBands(){
  document.querySelectorAll('.ink-band').forEach((el, i)=>{
    if(el.querySelector('svg.stain')) return;
    el.insertAdjacentHTML('afterbegin', inkStainSVG(i+7));
  });
}

/* ---------- Ícones próprios do universo (arquivos de imagem) ---------- */
const ICON_IMAGES = {
  terrena: 'assets/images/dimensions/terrena.png',
  infernal: 'assets/images/dimensions/infernal.png',
  arkanjerial: 'assets/images/dimensions/arkanjerial.png',
  sombria: 'assets/images/dimensions/sombria.png',
  carnical: 'assets/images/dimensions/carnical.png',
  limbica: 'assets/images/dimensions/limbica.png',
  perdicao: 'assets/images/dimensions/perdicao.png',
  default: 'assets/images/dimensions/default.png'
};
const ICONS = {
  rune: `<img src="${ICON_IMAGES.infernal}" alt="rune" style="width:49px; height:49px;">`
};
function iconFor(dimension){
  const d = (dimension||'').toLowerCase();
  if(d.includes('terrena')) return `<img src="${ICON_IMAGES.terrena}" alt="${dimension}" style="width:49px; height:49px;">`;
  if(d.includes('infernal')) return `<img src="${ICON_IMAGES.infernal}" alt="${dimension}" style="width:49px; height:49px;">`;
  if(d.includes('carni')) return `<img src="${ICON_IMAGES.carnical}" alt="${dimension}" style="width:49px; height:49px;">`;
  if(d.includes('sombr')) return `<img src="${ICON_IMAGES.sombria}" alt="${dimension}" style="width:49px; height:49px;">`;
  if(d.includes('límb') || d.includes('limb')) return `<img src="${ICON_IMAGES.limbica}" alt="${dimension}" style="width:49px; height:49px;">`;
  if(d.includes('arkanj')) return `<img src="${ICON_IMAGES.arkanjerial}" alt="${dimension}" style="width:49px; height:49px;">`;
  if(d.includes('perdi')) return `<img src="${ICON_IMAGES.perdicao}" alt="${dimension}" style="width:49px; height:49px;">`;
  return `<img src="${ICON_IMAGES.default}" alt="${dimension}" style="width:49px; height:49px;">`;
}

/* ---------- Ornamentos de canto (flourish gótico) ---------- */
const CORNER_SVG = `<svg viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="M2 18 V4 H16" fill="none" stroke="currentColor" stroke-width="1.6"/>
  <path d="M2 4 Q2 1.5 4.5 1.5" fill="none" stroke="currentColor" stroke-width="1.6"/>
  <path d="M5 10 Q11 10 11 16 Q11 21 6 21" fill="none" stroke="currentColor" stroke-width="1.1" opacity=".8"/>
  <circle cx="2" cy="18" r="1.7" fill="currentColor" stroke="none"/>
  <circle cx="16" cy="4" r="1.7" fill="currentColor" stroke="none"/>
</svg>`;
function applyCornerOrnaments(){
  document.querySelectorAll('.corner-frame').forEach(el=>{
    if(el.querySelector('.orn-corner')) return;
    ['tl','tr','br','bl'].forEach(pos=>{
      const span = document.createElement('span');
      span.className = `orn-corner orn-${pos}`;
      span.innerHTML = CORNER_SVG;
      el.appendChild(span);
    });
  });
}

/* ---------- Manchas de tinta decorativas em cards (assinatura recorrente) ---------- */
function applyInkSplats(){
  document.querySelectorAll('.card, .creature-card, .panel.corner-frame').forEach((el,i)=>{
    if(el.querySelector('.ink-splat')) return;
    const rand = mulberry32(i*13 + 3);
    const span = document.createElement('span');
    span.className = 'ink-splat';
    span.style.setProperty('--sx', (rand()*80+10).toFixed(0)+'%');
    span.style.setProperty('--sy', (rand()>.5 ? -8 : 88)+'%');
    span.style.setProperty('--srot', (rand()*60-30).toFixed(0)+'deg');
    el.appendChild(span);
  });
}


function spawnParticles(container, count){
  if(!container) return;
  for(let i=0;i<count;i++){
    const s = document.createElement('span');
    const left = Math.random()*100;
    const dur = 8 + Math.random()*10;
    const delay = Math.random()*10;
    const size = 1.5 + Math.random()*2.5;
    s.style.left = left+'%';
    s.style.width = size+'px';
    s.style.height = size+'px';
    s.style.animationDuration = dur+'s';
    s.style.animationDelay = delay+'s';
    container.appendChild(s);
  }
}

/* ---------- Navegação mobile ---------- */
function setHeaderHeightVar(){
  const header = document.querySelector('.site-header');
  if(header){
    document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px');
  }
}

function initNav(){
  setHeaderHeightVar();
  window.addEventListener('resize', setHeaderHeightVar);
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  if(toggle && nav){
    toggle.addEventListener('click', ()=>{
      nav.classList.toggle('open');
    });
    nav.querySelectorAll('a').forEach(a=>a.addEventListener('click', ()=>nav.classList.remove('open')));
  }
  // marca link ativo
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a').forEach(a=>{
    const href = a.getAttribute('href');
    if(href === path) a.classList.add('active');
  });
}

/* ---------- Busca global ---------- */
function buildSearchIndex(){
  const idx = [];
  const D = window.SITE_DATA;
  if(!D) return idx;

  (D.criaturas||[]).forEach(c=>{
    idx.push({ cat:'Bestiário', name:c.nome, sub:c.dimensao, url:`bestiario.html?criatura=${c.slug}` });
  });
  (D.racasInfernaculos||[]).forEach(r=>{
    idx.push({ cat:'Raça Infernácula', name:r.nome, sub:'Dimensão Infernal', url:`bestiario.html#racas` });
  });
  (D.atributos?.lista||[]).forEach(a=>{
    idx.push({ cat:'Atributo', name:a.nome, sub:'Compêndio', url:`compendio.html?tab=atributos#${slugify(a.nome)}` });
  });
  (D.pericias?.lista||[]).forEach(p=>{
    idx.push({ cat:'Perícia', name:p.nome, sub:'Compêndio', url:`compendio.html?tab=pericias#${slugify(p.nome)}` });
  });
  (D.sedes||[]).forEach(s=>{
    idx.push({ cat:'Sede da Ordem', name:s.nome, sub:'Universo', url:`universo.html#sedes` });
  });
  (D.dimensoes||[]).forEach(dm=>{
    idx.push({ cat:'Dimensão', name:dm.nome, sub:'Universo', url:`universo.html#dimensoes` });
  });
  return idx;
}
function slugify(s){
  return (s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
}

function initSearch(){
  const input = document.getElementById('global-search');
  const results = document.getElementById('search-results');
  if(!input || !results) return;
  const index = buildSearchIndex();

  function render(list){
    if(!list.length){
      results.innerHTML = `<div class="sr-empty">Nenhum resultado no grimório para essa busca.</div>`;
      return;
    }
    results.innerHTML = list.slice(0,10).map(r=>`
      <a class="sr-item" href="${r.url}">
        <div class="sr-cat">${r.cat}</div>
        <div class="sr-name">${r.name}</div>
      </a>`).join('');
  }

  input.addEventListener('input', ()=>{
    const q = input.value.trim().toLowerCase();
    if(q.length < 1){ results.classList.remove('open'); return; }
    const list = index.filter(r => r.name.toLowerCase().includes(q));
    render(list);
    results.classList.add('open');
  });
  input.addEventListener('focus', ()=>{
    if(input.value.trim().length) results.classList.add('open');
  });
  document.addEventListener('click', (e)=>{
    if(!e.target.closest('.search-box')) results.classList.remove('open');
  });
}

/* ---------- Tabs genéricas ---------- */
function initTabs(){
  document.querySelectorAll('[data-tabs]').forEach(group=>{
    const btns = group.querySelectorAll('.tab-btn');
    btns.forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const target = btn.dataset.tab;
        group.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
        group.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active'));
        btn.classList.add('active');
        group.querySelector(`.tab-panel[data-panel="${target}"]`).classList.add('active');
      });
    });
  });
}

window.refreshDecor = function(){ applyCornerOrnaments(); applyInkSplats(); };

document.addEventListener('DOMContentLoaded', ()=>{
  applyInkBands();
  applyCornerOrnaments();
  applyInkSplats();
  initNav();
  initSearch();
  initTabs();
  spawnParticles(document.querySelector('.hero-particles'), 26);
});
