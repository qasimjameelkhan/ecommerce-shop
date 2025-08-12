// public/js/product.js
document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(location.search);
  const slug = params.get('slug');
  const main = document.getElementById('productMain');
  const year = document.getElementById('year');
  const cartCount = document.getElementById('cart-count');
  if (year) year.textContent = new Date().getFullYear();
  updateCartCount();

  if (!slug) {
    main.innerHTML = '<p class="kv">Product not specified.</p>'; return;
  }

  const res = await fetch('/api/products/' + slug);
  if (!res.ok) return main.innerHTML = '<p class="kv">Product not found.</p>';
  const p = await res.json();

  main.innerHTML = `
    <div class="product-hero">
      <div class="card">
        <div class="thumb"><img src="${p.image || '/assets/placeholder.png'}" alt="${p.name}"></div>
      </div>
      <div class="card product-info">
        <h1>${p.name}</h1>
        <p class="kv">${p.description || ''}</p>
        <div style="margin-top:12px"><div class="price">$${p.price.toFixed(2)}</div></div>
        <div class="qty">
          <button id="dec">-</button>
          <div id="qtyVal">1</div>
          <button id="inc">+</button>
        </div>
        <div style="margin-top:14px">
          <button id="addBtn" class="btn btn-primary">Add to cart</button>
          <a class="btn btn-ghost" href="/cart.html">View cart</a>
        </div>
      </div>
    </div>
  `;

  let qty = 1;
  document.getElementById('dec').addEventListener('click', ()=>{ qty = Math.max(1, qty-1); document.getElementById('qtyVal').textContent = qty; });
  document.getElementById('inc').addEventListener('click', ()=>{ qty++; document.getElementById('qtyVal').textContent = qty; });

  document.getElementById('addBtn').addEventListener('click', ()=> {
    addToCart({ productId: p._id, name: p.name, price: p.price, image: p.image, quantity: qty });
    updateCartCount();
    document.getElementById('addBtn').textContent = 'Added';
    setTimeout(()=> document.getElementById('addBtn').textContent = 'Add to cart', 1200);
  });

  function addToCart(item) {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const found = cart.find(c => c.productId === item.productId);
    if (found) found.quantity += item.quantity;
    else cart.push(item);
    localStorage.setItem('cart', JSON.stringify(cart));
  }
  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const count = cart.reduce((s,i)=>s+i.quantity,0);
    if (cartCount) cartCount.textContent = count;
    const cc = document.getElementById('cart-count');
    if (cc) cc.textContent = count;
  }
});
