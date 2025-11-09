const cadastro = document.getElementById('cadastrar');

cadastro.addEventListener('click', async (e) => {
  e.preventDefault(); 
  const email = document.getElementById('email').value.trim();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  

  if (!email || !username || !password) {
    alert("Preencha todos os campos!");
    return;
  }

  try {
    const response = await fetch('http://localhost:3001/cadastrar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password })
    });

    const result = await response.json();
    console.log(result);

    if (result.success) {
      alert("Cadastro bem-sucedido!");
      window.location.href = "./login.html";
    } else {
      alert(result.message || "Erro no cadastro");
    }
  } catch (error) {
    console.error("Erro na requisição:", error);
    alert("Erro ao conectar ao servidor");
  }
});

const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');

togglePassword.addEventListener('click', () => {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    togglePassword.textContent = isPassword ? '😐' : '😑';
});
