<?php
session_start(); // Start the session
//$_SESSION['login']=10;
//error_log("login upper " . print_r($_SESSION, true));



header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');
/*
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
*/

error_reporting(E_ALL);
ini_set('display_errors', 1);

include 'db_connection.php'; // Include the database connection file



// Read JSON data from the POST request
$data = json_decode(file_get_contents('php://input'), true);

// Log received data for debugging purposes
//error_log("Received POST data: " . print_r($data, true));

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $email = $data['username']; // Extract email from the JSON data
    $password = $data['password']; // Extract password from the JSON data
    $rememberMe = isset($data['rememberMe']) ? $data['rememberMe'] : false; // Check if Remember Me option is set

    // Prepare and execute the SQL query to find the user by email
    $stmt = $conn->prepare("SELECT * FROM tbdusers WHERE email = ?");
    if (!$stmt) {
        //error_log("SQL statement preparation error: " . $conn->error);
        echo json_encode(["success" => false, "message" => "Error preparing statement: " . $conn->error]);
        exit();
    }

    $stmt->bind_param("s", $email); // Bind the email parameter
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // If the user exists, get the user data
        $user = $result->fetch_assoc();

        // Log entered and stored password for debugging purposes
        //error_log("Entered password: " . $password);
        //error_log("Stored password: " . $user['password']);

        // Directly compare the entered password with the stored password
        if (password_verify($password, $user['password'])) { // Directly compare passwords
            $_SESSION['username'] = $email;
            $_SESSION['logged_in'] = true;
            $_SESSION['user_id']=$user['id'];
            //error_log("login lower " . print_r($_SESSION, true));

            // If Remember Me is checked, set a cookie
            if ($rememberMe) {
                // Set cookie expiration time (e.g., 7 days)
                $cookieExpiration = time() + (7 * 24 * 60 * 60); // 7 days
                setcookie("username", $email, $cookieExpiration, "/");
                setcookie("logged_in", true, $cookieExpiration, "/");
                
                // Set session expiration time (7 days)
                $_SESSION['expire'] = $cookieExpiration;
                //error_log("login POST CHECK SESSION1 " . print_r($_SESSION, true));
            } else {
                // If Remember Me is not checked, set a shorter session expiration time (30 minutes)
                $_SESSION['expire'] = time() + (30 * 60); // Set session expiration to 30 minutes
                //error_log("login POST CHECK SESSION2 " . print_r($_SESSION, true));
            }

            echo json_encode(["success" => true, "message" => "Login successful!"]);

       
        } else {
            echo json_encode(["success" => false, "message" => "Invalid email or password."]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "User not found."]);
    }

    $stmt->close(); // Close the statement
}
//error_log("login way way bottom" . print_r($_SESSION, true));
$conn->close(); // Close the database connection
//error_log("login last" . print_r($_SESSION, true));
?>