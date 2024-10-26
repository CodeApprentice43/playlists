<?php
session_start();
header('Content-Type: application/json');

// Check if the access token is available in the session
if (!isset($_SESSION['access_token'])) {
    echo json_encode(['error' => 'Access token not found.']);
    http_response_code(401); // Unauthorized
    exit();
}

$accessToken = $_SESSION['access_token'];

// Spotify API endpoint for user profile
$url = 'https://api.spotify.com/v1/me';

// Initialize cURL session
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $accessToken",
]);

$response = curl_exec($ch);
$httpStatus = curl_getinfo($ch, CURLINFO_HTTP_CODE);

curl_close($ch);

// Check if the request was successful
if ($httpStatus === 200) {
    $data = json_decode($response, true);
    $profileLink = $data['external_urls']['spotify'] ?? 'No profile link available';
    $displayName = $data['display_name'] ?? 'Unknown User';

    // Return the display name and profile link as JSON
    echo json_encode([
        'displayName' => $displayName,
        'profileLink' => $profileLink,
    ]);
} else {
    echo json_encode(['error' => 'Failed to fetch profile data.', 'status' => $httpStatus]);
    http_response_code($httpStatus);
}
?>