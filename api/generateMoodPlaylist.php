<?php
session_start();
$mood = $_GET['mood']; // Get mood from query
$accessToken = $_SESSION['access_token']; // Access token from session

// Fetch recommendations with a limit of 20 tracks
$endpoint = "https://api.spotify.com/v1/recommendations?seed_genres={$mood}&limit=20";

$ch = curl_init($endpoint);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $accessToken"
]);

$response = curl_exec($ch);
curl_close($ch);

// Debug: Log the response to ensure tracks have URIs
error_log('Spotify Recommendations Response: ' . $response);

echo $response;