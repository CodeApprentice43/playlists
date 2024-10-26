<?php
session_start();

if (!isset($_SESSION['access_token'])) {
    echo "Access token not found. Please authenticate first.";
    exit();
}

$access_token = $_SESSION['access_token'];

// Ask Top 5 aritst API 
$url = 'https://api.spotify.com/v1/me/top/artists?limit=5';
$headers = array(
    "Authorization: Bearer $access_token"
);

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
$response = curl_exec($ch);

// check cURL 
if ($response === false) {
    echo 'cURL Error: ' . curl_error($ch);
    curl_close($ch);
    exit();
}

curl_close($ch);

$top_artists = json_decode($response, true);

// Top 5 aritst ID and name 
if (isset($top_artists['items'])) {
    $artist_ids = array();
    foreach ($top_artists['items'] as $artist) {
        $artist_ids[] = array('id' => $artist['id'], 'name' => $artist['name']);
    }
} else {
    echo "Failed to retrieve top artists.";
    exit();
}

echo "<h1>Top 5 Artists Playlist</h1>";
echo "<ul>";

$track_uris = array(); // arry of song's uri that will be added to playlist

// Get the top2 track of each artist
foreach ($artist_ids as $artist) {
    $artist_id = $artist['id'];
    $artist_name = $artist['name']; // store name of artists

    $url = "https://api.spotify.com/v1/artists/{$artist_id}/top-tracks?market=US"; // top 2 track based on USA

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
    $response = curl_exec($ch);
    curl_close($ch);

    $top_tracks = json_decode($response, true);

    if (isset($top_tracks['tracks'])) {
        echo "<li>Artist: <strong>$artist_name</strong></li>";
        echo "<ul>";

        $count = 0;
        foreach ($top_tracks['tracks'] as $track) {
            if ($count >= 2) break; // select only top 2 songs
            $track_name = $track['name']; 
            $track_uris[] = $track['uri']; 
            echo "<li>Track: $track_name</li>";
            $count++;
        }

        echo "</ul>";
    }
}

echo "</ul>";
?>

