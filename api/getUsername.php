<?php



session_start();

include 'db_connection.php'; // Establish connection to the database ($conn)



// CORS headers
<<<<<<< Updated upstream
header('Access-Control-Allow-Origin: https://se-dev.cse.buffalo.edu/CSE442/2024-Fall/skim243/');
=======
header('Access-Control-Allow-Origin: *');
>>>>>>> Stashed changes
header('Access-Control-Allow-Methods: GET, POST, OPTIONS'); // Add other methods if needed
header('Access-Control-Allow-Headers: Content-Type, Authorization'); // Allow headers you need
header('Access-Control-Allow-Credentials: true'); // Allow cookies, authorization headers with HTTPS
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    // Handle preflight request
    exit(0);
}

if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    echo json_encode(["success" => false, "message" => "User not logged in."]);
    exit();
}

$userId = $_SESSION['user_id'];
// Query to get the username from the database
$stmt = $conn->prepare("SELECT username FROM tbdusers WHERE id = ?");
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    echo json_encode(["success" => true, "username" => $user['username']]);
} else {
    echo json_encode(["success" => false, "message" => "User not found."]);
}

$stmt->close();
$conn->close();

?>
