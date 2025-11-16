<?php
session_start();

if (empty($_SESSION['username'])) {
    echo json_encode(["success" => false, "msg" => "Not logged in."]);
    exit;
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "ClothingStore";

try {
    
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $conn->prepare("
        SELECT * FROM `Order` WHERE email = :email
    ");

    $stmt->execute([
        ':email' => $_SESSION['email'],
    ]);

    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $itemStmt = $conn->prepare("
        SELECT * FROM OrderItem WHERE order_id = :order_id
    ");
    foreach ($orders as &$order) {
        $itemStmt->execute([
            ':order_id' => $order['id'],
        ]);
        $items = $itemStmt->fetchAll(PDO::FETCH_ASSOC);

        $order['items'] = $items;
    }

    echo json_encode([
        "success" => true,
        "orders" => $orders,
    ]);
} catch(PDOException $e) {
    echo json_encode(["success" => false, "msg" => "Error: " . $e->getMessage()]);
}

$conn = null;
?>