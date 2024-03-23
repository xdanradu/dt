-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Mar 23, 2024 at 11:32 AM
-- Server version: 8.0.23
-- PHP Version: 7.4.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `app_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `Messages`
--

CREATE TABLE `Messages` (
  `id` int NOT NULL,
  `content` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `from_fk` int DEFAULT NULL,
  `to_fk` int DEFAULT NULL,
  `from` int DEFAULT NULL,
  `to` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Messages`
--

INSERT INTO `Messages` (`id`, `content`, `createdAt`, `updatedAt`, `from_fk`, `to_fk`, `from`, `to`) VALUES
(1, 'Hello', '2021-03-16 19:28:03', '2021-03-16 19:28:03', 1, 2, 1, 2),
(2, 'hi', '2021-03-16 19:28:03', '2021-03-16 19:28:03', 2, 1, 2, 1),
(3, 'ca va', '2021-03-16 19:28:04', '2021-03-16 19:28:04', NULL, NULL, 3, 5),
(4, 'bine', '2021-03-16 19:28:04', '2021-03-16 19:28:04', NULL, NULL, 2, 4),
(5, 'unde?', '2021-03-16 19:28:04', '2021-03-16 19:28:04', NULL, NULL, 5, 4),
(6, 'in oras', '2021-03-16 19:28:04', '2021-03-16 19:28:04', NULL, NULL, 5, 1);

-- --------------------------------------------------------

--
-- Table structure for table `Users`
--

CREATE TABLE `Users` (
  `id` int NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Users`
--

INSERT INTO `Users` (`id`, `firstName`, `lastName`, `email`, `password`, `createdAt`, `updatedAt`) VALUES
(1, 'Dan', 'Radu', 'admin@admin.com', 'admin', '2021-03-16 19:12:43', '2021-03-16 19:12:43'),
(2, 'Vlad', 'Popescu', 'popescun@email.com', '12345', '2021-03-16 19:12:43', '2021-03-16 19:12:43'),
(3, 'Denisa', 'Croitoru', 'croitoru@email.com', '12345', '2021-03-16 19:12:43', '2021-03-16 19:12:43'),
(4, 'Denis', 'Lupoian', 'lupo@email.com', '12345', '2021-03-16 19:12:43', '2021-03-16 19:12:43'),
(5, 'Alexandru', 'Pop', 'luchi@email.com', '12345', '2021-03-16 19:12:43', '2021-03-16 19:12:43'),
(6, 'Alexandru', 'Pop', 'luchi@email.com', '12345', '2021-03-16 19:12:43', '2021-03-16 19:12:43');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Messages`
--
ALTER TABLE `Messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `from_fk` (`from_fk`),
  ADD KEY `to_fk` (`to_fk`),
  ADD KEY `from` (`from`),
  ADD KEY `to` (`to`);

--
-- Indexes for table `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Messages`
--
ALTER TABLE `Messages`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `Users`
--
ALTER TABLE `Users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Messages`
--
ALTER TABLE `Messages`
  ADD CONSTRAINT `Messages_ibfk_1` FOREIGN KEY (`from_fk`) REFERENCES `Users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `Messages_ibfk_2` FOREIGN KEY (`to_fk`) REFERENCES `Users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `Messages_ibfk_3` FOREIGN KEY (`from`) REFERENCES `Users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `Messages_ibfk_4` FOREIGN KEY (`to`) REFERENCES `Users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
