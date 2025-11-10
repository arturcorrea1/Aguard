login.addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
  
      const result = await response.json();
  
      if (result.success) {
        localStorage.setItem("id", result.id);
        localStorage.setItem("username", result.username);
        localStorage.setItem("email", result.email);
        localStorage.setItem("profile_picture_url", result.profile_picture_url || '');
        localStorage.setItem("tipo", result.tipo || 'padrao');

        alert("Login bem-sucedido!");
        window.location.href = "index.html";
      }
  
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      mensagem2.style.display = '';
    }
  });
