create database Aguard;
use Aguard;

create table usuario(
	id int primary key auto_increment,
    email varchar(255) not null unique,
    username varchar(255) not null unique,
    password varchar(255) not null,
    profile_picture_url text,
    created_at timestamp default current_timestamp,
    tipo enum ('admininistrador', 'padrao')
);

CREATE TABLE post(
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    conteudo TEXT NOT NULL,
    usuario_id INT NOT NULL,
    imagem_url TEXT, 
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

CREATE TABLE comentario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    usuario_id INT NOT NULL,
    conteudo TEXT NOT NULL,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES post(id),
    FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);



