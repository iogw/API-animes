CREATE DATABASE freedb_anime_seiyuus;

USE freedb_anime_seiyuus;

CREATE TABLE animes (
idAnime INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
title VARCHAR(50) UNIQUE NOT NULL,
year YEAR,
chapters INT
);

CREATE TABLE seiyuus (
idSeiyuu INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
name VARCHAR(50) NOT NULL,
surname VARCHAR(50) NOT NULL
);

CREATE TABLE characters (
idCharacter INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
name VARCHAR(50) UNIQUE NOT NULL,
fk_anime INT,
fk_seiyuu INT,
FOREIGN KEY (fk_anime) REFERENCES animes(idAnime),
FOREIGN KEY (fk_seiyuu) REFERENCES seiyuus(idSeiyuu)
);

INSERT INTO animes (title, year, chapters) 
VALUES ("Spy x Family", 2022, 37), 
       ("Kabaneri of the Iron Fortress", 2016, 12), 
       ("Darling in the franxxx", 2018, 24),
       ("Kimetsu no yaiba", 2019, 55);

INSERT INTO seiyuus (name, surname) 
VALUES ("Takuya", "Eguchi"), 
	("Atsumi", "Tanezaki"), 
       ("Toshiki", "Masuda"); 

INSERT INTO characters (name, fk_anime, fk_seiyuu) 
VALUES ("Anya Forger", 1, 2), 
	("Nine Gamma", 3, 1), 
       ("Loid Forger", 1, 1),
       ("Hinatsuru", 4, 2),
       ("Kurusu", 2, 3),
       ("Nine Beta", 3, 3);


CREATE TABLE users (
iduser INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
username VARCHAR(50) NOT NULL,
email VARCHAR(50) UNIQUE NOT NULL,
password VARCHAR(100) NOT NULL
);