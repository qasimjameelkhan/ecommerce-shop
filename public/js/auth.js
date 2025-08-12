// public/js/auth.js
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  if (loginForm) loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(loginForm);
    const body = { email: data.get('email'), password: data.get('password') };
    const res = await fetch('/api/auth/login', { method: 'POST', headers: {'Content-Type':'application/json'}, credentials:'include', body: JSON.stringify(body) });
    const json = await res.json();
    if (!res.ok) return alert(json.message || 'Login failed');
    window.location = '/';
  });

  if (registerForm) registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(registerForm);
    const body = { name: data.get('name'), email: data.get('email'), password: data.get('password') };
    const res = await fetch('/api/auth/register', { method: 'POST', headers: {'Content-Type':'application/json'}, credentials:'include', body: JSON.stringify(body) });
    const json = await res.json();
    if (!res.ok) return alert(json.message || 'Register failed');
    window.location = '/';
  });
});
