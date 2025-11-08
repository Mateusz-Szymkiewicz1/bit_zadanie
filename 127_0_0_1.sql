-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Lis 08, 2025 at 11:24 PM
-- Wersja serwera: 10.4.32-MariaDB
-- Wersja PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bit_zadanie`
--
CREATE DATABASE IF NOT EXISTS `bit_zadanie` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `bit_zadanie`;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `miejsca`
--

CREATE TABLE `miejsca` (
  `id` int(11) NOT NULL,
  `dostepne` tinyint(1) NOT NULL DEFAULT 1,
  `uwagi` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `miejsca`
--

INSERT INTO `miejsca` (`id`, `dostepne`, `uwagi`) VALUES
(1, 1, ''),
(2, 1, ''),
(3, 1, ''),
(4, 0, ''),
(5, 1, 'Miejsce dla niepełnosprawnych');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `pracownicy`
--

CREATE TABLE `pracownicy` (
  `id` int(11) NOT NULL,
  `login` text NOT NULL,
  `haslo` text NOT NULL,
  `admin` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pracownicy`
--

INSERT INTO `pracownicy` (`id`, `login`, `haslo`, `admin`) VALUES
(1, 'admin', '$2b$10$WvPf3RmmXJIpkIgKgLJuw.QqWV7721S600oQpJU.6WBtUe8Lair/C', 1);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `rezerwacje`
--

CREATE TABLE `rezerwacje` (
  `id` int(11) NOT NULL,
  `pracownik` int(11) NOT NULL,
  `miejsce` int(11) NOT NULL,
  `dzien` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rezerwacje`
--

INSERT INTO `rezerwacje` (`id`, `pracownik`, `miejsce`, `dzien`) VALUES
(13, 1, 1, '2025-11-09'),
(14, 1, 1, '2025-11-10');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `sessions`
--

CREATE TABLE `sessions` (
  `sid` varchar(255) NOT NULL,
  `session` text NOT NULL,
  `expires` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`sid`, `session`, `expires`) VALUES
('IBE8VJF-NEzlgmXwVwWJjptVl-6aaplZ', '{\"cookie\":{\"originalMaxAge\":172800000,\"expires\":\"2025-11-10T13:02:34.495Z\",\"httpOnly\":true,\"path\":\"/\"},\"user\":\"admin\"}', 1762779754),
('OgYDLjX3zJvZPY45Kiox-OusTUdbNcoD', '{\"cookie\":{\"originalMaxAge\":172800000,\"expires\":\"2025-11-10T22:18:32.901Z\",\"httpOnly\":true,\"path\":\"/\"},\"user\":\"admin\"}', 1762813113),
('QAmqo2Wv52iyo89aqN6-oSH-hvTdj3_h', '{\"cookie\":{\"originalMaxAge\":172800000,\"expires\":\"2025-11-10T13:01:37.450Z\",\"httpOnly\":true,\"path\":\"/\"},\"user\":\"admin\"}', 1762779697),
('sede_nkYhRZuuuLKl8uJA86_W8utQH1q', '{\"cookie\":{\"originalMaxAge\":172800000,\"expires\":\"2025-11-10T13:00:58.511Z\",\"httpOnly\":true,\"path\":\"/\"},\"user\":\"admin\"}', 1762779659),
('Yni6Zd_LrqDPm0DqZyWUjtL0WOnxnlX9', '{\"cookie\":{\"originalMaxAge\":172800000,\"expires\":\"2025-11-10T13:04:22.897Z\",\"httpOnly\":true,\"path\":\"/\"},\"user\":\"admin\"}', 1762779863);

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `miejsca`
--
ALTER TABLE `miejsca`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `pracownicy`
--
ALTER TABLE `pracownicy`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `rezerwacje`
--
ALTER TABLE `rezerwacje`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pracownik` (`pracownik`),
  ADD KEY `miejsce` (`miejsce`);

--
-- Indeksy dla tabeli `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`sid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `miejsca`
--
ALTER TABLE `miejsca`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `pracownicy`
--
ALTER TABLE `pracownicy`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `rezerwacje`
--
ALTER TABLE `rezerwacje`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `rezerwacje`
--
ALTER TABLE `rezerwacje`
  ADD CONSTRAINT `rezerwacje_ibfk_1` FOREIGN KEY (`miejsce`) REFERENCES `miejsca` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `rezerwacje_ibfk_2` FOREIGN KEY (`pracownik`) REFERENCES `pracownicy` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
