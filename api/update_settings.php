<?php
session_start(); //starts the php code 




include 'db_connection.php'; // Establish connection to the database ($conn)


// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    // Handle preflight request
    exit(0);
}


// Check if the user is logged in (MAKING THIS FOR TESTING)
if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) { //if the session is not set or if the user is NOT logged in
    echo json_encode(["success" => false, "message" => "You are not logged in."]); //throw an error
    exit(); //end 
}






// Check if the request method is POST (aka waiting for a post reuqet)
if ($_SERVER['REQUEST_METHOD'] == 'POST') {

     // Get the JSON raw body
    $data = json_decode(file_get_contents('php://input'), true);

   // Sanitize and validate inputs
   $username = isset($data['username']) ? trim($data['username']) : null;
   $email = isset($data['email']) ? trim($data['email']) : null;
   $password = isset($data['password']) ? trim($data['password']) : null;
   $confirmPassword = isset($data['confirm_password']) ? trim($data['confirm_password']) : null;


     //VALIDATE INPUTS:



    
     // Password matches confirm password 
    
    
     if ($password && $password !== $confirmPassword) { //if password exists AND doesnt match confirm password 
        echo json_encode(["success" => false, "message" => "Passwords do not match."]); //throw an error
        exit(); //exit 
    }



    // Check if the user id is set
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "message" => "User ID not found in session."]);
    exit();
}

// Validate email format
if ($email && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["success" => false, "message" => "Invalid email format."]);
    exit();
}


   // Prepare to update user information in the database
   $userId = $_SESSION['user_id']; //$_SESSION['user_id'];// MAKING THIS FOR TESTING $_SESSION['user_id']; // Assume you saved user ID in session during login (AND put user_id in database during registration)
   $updateFields = []; // Array to hold the fields we want to update

   // Validate the user ID against the database
   $stmt = $conn->prepare("SELECT id FROM tbdusers WHERE id = ?");
   $stmt->bind_param("i", $userId); // "i" indicates that the parameter is an integer
   $stmt->execute();
   $result = $stmt->get_result();

  if ($result->num_rows === 0) {
    // User ID is invalid
    echo json_encode(["success" => false, "message" => "Invalid user ID."]);
    //error_log("INVALID USER ID");
    exit();
}

// Close the statement after using it
$stmt->close();


    // Check if the username is provided
    if (!empty($username)) {
        $updateFields['username'] = $username; // Store in associative array
    }

    // Check if the email is provided
    if (!empty($email)) {
        $updateFields['email'] = $email; // Store in associative array
    }

    // Check if the password is provided
    if (!empty($password)) {
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT); // Hash the password
        $updateFields['password'] = $hashedPassword; // Store in associative array
    }

    // If no fields to update, return a message
    if (empty($updateFields)) {//checks if updateFields is empty (nothing to update)
        echo json_encode(["success" => false, "message" => "No fields to update."]);//Throws an error 
        exit();//exists 
    }



    // Prepare update SQL with placeholders
    $setFields = [];
    $params = [];
    $paramTypes = "";

    foreach ($updateFields as $field => $value) {
        $setFields[] = "$field = ?";
        $params[] = $value;
        $paramTypes .= is_int($value) ? 'i' : 's'; // Append 'i' for integers, 's' for strings
    }



    // Turn updateFields list into a string for the SQL query (below) 
    $setFieldsString = implode(", ", $setFields);

    // Update query
    $sql = "UPDATE tbdusers SET $setFieldsString WHERE id = ?";
    $params[] = $userId; // Add user ID to parameters for the WHERE clause
    $paramTypes .= 'i'; // Append 'i' for the user ID

    // Create a prepared statement
    $stmt = $conn->prepare($sql);


    // Bind the user ID to the statement
    $stmt->bind_param($paramTypes, ...$params);

    
    // Execute the prepared statement
    if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Settings updated successfully!"]);
    } else {
        echo json_encode(["success" => false, "message" => "Error updating settings: " . $stmt->error]);
    }

    // Close the statement
    $stmt->close();

}



// Close the connection to the database ($conn)
$conn->close();

?>