

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

  CREATE TABLE Orders (
  id BIGINT UNSIGNED AUTO_INCREMENT NOT NULL,
  addr VARCHAR(50) NOT NULL,
  total FLOAT NOT NULL,
  shipping_type VARCHAR(20) NOT NULL,
  purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY (id)
  );

  
  CREATE TABLE CartItems (
  id BIGINT UNSIGNED AUTO_INCREMENT NOT NULL,
  user_email VARCHAR(50),
  product_id BIGINT UNSIGNED,
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