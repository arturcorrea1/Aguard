create database Aguard;
use Aguard;
 
create table usuario(
	id int primary key auto_increment,
    email varchar(255) not null unique,
    username varchar(255) not null unique,
    password varchar(255) not null,
    profile_picture_url text,
    created_at timestamp default current_timestamp
);

create table noticias(
	news_title varchar(255) not null,
    news_image text,
    created_at timestamp default current_timestamp
);