<?php

//Retrieves all cart items based on user email
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "ClothingStore";

$customeremail = "John@test.com";


try {
  $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
  $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  $stmt = $conn->prepare("SELECT product_id FROM CartItems WHERE user_email = '$customeremail'");
  $stmt->execute();

  // set the resulting array to associative
  $result = $stmt->setFetchMode(PDO::FETCH_ASSOC);
  foreach(new RecursiveArrayIterator($stmt->fetchAll()) as $k=>$v) {
    echo $k.current($v);
    echo "<br>";
  }
} catch(PDOException $e) {
  echo "Error: " . $e->getMessage();
}
$conn = null;
?>