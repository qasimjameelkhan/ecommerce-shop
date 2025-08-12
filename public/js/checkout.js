// public/js/checkout.js
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('checkoutForm');
  const message = document.getElementById('message');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (!cart.length) return message.innerHTML = '<p class="kv">Cart is empty</p>';

    const shippingAddress = {
      name: form.name.value,
      address: form.address.value,
      city: form.city.value,
      postalCode: form.postalCode.value,
      country: form.country.value
    };

    const items = cart.map(c => ({ productId: c.productId, quantity: c.quantity }));

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ items, shippingAddress })
      });

      const data = await res.json();
      if (!res.ok) {
        message.innerHTML = `<p class="kv">${data.message || 'Checkout failed'}</p>`;
        if (res.status === 401) message.innerHTML += `<p class="kv">Please <a href="/account.html">login</a> first.</p>`;
        return;
      }
      // success
      localStorage.removeItem('cart');
      message.innerHTML = `<p style="color:var(--accent)">Order placed — ID: ${data.order._id}</p>`;
    } catch (err) {
      message.innerHTML = `<p class="kv">Error placing order</p>`;
      console.error(err);
    }
  });
});
