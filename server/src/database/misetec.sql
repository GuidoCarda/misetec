  CREATE DATABASE misetec;
  USE misetec;

  CREATE TABLE service_type(
    id int primary key auto_increment,
    denomination varchar(50),
    `description` varchar(255)
  );

  CREATE TABLE order_status(
    id int primary key auto_increment,
    denomination varchar(30)
  );

  CREATE TABLE device(
    id int primary key auto_increment,
    brand varchar(50),
    model varchar(50),
    `type` enum('pc', 'notebook') default 'pc',
    serial_number varchar(50)
  );

  CREATE TABLE client(
    id int primary key auto_increment,
    firstname varchar(50),
    lastname varchar(50),
    email varchar(50),
    `address` varchar(50),
    phone_number varchar(20),
    postal_code varchar(10),
    `status` boolean default true
    province_id int,
    foreign key (province_id) references province(id)
  );

  CREATE TABLE staff(
    id int primary key auto_increment,
    firstname varchar(50),
    lastname varchar(50),
    email varchar(50),
    `password` varchar(255)
  );

  CREATE TABLE `order`(
    id int primary key auto_increment,
    created_at timestamp default current_timestamp,
    finished_at timestamp,
    `description` varchar(255),
    device_failure varchar(255),
    accesories varchar(255),
    report varchar(255),
    service_type_id int,
    status_id int default 1,
    device_id int,
    client_id int,
    staff_id int,
    foreign key (service_type_id) references service_type(id),
    foreign key (status_id) references order_status(id),
    foreign key (device_id) references device(id),
    foreign key (client_id) references client(id),
    foreign key (staff_id) references staff(id)
  );

ALTER TABLE `order` MODIFY COLUMN created_at timestamp default current_timestamp;
ALTER TABLE `order` MODIFY COLUMN finished_at timestamp default null;

  -- CREATE TABLE order_history(
  --   id int primary key auto_increment,
  --   order_id int,
  --   status_id int,
  --   created_at timestamp default current_timestamp,
  --   foreign key (order_id) references `order`(id),
  --   foreign key (status_id) references order_status(id)
  -- );

INSERT INTO order_status (denomination) 
VALUES ('sin revisar'),
      ('en espera'),
      ('en progreso'),
      ('cancelada'),
      ('finalizada');

INSERT INTO service_type (denomination, `description`)
VALUES
  ('Reparación de PCs y Notebooks', 'Servicio de reparación de computadoras y notebooks.'),
  ('Mantenimiento preventivo y correctivo', 'Servicio de mantenimiento para prevenir y corregir problemas en sistemas.'),
  ('Consultoría IT', 'Servicio de consultoría en tecnologías de la información.'),
  ('Servicio Remoto', 'Asistencia y solución de problemas de forma remota.'),
  ('Cableados estructurados', 'Instalación y configuración de sistemas de cableado estructurado.'),
  ('Instalación y configuración de cámaras de seguridad', 'Servicio de instalación y configuración de sistemas de cámaras de seguridad.');


  /*
  Consultar.
  -- 1 - Cuando setear campos a NOT NULL?


  -- 2 - En el caso que quiera tener un historial de actualizaciones. Como lo podria implementar?
  -- Es decir guardar la fecha de cada cambio de estado.
  -- Trigger, y una nueva tabla de movimientos/actualizaciones?
  -- Cuando se de un update en la tabla ORDER que se almacene la fecha y hora junto a la actualizacion dada?
  */


CREATE VIEW order_list_view AS
SELECT  o.id, 
        o.created_at, 
        o.description, 
        o.status_id, 
        os.denomination as status, 
        o.service_type_id, 
        st.denomination as service_type,  
        o.client_id, 
        c.firstname, 
        c.lastname 
FROM `order` o 
INNER JOIN service_type st ON o.service_type_id = st.id 
INNER JOIN client c ON o.client_id = c.id 
INNER JOIN order_status os ON o.status_id = os.id
ORDER BY o.status_id;

