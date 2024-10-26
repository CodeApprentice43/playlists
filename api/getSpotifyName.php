<?php
session_start();
//$_SESSION['get spotify name']=10;
//error_log("Get spotify name " . print_r($_SESSION, true));

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

// Check if access token is available
if (!isset($_SESSION['access_token'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit();
}

// Get access token from session
$access_token = $_SESSION['access_token'];

// Fetch user profile information from Spotify API
$user_profile_url = "https://api.spotify.com/v1/me";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $user_profile_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $access_token,
]);

$response = curl_exec($ch);
curl_close($ch);

// Check for errors in the response
if ($response === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch user profile']);
    exit();
}

// Decode the JSON response
$user_profile = json_decode($response, true);

// Extract the display name
if (isset($user_profile['display_name'])) {
    echo json_encode(['spotifyName' => $user_profile['display_name']]);
} else {
    echo json_encode(['error' => 'Display name not found']);
}
?>
