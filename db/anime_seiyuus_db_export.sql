CREATE DATABASE  IF NOT EXISTS `freedb_anime_seiyuus` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `freedb_anime_seiyuus`;
-- MySQL dump 10.13  Distrib 8.0.35, for Linux (x86_64)
--
-- Host: sql.freedb.tech    Database: freedb_anime_seiyuus
-- ------------------------------------------------------
-- Server version	8.0.35-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `animes`
--

DROP TABLE IF EXISTS `animes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `animes` (
  `idAnime` int NOT NULL AUTO_INCREMENT,
  `title` varchar(50) NOT NULL,
  `year` year DEFAULT NULL,
  `chapters` int DEFAULT NULL,
  PRIMARY KEY (`idAnime`),
  UNIQUE KEY `title` (`title`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `animes`
--

LOCK TABLES `animes` WRITE;
/*!40000 ALTER TABLE `animes` DISABLE KEYS */;
INSERT INTO `animes` VALUES (1,'Spy x Family',2022,37),(2,'Kabaneri of the Iron Fortress',2016,12),(3,'Darling in the franxxx',2018,24),(4,'Kimetsu no yaiba',2019,55);
/*!40000 ALTER TABLE `animes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `characters`
--

DROP TABLE IF EXISTS `characters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `characters` (
  `idCharacter` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `fk_anime` int DEFAULT NULL,
  `fk_seiyuu` int DEFAULT NULL,
  PRIMARY KEY (`idCharacter`),
  UNIQUE KEY `name` (`name`),
  KEY `fk_anime` (`fk_anime`),
  KEY `fk_seiyuu` (`fk_seiyuu`),
  CONSTRAINT `characters_ibfk_1` FOREIGN KEY (`fk_anime`) REFERENCES `animes` (`idAnime`),
  CONSTRAINT `characters_ibfk_2` FOREIGN KEY (`fk_seiyuu`) REFERENCES `seiyuus` (`idSeiyuu`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `characters`
--

LOCK TABLES `characters` WRITE;
/*!40000 ALTER TABLE `characters` DISABLE KEYS */;
INSERT INTO `characters` VALUES (1,'Anya Forger',1,2),(2,'Nine Gamma',3,1),(3,'Loid Forger',1,1),(4,'Hinatsuru',4,2),(5,'Kurusu',2,3),(6,'Nine Beta',3,3);
/*!40000 ALTER TABLE `characters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `seiyuus`
--

DROP TABLE IF EXISTS `seiyuus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seiyuus` (
  `idSeiyuu` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `surname` varchar(45) NOT NULL,
  PRIMARY KEY (`idSeiyuu`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seiyuus`
--

LOCK TABLES `seiyuus` WRITE;
/*!40000 ALTER TABLE `seiyuus` DISABLE KEYS */;
INSERT INTO `seiyuus` VALUES (1,'Takuya','Eguchi'),(2,'Atsumi','Tanezaki'),(3,'Toshiki','Masuda');
/*!40000 ALTER TABLE `seiyuus` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-11-14 19:48:15
