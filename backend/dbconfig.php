<!-- this is an example of a config file -->
<?php
$host = "localhost";
$username = "username";
$password = "password";
$dbname = "airbnb_db"; 

$con = mysqli_connect($host, $username, $password, $dbname)
	or die("<br>Cannot connect to DB:" .mysqli_connect_error());
?>