// =========================================
//   LIMA LIMÓN – JavaScript Principal
// =========================================

const WA_NUMBER = '541156584277';

// ===== PRODUCTOS =====
const products = [
  { id:1, name:'Remera Oversize', desc:'100% algodón premium, fit holgado', price:8500, emoji:'👕', stock:12, gradient:'linear-gradient(135deg,#0d2010,#1a3a10)' },
  { id:2, name:'Buzo Hoodie',     desc:'Con capucha, bolsillo canguro',     price:15000, emoji:'🦋', stock:8,  gradient:'linear-gradient(135deg,#0d1a10,#0a2a15)' },
  { id:3, name:'Pantalón Baggy',  desc:'Corte baggy, cintura elástica',     price:12000, emoji:'👖', stock:5,  gradient:'linear-gradient(135deg,#101a0d,#1a2a08)' },
  { id:4, name:'Jogger Oversize', desc:'Cómodo y liviano para el día a día',price:11000, emoji:'🩳', stock:15, gradient:'linear-gradient(135deg,#0a1a0a,#152510)' },
  { id:5, name:'Set Completo',    desc:'Buzo + Pantalón combinados',        price:24000, emoji:'✨', stock:3,  gradient:'linear-gradient(135deg,#0d200d,#203a10)' },
  { id:6, name:'Trucker Cap LL',  desc:'Bordado LL premium, ajustable',     price:5500,  emoji:'🧢', stock:20, gradient:'linear-gradient(135deg,#0a150a,#152010)' },
];

// ===== TESTIMONIOS =====
const testimonios = [
  { stars:5, text:'La remera oversize es de otra calidad. La uso todo el tiempo, se lava perfecto y no pierde la forma.', author:'Valentina R.', city:'Buenos Aires' },
  { stars:5, text:'Me llegó super rápido y el buzo hoodie es increíble. El bordado está impecable.', author:'Mateo G.', city:'Córdoba' },
  { stars:5, text:'El set completo es un golazo. Calidad premium a precio justo. Voy a seguir comprando.', author:'Sofía M.', city:'Rosario' },
  { stars:5, text:'El estilo es exactamente lo que buscaba. Oversize real, no el oversize trucho de otros lados.', author:'Tomás L.', city:'Mendoza' },
  { stars:5, text:'Atención por WhatsApp re rápida. Me ayudaron a elegir el talle y quedó perfecto.', author:'Julieta P.', city:'La Plata' },
];

// ===== CARRITO =====
let cart = [];
let talleSelected = '';

// ===== NAVBAR SCROLL =====
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  updateActiveLink();
});

// ===== ACTIVE LINK =====
function updateActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-link');
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 100) current = s.id;
  });
  links.forEach(l => {
    l.classList.toggle('active', l.getAttribute('href') === '#' + current);
  });
}

// ===== HAMBURGER =====
const hamburger = document.getElementById('hamburger');
const navMobile = document.getElementById('navMobile');
hamburger.addEventListener('click', () => {
  navMobile.classList.toggle('open');
});
document.querySelectorAll('.nav-mobile .nav-link').forEach(l => {
  l.addEventListener('click', () => navMobile.classList.remove('open'));
});

// ===== CURSOR =====
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top  = e.clientY + 'px';
  setTimeout(() => {
    follower.style.left = e.clientX + 'px';
    follower.style.top  = e.clientY + 'px';
  }, 80);
});

// ===== RENDER PRODUCTOS =====
function renderProducts() {
  const grid = document.getElementById('productsGrid');
  grid.innerHTML = products.map((p, i) => {
    const pct = Math.round((p.stock / 20) * 100);
    const low = p.stock <= 5;
    return `
    <div class="product-card reveal" style="animation-delay:${i*0.08}s">
      <div class="product-img" style="background:${p.gradient}">${p.emoji}</div>
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-desc">${p.desc}</div>
        <div class="stock-bar"><div class="stock-fill" style="width:${pct}%"></div></div>
        <div class="product-stock ${low ? 'low' : ''}">${low ? '⚡ Solo ' + p.stock + ' restantes' : '📦 Stock disponible: ' + p.stock}</div>
        <div class="product-bottom">
          <div class="product-price">$${p.price.toLocaleString('es-AR')}</div>
          <button class="add-btn" onclick="addToCart(${p.id})">+</button>
        </div>
      </div>
    </div>`;
  }).join('');
  observeReveal();
}

// ===== RENDER TESTIMONIOS =====
function renderTestimonios() {
  const grid = document.getElementById('testimoniosGrid');
  grid.innerHTML = testimonios.map(t => `
    <div class="testimonio-card reveal">
      <div class="t-stars">${'★'.repeat(t.stars)}</div>
      <div class="t-text">"${t.text}"</div>
      <div class="t-author">${t.author}</div>
      <div class="t-city">${t.city}</div>
    </div>`).join('');
  observeReveal();
}

