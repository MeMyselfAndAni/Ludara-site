<?php
// Replace with your Gmail
$to = "mmlando@gmail.com";
$subject = "Contact Form Submission from " . $_POST['name'];
$message = "Name: " . $_POST['name'] . "\n";
$message .= "Email: " . $_POST['email'] . "\n\n";
$message .= $_POST['message'];

$headers = "From: " . $_POST['email'] . "\r\n" .
           "Reply-To: " . $_POST['email'] . "\r\n";

if (mail($to, $subject, $message, $headers)) {
    header("Location: contact.php?success=1");
    exit;
} else {
    echo "Sorry, your message could not be sent.";
}
?>
