<?php
$servername = "localhost"; 
$username = "skim243";     
$password = "50440102";  
$dbname = "skim243_db";     

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]));
}
?>
