document.addEventListener('DOMContentLoaded', () => {
    const postsContainer = document.getElementById('posts-container');
    const createPostForm = document.getElementById('create-post-form');

    const formatarData = (dataString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dataString).toLocaleDateString('pt-BR', options);
    };

    const carregarPosts = async () => {
        try {
            const res = await fetch('http://localhost:3001/forum/posts');
            const data = await res.json();

            if (data.success) {
                postsContainer.innerHTML = ''; 
                data.posts.forEach(post => {
                    const postElement = document.createElement('li');
                    postElement.classList.add('row');
                    
                    const userTipo = localStorage.getItem('tipo');
                    const userId = localStorage.getItem('id');
                    
                    // Mostrar botões de editar/excluir para admins ou qualquer usuário
                    const showEditDelete = userTipo === 'admininistrador' || userTipo === 'padrao';
                    
                    postElement.innerHTML = `
                    <div class="post-card">
                        <a href="thread.html?id=${post.id}">
                            <h4 class="titulo-post">${post.titulo}</h4>
                            <div class="bottom-post">
                                <p class="timestamp-post">Postado por: ${post.username} em ${formatarData(post.data_criacao)}</p>
                                <p class="comment-count-post">Ver comentários</p>
                            </div>
                        </a>
                        ${showEditDelete ? `
                            <div class="post-actions" style="margin-top: 10px;">
                                <button onclick="editarPost(${post.id}, '${post.titulo}', '${post.conteudo.replace(/'/g, "\\'")}')">Editar</button>
                                <button onclick="excluirPost(${post.id})" style="background-color: #dc3545;">Excluir</button>
                            </div>
                        ` : ''}
                    </div>
                    `;
                    postsContainer.appendChild(postElement);
                });
            } else {
                postsContainer.innerHTML = '<p>Erro ao carregar posts: ' + data.message + '</p>';
            }
        } catch (error) {
            console.error('Erro ao carregar posts:', error);
            postsContainer.innerHTML = '<p>Erro de conexão com o servidor.</p>';
        }
    };

    if (createPostForm) {
        createPostForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const userId = localStorage.getItem('id');
            if (!userId) {
                alert('Você precisa estar logado para criar um post.');
                window.location.href = 'login.html';
                return;
            }

            const titulo = document.getElementById('post-title').value;
            const conteudo = document.getElementById('post-content').value;
            const imageFile = document.getElementById('post-image').files[0];
            let imageUrl = null;

            if (imageFile) {
                const formData = new FormData();
                formData.append('imagem', imageFile);

                try {
                    const uploadRes = await fetch('http://localhost:3001/forum/upload-imagem', {
                        method: 'POST',
                        body: formData,
                    });
                    const uploadData = await uploadRes.json();

                    if (uploadData.success) {
                        imageUrl = uploadData.imageUrl;
                    } else {
                        alert('Erro ao fazer upload da imagem: ' + uploadData.message);
                        return;
                    }
                } catch (error) {
                    console.error('Erro ao fazer upload da imagem:', error);
                    alert('Erro de conexão ao fazer upload da imagem.');
                    return;
                }
            }

            try {
                const postRes = await fetch('http://localhost:3001/forum/post', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ titulo, conteudo, usuario_id: userId, imagem_url: imageUrl }),
                });
                const postData = await postRes.json();

                alert(postData.message);
                if (postData.success) {
                    createPostForm.reset();
                    carregarPosts();
                }
            } catch (error) {
                console.error('Erro ao criar post:', error);
                alert('Erro ao criar post. Tente novamente.');
            }
        });
    }

    carregarPosts();
});

// Função para editar post
window.editarPost = async (postId, titulo, conteudo) => {
    const novoTitulo = prompt('Editar título:', titulo);
    const novoConteudo = prompt('Editar conteúdo:', conteudo);
    
    if (novoTitulo === null || novoConteudo === null) return;
    
    const userId = localStorage.getItem('id');
    const userTipo = localStorage.getItem('tipo');
    
    try {
        const res = await fetch(`http://localhost:3001/forum/post/${postId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                titulo: novoTitulo, 
                conteudo: novoConteudo, 
                usuario_id: userId,
                user_tipo: userTipo
            }),
        });
        const data = await res.json();
        
        alert(data.message);
        if (data.success) {
            location.reload();
        }
    } catch (error) {
        console.error('Erro ao editar post:', error);
        alert('Erro ao editar post. Tente novamente.');
    }
};

// Função para excluir post
window.excluirPost = async (postId) => {
    if (!confirm('Tem certeza que deseja excluir este post?')) return;
    
    const userId = localStorage.getItem('id');
    const userTipo = localStorage.getItem('tipo');
    
    try {
        const res = await fetch(`http://localhost:3001/forum/post/${postId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                usuario_id: userId,
                user_tipo: userTipo
            }),
        });
        const data = await res.json();
        
        alert(data.message);
        if (data.success) {
            location.reload();
        }
    } catch (error) {
        console.error('Erro ao excluir post:', error);
        alert('Erro ao excluir post. Tente novamente.');
    }
};
