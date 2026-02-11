<?php
session_start();
// retrieves stored user settings from User_Setting table
header("Content-Type: application/json");

// connects to airbnb_db
if (!isset($_SESSION['uid'])) {
    echo json_encode([
        "success" => false,
        "message" => "Not logged in."
    ]);
    exit;
}

$uid = $_SESSION['uid'];

require "dbconfig.php";

// query the user's saved settings
$sql = "SELECT slider_low_value, slider_high_value, datetime 
        FROM User_Setting 
        WHERE uid = ?";

$stmt = $con->prepare($sql);
$stmt->bind_param("i", $uid);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    // settings found, return 
    echo json_encode([
        "success" => true,
        "setting" => $row
    ]);
} else {
    // no saved settings found for this user
    echo json_encode([
        "success" => false,
        "message" => "No settings saved for this user."
    ]);
}

$stmt->close();
$con->close();
?>
