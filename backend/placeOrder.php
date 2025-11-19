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

$cart = json_decode($_POST['cart'] ?? '[]', true);
$totals = json_decode($_POST['totals'] ?? '[]', true);
$discount_code = $_POST['discount_code'];
$shipping_method = $_POST['shipping_method'];
$address = $_POST['address'];

try {
    
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $conn->beginTransaction();
    

    $stmt = $conn->prepare("
        INSERT INTO `Order`(email, total, subtotal, tax, shipping_amount, discount_amount, addr, shipping_type, discount_code)
        VALUES (:email, :total, :subtotal, :tax, :shipping_amount, :discount_amount, :addr, :shipping_type, :discount_code)
    ");

    $stmt->execute([
        ':email' => $_SESSION['email'],
        ':total' => $totals['total'] ?? 0,
        ':subtotal' => $totals['subtotal'] ?? 0,
        ':tax' => $totals['tax'] ?? 0,
        ':shipping_amount' => $totals['shipping'] ?? 0,
        ':discount_amount' => $totals['discountAmount'] ?? 0,
        ':addr' => $address ?? '',
        ':shipping_type' => $shipping_method ?? '',
        ':discount_code' => $discount_code ?? ''
    ]);

    $order_id = $conn->lastInsertId();
    foreach ($cart as $item) {
        $itemStmt = $conn->prepare("
            INSERT INTO OrderItem(order_id, product_id, quantity, price)
            VALUES (:order_id, :product_id, :quantity, :price)
        ");

        $itemStmt->execute([
            ':order_id' => $order_id,
            ':product_id' => $item['product_id'] ?? 0,
            ':quantity' => $item['quantity'] ?? 1,
            ':price' => $item['price'] ?? 0,
        ]);
    }
    
    $conn->commit();

    echo json_encode(["success" => true, "msg" => "Purchase successful."]);
} catch(PDOException $e) {
    echo json_encode(["success" => false, "msg" => "Error: " . $e->getMessage()]);
}

$conn = null;
?>