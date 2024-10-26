<?php
session_start();
header('Content-Type: application/json');

// Database connection details
$servername = "localhost";
$username = "skim243";
$password = "50440102";
$dbname = "skim243_db";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(['message' => 'Database connection failed: ' . $conn->connect_error]));
}

$userId = $_SESSION['user_id']; // Assuming user_id is stored in session

// Fetch playlists for the user
$sql = "SELECT playlist_id, playlist_name, track_uris FROM playlists WHERE user_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $userId);
$stmt->execute();
$result = $stmt->get_result();

$playlists = [];
while ($row = $result->fetch_assoc()) {
    $playlists[] = $row;
}

echo json_encode($playlists);

$stmt->close();
$conn->close();
?>

