<?php
session_start();

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

// Check if access token is available
if (!isset($_SESSION['access_token'])) {
    echo json_encode(['error' => 'You have not connected your Spotify account yet.']);
    exit();
}

// Get access token from session
$access_token = $_SESSION['access_token'];

// Get the genre from the query parameter
if (!isset($_GET['genre'])) {
    echo json_encode(['error' => 'Genre not provided']);
    exit();
}

$genre = $_GET['genre'];  // Grab genre from query string

// Spotify API endpoint for getting recommendations based on the provided genre
$recommendations_url = "https://api.spotify.com/v1/recommendations?seed_genres=" . urlencode($genre) . "&limit=10";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $recommendations_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $access_token,
]);

$response = curl_exec($ch);
curl_close($ch);

// Check if the cURL request was successful
if ($response === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch recommendations']);
    exit();
}

// Decode the JSON response
$recommendations_data = json_decode($response, true);

// Check for errors in the response
if (isset($recommendations_data['tracks'])) {
    $songs = [];
    foreach ($recommendations_data['tracks'] as $track) {
        $songs[] = [
            'song_name' => $track['name'],
            'artist_name' => $track['artists'][0]['name'],
            'album_images' => $track['album']['images'],
            'external_urls' => $track['external_urls']
        ];
    }
    echo json_encode(['songs' => $songs]);
} else {
    echo json_encode(['error' => 'No recommendations found']);
}
?>