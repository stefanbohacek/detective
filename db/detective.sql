-- phpMyAdmin SQL Dump
-- version 4.4.13.1deb1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Apr 04, 2016 at 10:38 PM
-- Server version: 5.6.28-0ubuntu0.15.10.1
-- PHP Version: 5.6.11-1ubuntu3.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `detective_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `detective`
--

CREATE TABLE IF NOT EXISTS `detective` (
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `id` bigint(20) NOT NULL,
  `chat_log` longtext NOT NULL,
  `user_role` text NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `detective`
--

INSERT INTO `detective` (`time`, `id`, `chat_log`, `user_role`) VALUES
('2015-05-15 11:26:21', 1, '%0A%20%20%20%20%3Cul%20id%3D%22messages%22%3E%3Cli%20class%3D%22user-message%20new-message%22%3Eyoure%20a%20robot%3C/li%3E%3Cli%20class%3D%22system-message%20user-correct%22%3ECORRECT%3C/li%3E%3Cli%20class%3D%22system-message%20new-message%22%3EGame%20is%20over%3C/li%3E%3C/ul%3E%0A%20%20', ''),
('2015-05-16 02:29:19', 16, '%0A%20%20%20%20%3Cul%20id%3D%22messages%22%3E%3Cli%20class%3D%22user-message%20new-message%22%3Ehello%3C/li%3E%3Cli%20class%3D%22user-message%20new-message%22%3Eyou%20are%20an%20impostor%3C/li%3E%3Cli%20class%3D%22system-message%20error-message%22%3EERROR%3C/li%3E%3Cli%20class%3D%22system-message%20new-message%22%3EToo%20early%20to%20tell%3C/li%3E%3Cli%20class%3D%22rori-message%20new-message%22%3Ehello%3C/li%3E%3Cli%20class%3D%22user-message%20new-message%22%3Eyou%20are%20an%20impostor%3C/li%3E%3Cli%20class%3D%22system-message%20user-correct%22%3ECORRECT%3C/li%3E%3Cli%20class%3D%22system-message%20new-message%22%3EGame%20is%20over%3C/li%3E%3C/ul%3E%0A%20%20', ''),
('2015-05-16 04:13:27', 17, '%0A%20%20%20%20%3Cul%20id%3D%22messages%22%3E%3Cli%20class%3D%22user-message%20new-message%20wiggle-message%22%3Ewiggle%3C/li%3E%3Cli%20class%3D%22user-message%20new-message%20jump-message%22%3Ejump%3C/li%3E%3Cli%20class%3D%22jump-message%22%3Ejump%3C/li%3E%3Cli%20class%3D%22jump-message%22%3Ejump%3C/li%3E%3Cli%3Eyou%20are%20a%20robot%3C/li%3E%3Cli%20class%3D%22system-message%20new-message%22%3EYOU%20FOOLED%20THE%20DETECTIVE%3C/li%3E%3Cli%20class%3D%22system-message%20new-message%22%3EGame%20is%20over%3C/li%3E%3C/ul%3E%0A%20%20', ''),
('2015-05-16 04:27:19', 18, '%0A%20%20%20%20%3Cul%20id%3D%22messages%22%3E%3Cli%20class%3D%22user-message%20new-message%22%3EHello%3C/li%3E%3Cli%20class%3D%22user-message%20new-message%22%3EYou%20are%20a%20robot%3C/li%3E%3Cli%20class%3D%22system-message%20user-correct%22%3ECORRECT%3C/li%3E%3Cli%20class%3D%22system-message%20new-message%22%3EGame%20is%20over%3C/li%3E%3C/ul%3E%0A%20%20', ''),
('2015-05-16 11:32:05', 19, '%0A%20%20%20%20%3Cul%20id%3D%22messages%22%3E%3Cli%20class%3D%22user-message%20new-message%22%3Eyoure%20a%20robot%3C/li%3E%3Cli%20class%3D%22system-message%20user-correct%22%3ECORRECT%3C/li%3E%3Cli%20class%3D%22system-message%20new-message%22%3EGame%20is%20over%3C/li%3E%3C/ul%3E%0A%20%20', ''),
('2015-05-17 01:39:45', 20, '%0A%20%20%20%20%3Cul%20id%3D%22messages%22%3E%3C/ul%3E%0A%20%20', ''),
('2015-05-17 13:16:53', 21, '%0A%20%20%20%20%3Cul%20id%3D%22messages%22%3E%3Cli%20class%3D%22system-message%20new-message%22%3EPartner%20disconnected.%3C/li%3E%3C/ul%3E%0A%20%20', ''),
('2015-05-17 13:20:22', 22, '%0A%20%20%20%20%3Cul%20id%3D%22messages%22%3E%3Cli%20class%3D%22rori-message%20new-message%22%3E%3Cspan%20class%3D%22message-prepend%22%3E%26gt%3B%3C/span%3E%20Hello%3C/li%3E%3Cli%20class%3D%22user-message%20new-message%22%3EYoure%20an%20impostor%3C/li%3E%3Cli%20class%3D%22system-message%20user-correct%22%3ECORRECT%3C/li%3E%3Cli%20class%3D%22system-message%20new-message%22%3EGame%20is%20over%3C/li%3E%3C/ul%3E%0A%20%20', ''),
('2015-05-17 13:29:31', 23, '%0A%20%20%20%20%3Cul%20id%3D%22messages%22%3E%3Cli%20class%3D%22rori-message%20new-message%22%3E%3Cspan%20class%3D%22message-prepend%22%3E%26gt%3B%3C/span%3E%20Hey%21%3C/li%3E%3Cli%20class%3D%22user-message%20new-message%22%3Eyoure%20an%20impostor%3C/li%3E%3Cli%20class%3D%22system-message%20user-correct%22%3ECORRECT%3C/li%3E%3Cli%20class%3D%22system-message%20new-message%22%3EGame%20is%20over%3C/li%3E%3C/ul%3E%0A%20%20', ''),
('2015-05-17 14:01:57', 24, '%0A%20%20%20%20%3Cul%20id%3D%22messages%22%3E%3Cli%20class%3D%22user-message%20new-message%22%3EHello%3C/li%3E%3Cli%3E%3Cspan%20class%3D%22message-prepend%22%3E%26gt%3B%3C/span%3E%20hi%3C/li%3E%3Cli%3E%3Cspan%20class%3D%22message-prepend%22%3E%26gt%3B%3C/span%3E%20youre%20an%20impostor%3C/li%3E%3Cli%20class%3D%22system-message%20new-message%22%3EYOU%20HAVE%20BEEN%20REVEALED%3C/li%3E%3Cli%20class%3D%22system-message%20new-message%22%3EGame%20is%20over%3C/li%3E%3C/ul%3E%0A%20%20', 'undefined'),
('2015-05-17 14:03:24', 25, '%0A%20%20%20%20%3Cul%20id%3D%22messages%22%3E%3Cli%20class%3D%22rori-message%20new-message%22%3E%3Cspan%20class%3D%22message-prepend%22%3E%26gt%3B%3C/span%3E%20hello%3C/li%3E%3Cli%20class%3D%22user-message%20new-message%22%3Ehi%2C%20youre%20an%20impostor%3C/li%3E%3Cli%20class%3D%22system-message%20user-correct%22%3ECORRECT%3C/li%3E%3Cli%20class%3D%22system-message%20new-message%22%3EGame%20is%20over%3C/li%3E%3C/ul%3E%0A%20%20', 'undefined'),
('2015-05-17 14:04:23', 26, '%0A%20%20%20%20%3Cul%20id%3D%22messages%22%3E%3Cli%20class%3D%22rori-message%20new-message%22%3E%3Cspan%20class%3D%22message-prepend%22%3E%26gt%3B%3C/span%3E%20Hi%3C/li%3E%3Cli%20class%3D%22user-message%20new-message%22%3EHello%2C%20youre%20an%20impostor%3C/li%3E%3Cli%20class%3D%22system-message%20user-correct%22%3ECORRECT%3C/li%3E%3Cli%20class%3D%22system-message%20new-message%22%3EGame%20is%20over%3C/li%3E%3C/ul%3E%0A%20%20', 'detective'),
('2015-05-17 14:04:39', 27, '%0A%20%20%20%20%3Cul%20id%3D%22messages%22%3E%3Cli%20class%3D%22user-message%20new-message%22%3EHi%3C/li%3E%3Cli%3E%3Cspan%20class%3D%22message-prepend%22%3E%26gt%3B%3C/span%3E%20Hello%2C%20youre%20an%20impostor%3C/li%3E%3Cli%20class%3D%22system-message%20new-message%22%3EYOU%20HAVE%20BEEN%20REVEALED%3C/li%3E%3Cli%20class%3D%22system-message%20new-message%22%3EGame%20is%20over%3C/li%3E%3C/ul%3E%0A%20%20', 'impostor'),
('2015-06-11 05:01:54', 28, '%0A%20%20%20%20%3Cul%20id%3D%22messages%22%3E%3Cli%20class%3D%22user-message%20new-message%22%3Eyoure%20an%20imposter%3C/li%3E%3Cli%20class%3D%22system-message%20error-message%22%3EINCORRECT%3C/li%3E%3Cli%20class%3D%22system-message%20new-message%22%3EGame%20is%20over%3C/li%3E%3C/ul%3E%0A%20%20', 'detective');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `detective`
--
ALTER TABLE `detective`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id` (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `detective`
--
ALTER TABLE `detective`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=29;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
