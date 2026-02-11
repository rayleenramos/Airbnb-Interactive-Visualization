<?php
session_start();
// ends the user session and logs them out
session_unset();
session_destroy();
echo json_encode(['success' => true, 'message' => 'Logged out successfully.']);
?>
