<?php
session_start();

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Add CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');


// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$accessToken = $_SESSION['access_token']; 
$data = json_decode(file_get_contents('php://input'), true);

// Log the incoming data
error_log('Received data: ' . print_r($data, true));

// Check if we have valid data
if (!isset($data['tracks']) || !is_array($data['tracks'])) {
    echo json_encode(['message' => 'No track URIs provided.']);
    exit;
}

$trackUris = $data['tracks']; // Array of track URIs
$playlistName = $data['name'] ?? 'Default Playlist Name'; // Default name if not provided
$playlistDescription = $data['description'] ?? 'Default playlist description.'; // Default description if not provided

// Debug: Log received URIs and playlist details to ensure they're valid
error_log('Received URIs: ' . print_r($trackUris, true));
error_log('Playlist Name: ' . $playlistName);
error_log('Playlist Description: ' . $playlistDescription);

// Step 1: Create a new playlist for the user
$createPlaylistEndpoint = "https://api.spotify.com/v1/me/playlists";
$playlistData = json_encode([
    'name' => $playlistName,
    'description' => $playlistDescription,
    'public' => false,
]);

// Make the request to create the playlist
$ch = curl_init($createPlaylistEndpoint);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $accessToken",
    "Content-Type: application/json"
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, $playlistData);

$response = curl_exec($ch);
curl_close($ch);

$playlist = json_decode($response, true);

if (isset($playlist['id'])) {
    $playlistId = $playlist['id'];

    // Step 2: Add tracks to the created playlist
    $addTracksEndpoint = "https://api.spotify.com/v1/playlists/{$playlistId}/tracks";
    $trackData = json_encode(['uris' => $trackUris]);

    $ch = curl_init($addTracksEndpoint);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Authorization: Bearer $accessToken",
        "Content-Type: application/json"
    ]);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $trackData);

    $addResponse = curl_exec($ch);
    $addResult = json_decode($addResponse, true);
    curl_close($ch);

    error_log('Add Tracks Response: ' . print_r($addResult, true));

    if (isset($addResult['snapshot_id'])) {
        echo json_encode(['message' => 'Playlist created and saved to Spotify!']);
    } else {
        error_log('Failed to add tracks: ' . $addResponse);
        echo json_encode(['message' => 'Failed to add tracks to the playlist.', 'error' => $addResponse]);
    }
} else {
    error_log('Failed to create playlist: ' . $response);
    echo json_encode(['message' => 'Failed to create playlist.', 'error' => $response]);
}
?>