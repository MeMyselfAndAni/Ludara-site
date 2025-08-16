<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Contact</title>
</head>
<body>
  <h1>Contact Us</h1>
  <?php if (isset($_GET['success'])): ?>
    <p style="color: green;">Your message was sent successfully!</p>
  <?php endif; ?>
  <form action="send_mail.php" method="POST">
    <label>Your Name: <input type="text" name="name" required></label><br>
    <label>Your Email: <input type="email" name="email" required></label><br>
    <label>Your Message:<br> <textarea name="message" required></textarea></label><br>
    <button type="submit">Send</button>
  </form>
</body>
</html>
