// =========================================
//   HAKU – Código Principal Integrado
// =========================================

const WA_NUMBER = '5491168462643'; // Número actualizado

// ===== PRODUCTOS CON DATA TÉCNICA =====
const products = [
  { id:1, name:'Remera Oversize', desc:'Algodón peinado 24/1 pesado. Cuello de rib grueso.', price:8500, emoji:'👕', image:'image_9ff044.jpg', stock:12, gradient:'linear-gradient(135deg,#0b1020,#12213f)' },
  { id:2, name:'Buzo Hoodie',     desc:'Frisa invisible premium pesada. Capucha forrada de doble tela.', price:15000, emoji:'🧥', image:'', stock:8,  gradient:'linear-gradient(135deg,#0a0e1a,#0e1c38)' },
  { id:3, name:'Pantalón Baggy',  desc:'Gabardina premium de 10 oz. Bolsillos laterales tácticos.', price:12000, emoji:'👖', image:'', stock:5,  gradient:'linear-gradient(135deg,#0b0f1a,#122542)' },
  { id:4, name:'Jogger Oversize', desc:'Rústico de algodón de alta densidad con cordón técnico.', price:11000, emoji:'🩳', image:'', stock:15, gradient:'linear-gradient(135deg,#0a0e18,#101f3a)' },
  { id:5, name:'Set Completo',    desc:'Combo Hoodie + Jogger combinados del mismo Drop.', price:24000, emoji:'✨', image:'', stock:3,  gradient:'linear-gradient(135deg,#0b1120,#142848)' },
  { id:6, name:'Trucker Cap HK',  desc:'Gorra truckera estructurada. Bordado frontal en alta definición.', price:5500,  emoji:'🧢', image:'', stock:20, gradient:'linear-gradient(135deg,#0a0f1c,#111f3c)' },
];

let cart = [];
let talleSelected = '';

// ===== NAVBAR =====
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== MENÚ MOBILE =====
const hamburger = document.getElementById('hamburger');
const navMobile = document.getElementById('navMobile');
hamburger.addEventListener('click', () => { navMobile.classList.toggle('open'); });
document.querySelectorAll('.nav-mobile .nav-link').forEach(l => {
  l.addEventListener('click', () => navMobile.classList.remove('open'));
});

// ===== RENDER DE PRODUCTOS =====
function renderProducts() {
  const grid = document.getElementById('productsGrid');
  if(!grid) return;
  grid.innerHTML = products.map((p, i) => {
    const pct = Math.round((p.stock / 20) * 100);
    const low = p.stock <= 5;
    const imgInner = p.image
      ? `<img src="${p.image}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;transition:transform 0.4s ease;" class="p-img-hover" onerror="this.parentElement.innerHTML='${p.emoji}'">`
      : p.emoji;
    return `
    <div class="product-card reveal" style="animation-delay:${i*0.06}s">
      <div class="product-img" style="background:${p.gradient};overflow:hidden;position:relative;">${imgInner}</div>
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-desc">${p.desc}</div>
        <div class="stock-bar"><div class="stock-fill" style="width:${pct}%"></div></div>
        <div class="product-stock ${low ? 'low' : ''}">${low ? '⚡ Quedan muy pocos!' : '📦 Stock Disponible'}</div>
        <div class="product-bottom">
          <div class="product-price">$${p.price.toLocaleString('es-AR')}</div>
          <button class="add-btn" onclick="addToCart(${p.id})">+</button>
        </div>
      </div>
    </div>`;
  }).join('');
  observeReveal();
}

// ===== ACCIONES DEL CARRITO =====
function addToCart(id) {
  const p = products.find(x => x.id === id);
  const existing = cart.find(x => x.id === id);
  if (existing) existing.qty++;
  else cart.push({ ...p, qty: 1 });
  updateCartUI();
  showToast(`¡${p.name} al carrito!`);
}

