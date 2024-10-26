<?php
session_start();
//$_SESSION['get played tracks']=10;
//error_log("Get recently played tracks " . print_r($_SESSION, true));
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

if (!isset($_SESSION['access_token'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit();
}

$access_token = $_SESSION['access_token'];

// Fetch recently played tracks from Spotify API
$recently_played_url = "https://api.spotify.com/v1/me/player/recently-played?limit=10";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $recently_played_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $access_token,
]);

$response = curl_exec($ch);
curl_close($ch);

if ($response === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch recently played tracks']);
    exit();
}

// Return the recently played tracks to the frontend
echo $response;
