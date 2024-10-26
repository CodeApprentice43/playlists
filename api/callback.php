<?php
session_start();
//$_SESSION['callbacl=k']=10;
//error_log("Callback.php " . print_r($_SESSION, true));

$client_id = '6af8d08dc8214a1a9970327659dcb156';
$client_secret = 'ef0df14ce9b946ab95b10d89136bcce9';
$redirect_uri = 'https://se-dev.cse.buffalo.edu/CSE442/2024-Fall/nafismor/moodplaylist/php/callback.php';
$code = isset($_GET['code']) ? $_GET['code'] : '';

if ($code) {
    $url = 'https://accounts.spotify.com/api/token';
    $headers = [
        'Content-Type: application/x-www-form-urlencoded',
    ];

    $post_fields = http_build_query([
        'grant_type' => 'authorization_code',
        'code' => $code,
        'redirect_uri' => $redirect_uri,
        'client_id' => $client_id,
        'client_secret' => $client_secret,
    ]);

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $post_fields);

    $response = curl_exec($ch);
    $token_data = json_decode($response, true);
    curl_close($ch);

    if (isset($token_data['access_token'])) {
        $_SESSION['access_token'] = $token_data['access_token'];
        header('Location: https://se-dev.cse.buffalo.edu/CSE442/2024-Fall/nafismor/moodplaylist/#/callback'); // Redirect back to React frontend
        exit();
    } else {
        echo 'Error obtaining access token';
    }
} else {
    echo 'No authorization code provided';
}
