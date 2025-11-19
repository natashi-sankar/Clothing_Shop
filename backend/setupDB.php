

<?php

//This should be run to set up the Database and tables for the clothing store.

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "ClothingStore";

//Try to create the database
try {
  $conn = new PDO("mysql:host=$servername", $username, $password);
  // set the PDO error mode to exception
  $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  //Drops the database if it exists, then creates a new one.
  $sql = "
  DROP DATABASE IF EXISTS ClothingStore;
  CREATE DATABASE ClothingStore;";
  // use exec() because no results are returned
  $conn->exec($sql);
  echo "Database created successfully<br>";
} catch(PDOException $e) {
  echo $e->getMessage();
}

//Try to create the tables
try {
  $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
  // set the PDO error mode to exception
  $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  // sql to create table
  //Product - table of store products
  //User - table of registered customers
  //Orders - Table of orders made by users.
  //CartItems - a table of items in all user carts. contains the primary keys of the user and what product they are purchasing.
  $sql = 
  "CREATE TABLE Product (
  id BIGINT UNSIGNED AUTO_INCREMENT NOT NULL,
  title VARCHAR(30) NOT NULL,
  price FLOAT NOT NULL,
  descript VARCHAR(150) NOT NULL,
  section VARCHAR(30) NOT NULL,
  category VARCHAR(30) NOT NULL,
  thumbnail VARCHAR(50) NOT NULL,
  PRIMARY KEY (id)
  );

  CREATE TABLE User (
  email VARCHAR(50) NOT NULL,
  username VARCHAR(50) NOT NULL,
  pass VARCHAR(50) NOT NULL,
  PRIMARY KEY (email)
  );


  CREATE TABLE `Order` (
  id BIGINT UNSIGNED AUTO_INCREMENT NOT NULL,
  email VARCHAR(50) NOT NULL,
  addr VARCHAR(50) NOT NULL,
  total FLOAT NOT NULL,
  tax FLOAT NULL NULL,
  discount_amount FLOAT NULL NULL,
  shipping_amount FLOAT NULL NULL,
  subtotal FLOAT NULL NULL,
  discount_code VARCHAR(50) NOT NULL,
  shipping_type VARCHAR(20) NOT NULL,
  purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (email) REFERENCES User(email)
  );

  CREATE TABLE OrderItem (
  id BIGINT UNSIGNED AUTO_INCREMENT NOT NULL,
  order_id BIGINT UNSIGNED NOT NULL,
  product_id BIGINT UNSIGNED NOT NULL,
  quantity INT UNSIGNED NOT NULL,
  price FLOAT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (order_id) REFERENCES `Order`(id)
  );

  
  CREATE TABLE CartItems (
  id BIGINT UNSIGNED AUTO_INCREMENT NOT NULL,
  user_email VARCHAR(50),
  product_id BIGINT UNSIGNED,
  quantity INT UNSIGNED NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  FOREIGN KEY (user_email) REFERENCES User(email),
  FOREIGN KEY (product_id) REFERENCES Product(id)
  );
  
  ";
  // use exec() because no results are returned
  $conn->exec($sql);
  echo "Tables created successfully";
} catch(PDOException $e) {
  echo $e->getMessage();
}
$conn = null;
?>