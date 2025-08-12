// public/scripts.js
// Single frontend entry for all pages: fetch products, cart (localStorage), auth forms, checkout

const API_BASE = ''; // same origin, adjust if using different backend origin

/* ---------- Utility: cart (localStorage) ---------- */
const CART_KEY = 'cart_v1';
function getCart(){ return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }
function setCart(c){ localStorage.setItem(CART_KEY, JSON.stringify(c)); updateTopCounts(); }
function addToCart(item){
  const c = getCart();
  const found = c.find(x=>x.productId === item.productId);
  if(found){ found.quantity += item.quantity; } else { c.push(item); }
  setCart(c);
}
function removeFromCart(productId){
  const c = getCart().filter(x=>x.productId !== productId);
  setCart(c);
}
function changeQty(productId, qty){
  const c = getCart();
  const item = c.find(x=>x.productId===productId);
  if(!item) return;
  item.quantity = Math.max(1, qty);
  setCart(c);
}
function cartTotal(){
  return getCart().reduce((s,it)=> s + (it.price * it.quantity), 0);
}
function updateTopCounts(){
  const count = getCart().reduce((s,i)=> s + i.quantity, 0);
  const els = document.querySelectorAll('#top-cart-count, #top-cart-count-2, #top-cart-count-3, #top-cart-count-4, #top-cart-count-5, #top-cart-count-6, #top-cart-count-7');
  els.forEach(e=> e.textContent = count);
  const top = document.querySelectorAll('#top-cart-count');
  if(document.getElementById('top-cart-count')) document.getElementById('top-cart-count').textContent = count;
  if(document.getElementById('top-cart-count-2')) document.getElementById('top-cart-count-2').textContent = count;
  if(document.getElementById('top-cart-count-3')) document.getElementById('top-cart-count-3').textContent = count;
}
updateTopCounts();

/* ---------- Products: fetch & render ---------- */
async function fetchProducts(){
  try{
    const res = await fetch(API_BASE + '/api/products');
    if(!res.ok) return [];
    return await res.json();
  }catch(e){ console.error('fetchProducts', e); return []; }
}

