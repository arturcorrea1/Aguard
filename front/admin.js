document.addEventListener('DOMContentLoaded', () => {
    // Verificar se o usuário é admin
    const userTipo = localStorage.getItem('tipo');
    if (userTipo !== 'admininistrador') {
        alert('Acesso negado. Apenas administradores podem acessar esta página.');
        window.location.href = 'index.html';
        return;
    }

    carregarUsuarios();
});

const formatarData = (dataString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dataString).toLocaleDateString('pt-BR', options);
};

const carregarUsuarios = async () => {
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    const table = document.getElementById('users-table');
    const tbody = document.getElementById('users-tbody');

    try {
        const userTipo = localStorage.getItem('tipo');
        const res = await fetch(`http://localhost:3001/admin/usuarios?user_tipo=${userTipo}`);
        const data = await res.json();

        loading.style.display = 'none';

        if (data.success) {
            tbody.innerHTML = '';
            data.usuarios.forEach(usuario => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>
                        <img src="${usuario.profile_picture_url || './user.png'}" 
                             alt="Foto de perfil" class="profile-pic">
                    </td>
                    <td>${usuario.username}</td>
                    <td>${usuario.email}</td>
                    <td>
                        <span class="tipo-badge ${usuario.tipo === 'admininistrador' ? 'tipo-admin' : 'tipo-padrao'}">
                            ${usuario.tipo === 'admininistrador' ? 'Admin' : 'Usuário'}
                        </span>
                    </td>
                    <td>${formatarData(usuario.created_at)}</td>
                    <td>
                        <button class="btn btn-edit" onclick="editarUsuario(${usuario.id}, '${usuario.username}', '${usuario.email}', '${usuario.tipo}')">
                            Editar
                        </button>
                        <button class="btn btn-delete" onclick="excluirUsuario(${usuario.id}, '${usuario.username}')">
                            Excluir
                        </button>
                    </td>
                `;
                tbody.appendChild(row);
            });
            table.style.display = 'table';
        } else {
            error.textContent = 'Erro ao carregar usuários: ' + data.message;
            error.style.display = 'block';
        }
    } catch (err) {
        console.error('Erro ao carregar usuários:', err);
        loading.style.display = 'none';
        error.textContent = 'Erro de conexão com o servidor.';
        error.style.display = 'block';
    }
};

window.editarUsuario = async (userId, currentUsername, currentEmail, currentTipo) => {
    const novoUsername = prompt('Editar nome de usuário:', currentUsername);
    if (novoUsername === null) return;
    
    const novoEmail = prompt('Editar email:', currentEmail);
    if (novoEmail === null) return;
    
    const novoTipo = prompt('Editar tipo (admininistrador/padrao):', currentTipo);
    if (novoTipo === null) return;
    
    const userTipo = localStorage.getItem('tipo');
    
    try {
        const res = await fetch(`http://localhost:3001/admin/usuario/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                username: novoUsername,
                email: novoEmail,
                tipo: novoTipo,
                user_tipo: userTipo
            }),
        });
        const data = await res.json();
        
        alert(data.message);
        if (data.success) {
            carregarUsuarios();
        }
    } catch (error) {
        console.error('Erro ao editar usuário:', error);
        alert('Erro ao editar usuário. Tente novamente.');
    }
};

window.excluirUsuario = async (userId, username) => {
    if (!confirm(`Tem certeza que deseja excluir o usuário "${username}"?\n\nEsta ação irá excluir também todos os posts e comentários deste usuário.`)) {
        return;
    }
    
    const userTipo = localStorage.getItem('tipo');
    
    try {
        const res = await fetch(`http://localhost:3001/admin/usuario/${userId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                user_tipo: userTipo
            }),
        });
        const data = await res.json();
        
        alert(data.message);
        if (data.success) {
            carregarUsuarios();
        }
    } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        alert('Erro ao excluir usuário. Tente novamente.');
    }
};
