<?php
session_start();
header('Access-Control-Allow-Origin: https://se-dev.cse.buffalo.edu/CSE442/2024-Fall/anasca/');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

if (!isset($_SESSION['access_token'])) {
    echo json_encode(['success' => false, 'message' => 'Access token is missing or invalid']);
    exit;
}


// Spotify API credentials
$accessToken = $_SESSION['access_token'];
$spotifyApiUrl = 'https://api.spotify.com/v1/';



// Function to make Spotify API requests
function makeSpotifyApiRequest($url, $accessToken, $method = 'GET', $data = null) {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Authorization: Bearer $accessToken",
        'Content-Type: application/json'
    ]);

    if ($method === 'POST' && $data) {
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    }

    $response = curl_exec($ch);

    // Check for cURL errors
    if ($response === false) {
        return ['error' => curl_error($ch)];
    }

    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    // Log the HTTP code for debugging
    file_put_contents('debug.log', "HTTP Code: $httpCode\n", FILE_APPEND);

    // Check for non-2xx HTTP responses
    if ($httpCode < 200 || $httpCode >= 300) {
        return ['error' => "HTTP Code $httpCode", 'response' => $response];
    }

    return json_decode($response, true);
}

// Handle POST request for generating recommendations
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $inputData = json_decode(file_get_contents('php://input'), true);
    $recentlyPlayedTracks = $inputData['recentlyPlayed']; // Track IDs

    // Log received input data for debugging
    file_put_contents('debug.log', "Input Data: " . json_encode($inputData) . "\n", FILE_APPEND);

    if (empty($recentlyPlayedTracks)) {
        echo json_encode(['success' => false, 'message' => 'No recently played tracks provided']);
        exit;
    }

    // Prepare seeds for the Recommendations API
    $seedTracks = implode(',', array_slice($recentlyPlayedTracks, 0, 2)); // Use up to 2 tracks as seeds

    // Call the Recommendations API
    $recommendationsUrl = $spotifyApiUrl . "recommendations?seed_tracks=$seedTracks&limit=20";
    $recommendationsResponse = makeSpotifyApiRequest($recommendationsUrl, $accessToken, 'GET');

    // Log the response from the Recommendations API
    file_put_contents('debug.log', "Recommendations Response: " . json_encode($recommendationsResponse) . "\n", FILE_APPEND);

    // Check for errors in recommendations response
    if (isset($recommendationsResponse['error']) || empty($recommendationsResponse['tracks'])) {
        echo json_encode([
            'success' => false,
            'message' => 'Failed to get recommendations',
            'error' => $recommendationsResponse['error'] ?? 'No tracks found'
        ]);
        exit;
    }

    // Extract recommended track URIs
    $recommendedTrackUris = [];
    foreach ($recommendationsResponse['tracks'] as $track) {        
         $recommendedTrackUris[] = [
            'uri' => $track['uri'],
            'song_name' => $track['name'],
            'artist_name' => $track['artists'][0]['name'], // Assuming the first artist is the main one
            'album_image' => $track['album']['images'][0]['url'], // Assuming the first image is the best one
            'external_url' => $track['external_urls']['spotify'] // Spotify external URL
        ];
    }

    if (empty($recommendedTrackUris)) {
        echo json_encode(['success' => false, 'message' => 'No recommended tracks found']);
        exit;
    }

    // Return recommended track URIs
    echo json_encode(['success' => true, 'recommendedTrackUris' => $recommendedTrackUris]);
}
?>