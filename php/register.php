<?php
// Enable error reporting for debugging purposes
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Allow requests from the React app
header('Access-Control-Allow-Origin: https://se-dev.cse.buffalo.edu/CSE442/2024-Fall/skim243/tbd/');
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");



// Handle OPTIONS request for CORS preflight
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    exit(0); // Terminate the script early for OPTIONS request
}

// Include the database connection
include 'db_connection.php';




// Check if the request method is POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Retrieve and sanitize form inputs
    $data = file_get_contents("php://input");
    parse_str($data, $form_data); // Parse incoming data as form data

    // Validate if data is retrieved properly
    if (!$form_data) {
        echo "Registration Failed: No data received.";
        exit();
    }




// Sanitize and validate inputs
$username = $conn->real_escape_string(trim(htmlspecialchars($form_data['name'])));
$email = $conn->real_escape_string(trim(filter_var($form_data['email'], FILTER_SANITIZE_EMAIL)));
$password = $conn->real_escape_string(trim($form_data['password']));
$confirmPassword = $conn->real_escape_string(trim($form_data['confirmPassword']));

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo "Invalid email format.";
    exit();
}



 // Check password length (minimum 8 characters, can be adjusted)
 if (strlen($password) < 8) {
    echo "Password must be at least 8 characters long.";
    exit();
}




// Check if passwords match
if ($password !== $confirmPassword) {
    echo "Passwords do not match.";
    exit();
}

// Check if all fields are filled
if (empty($username) ||  empty($email) || empty($password) || empty($confirmPassword)) {
    echo "All fields are required.";
    exit();
}

// Check if the email already exists
$checkEmailQuery = "SELECT * FROM tbdusers WHERE email='$email'";
$result = $conn->query($checkEmailQuery);

if ($result->num_rows > 0) {
    echo "Email already exists.";
    exit();
}



  // Hash the password
  $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

  // Insert user into the database
  $sql = "INSERT INTO tbdusers (username, email, password) VALUES ('$username', '$email', '$hashedPassword')";

  if ($conn->query($sql) === TRUE) {
      echo "Registration successful!";
  } else {
      echo "Error: " . $conn->error;
  }
}

// Close the connection
$conn->close();
?>
