-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Värd: 127.0.0.1
-- Tid vid skapande: 21 mars 2024 kl 18:25
-- Serverversion: 10.4.28-MariaDB
-- PHP-version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Databas: `guest_book`
--

-- --------------------------------------------------------

--
-- Tabellstruktur `guestbook`
--

CREATE TABLE `guestbook` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `homepage` varchar(255) DEFAULT NULL,
  `comment` text NOT NULL,
  `time` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumpning av Data i tabell `guestbook`
--

INSERT INTO `guestbook` (`id`, `name`, `email`, `homepage`, `comment`, `time`) VALUES
(9, 'aaf', 'fredrik.helleblad@skola.taby.se', 'https://sodexo.mashie.com/public/app/T%C3%A4by%20skolor%20Mitt/5e136a25', 'ukk', '2024-02-23 13:05:11'),
(10, 'göran', 'goran.blad@gmail.com', 'http://www.sss.ss', 'Hejsan', '2024-03-14 13:20:23'),
(11, 'fredde', 'kukung@gmail.com', 'https://goran.se', 'axel suger dase', '2024-03-14 13:31:07');

--
-- Index för dumpade tabeller
--

--
-- Index för tabell `guestbook`
--
ALTER TABLE `guestbook`
  ADD PRIMARY KEY (`id`),
  ADD KEY `time` (`time`);

--
-- AUTO_INCREMENT för dumpade tabeller
--

--
-- AUTO_INCREMENT för tabell `guestbook`
--
ALTER TABLE `guestbook`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
