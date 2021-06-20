-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 21, 2021 at 12:03 AM
-- Server version: 10.4.13-MariaDB
-- PHP Version: 7.2.32

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `wfp`
--

-- --------------------------------------------------------

--
-- Table structure for table `runs`
--

CREATE TABLE `runs` (
  `id` int(11) NOT NULL,
  `workflow` int(11) NOT NULL,
  `user` int(11) NOT NULL,
  `state` int(11) NOT NULL,
  `usertask` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `runs`
--

INSERT INTO `runs` (`id`, `workflow`, `user`, `state`, `usertask`) VALUES
(1, 1, 2, 2, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE `tasks` (
  `id` int(11) NOT NULL,
  `name` text NOT NULL,
  `workflow` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`id`, `name`, `workflow`) VALUES
(1, 'Enviar e-mail', NULL),
(2, 'Redatar documento', NULL),
(3, 'Revisar documento', NULL),
(4, 'Planificar reunión', NULL),
(5, 'Analizar funcionalidad', NULL),
(6, 'Diseñar funcionalidad', NULL),
(7, 'Implementar funcionalidad', NULL),
(8, 'Redactar requisitos de sistema', NULL),
(9, 'Diseñar pruebas de sistema', NULL),
(10, 'Realizar pedido', NULL),
(11, 'Enviar Factura', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `login` text NOT NULL,
  `name` text NOT NULL,
  `email` text DEFAULT NULL,
  `passwd` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `login`, `name`, `email`, `passwd`) VALUES
(1, 'admin', 'Administrador', 'root@wf-processor.com', 'admin'),
(2, 'juanito', 'Juan Sánchez', 'juan.sanchez@mycomp.com', '12345'),
(3, 'pepito', 'Pepe López', 'pepe.lopez@gmail.com', 'patata');

-- --------------------------------------------------------

--
-- Table structure for table `usertasks`
--

CREATE TABLE `usertasks` (
  `id` int(11) NOT NULL,
  `run` int(11) NOT NULL,
  `user` int(11) NOT NULL,
  `wftask` int(11) NOT NULL,
  `state` int(11) NOT NULL,
  `notes` text DEFAULT NULL,
  `horas` int(11) DEFAULT NULL,
  `startdate` date DEFAULT NULL,
  `enddate` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `usertasks`
--

INSERT INTO `usertasks` (`id`, `run`, `user`, `wftask`, `state`, `notes`, `horas`, `startdate`, `enddate`) VALUES
(1, 1, 2, 1, 2, '', NULL, NULL, NULL),
(2, 1, 2, 2, 1, NULL, NULL, NULL, NULL),
(3, 1, 2, 3, 1, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `wftasks`
--

CREATE TABLE `wftasks` (
  `id` int(11) NOT NULL,
  `workflow` int(11) NOT NULL,
  `orderaaa` int(11) NOT NULL,
  `task` int(11) NOT NULL,
  `data` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `wftasks`
--

INSERT INTO `wftasks` (`id`, `workflow`, `orderaaa`, `task`, `data`) VALUES
(1, 1, 10, 1, 'Al Scrum Master'),
(2, 1, 20, 4, 'Reunión revisión del sprint'),
(3, 1, 30, 3, 'Requisitos software para las tareas del sprint.');

-- --------------------------------------------------------

--
-- Table structure for table `workflows`
--

CREATE TABLE `workflows` (
  `id` int(11) NOT NULL,
  `name` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `workflows`
--

INSERT INTO `workflows` (`id`, `name`) VALUES
(1, 'Proceso1');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `runs`
--
ALTER TABLE `runs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `workflow` (`workflow`),
  ADD KEY `usertask` (`usertask`),
  ADD KEY `user` (`user`);

--
-- Indexes for table `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `workflow` (`workflow`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `usertasks`
--
ALTER TABLE `usertasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `run` (`run`),
  ADD KEY `wftask` (`wftask`),
  ADD KEY `usertaskstate` (`user`,`state`);

--
-- Indexes for table `wftasks`
--
ALTER TABLE `wftasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `workflow` (`workflow`),
  ADD KEY `task` (`task`);

--
-- Indexes for table `workflows`
--
ALTER TABLE `workflows`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `runs`
--
ALTER TABLE `runs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `usertasks`
--
ALTER TABLE `usertasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `wftasks`
--
ALTER TABLE `wftasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `workflows`
--
ALTER TABLE `workflows`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `runs`
--
ALTER TABLE `runs`
  ADD CONSTRAINT `runs_ibfk_1` FOREIGN KEY (`workflow`) REFERENCES `workflows` (`id`),
  ADD CONSTRAINT `runs_ibfk_2` FOREIGN KEY (`usertask`) REFERENCES `usertasks` (`id`),
  ADD CONSTRAINT `runs_ibfk_3` FOREIGN KEY (`user`) REFERENCES `users` (`id`);

--
-- Constraints for table `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`workflow`) REFERENCES `workflows` (`id`);

--
-- Constraints for table `usertasks`
--
ALTER TABLE `usertasks`
  ADD CONSTRAINT `usertasks_ibfk_1` FOREIGN KEY (`run`) REFERENCES `runs` (`id`),
  ADD CONSTRAINT `usertasks_ibfk_2` FOREIGN KEY (`user`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `usertasks_ibfk_3` FOREIGN KEY (`wftask`) REFERENCES `wftasks` (`id`);

--
-- Constraints for table `wftasks`
--
ALTER TABLE `wftasks`
  ADD CONSTRAINT `wftasks_ibfk_1` FOREIGN KEY (`workflow`) REFERENCES `workflows` (`id`),
  ADD CONSTRAINT `wftasks_ibfk_2` FOREIGN KEY (`task`) REFERENCES `tasks` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
