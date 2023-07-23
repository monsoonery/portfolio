<?php
if(isset($_POST['submit'])){
	$to = "masonchammat@gmail.com"; // Your email address
	$name = $_POST['Name'];
	$from = $_POST['Email'];
	$message = $_POST['Message'];
	$subject = "Contact Form Details";
	$headers = "From:" . $from;
	$result = mail($to,$subject,$message,$headers);

	if ($result) {
		echo '<script type="text/javascript">alert("Your Message was sent Successfully!");</script>';
		echo '<script type="text/javascript">window.location.href = window.location.href;</script>';

	}else{
		echo '<script type="text/javascript">alert("Sorry! Message was not sent, Try again Later.");</script>';
		echo '<script type="text/javascript">window.location.href = window.location.href;</script>';
	}
}
?>