function productCardHtml(p){
  return `
    <div class="bg-white rounded-lg shadow hover:shadow-lg transition group">
      <a href="/product.html?slug=${encodeURIComponent(p.slug)}">
        <div class="h-56 flex items-center justify-center overflow-hidden rounded-t-lg bg-gray-50">
          <img src="${p.image || '/images/placeholder.jpg'}" alt="${escapeHtml(p.name)}" class="w-full h-full object-contain p-6" />
        </div>
      </a>
      <div class="p-4">
        <a href="/product.html?slug=${encodeURIComponent(p.slug)}" class="font-semibold text-gray-800 hover:text-indigo-600">${escapeHtml(p.name)}</a>
        <div class="mt-2 text-sm text-gray-500">${escapeHtml((p.description||'').slice(0,80))}</div>
        <div class="mt-4 flex items-center justify-between">
          <div class="text-indigo-600 font-bold">$${Number(p.price).toFixed(2)}</div>
          <div>
            <button data-id="${p._id}" data-name="${escapeHtml(p.name)}" data-price="${p.price}" data-image="${p.image || '/images/placeholder.jpg'}" class="add-btn inline-block bg-indigo-600 text-white px-3 py-2 rounded hover:bg-indigo-700">Add</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function escapeHtml(s){
  return String(s||'').replace(/[&<>"']/g, c=> ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c]) );
}

/* Home: render featured into #home-products */
async function homeRender(){
  const container = document.getElementById('home-products');
  if(!container) return;
  const prods = await fetchProducts();
  // pick first 8
  container.innerHTML = prods.slice(0,8).map(productCardHtml).join('');
  attachAddButtons();
}

/* Products page render */
async function productsRender(){
  const grid = document.getElementById('products-grid');
  if(!grid) return;
  const prods = await fetchProducts();
  grid.innerHTML = prods.map(productCardHtml).join('');
  attachAddButtons();
}

/* Attach add to cart handlers */
function attachAddButtons(){
  document.querySelectorAll('.add-btn').forEach(b=>{
    b.addEventListener('click', ()=>{
      const id = b.dataset.id;
      const name = b.dataset.name;
      const price = parseFloat(b.dataset.price||0) || 0;
      const image = b.dataset.image || '/images/placeholder.jpg';
      addToCart({ productId: id, name, price, image, quantity: 1 });
      showToast('Added to cart');
      updateTopCounts();
    });
  });
}

/* ---------- Product detail page ---------- */
async function productPageRender(){
  const root = document.getElementById('product-root');
  if(!root) return;
  const params = new URLSearchParams(location.search);
  const slug = params.get('slug');
  if(!slug){ root.innerHTML = '<div class="p-6">Product not found</div>'; return; }

  try{
    const res = await fetch(API_BASE + '/api/products/' + encodeURIComponent(slug));
    if(!res.ok){ root.innerHTML = '<div class="p-6">Product not found</div>'; return; }
    const p = await res.json();
    document.getElementById('product-image').src = p.image || '/images/placeholder.jpg';
    document.getElementById('product-name').textContent = p.name;
    document.getElementById('product-price').textContent = '$' + Number(p.price).toFixed(2);
    document.getElementById('product-desc').textContent = p.description || '';

    let qty = 1;
    function setQty(){ document.getElementById('qty-val').textContent = qty; }
    document.getElementById('qty-inc').addEventListener('click', ()=>{ qty++; setQty(); });
    document.getElementById('qty-dec').addEventListener('click', ()=>{ qty = Math.max(1, qty-1); setQty(); });

    document.getElementById('add-to-cart').addEventListener('click', ()=>{
      addToCart({ productId: p._id, name: p.name, price: p.price, image: p.image||'/images/placeholder.jpg', quantity: qty });
      showToast('Added to cart');
      updateTopCounts();
    });

  }catch(err){ console.error(err); root.innerHTML='<div class="p-6">Error loading product</div>'; }
}

/* ---------- Cart page ---------- */
function cartPageRender(){
  const el = document.getElementById('cart-list');
  if(!el) return;
  const cart = getCart();
  if(!cart.length){ el.innerHTML = '<div class="bg-white p-6 rounded shadow text-center text-gray-600">Your cart is empty</div>'; document.getElementById('cart-total').textContent='$0.00'; return;}
  el.innerHTML = '';
  cart.forEach(item=>{
    const row = document.createElement('div');
    row.className = 'flex items-center gap-4 bg-white p-4 rounded shadow';
    row.innerHTML = `
      <img src="${item.image}" class="w-20 h-20 object-cover rounded" />
      <div class="flex-1">
        <div class="font-semibold">${escapeHtml(item.name)}</div>
        <div class="text-sm text-gray-500">$${Number(item.price).toFixed(2)} each</div>
        <div class="mt-2 inline-flex items-center gap-2">
          <button class="px-2 py-1 border qty-dec" data-id="${item.productId}">-</button>
          <span class="px-3">${item.quantity}</span>
          <button class="px-2 py-1 border qty-inc" data-id="${item.productId}">+</button>
          <button class="ml-4 text-red-600 remove-item" data-id="${item.productId}">Remove</button>
        </div>
      </div>
      <div class="text-right font-bold">$${(item.price * item.quantity).toFixed(2)}</div>
    `;
    el.appendChild(row);
  });

  // attach handlers
  el.querySelectorAll('.qty-dec').forEach(b=> b.addEventListener('click', ()=>{
    const id = b.dataset.id; const cart = getCart(); const it = cart.find(x=>x.productId===id); if(!it) return; it.quantity = Math.max(1, it.quantity-1); setCart(cart); cartPageRender();
  }));
  el.querySelectorAll('.qty-inc').forEach(b=> b.addEventListener('click', ()=>{
    const id = b.dataset.id; const cart = getCart(); const it = cart.find(x=>x.productId===id); if(!it) return; it.quantity++; setCart(cart); cartPageRender();
  }));
  el.querySelectorAll('.remove-item').forEach(b=> b.addEventListener('click', ()=>{
    const id = b.dataset.id; removeFromCart(id); cartPageRender();
  }));

  document.getElementById('cart-total').textContent = '$' + cartTotal().toFixed(2);
}

/* ---------- Checkout page ---------- */
function checkoutRender(){
  const summary = document.getElementById('order-summary');
  if(!summary) return;
  const cart = getCart();
  if(!cart.length){ summary.innerHTML = '<div class="text-gray-500">Cart is empty.</div>'; document.getElementById('order-total').textContent = '$0.00'; return; }
  summary.innerHTML = cart.map(it=> `<div class="flex justify-between"><div>${escapeHtml(it.name)} x${it.quantity}</div><div>$${(it.price*it.quantity).toFixed(2)}</div></div>`).join('');
  document.getElementById('order-total').textContent = '$' + cartTotal().toFixed(2);

  const form = document.getElementById('checkout-form');
  if(form){
    form.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const formData = new FormData(form);
      const address = {
        name: formData.get('name'),
        address: formData.get('address'),
        city: formData.get('city'),
        postalCode: formData.get('postalCode'),
        country: formData.get('country'),
      };
      const items = getCart().map(it=> ({ productId: it.productId, quantity: it.quantity }));
      try{
        const res = await fetch(API_BASE + '/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ items, shippingAddress: address })
        });
        const json = await res.json();
        if(!res.ok){ document.getElementById('checkout-msg').textContent = json.message || 'Order failed'; if(res.status===401) document.getElementById('checkout-msg').textContent = 'Please login first.'; return; }
        // success
        localStorage.removeItem(CART_KEY);
        updateTopCounts();
        window.location.href = '/';
        alert('Order placed! ID: ' + (json.order? json.order._id : '—'));
      }catch(err){ console.error(err); document.getElementById('checkout-msg').textContent = 'Error placing order.'; }
    });
  }
}

/* ---------- Auth forms (login/register) ---------- */
function authForms(){
  const login = document.getElementById('login-form');
  if(login) login.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const fd = new FormData(login);
    const body = { email: fd.get('email'), password: fd.get('password') };
    try{
      const res = await fetch(API_BASE + '/api/auth/login', { method: 'POST', headers: {'Content-Type':'application/json'}, credentials: 'include', body: JSON.stringify(body) });
      const json = await res.json();
      if(!res.ok) return alert(json.message || 'Login failed');
      window.location.href = '/';
    }catch(e){ alert('Network error'); }
  });

  const reg = document.getElementById('register-form');
  if(reg) reg.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const fd = new FormData(reg);
    const body = { name: fd.get('name'), email: fd.get('email'), password: fd.get('password') };
    try{
      const res = await fetch(API_BASE + '/api/auth/register', { method: 'POST', headers: {'Content-Type':'application/json'}, credentials: 'include', body: JSON.stringify(body) });
      const json = await res.json();
      if(!res.ok) return alert(json.message || 'Register failed');
      window.location.href = '/';
    }catch(e){ alert('Network error'); }
  });
}

/* ---------- Helpers ---------- */
function showToast(msg='Done'){
  // simple toast
  const t = document.createElement('div');
  t.textContent = msg;
  t.className = 'fixed bottom-6 right-6 bg-black text-white px-4 py-2 rounded shadow';
  document.body.appendChild(t);
  setTimeout(()=> { t.style.opacity = '0'; setTimeout(()=> t.remove(), 300); }, 1400);
}

/* ---------- Router-like init ---------- */
document.addEventListener('DOMContentLoaded', async ()=>{
  updateTopCounts();
  const path = location.pathname;
  if(path === '/' || path.endsWith('/index.html')){ await homeRender(); }
  if(path.endsWith('/products.html')){ await productsRender(); }
  if(path.endsWith('/product.html')){ await productPageRender(); }
  if(path.endsWith('/cart.html')){ cartPageRender(); }
  if(path.endsWith('/checkout.html')){ checkoutRender(); }
  if(path.endsWith('/auth.html')){ authForms(); }

  // search handler (on homepage)
  const search = document.getElementById('site-search');
  if(search){
    search.addEventListener('keydown', async (e)=>{
      if(e.key === 'Enter'){ e.preventDefault(); const q = search.value.trim().toLowerCase(); const prods = await fetchProducts(); const matched = prods.filter(p => (p.name||'').toLowerCase().includes(q) || (p.description||'').toLowerCase().includes(q)); document.getElementById('home-products').innerHTML = matched.map(productCardHtml).join(''); attachAddButtons(); }
    });
  }
});