// ===== CARRITO =====
function addToCart(id) {
  const p = products.find(x => x.id === id);
  const existing = cart.find(x => x.id === id);
  if (existing) existing.qty++;
  else cart.push({ ...p, qty: 1 });
  updateCartUI();
  launchConfetti();
  showToast('¡' + p.emoji + ' ' + p.name + ' agregado!');
}

function updateCartUI() {
  const count = cart.reduce((a, c) => a + c.qty, 0);
  document.getElementById('cartCount').textContent = count;
  const total = cart.reduce((a, c) => a + c.price * c.qty, 0);
  document.getElementById('cartTotal').textContent = '$' + total.toLocaleString('es-AR');
  const items = document.getElementById('cartItems');
  if (cart.length === 0) {
    items.innerHTML = '<p style="color:var(--muted);text-align:center;padding:2rem;">Tu carrito está vacío 🍋</p>';
    return;
  }
  items.innerHTML = cart.map(c => `
    <div class="cart-item">
      <div class="cart-item-emoji">${c.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${c.name}</div>
        <div class="cart-item-price">$${(c.price * c.qty).toLocaleString('es-AR')}</div>
      </div>
      <div class="cart-item-qty">
        <button class="qty-btn" onclick="changeQty(${c.id}, -1)">−</button>
        <span>${c.qty}</span>
        <button class="qty-btn" onclick="changeQty(${c.id}, 1)">+</button>
      </div>
    </div>`).join('');
}

function changeQty(id, delta) {
  const item = cart.find(x => x.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(x => x.id !== id);
  updateCartUI();
}

function openCart() {
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
}
function closeCart() {
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
}
document.getElementById('cartBtn').addEventListener('click', openCart);

function checkoutCart() {
  if (cart.length === 0) { showToast('Tu carrito está vacío 🍋'); return; }
  const total = cart.reduce((a, c) => a + c.price * c.qty, 0);
  let msg = '🍋 *Pedido LIMA LIMÓN*\n\n';
  cart.forEach(c => { msg += `${c.emoji} ${c.name} x${c.qty} — $${(c.price * c.qty).toLocaleString('es-AR')}\n`; });
  msg += `\n💵 *Total: $${total.toLocaleString('es-AR')}*`;
  window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg), '_blank');
}

// ===== CONFETTI =====
function launchConfetti() {
  const container = document.getElementById('confettiContainer');
  const colors = ['#a8e63d','#f5e642','#7bc92a','#ffffff','#4a9e1a'];
  for (let i = 0; i < 60; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.cssText = `
      left: ${Math.random() * 100}vw;
      top: ${Math.random() * 50 + 20}vh;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-delay: ${Math.random() * 0.4}s;
      transform: rotate(${Math.random() * 360}deg);
    `;
    container.appendChild(el);
    setTimeout(() => el.remove(), 1400);
  }
}

// ===== TOAST =====
function showToast(msg) {
  const t = document.createElement('div');
  t.textContent = msg;
  t.style.cssText = `
    position:fixed; bottom:6rem; left:50%; transform:translateX(-50%);
    background:var(--lima); color:var(--bg);
    padding:0.7rem 1.5rem; border-radius:30px;
    font-family:var(--font-sub); font-size:0.85rem; letter-spacing:1px;
    z-index:9999; animation:toastIn 0.3s ease;
    box-shadow: 0 8px 25px rgba(168,230,61,0.4);
  `;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2500);
}

// ===== FORMULARIO =====
function selectTalle(btn) {
  document.querySelectorAll('.talle-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  talleSelected = btn.textContent;
}

function sendOrder() {
  const name   = document.getElementById('fname').value.trim();
  const prenda = document.getElementById('fprenda').value;
  const color  = document.getElementById('fcolor').value.trim();
  const nota   = document.getElementById('fnota').value.trim();
  if (!name || !prenda || !talleSelected) {
    showToast('⚠️ Completá nombre, prenda y talle');
    return;
  }
  let msg = `🍋 *Pedido LIMA LIMÓN*\n\n`;
  msg += `👤 Nombre: ${name}\n`;
  msg += `👕 Prenda: ${prenda}\n`;
  msg += `📏 Talle: ${talleSelected}\n`;
  if (color) msg += `🎨 Color: ${color}\n`;
  if (nota)  msg += `📝 Nota: ${nota}\n`;
  window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg), '_blank');
}

// ===== REVEAL ON SCROLL =====
function observeReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => observer.observe(el));
}

// ===== EASTER EGG =====
let logoClicks = 0;
document.querySelector('.nav-logo').addEventListener('click', e => {
  logoClicks++;
  if (logoClicks >= 5) {
    document.body.style.filter = 'hue-rotate(120deg)';
    showToast('🍋 FRESH MODE ACTIVADO');
    setTimeout(() => { document.body.style.filter = ''; logoClicks = 0; }, 3000);
  }
});

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  renderTestimonios();
  observeReveal();
  updateCartUI();
});

// toast keyframes
const style = document.createElement('style');
style.textContent = `@keyframes toastIn { from { opacity:0; transform:translateX(-50%) translateY(10px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }`;
document.head.appendChild(style);  