CREATE VIEW client_order_list_view AS
SELECT  o.id, 
        o.created_at, 
        o.description, 
        o.status_id, 
        os.denomination as status, 
        o.service_type_id, 
        st.denomination as service_type,  
        o.client_id, 
        c.firstname, 
        c.lastname 
FROM `order` o 
INNER JOIN service_type st ON o.service_type_id = st.id 
INNER JOIN client c ON o.client_id = c.id 
INNER JOIN order_status os ON o.status_id = os.id
ORDER BY o.status_id;




CREATE VIEW order_detail_view AS
SELECT o.id,
       o.created_at,
       o.finished_at,
       o.description,
      o.device_failure,
      o.accesories,
      o.report,
      o.service_type_id,
      st.denomination as service_type,
      o.status_id,
      os.denomination as status,
      o.device_id,
      d.brand,
      d.model,
      d.type,
      d.serial_number,
      o.client_id,
      c.firstname,
      c.lastname,
      c.email,
      c.province,
      o.staff_id
FROM `order` o
INNER JOIN service_type st ON o.service_type_id = st.id
INNER JOIN order_status os ON o.status_id = os.id
LEFT JOIN device d ON o.device_id = d.id
INNER JOIN client c ON o.client_id = c.id;
INNER JOIN provice p ON c.province_id = p.id;


CREATE VIEW order_status_count_view AS
SELECT
  COUNT(*) AS total_orders,
  SUM(CASE WHEN status_id = 5 THEN 1 ELSE 0 END) AS finished_orders,
  SUM(CASE WHEN status_id = 4 THEN 1 ELSE 0 END) AS cancelled_orders,
  SUM(CASE WHEN status_id = 3 THEN 1 ELSE 0 END) AS in_progress_orders,
  SUM(CASE WHEN status_id = 2 THEN 1 ELSE 0 END) AS waiting_for_approval_orders,
  SUM(CASE WHEN status_id = 1 THEN 1 ELSE 0 END) AS pending_orders
FROM `order`;


SELECT * FROM client WHERE  status = 1;



SELECT *
FROM `order`
WHERE status_id = 1


SELECT
  id,
  TIMESTAMPDIFF(SECOND, created_at, finished_at) AS resolution_time
FROM `order`
WHERE finished_at IS NOT NULL;

SELECT 
  id,
  status,
FROM order_list_view
WHERE created_at BETWEEN ? AND ?


SELECT 
  COUNT(id) AS pending
FROM `order`
WHERE status_id = 1 AND created_at BETWEEN "2022-1-17" AND "2023-12-30"


SELECT
  COUNT(*) AS total,
  SUM(CASE WHEN status_id = 3 THEN 1 ELSE 0 END) AS in_progress,
  SUM(CASE WHEN status_id = 1 THEN 1 ELSE 0 END) AS pending;
FROM `order`
WHERE created_at BETWEEN "2022-1-17" AND "2023-12-30"




ALTER TABLE `client` DROP COLUMN province;
ALTER TABLE `client` ADD COLUMN province_id int;
ALTER TABLE `client` ADD FOREIGN KEY (province_id) REFERENCES province(id);


-- Agregar tabla provincias
CREATE TABLE province(
  id int primary key auto_increment,
  denomination varchar(50)
);

INSERT INTO province (denomination) VALUES
('Buenos Aires'),
('Catamarca'),
('Chaco'),
('Chubut'),
('Córdoba'),
('Corrientes'),
('Entre Ríos'),
('Formosa'),
('Jujuy'),
('La Pampa'),
('La Rioja'),
('Mendoza'),
('Misiones'),
('Neuquén'),
('Río Negro'),
('Salta'),
('San Juan'),
('San Luis'),
('Santa Cruz'),
('Santa Fe'),
('Santiago del Estero'),
('Tierra del Fuego, Antártida e Islas del Atlántico Sur'),
('Tucumán');



ALTER TABLE `client` ADD COLUMN `otp` VARCHAR(4);