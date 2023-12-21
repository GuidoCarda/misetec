-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 20-12-2023 a las 21:48:50
-- Versión del servidor: 10.4.24-MariaDB
-- Versión de PHP: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `misetec`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `client`
--

CREATE TABLE `client` (
  `id` int(11) NOT NULL,
  `firstname` varchar(50) DEFAULT NULL,
  `lastname` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `address` varchar(50) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `postal_code` varchar(10) DEFAULT NULL,
  `status` tinyint(1) DEFAULT 1,
  `province_id` int(11) DEFAULT NULL,
  `otp` varchar(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `client`
--

INSERT INTO `client` (`id`, `firstname`, `lastname`, `email`, `address`, `phone_number`, `postal_code`, `status`, `province_id`, `otp`) VALUES
(1, 'Guido', 'Cardarelli', 'guidocarda@hotmail.com', 'Gutierrez 33', '155919451', '2000', 1, NULL, '6058'),
(2, 'Estefania', 'Curi', 'estefania@gmail.com', 'Alcarcito 232', '155942345', '3142', 1, NULL, '1943'),
(3, 'Joaquin', 'Vesco Aparicio', 'joaquinvesapa@gmail.com', 'Galindo 423', '153052343', '2132', 1, NULL, NULL),
(4, 'Jorge', 'Cardarelli', 'jcardarelli@gmail.com', 'Gutierrez 33', '156235111', '2000', 1, NULL, NULL),
(5, 'Luciano', 'Castro', 'lucianocastro@gmail.com', 'Caminito 323', '154623454', '1228', 1, NULL, NULL),
(6, 'Pedro', 'Ramirez', 'pedroramirez@gmail.com', 'La hoguera 333', '156345464', '6300', 1, NULL, NULL),
(7, 'Luca', 'Lavoranti', 'lucalavoranti@gmail.com', 'Juan Manuel de Rosas 1350', '155919451', '2000', 1, NULL, '1193'),
(8, 'Manuel', 'Dominguez', 'manudominguez@hotmail.com', 'Roca 232', '152345122', '3600', 1, NULL, NULL),
(9, 'Marcela', 'Botta', 'marcelabotta5@gmail.com', 'Pelegrini 332', '155938454', '2000', 1, NULL, NULL),
(10, 'Robertito', 'Carlos', 'robertito@gmail.com', 'Gutierrez 33', '155949231', '2000', 1, 5, NULL),
(11, 'Juan', 'Perez', 'juanperez@gmail.com', 'Guatemala 222', '1551321', '2330', 1, 1, '8242');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `device`
--

CREATE TABLE `device` (
  `id` int(11) NOT NULL,
  `brand` varchar(50) DEFAULT NULL,
  `model` varchar(50) DEFAULT NULL,
  `type` enum('pc','notebook') DEFAULT 'pc',
  `serial_number` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `device`
--

INSERT INTO `device` (`id`, `brand`, `model`, `type`, `serial_number`) VALUES
(1, 'Lenovo', 'Ideapad 5', 'pc', 'KJDA23D'),
(2, 'Asus', 'Vivobook', 'pc', '32K432-232AS'),
(3, 'Lenovo', 'Ideapad 7', 'pc', 'KK023-2323F'),
(4, 'Lenovo', 'Ideapad 3', 'pc', 'kksfd-2323');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `order`
--

CREATE TABLE `order` (
  `id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `finished_at` timestamp NULL DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `device_failure` varchar(255) DEFAULT NULL,
  `accesories` varchar(255) DEFAULT NULL,
  `report` varchar(255) DEFAULT NULL,
  `service_type_id` int(11) DEFAULT NULL,
  `status_id` int(11) DEFAULT 1,
  `device_id` int(11) DEFAULT NULL,
  `client_id` int(11) DEFAULT NULL,
  `staff_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `order`
--

INSERT INTO `order` (`id`, `created_at`, `finished_at`, `description`, `device_failure`, `accesories`, `report`, `service_type_id`, `status_id`, `device_id`, `client_id`, `staff_id`) VALUES
(1, '2023-12-18 14:37:29', NULL, 'La pantalla parpadea repentinamente. \nAl mover el flexor tambien por momentos parpaedea.\n\nPosible falla en el flexor.', NULL, 'Fuente de poder original', NULL, 1, 4, 1, 3, 1),
(2, '2023-12-18 14:41:12', NULL, 'Instalacion cableado ethernet en domicilio.\nVisita pactada para el 03/01/24 a fin de presupuestar instalacion.', 'aa', '', 'Instalacion 20mts cableado.\n1 extensor wifi.\nInstalacion de 10 nuevas Fichas rj45 hembra.\nCambio 5 fichas rj43 existentes.', 5, 2, NULL, 1, 1),
(3, '2023-12-07 14:44:17', '2023-12-18 22:38:25', 'Puerto de carga no funciona correctamente, deja de cargar por momentos. \nYa se probó con otro cargador y ocurre lo mismo.\n\nRevisar puerto de carga', '', 'Fuente de poder original ', 'Cambio puerto', 1, 5, 2, 1, 1),
(4, '2023-11-02 14:57:36', NULL, 'Instalacion de dos camaras en local de alimentos para celiacos', NULL, NULL, NULL, 6, 4, NULL, 3, 1),
(5, '2023-12-18 15:22:56', NULL, 'Instalacion paquete office 2023 y antivirus AVAST 2023. Eliminacion software sin utilización', '', '', '', 4, 1, NULL, 6, 1),
(6, '2023-12-18 15:24:48', NULL, 'Empresa de seguros requiere consultoria sobre el sector IT para agilizar procesos internos.', NULL, NULL, NULL, 3, 1, NULL, 7, 1),
(7, '2023-12-01 15:28:29', NULL, 'Actualizacion software edicion.', NULL, NULL, NULL, 4, 4, NULL, 8, 1),
(8, '2023-12-18 15:38:35', '2023-12-18 22:49:59', 'El rendimiento disminuyó considerablemente luego de descargar el suite adobe crackeado.\n\n', '', '', '', 2, 5, 3, 1, 1),
(9, '2023-12-18 15:52:48', NULL, 'Ejemplo consultoria It', NULL, NULL, NULL, 3, 1, NULL, 6, 1),
(10, '2023-12-18 15:53:02', NULL, 'Ejemplo cableado estruct 1', NULL, NULL, NULL, 5, 1, NULL, 6, 1),
(11, '2023-12-18 15:53:26', NULL, 'Ejemplo servicio remoto', NULL, NULL, NULL, 4, 1, NULL, 8, 1),
(12, '2023-12-18 16:07:43', NULL, 'Cambio panel ', '', '', 'Cambio panel. Costo $40.000', 1, 3, 4, 9, 1),
(13, '2023-12-19 00:15:57', NULL, 'test', NULL, NULL, NULL, 4, 1, NULL, 10, 1);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `order_detail_view`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `order_detail_view` (
`id` int(11)
,`created_at` timestamp
,`finished_at` timestamp
,`description` varchar(255)
,`device_failure` varchar(255)
,`accesories` varchar(255)
,`report` varchar(255)
,`service_type_id` int(11)
,`service_type` varchar(50)
,`status_id` int(11)
,`status` varchar(30)
,`device_id` int(11)
,`brand` varchar(50)
,`model` varchar(50)
,`type` enum('pc','notebook')
,`serial_number` varchar(50)
,`client_id` int(11)
,`firstname` varchar(50)
,`lastname` varchar(50)
,`email` varchar(50)
,`province_id` int(11)
,`province` varchar(50)
,`staff_id` int(11)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `order_list_view`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `order_list_view` (
`id` int(11)
,`created_at` timestamp
,`description` varchar(255)
,`status_id` int(11)
,`status` varchar(30)
,`service_type_id` int(11)
,`service_type` varchar(50)
,`client_id` int(11)
,`firstname` varchar(50)
,`lastname` varchar(50)
);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `order_status`
--

CREATE TABLE `order_status` (
  `id` int(11) NOT NULL,
  `denomination` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `order_status`
--

INSERT INTO `order_status` (`id`, `denomination`) VALUES
(1, 'sin revisar'),
(2, 'en espera'),
(3, 'en progreso'),
(4, 'cancelada'),
(5, 'finalizada');

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `order_status_count_view`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `order_status_count_view` (
`total_orders` bigint(21)
,`finished_orders` decimal(22,0)
,`cancelled_orders` decimal(22,0)
,`in_progress_orders` decimal(22,0)
,`waiting_for_approval_orders` decimal(22,0)
,`pending_orders` decimal(22,0)
);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `province`
--

CREATE TABLE `province` (
  `id` int(11) NOT NULL,
  `denomination` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `province`
--

INSERT INTO `province` (`id`, `denomination`) VALUES
(1, 'Buenos Aires'),
(2, 'Catamarca'),
(3, 'Chaco'),
(4, 'Chubut'),
(5, 'Córdoba'),
(6, 'Corrientes'),
(7, 'Entre Ríos'),
(8, 'Formosa'),
(9, 'Jujuy'),
(10, 'La Pampa'),
(11, 'La Rioja'),
(12, 'Mendoza'),
(13, 'Misiones'),
(14, 'Neuquén'),
(15, 'Río Negro'),
(16, 'Salta'),
(17, 'San Juan'),
(18, 'San Luis'),
(19, 'Santa Cruz'),
(20, 'Santa Fe'),
(21, 'Santiago del Estero'),
(22, 'Tierra del Fuego, Antártida e Islas del Atlántico '),
(23, 'Tucumán');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `service_type`
--

CREATE TABLE `service_type` (
  `id` int(11) NOT NULL,
  `denomination` varchar(50) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `service_type`
--

INSERT INTO `service_type` (`id`, `denomination`, `description`) VALUES
(1, 'Reparación de PCs y Notebooks', 'Servicio de reparación de computadoras y notebooks.'),
(2, 'Mantenimiento preventivo y correctivo', 'Servicio de mantenimiento para prevenir y corregir problemas en sistemas.'),
(3, 'Consultoría IT', 'Servicio de consultoría en tecnologías de la información.'),
(4, 'Servicio Remoto', 'Asistencia y solución de problemas de forma remota.'),
(5, 'Cableados estructurados', 'Instalación y configuración de sistemas de cableado estructurado.'),
(6, 'Instalación y configuración de cámaras de segurida', 'Servicio de instalación y configuración de sistemas de cámaras de seguridad.');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `staff`
--

CREATE TABLE `staff` (
  `id` int(11) NOT NULL,
  `firstname` varchar(50) DEFAULT NULL,
  `lastname` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `staff`
--

INSERT INTO `staff` (`id`, `firstname`, `lastname`, `email`, `password`) VALUES
(1, 'Emanuel', 'Cardarelli', 'user1@hotmail.com', '$2b$10$cNvavl6ow7tJPgh4oH6qYew7BLlPlQIHoPYSNgwgnh1OCFcvb1m76');

-- --------------------------------------------------------

--
-- Estructura para la vista `order_detail_view`
--
DROP TABLE IF EXISTS `order_detail_view`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `order_detail_view`  AS SELECT `o`.`id` AS `id`, `o`.`created_at` AS `created_at`, `o`.`finished_at` AS `finished_at`, `o`.`description` AS `description`, `o`.`device_failure` AS `device_failure`, `o`.`accesories` AS `accesories`, `o`.`report` AS `report`, `o`.`service_type_id` AS `service_type_id`, `st`.`denomination` AS `service_type`, `o`.`status_id` AS `status_id`, `os`.`denomination` AS `status`, `o`.`device_id` AS `device_id`, `d`.`brand` AS `brand`, `d`.`model` AS `model`, `d`.`type` AS `type`, `d`.`serial_number` AS `serial_number`, `o`.`client_id` AS `client_id`, `c`.`firstname` AS `firstname`, `c`.`lastname` AS `lastname`, `c`.`email` AS `email`, `c`.`province_id` AS `province_id`, `p`.`denomination` AS `province`, `o`.`staff_id` AS `staff_id` FROM (((((`order` `o` join `service_type` `st` on(`o`.`service_type_id` = `st`.`id`)) join `order_status` `os` on(`o`.`status_id` = `os`.`id`)) left join `device` `d` on(`o`.`device_id` = `d`.`id`)) join `client` `c` on(`o`.`client_id` = `c`.`id`)) left join `province` `p` on(`c`.`province_id` = `p`.`id`))  ;

-- --------------------------------------------------------

--
-- Estructura para la vista `order_list_view`
--
DROP TABLE IF EXISTS `order_list_view`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `order_list_view`  AS SELECT `o`.`id` AS `id`, `o`.`created_at` AS `created_at`, `o`.`description` AS `description`, `o`.`status_id` AS `status_id`, `os`.`denomination` AS `status`, `o`.`service_type_id` AS `service_type_id`, `st`.`denomination` AS `service_type`, `o`.`client_id` AS `client_id`, `c`.`firstname` AS `firstname`, `c`.`lastname` AS `lastname` FROM (((`order` `o` join `service_type` `st` on(`o`.`service_type_id` = `st`.`id`)) join `client` `c` on(`o`.`client_id` = `c`.`id`)) join `order_status` `os` on(`o`.`status_id` = `os`.`id`)) ORDER BY `o`.`status_id` ASC, `o`.`created_at` ASC  ;

-- --------------------------------------------------------

--
-- Estructura para la vista `order_status_count_view`
--
DROP TABLE IF EXISTS `order_status_count_view`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `order_status_count_view`  AS SELECT count(0) AS `total_orders`, sum(case when `order`.`status_id` = 5 then 1 else 0 end) AS `finished_orders`, sum(case when `order`.`status_id` = 4 then 1 else 0 end) AS `cancelled_orders`, sum(case when `order`.`status_id` = 3 then 1 else 0 end) AS `in_progress_orders`, sum(case when `order`.`status_id` = 2 then 1 else 0 end) AS `waiting_for_approval_orders`, sum(case when `order`.`status_id` = 1 then 1 else 0 end) AS `pending_orders` FROM `order`  ;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `client`
--
ALTER TABLE `client`
  ADD PRIMARY KEY (`id`),
  ADD KEY `province_id` (`province_id`);

--
-- Indices de la tabla `device`
--
ALTER TABLE `device`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `order`
--
ALTER TABLE `order`
  ADD PRIMARY KEY (`id`),
  ADD KEY `service_type_id` (`service_type_id`),
  ADD KEY `status_id` (`status_id`),
  ADD KEY `device_id` (`device_id`),
  ADD KEY `client_id` (`client_id`),
  ADD KEY `staff_id` (`staff_id`);

--
-- Indices de la tabla `order_status`
--
ALTER TABLE `order_status`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `province`
--
ALTER TABLE `province`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `service_type`
--
ALTER TABLE `service_type`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `staff`
--
ALTER TABLE `staff`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `client`
--
ALTER TABLE `client`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `device`
--
ALTER TABLE `device`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `order`
--
ALTER TABLE `order`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `order_status`
--
ALTER TABLE `order_status`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `province`
--
ALTER TABLE `province`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT de la tabla `service_type`
--
ALTER TABLE `service_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `staff`
--
ALTER TABLE `staff`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `client`
--
ALTER TABLE `client`
  ADD CONSTRAINT `client_ibfk_1` FOREIGN KEY (`province_id`) REFERENCES `province` (`id`);

--
-- Filtros para la tabla `order`
--
ALTER TABLE `order`
  ADD CONSTRAINT `order_ibfk_1` FOREIGN KEY (`service_type_id`) REFERENCES `service_type` (`id`),
  ADD CONSTRAINT `order_ibfk_2` FOREIGN KEY (`status_id`) REFERENCES `order_status` (`id`),
  ADD CONSTRAINT `order_ibfk_3` FOREIGN KEY (`device_id`) REFERENCES `device` (`id`),
  ADD CONSTRAINT `order_ibfk_4` FOREIGN KEY (`client_id`) REFERENCES `client` (`id`),
  ADD CONSTRAINT `order_ibfk_5` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
