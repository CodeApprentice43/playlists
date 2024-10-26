/* General page styling */
body {
    margin: 0; /* Remove default margin */
    padding: 0; /* Remove default padding */
    font-family: Arial, sans-serif; /* Set font family for the entire page */
    background-color: #daf7a6; /* Light green background for the page */
  }
  
  /* Container to center the registration form vertically and horizontally */
  .sign-container {
    display: flex; /* Flexbox layout to center content */
    justify-content: center; /* Horizontally center the form */
    align-items: center; /* Vertically center the form */
    height: 100vh; /* Full viewport height */
  }
  
  /* Styling for the form box */
  .sign-box {
    background-color: #fff; /* White background for the form box */
    border-radius: 10px; /* Rounded corners */
    padding: 40px; /* Padding inside the box */
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
    text-align: center; /* Center-align all text inside the form box */
    width: 400px; /* Fixed width for the form */

    height: 600px;

  }
  
/* Profile icon */
.profile-icon img {
    width: 100px; 
    height: 100px;
    border-radius: 50%; 
    margin-bottom: 20px; 
  }
  
  /* Styling for the form title */
  h2 {
    margin-bottom: 20px; /* Space below the title */
    font-weight: 600; /* Make the title bold */
    color: #000; /* Black color for the title */
  }
  
  /* General styling for input fields */
  .input-group {
    margin-bottom: 20px; /* Space below each input field */
    text-align: left; /* Left-align labels */
  }
  
  .input-group label {
    font-size: 14px; /* Font size for labels */
    color: #333; /* Dark grey color for labels */
    font-weight: 500; /* Make the labels slightly bold */
  }

  .input-group input {
    width: 100%; /* Full width for input fields */
    padding: 10px; /* Padding inside input fields */
    border: 1px solid #ccc; /* Light grey border around input fields */
    border-radius: 5px; /* Slightly rounded corners for input fields */
    margin-top: 5px; /* Small space between label and input */
  }
  
  input:focus {
    outline: none; /* Remove default outline on focus */
    border-color: #a39eff; /* Change border color to light purple on focus */
  }
  
  /* Red asterisk (*) for required fields */

  .input-group span {
    color: red; /* Red color for the asterisk */
  }
  
  /* Styling for the login link */
  .login-link {
    margin-top: 10px; /* Small space above the login link */
    font-size: 12px; /* Smaller font for the login text */
  }
  
  .login-link a {
    color: #4caf50; /* Green color for the link */
    text-decoration: none; /* Remove underline from the link */
  }
  
  /* Styling for the sign-up button */
  .sign-btn {
    background-color: #4caf50; /* Green background for the button */
    color: white; /* White text on the button */
    padding: 10px 0; /* Padding for top and bottom of the button */
    width: 100%; /* Full width button */
    border: none; /* Remove border */
    border-radius: 5px; /* Rounded corners for the button */
    font-size: 16px; /* Font size for button text */
    cursor: pointer; /* Pointer cursor on hover */
  }
  
  .sign-btn:hover {
    background-color: #45a049; /* Darker green on hover */

  }
