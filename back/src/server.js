const express = require('express');
const cors = require('cors');
const connection = require('./db_config');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const port = 3001;

// upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});
const upload = multer({ storage });

// cadastro
app.post('/cadastrar', async (req, res) => {
  const { email, username, password } = req.body;

  try {
    const [exist] = await connection
      .promise()
      .query('SELECT * FROM usuario WHERE email = ?', [email]);

    if (exist.length > 0)
      return res
        .status(400)
        .json({ success: false, message: 'E-mail já cadastrado.' });

    const hash = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO usuario (email, username, password) VALUES (?, ?, ?)';
    await connection.promise().query(sql, [email, username, hash]);

    res.json({ success: true, message: 'Usuário cadastrado com sucesso!' });
  } catch (err) {
    console.error('Erro ao cadastrar:', err);
    res.status(500).json({ success: false, message: 'Erro interno no servidor.' });
  }
});

// login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await connection
      .promise()
      .query('SELECT * FROM usuario WHERE email = ?', [email]);

    if (rows.length === 0)
      return res.json({ success: false, message: 'Usuário não encontrado.' });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match)
      return res.json({ success: false, message: 'Senha incorreta.' });

    res.json({
      success: true,
      message: 'Login bem-sucedido!',
      id: user.id,
      username: user.username,
      email: user.email,
      profile_picture_url: user.profile_picture_url,
    });
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ success: false, message: 'Erro no servidor.' });
  }
});

  app.get('/usuario/:id', async(req,res) =>{
    const {id} = req.params;
    
  try{
    const [rows] = await connection
      .promise()
      .query('SELECT * FROM usuario WHERE id = ?', [id]);

      if (rows.length === 0)
      return res.json({ success: false, message: 'Usuário não encontrado.' });

      const user = rows[0];

      res.json({
      success: true,
      message: 'Sucesso ao carregar dados do usuário',
     user: {
       id: user.id,
      username: user.username,
      email: user.email,
      profile_picture_url: user.profile_picture_url,
     }
    });
  } catch (err) {
    console.error('Erro ao carregar dados do usuário.', err);
    res.status(500).json({ success: false, message: 'Erro no servidor.' });
  }

  })

// editar
app.put('/usuario/editar/:id', async (req, res) => {
  const { id } = req.params;
  const { username, email, password} = req.body;

  try {
    const campos = [];
    const valores = [];

    if (username) {
      campos.push('username = ?');
      valores.push(username);
    }
    if (email) {
      campos.push('email = ?');
      valores.push(email);
    }
    if (password) {
      const hash = await bcrypt.hash(password, 10);
      campos.push('password = ?');
      valores.push(hash);
    }

    if (campos.length === 0)
      return res.json({ success: false, message: 'Nada para atualizar.' });

    valores.push(id);
    const sql = `UPDATE usuario SET ${campos.join(', ')} WHERE id = ?`;
    await connection.promise().query(sql, valores);

    res.json({ success: true, message: 'Perfil atualizado com sucesso!' });
  } catch (err) {
    console.error('Erro ao editar perfil:', err);
    res.status(500).json({ success: false, message: 'Erro ao editar perfil.' });
  }
});

// excluir
      app.delete('/deletar/:id', (req, res) => {
        const {id} = req.params;
        const query = 'DELETE FROM usuario WHERE id = ?';
        connection.query(query, [id], (err) => {
          if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao remover' });
          }
          res.json({ success: true, message: 'Removido com sucesso!' });
        });
      });

// posts
app.post('/forum/post', async (req, res) => {
  const { titulo, conteudo, usuario_id, imagem_url } = req.body;
  try {
    const sql = 'INSERT INTO post (titulo, conteudo, usuario_id, imagem_url) VALUES (?, ?, ?, ?)';
    const [result] = await connection.promise().query(sql, [titulo, conteudo, usuario_id, imagem_url]);
    res.json({ success: true, message: 'Post criado com sucesso!', postId: result.insertId });
  } catch (err) {
    console.error('Erro ao criar post:', err);
    res.status(500).json({ success: false, message: 'Erro ao criar post.' });
  }
});

app.get('/forum/posts', async (req, res) => {
  try {
    const sql = 'SELECT p.id, p.titulo, p.conteudo, p.data_criacao, p.imagem_url, u.username, u.profile_picture_url FROM post p JOIN usuario u ON p.usuario_id = u.id ORDER BY p.data_criacao DESC';
    const [rows] = await connection.promise().query(sql);
    res.json({ success: true, posts: rows });
  } catch (err) {
    console.error('Erro ao listar posts:', err);
    res.status(500).json({ success: false, message: 'Erro ao listar posts.' });
  }
});

app.get('/forum/post/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const sqlPost = 'SELECT p.id, p.titulo, p.conteudo, p.data_criacao, p.imagem_url, u.username, u.profile_picture_url FROM post p JOIN usuario u ON p.usuario_id = u.id WHERE p.id = ?';
    const [postRows] = await connection.promise().query(sqlPost, [id]);

    if (postRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Post não encontrado.' });
    }

    const sqlComentarios = 'SELECT c.id, c.conteudo, c.data_criacao, u.username, u.profile_picture_url FROM comentario c JOIN usuario u ON c.usuario_id = u.id WHERE c.post_id = ? ORDER BY c.data_criacao ASC';
    const [comentarioRows] = await connection.promise().query(sqlComentarios, [id]);

    res.json({ success: true, post: postRows[0], comentarios: comentarioRows });
  } catch (err) {
    console.error('Erro ao buscar post:', err);
    res.status(500).json({ success: false, message: 'Erro ao buscar post.' });
  }
});

// post
app.post('/forum/upload-imagem', upload.single('imagem'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Nenhuma imagem enviada.' });
  }
  const imageUrl = `http://localhost:${port}/uploads/${req.file.filename}`;
  res.json({ success: true, imageUrl });
});

// comentarios
app.post('/forum/comentario', async (req, res) => {
  const { post_id, usuario_id, conteudo } = req.body;
  try {
    const sql = 'INSERT INTO comentario (post_id, usuario_id, conteudo) VALUES (?, ?, ?)';
    const [result] = await connection.promise().query(sql, [post_id, usuario_id, conteudo]);
    res.json({ success: true, message: 'Comentário adicionado com sucesso!', comentarioId: result.insertId });
  } catch (err) {
    console.error('Erro ao adicionar comentário:', err);
    res.status(500).json({ success: false, message: 'Erro ao adicionar comentário.' });
  }
});

// upload de foto
app.post('/usuario/foto/:id', upload.single('foto'), async (req, res) => {
  const { id } = req.params;

  if (!req.file)
    return res.status(400).json({ success: false, message: 'Nenhum arquivo enviado.' });

  const fotoUrl = `http://localhost:${port}/uploads/${req.file.filename}`;

  try {
    await connection
      .promise()
      .query('UPDATE usuario SET profile_picture_url = ? WHERE id = ?', [
        fotoUrl,
        id,
      ]);
    res.json({ success: true, foto: fotoUrl });
  } catch (err) {
    console.error('Erro ao salvar foto:', err);
    res.status(500).json({ success: false, message: 'Erro ao salvar imagem.' });
  }
});

// teste
app.get('/', (req, res) => {
  res.send('Servidor rodando ✅');
});

app.listen(port, () => console.log(`🚀 Servidor rodando na porta ${port}`));
