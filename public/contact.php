<?php
if($_SERVER["REQUEST_METHOD"] == "POST") {
  // Get the form data
  $name = $_POST["name"];
  $email = $_POST["email"];
  $message = $_POST["message"];

  // Send an email
  $to = "hola@michgonzalez.com";
  $subject = "New message from website contact form";
  $body = "Name: $name\nEmail: $email\nMessage: $message";
  $headers = "From: $email";

  if(mail($to, $subject, $body, $headers)) {
    header("Location: /?sms=01");
    exit();
  } else {
    header("Location: /?sms=02");
    exit();
  }
}
?>