function updateCartUI() {
  document.getElementById('cartCount').textContent = cart.reduce((a, c) => a + c.qty, 0);
  document.getElementById('cartTotal').textContent = '$' + cart.reduce((a, c) => a + c.price * c.qty, 0).toLocaleString('es-AR');
  const items = document.getElementById('cartItems');
  if (cart.length === 0) {
    items.innerHTML = '<p style="color:var(--muted);text-align:center;padding:2rem;">Tu carrito está vacío</p>';
    return;
  }
  items.innerHTML = cart.map(c => `
    <div class="cart-item">
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

function openCart() { document.getElementById('cartDrawer').classList.add('open'); document.getElementById('cartOverlay').classList.add('open'); }
function closeCart() { document.getElementById('cartDrawer').classList.remove('open'); document.getElementById('cartOverlay').classList.remove('open'); }
document.getElementById('cartBtn').addEventListener('click', openCart);

function checkoutCart() {
  if (cart.length === 0) return;
  let msg = '🔥 *NUEVO PEDIDO DE LA WEB (HAKU)* 🔥\n\n';
  cart.forEach(c => { msg += `• ${c.name} (x${c.qty}) — $${(c.price * c.qty).toLocaleString('es-AR')}\n`; });
  msg += `\n💵 *Total: $${cart.reduce((a, c) => a + c.price * c.qty, 0).toLocaleString('es-AR')}*`;
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
}

// ===== ACCIONES FORMULARIO DIRECTO =====
function selectTalle(btn) {
  document.querySelectorAll('.talle-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  talleSelected = btn.textContent;
}

function sendOrder() {
  const name = document.getElementById('fname').value.trim();
  const prenda = document.getElementById('fprenda').value;
  const color = document.getElementById('fcolor').value.trim();
  const nota = document.getElementById('fnota').value.trim();
  if (!name || !prenda || !talleSelected) {
    showToast('⚠️ Completa nombre, prenda y talle.');
    return;
  }
  let msg = `⚡ *CONSULTA DIRECTA PRENDA HAKU* ⚡\n\n`;
  msg += `👤 *Cliente:* ${name}\n`;
  msg += `📦 *Artículo:* ${prenda}\n`;
  msg += `📏 *Talle:* ${talleSelected}\n`;
  if(color) msg += `🎨 *Color:* ${color}\n`;
  if(nota)  msg += `📝 *Nota:* ${nota}\n`;
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
}

// ===== MODAL TALLES INTERACTIVO =====
function openSizeModal() { document.getElementById('sizeModal').classList.add('open'); document.getElementById('sizeOverlay').classList.add('open'); }
function closeSizeModal() { document.getElementById('sizeModal').classList.remove('open'); document.getElementById('sizeOverlay').classList.remove('open'); }

// ===== TOAST ACCESORIO =====
function showToast(msg) {
  const t = document.createElement('div');
  t.textContent = msg;
  t.style.cssText = 'position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);background:#2f6bff;color:#fff;padding:0.6rem 1.4rem;border-radius:30px;font-family:var(--font-mono);font-size:0.8rem;z-index:99999;box-shadow:0 5px 15px rgba(47,107,255,0.3);';
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2500);
}

// ===== REVEAL EFFECT =====
function observeReveal() {
  const obs = new IntersectionObserver(ents => { ents.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); }); }, { threshold: 0.05 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

document.addEventListener('DOMContentLoaded', () => { renderProducts(); observeReveal(); }); 

// ===== ANIMACIÓN DEL CURSOR PERSONALIZADO =====
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

if (cursorDot && cursorRing) {
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  // El punto sigue al mouse instantáneamente
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });

  // El anillo sigue al punto con retraso (efecto smooth)
  function renderCursor() {
    ringX += (mouseX - ringX) * 0.15; // Velocidad del anillo
    ringY += (mouseY - ringY) * 0.15;
    
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
    
    requestAnimationFrame(renderCursor);
  }
  renderCursor();

  // Activar efecto "hovered" en botones y enlaces
  const addHoverEvents = () => {
    const clickables = document.querySelectorAll('a, button, input, select, textarea, .talle-btn, .product-card');
    clickables.forEach(el => {
      // Para evitar duplicar eventos si se vuelve a llamar a la función
      el.removeEventListener('mouseenter', hoverIn);
      el.removeEventListener('mouseleave', hoverOut);
      
      el.addEventListener('mouseenter', hoverIn);
      el.addEventListener('mouseleave', hoverOut);
    });
  };

  const hoverIn = () => cursorRing.classList.add('hovered');
  const hoverOut = () => cursorRing.classList.remove('hovered');

  // Inicializar eventos y volver a cargarlos si agregas productos dinámicamente
  addHoverEvents();
  setTimeout(addHoverEvents, 1000); 
} 
