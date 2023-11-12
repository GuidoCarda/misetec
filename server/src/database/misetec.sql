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
  `type` varchar(50),
  serial_number varchar(50)
);

CREATE TABLE client(
  id int primary key auto_increment,
  firstname varchar(50),
  lastname varchar(50),
  email varchar(50),
  `address` varchar(50),
  phone_number varchar(20),
  postal_code varchar(10)
);

CREATE TABLE staff(
  id int primary key auto_increment,
  firstname varchar(50),
  lastname varchar(50),
  username varchar(50),
  `password` varchar(50)
);

CREATE TABLE order(
  id int primary key auto_increment,
  created_at date,
  finished_at date,
  `description` varchar(255),
  device_failure varchar(255),
  accesories varchar(255),
  report varchar(255),
  service_type_id int,
  status_id int,
  device_id int,
  client_id int,
  staff_id int,
  foreign key (service_type_id) references service_type(id),
  foreign key (status_id) references order_status(id),
  foreign key (device_id) references device(id),
  foreign key (client_id) references client(id),
  foreign key (staff_id) references staff(id)
);

INSERT INTO order_status (denomination) 
VALUES ('sin revisar'),
       ('en espera'),
       ('en progreso'),
       ('cancelada'),
       ('finalizada');
      
/*
Consultar.
-- 1 - Cuando setear campos a NOT NULL?


-- 2 - En el caso que quiera tener un historial de actualizaciones. Como lo podria implementar?
-- Es decir guardar la fecha de cada cambio de estado.
-- Trigger, y una nueva tabla de movimientos/actualizaciones?
-- Cuando se de un update en la tabla ORDER que se almacene la fecha y hora junto a la actualizacion dada?
*/


