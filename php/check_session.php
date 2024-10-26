<?php
session_start(); // Start the session
//$_SESSION['check session']=10;
//error_log("Check session upper : " . print_r($_SESSION, true));

// Check if the user is logged in using cookies or session
if (isset($_COOKIE['logged_in']) && $_COOKIE['logged_in'] == true) {
    // If logged in using cookies, restore session variables
    $_SESSION['username'] = $_COOKIE['username'];
    $_SESSION['logged_in'] = true;
    echo json_encode(["success" => true, "message" => "Logged in automatically from cookie."]);
    error_log("Check session lower: " . print_r($_SESSION, true));
} elseif (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] == true) {
    // If logged in using session, return success message
    echo json_encode(["success" => true, "message" => "Logged in from session."]);
} else {
    // If not logged in, return failure message
    echo json_encode(["success" => false, "message" => "Not logged in."]);
}
?>
