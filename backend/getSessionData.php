<?php
session_start();

// return all necessary data here
echo json_encode([
    "username" => $_SESSION['username'] ?? null,
    "email" => $_SESSION['email'] ?? null
]);
?>