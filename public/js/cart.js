// public/js/cart.js
document.addEventListener('DOMContentLoaded', () => {
  const cartItemsEl = document.getElementById('cartItems');
  const totalEl = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('checkoutBtn');

  render();

  function render() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (!cart.length) {
      cartItemsEl.innerHTML = '<p class="kv">Your cart is empty.</p>';
      totalEl.textContent = '$0.00';
      checkoutBtn.classList.add('btn-ghost');
      checkoutBtn.href = '/';
      return;
    }
    cartItemsEl.innerHTML = '';
    let total = 0;
    cart.forEach((it, idx) => {
      total += it.quantity * it.price;
      const el = document.createElement('div');
      el.className = 'cart-item';
      el.innerHTML = `
        <img src="${it.image || '/assets/placeholder.png'}" alt="${it.name}">
        <div style="flex:1">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <strong>${it.name}</strong>
            <div>$${(it.price * it.quantity).toFixed(2)}</div>
          </div>
          <div class="kv">
            <button class="qty-btn" data-idx="${idx}" data-op="-">-</button>
            <span style="padding:0 8px" id="q-${idx}">${it.quantity}</span>
            <button class="qty-btn" data-idx="${idx}" data-op="+">+</button>
            <button class="btn btn-ghost" data-remove="${idx}" style="margin-left:12px">Remove</button>
          </div>
        </div>
      `;
      cartItemsEl.appendChild(el);
    });

    totalEl.textContent = `$${total.toFixed(2)}`;
    checkoutBtn.href = '/checkout.html';
    attachHandlers();
  }

  function attachHandlers() {
    document.querySelectorAll('.qty-btn').forEach(b => {
      b.addEventListener('click', (e)=>{
        const idx = +b.dataset.idx;
        const op = b.dataset.op;
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        if (op === '+') cart[idx].quantity++;
        else cart[idx].quantity = Math.max(1, cart[idx].quantity - 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        render();
      });
    });

    document.querySelectorAll('[data-remove]').forEach(b=>{
      b.addEventListener('click', ()=>{
        const idx = +b.dataset.remove;
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        cart.splice(idx,1);
        localStorage.setItem('cart', JSON.stringify(cart));
        render();
      });
    });
  }
});
