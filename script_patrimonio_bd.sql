-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: patrimonio_db
-- ------------------------------------------------------
-- Server version	8.0.37

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
-- Table structure for table `__efmigrationshistory`
--

DROP TABLE IF EXISTS `__efmigrationshistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `__efmigrationshistory` (
  `MigrationId` varchar(150) NOT NULL,
  `ProductVersion` varchar(32) NOT NULL,
  PRIMARY KEY (`MigrationId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `__efmigrationshistory`
--

LOCK TABLES `__efmigrationshistory` WRITE;
/*!40000 ALTER TABLE `__efmigrationshistory` DISABLE KEYS */;
INSERT INTO `__efmigrationshistory` VALUES ('20250911020852_InitialCreate','9.0.8');
/*!40000 ALTER TABLE `__efmigrationshistory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `itensconferidos`
--

DROP TABLE IF EXISTS `itensconferidos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `itensconferidos` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `sessao_id` int NOT NULL,
  `patrimonio_id` int DEFAULT NULL,
  `identificacao_ni` longtext NOT NULL,
  `patrimonio_nome` longtext NOT NULL,
  `local_encontrado_id` int NOT NULL,
  `status` longtext NOT NULL,
  `leitura_tipo` longtext NOT NULL,
  `placa_identificacao_ok` tinyint(1) NOT NULL,
  `observacao` longtext NOT NULL,
  `foto_url` longtext NOT NULL,
  `data_hora_conferencia` datetime(6) NOT NULL,
  `conferido_por_id` int DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_itensconferidos_conferido_por_id` (`conferido_por_id`),
  KEY `IX_itensconferidos_local_encontrado_id` (`local_encontrado_id`),
  KEY `IX_itensconferidos_patrimonio_id` (`patrimonio_id`),
  KEY `IX_itensconferidos_sessao_id` (`sessao_id`),
  CONSTRAINT `FK_itensconferidos_locais_local_encontrado_id` FOREIGN KEY (`local_encontrado_id`) REFERENCES `locais` (`Id`) ON DELETE CASCADE,
  CONSTRAINT `FK_itensconferidos_patrimonios_patrimonio_id` FOREIGN KEY (`patrimonio_id`) REFERENCES `patrimonios` (`Id`),
  CONSTRAINT `FK_itensconferidos_sessoesconferencia_sessao_id` FOREIGN KEY (`sessao_id`) REFERENCES `sessoesconferencia` (`Id`) ON DELETE CASCADE,
  CONSTRAINT `FK_itensconferidos_usuarios_conferido_por_id` FOREIGN KEY (`conferido_por_id`) REFERENCES `usuarios` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `itensconferidos`
--

LOCK TABLES `itensconferidos` WRITE;
/*!40000 ALTER TABLE `itensconferidos` DISABLE KEYS */;
/*!40000 ALTER TABLE `itensconferidos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `locais`
--

DROP TABLE IF EXISTS `locais`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `locais` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `codigo_local` varchar(255) NOT NULL,
  `nome_local` longtext NOT NULL,
  `responsavel_id` int DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_locais_responsavel_id` (`responsavel_id`),
  CONSTRAINT `FK_locais_usuarios_responsavel_id` FOREIGN KEY (`responsavel_id`) REFERENCES `usuarios` (`Id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `locais`
--

LOCK TABLES `locais` WRITE;
/*!40000 ALTER TABLE `locais` DISABLE KEYS */;
/*!40000 ALTER TABLE `locais` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patrimonios`
--

DROP TABLE IF EXISTS `patrimonios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patrimonios` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `numero_patrimonio` longtext NOT NULL,
  `descricao_equipamento` longtext NOT NULL,
  `local_id` int DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_patrimonios_local_id` (`local_id`),
  CONSTRAINT `FK_patrimonios_locais_local_id` FOREIGN KEY (`local_id`) REFERENCES `locais` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patrimonios`
--

LOCK TABLES `patrimonios` WRITE;
/*!40000 ALTER TABLE `patrimonios` DISABLE KEYS */;
/*!40000 ALTER TABLE `patrimonios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessoesconferencia`
--

DROP TABLE IF EXISTS `sessoesconferencia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessoesconferencia` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `data_inicio` datetime(6) NOT NULL,
  `data_fim` datetime(6) DEFAULT NULL,
  `status` longtext NOT NULL,
  `iniciada_por` int DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_sessoesconferencia_iniciada_por` (`iniciada_por`),
  CONSTRAINT `FK_sessoesconferencia_usuarios_iniciada_por` FOREIGN KEY (`iniciada_por`) REFERENCES `usuarios` (`Id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessoesconferencia`
--

LOCK TABLES `sessoesconferencia` WRITE;
/*!40000 ALTER TABLE `sessoesconferencia` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessoesconferencia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `nome_usuario` longtext NOT NULL,
  `nome_completo` longtext NOT NULL,
  `senha_hash` longtext NOT NULL,
  `perfil` longtext NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'admin','Administrador','$2a$11$2LgZAYaWk42sUjyWlN2vde3daQjyFOPoXfgh1NA0cI84FOwg0Y.NK','administrador');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-10 23:14:47
