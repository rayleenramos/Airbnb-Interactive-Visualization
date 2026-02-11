<?php
session_start();
header('Content-Type: application/json');

// connects to airbnb_db
if (!isset($_SESSION['uid'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Please login to the database first.'
    ]);
    exit;
}

require 'dbconfig.php';  

// raw airbnb data - imit to 500 rows 
$airbnbRaw = [];
$sql0 = "SELECT neighbourhood_cleansed, neighbourhood_group_cleansed, property_type, bedrooms, bathrooms, price, number_of_reviews, review_scores_rating
         FROM airbnb LIMIT 500";
$result0 = mysqli_query($con, $sql0);
// successful query
if ($result0) {
    while ($row = mysqli_fetch_assoc($result0)) {
        $airbnbRaw[] = $row;
    }
} else {
    // failed query
    echo json_encode([
        'success' => false,
        'message' => 'Failed to query airbnb table.'
    ]);
    exit;
}

//  borough data mart
$priceBorough = [];
$sql3 = "SELECT borough, total_price, listing_count, avg_price FROM price_borough";
$result3 = mysqli_query($con, $sql3);
// successful query
if ($result3) {
    while ($row = mysqli_fetch_assoc($result3)) {
        $priceBorough[] = $row;
    }
} else {
    // failed query
    echo json_encode([
        'success' => false,
        'message' => 'Failed to query price_borough.'
    ]);
    exit;
}

// neighborhood data mart
$priceNeighborhood = [];
$sql1 = "SELECT neighborhood, borough, total_price, listing_count, avg_price
         FROM price_neighborhood";
$result1 = mysqli_query($con, $sql1);
// successful query
if ($result1) {
    while ($row = mysqli_fetch_assoc($result1)) {
        $priceNeighborhood[] = $row;
    }
} else {
    // failed query
    echo json_encode([
        'success' => false,
        'message' => 'Failed to query price_neighborhood.'
    ]);
    exit;
}

// reviews data mart
$priceReviews = [];
$sql2 = "SELECT number_of_reviews, total_price, listing_count, avg_price
         FROM price_reviews";
$result2 = mysqli_query($con, $sql2);
// successful query
if ($result2) {
    while ($row = mysqli_fetch_assoc($result2)) {
        $priceReviews[] = $row;
    }
} else {
    // failed query
    echo json_encode([
        'success' => false,
        'message' => 'Failed to query price_reviews.'
    ]);
    exit;
}

echo json_encode([
    'success' => true,
    'airbnb_raw' => $airbnbRaw,
    'price_neighborhood' => $priceNeighborhood,
    'price_reviews' => $priceReviews,
    'price_borough' => $priceBorough
]);
mysqli_close($con);