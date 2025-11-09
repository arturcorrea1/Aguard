document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    const postTitleEl = document.getElementById('post-title');
    const postContentEl = document.getElementById('post-content');
    const postAuthorEl = document.getElementById('post-author');
    const postDateEl = document.getElementById('post-date');
    const commentsContainer = document.getElementById('comments-container');
    const commentForm = document.getElementById('comment-form');

    // Função para formatar a data
    const formatarData = (dataString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dataString).toLocaleDateString('pt-BR', options);
    };

    // Função para carregar o post e comentários
    const carregarPost = async () => {
        if (!postId) {
            postTitleEl.textContent = 'Post não encontrado.';
            return;
        }

        try {
            const res = await fetch(`http://localhost:3001/forum/post/${postId}`);
            const data = await res.json();

            if (data.success) {
                const post = data.post;
                postTitleEl.textContent = post.titulo;
                postContentEl.textContent = post.conteudo;
                postAuthorEl.textContent = `Postado por: ${post.username}`;
                postDateEl.textContent = formatarData(post.data_criacao);

                const imageContainer = document.getElementById('post-image-container');
                imageContainer.innerHTML = '';
                if (post.imagem_url) {
                    const img = document.createElement('img');
                    img.src = post.imagem_url;
                    img.style.maxWidth = '100%';
                    img.style.height = 'auto';
                    img.style.marginBottom = '20px';
                    imageContainer.appendChild(img);
                }

                commentsContainer.innerHTML = '';
                data.comentarios.forEach(comentario => {
                    const commentElement = document.createElement('div');
                    commentElement.classList.add('comment');
                    commentElement.innerHTML = `
                        <div class="top-comment">
                            <img src="${comentario.profile_picture_url || "./user.png"}" class="pfp"/>
                            <p class="user">${comentario.username}</p>
                            <p class="timestamp">${formatarData(comentario.data_criacao)}</p>
                        </div>
                        <div class="comment-content">
                            ${comentario.conteudo}
                        </div>
                    `;
                    commentsContainer.appendChild(commentElement);
                });
            } else {
                postTitleEl.textContent = 'Erro ao carregar post: ' + data.message;
            }
        } catch (error) {
            console.error('Erro ao carregar post:', error);
            postTitleEl.textContent = 'Erro de conexão com o servidor.';
        }
    };


    if (commentForm) {
        commentForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const userId = localStorage.getItem('id');
            if (!userId) {
                alert('Você precisa estar logado para comentar.');
                window.location.href = 'login.html';
                return;
            }

            const conteudo = document.getElementById('comment-content-input').value;

            try {
                const res = await fetch('http://localhost:3001/forum/comentario', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ post_id: postId, usuario_id: userId, conteudo }),
                });
                const data = await res.json();

                alert(data.message);
                if (data.success) {
                    document.getElementById('comment-content-input').value = '';
                    carregarPost(); 
                }
            } catch (error) {
                console.error('Erro ao criar comentário:', error);
                alert('Erro ao criar comentário. Tente novamente.');
            }
        });
    }

    carregarPost();
});
