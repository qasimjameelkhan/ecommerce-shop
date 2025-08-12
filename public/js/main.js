// public/js/main.js
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('productsGrid');
  const search = document.getElementById('search');
  const year = document.getElementById('year');
  const cartCount = document.getElementById('cart-count');

  year.textContent = new Date().getFullYear();
  updateCartCount();

  async function load() {
    const res = await fetch('/api/products');
    const products = await res.json();
    display(products);
  }

  function display(products) {
    grid.innerHTML = '';
    if (!products.length) {
      document.getElementById('no-results').style.display = 'block';
      return;
    } else {
      document.getElementById('no-results').style.display = 'none';
    }
    products.forEach(p => {
      const el = document.createElement('div');
      el.className = 'card';
      el.innerHTML = `
        <div class="thumb"><img src="${p.image || '/assets/placeholder.png'}" alt="${p.name}"></div>
        <h3>${p.name}</h3>
        <p class="kv">${p.description ? p.description.slice(0, 80) : ''}</p>
        <div class="actions">
          <div class="price">$${p.price.toFixed(2)}</div>
          <div>
            <a class="btn btn-ghost" href="/product.html?slug=${p.slug}">View</a>
            <button class="btn btn-primary" data-id="${p._id}" data-name="${p.name}" data-price="${p.price}" data-image="${p.image}">Add</button>
          </div>
        </div>
      `;
      grid.appendChild(el);
    });

    // attach add buttons
    document.querySelectorAll('.btn-primary[data-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const name = btn.dataset.name;
        const price = parseFloat(btn.dataset.price);
        const image = btn.dataset.image;
        addToCart({ productId: id, name, price, image, quantity: 1 });
        updateCartCount();
        btn.textContent = 'Added';
        setTimeout(()=> btn.textContent = 'Add', 900);
      });
    });
  }

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
    cartCount.textContent = count;
    document.getElementById('cart-count').textContent = count;
  }

  search.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    fetch('/api/products')
      .then(r=>r.json())
      .then(products => {
        const filtered = products.filter(p => p.name.toLowerCase().includes(q) || (p.description||'').toLowerCase().includes(q));
        display(filtered);
      });
  });

  load();
});
