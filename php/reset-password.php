<?php
// Include your database connection

require 'db_connection.php';
header('Content-Type:text/html');
ini_set('SMTP', 'smtp.gmail.com');
ini_set('smtp_port', 587);
ini_set('sendmail_from', 'asaha5@buffalo.edu');
ini_set('sendmail_path', "env -i /usr/sbin/sendmail -t -i");

$redirect_url = 'https://se-dev.cse.buffalo.edu/CSE442/2024-Fall/skim243/tbd/#/login'; // Specify the login page URL

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $token = htmlspecialchars($_POST['token']);
    $new_password = htmlspecialchars($_POST['password']);

    // Check if the token is valid and not expired
    $stmt = $conn->prepare("SELECT * FROM tbdusers WHERE reset_token = ? AND reset_token_expiry > NOW()");
    $stmt->bind_param('s', $token);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    if ($user) {
        // Update the user's password and clear the token
        $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);
        $stmt = $conn->prepare("UPDATE tbdusers SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE reset_token = ?");
        $stmt->bind_param('ss', $hashed_password, $token);
        $stmt->execute();
        $message = "Your password has been reset successfully! Redirecting to login...";
        $redirect = true; // Set flag to enable redirection
    } else {
        $message = "The token is invalid or has expired.";
        $redirect = false; // Disable redirection if reset fails
    }

}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #ccf0b5;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }
        .reset-container {
            background-color: #fff;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
            max-width: 400px;
            width: 100%;
            text-align: center;
        }
        .logo {
            background-color: #d8b4fe;
            border-radius: 50%;
            width: 60px;
            height: 60px;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0 auto 20px;
            font-size: 20px;
            color: #000;
        }
        .reset-container h2 {
            color: #333;
            margin-bottom: 10px;
        }
        .reset-container label {
            display: block;
            font-weight: bold;
            margin: 15px 0 5px;
        }
        .reset-container input[type="password"] {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            margin-bottom: 20px;
            box-sizing: border-box;
        }
        .reset-container button {
            background-color: #28a745;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.3s ease;
        }
        .reset-container button:hover {
            background-color: #218838;
        }
        .message {
            margin-top: 20px;
            color: #333;
        }
        @media only screen and (max-width: 480px) {

            .reset-container {
                padding: 8px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
            }
            .reset-container button {
                font-size: 14px;
                padding: 16px;
            }
        }
    </style>
</head>
<body>
    <div class="reset-container">
        <div class="logo">TBD</div>
        <h2>Reset Your Password</h2>
        <?php if ($_SERVER['REQUEST_METHOD'] == 'POST'): ?>
            <p class="message"><?php echo htmlspecialchars($message); ?></p>
            <?php if ($redirect): ?>
                <script>
                    setTimeout(function() {
                        window.location.href = '<?php echo $redirect_url; ?>';
                    }, 2000); // Redirects after 2 seconds
                </script>
            <?php endif; ?>
        <?php elseif (isset($_GET['token'])): ?>
            <?php $token = htmlspecialchars($_GET['token']); ?>
            <form action="reset-password.php" method="POST">
                <input type="hidden" name="token" value="<?php echo $token; ?>">
                <label for="password">New Password:</label>    
                <input type="password" name="password" required>
                <button type="submit">Reset Password</button>
            </form>
        <?php endif; ?>
    </div>
</body>
</html>

        





