<?php
session_start();
header('Content-Type: application/json');

// connects to airbnb_db 
require 'dbconfig.php'; 

$login    = $_POST['login'] ?? '';
$pass_in  = $_POST['password'] ?? '';

if ($login === '' || $pass_in === '') {
    echo json_encode([
        'success' => false,
        'message' => 'Login and password are required.'
    ]);
    exit;
}

// connect to datamining database
$dm_conn = new mysqli($host, $username, $password, 'datamining');
if ($dm_conn->connect_error) {
    echo json_encode([
        'success' => false,
        'message' => 'DB connection to datamining failed.'
    ]);
    exit;
}


// check log in information 
$sql  = "SELECT uid, login FROM DV_User WHERE login = ? AND password = ?";
$stmt = $dm_conn->prepare($sql);
$stmt->bind_param("ss", $login, $pass_in);
$stmt->execute();
$result = $stmt->get_result();

// check if a user was found
if ($row = $result->fetch_assoc()) {
    // login successful: save user info to session
    $_SESSION['uid']   = $row['uid'];
    $_SESSION['login'] = $row['login'];

    echo json_encode([
        'success' => true,
        'uid'     => $row['uid'],
        'login'   => $row['login']
    ]);
} else {
    // login failed: no match found
    echo json_encode([
        'success' => false,
        'message' => 'Invalid login or password.'
    ]);
}

$stmt->close();
$dm_conn->close();
