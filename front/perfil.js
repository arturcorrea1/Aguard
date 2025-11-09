const userId = localStorage.getItem("id");
const usernameDisplay = document.getElementById("usernameDisplay");
const emailDisplay = document.getElementById("email");
const fotoEl = document.getElementById("fotoPerfil");
const fileInput = document.getElementById("inputFoto");


document.getElementById("btnSair").addEventListener("click", () => {
  localStorage.removeItem("id");
  localStorage.removeItem("email");
  localStorage.removeItem("username");
  localStorage.removeItem("userData");
  window.location.href = "login.html";
});

async function carregarPerfil() {
  const userId = localStorage.getItem("id");
  if (!userId) {
    window.location.href = "login.html";
    return;
  }

  const res = await fetch(`http://localhost:3001/usuario/${userId}`);
  const data = await res.json();

  if (data.success) {
    const user = data.user;
    usernameDisplay.textContent = user.username;
    emailDisplay.textContent = user.email;
    fotoEl.src = user.profile_picture_url || "./user.png";

    document.getElementById("editUsername").value = user.username;
    document.getElementById("editEmail").value = user.email;
  }
}

fileInput.addEventListener("change", async () => {
  const userId = localStorage.getItem("id");
  const formData = new FormData();
  formData.append("foto", fileInput.files[0]);

  const res = await fetch(`http://localhost:3001/usuario/foto/${userId}`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (data.success) {
    fotoEl.src = data.foto;

  }
});

document.getElementById("formEditar").addEventListener("submit", async (e) => {
  e.preventDefault();
  const userId = localStorage.getItem("id");

  if (!userId) {
    alert("Erro:  não logado. Faça o logUsuárioin novamente.");
    window.location.href = "login.html";
    return;
  }

  const username = document.getElementById("editUsername").value;
  const email = document.getElementById("editEmail").value;
  const password = document.getElementById("editPassword").value;

  const body = { username, email };
  if (password) {
    body.password = password;
  }

  const res = await fetch(`http://localhost:3001/usuario/editar/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  alert(data.message);

  if (data.success) {
    document.getElementById("modalEditar").style.display = "none";
    localStorage.setItem("email", email)
    localStorage.setItem("username", username)
    localStorage.setItem("passowrd", password)
    carregarPerfil(); 
  }
});

document.getElementById("editarPerfil").onclick = function () {
  document.getElementById("modalEditar").style.display = "block";
}

document.getElementsByClassName("close")[0].onclick = function () {
  document.getElementById("modalEditar").style.display = "none";
}

window.onclick = function (event) {
  if (event.target == document.getElementById("modalEditar")) {
    document.getElementById("modalEditar").style.display = "none";
  }
}

carregarPerfil();
