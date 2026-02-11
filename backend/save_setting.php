<?php
session_start();
header("Content-Type: application/json");

// connects to airbnb_db
if (!isset($_SESSION['uid']) || !isset($_SESSION['login'])) {
    echo json_encode([
        "success" => false,
        "message" => "You must be logged in to save settings."
    ]);
    exit;
}

$uid   = $_SESSION['uid'];
$login = $_SESSION['login'];

$slider_low  = $_POST['slider_low_value'] ?? null;
$slider_high = $_POST['slider_high_value'] ?? null;

if ($slider_low === null || $slider_high === null) {
    echo json_encode([
        "success" => false,
        "message" => "Missing slider values."
    ]);
    exit;
}

require "dbconfig.php";

// check if user already has saved settings
$check_sql = "SELECT uid FROM User_Setting WHERE uid = ?";
$stmt = $con->prepare($check_sql);
$stmt->bind_param("i", $uid);
$stmt->execute();
$result = $stmt->get_result();

$now = date("Y-m-d H:i:s");

if ($result->num_rows > 0) {

    // UPDATE: user exists, update existing record
    $update_sql = "
        UPDATE User_Setting 
        SET slider_low_value = ?, slider_high_value = ?, datetime = ?
        WHERE uid = ?
    ";
    $stmt2 = $con->prepare($update_sql);
    $stmt2->bind_param("ddsi", $slider_low, $slider_high, $now, $uid);

    if ($stmt2->execute()) {
        echo json_encode(["success" => true, "message" => "Settings updated."]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to update settings."]);
    }

} else {

    // INSERT: new user, create new record
    $insert_sql = "
        INSERT INTO User_Setting (uid, login, slider_low_value, slider_high_value, datetime)
        VALUES (?, ?, ?, ?, ?)
    ";
    $stmt3 = $con->prepare($insert_sql);
    $stmt3->bind_param("isdds", $uid, $login, $slider_low, $slider_high, $now);

    if ($stmt3->execute()) {
        echo json_encode(["success" => true, "message" => "Settings saved."]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to save settings."]);
    }
}

$con->close();
?>
