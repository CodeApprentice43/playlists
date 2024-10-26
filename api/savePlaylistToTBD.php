<?php
session_start();
$accessToken = $_SESSION['access_token'];
$data = json_decode(file_get_contents('php://input'), true);
$trackUris = $data['tracks']; // Array of track URIs

// Debug: Log received URIs to ensure they're valid
error_log('Received URIs: ' . print_r($trackUris, true));

// Check if we have valid URIs
if (empty($trackUris)) {
    echo json_encode(['message' => 'No track URIs provided.']);
    exit;
}

// Step 1: Create a new playlist for the user
$createPlaylistEndpoint = "https://api.spotify.com/v1/me/playlists";
$playlistData = json_encode([
    'name' => 'Mood Playlist',
    'description' => 'Generated based on your selected mood.',
    'public' => false,
]);

$ch = curl_init($createPlaylistEndpoint);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $accessToken",
    "Content-Type: application/json"
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, $playlistData);

$response = curl_exec($ch);
$playlist = json_decode($response, true);
curl_close($ch);

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

    if (isset($addResult['snapshot_id'])) {
        // Step 3: Connect to MySQL database and save playlist info
        $servername = "localhost";
        $username = "skim243";
        $password = "50440102";
        $dbname = "skim243_db";

        // Create connection
        $conn = new mysqli($servername, $username, $password, $dbname);

        // Check connection
        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }

        $userId = $_SESSION['user_id']; // Assuming user_id is stored in session
        $playlistName = 'Mood Playlist';
        $trackUrisString = implode(';', $trackUris); // Convert track URIs array to a semicolon-separated string

        // Prepare and bind the SQL statement
        $stmt = $conn->prepare("INSERT INTO playlists (user_id, playlist_id, playlist_name, track_uris) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssss", $userId, $playlistId, $playlistName, $trackUrisString);

        // Execute the statement
        if ($stmt->execute()) {
            echo json_encode(['message' => 'Playlist created, saved to Spotify, and stored in the database!']);
        } else {
            echo json_encode(['message' => 'Failed to save playlist to the database.', 'error' => $stmt->error]);
        }

        // Close the statement and connection
        $stmt->close();
        $conn->close();
    } else {
        error_log('Failed to add tracks: ' . $addResponse);
        echo json_encode(['message' => 'Failed to add tracks to the playlist.', 'error' => $addResponse]);
    }
} else {
    error_log('Failed to create playlist: ' . $response);
    echo json_encode(['message' => 'Failed to create playlist.', 'error' => $response]);
}
?>