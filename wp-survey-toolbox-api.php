<?php

// $str = rtrim($_SERVER["REQUEST_URI"],'/');

// $queryParts = explode("/", $str);

// $requestType = $queryParts[count($queryParts) - 1];

/*
Behavior:
*/


// TODO: Add exit on get if not admin
// Prevent POSTS not from correct origin

// Load up WordPress functionality
define( 'SHORTINIT', true );
require_once( dirname(dirname(dirname(__DIR__))) . '/wp-load.php' );

global $wpdb;

$time_start = microtime(true);

// Get all info from all surveys

// Handle GET requests
// if ($_SERVER["REQUEST_METHOD"] == "GET") {
	// header('Content-Type: application/json');

	// if ( get_param("fetch") == "surveys" ) {
		// if (! get_param("sid")) { // Get all surveys
			// echo json_encode($wpdb->get_results("SELECT * FROM " . $wpdb->prefix . "wp_survey_toolbox_surveys", "ARRAY_A"));
			// exit;
		// } else { // Get a survey by id
			// $sid = get_param("sid");
			// echo json_encode($wpdb->get_row("SELECT * FROM " . $wpdb->prefix . "wp_survey_toolbox_surveys WHERE sid = $sid", "ARRAY_A"));
			// exit;
		// }
	// }
	
	
// POST Logic	
// } elseif ($_SERVER["REQUEST_METHOD"] == "POST") {
	// header('Content-Type: application/json');
	// echo "You made a post request:\n";
	// echo file_get_contents('php://input');
	// exit;
// } 



// $results = array("number of surveys in the database" => $a,
				// "query string you supplied" => $_SERVER['QUERY_STRING'],
				// "results" => $b
//);
//echo json_encode($results);

$verb = $_SERVER['REQUEST_METHOD'];

if ($verb == "POST") {

	$request = file_get_contents('php://input');

	$request = json_decode($request, true);

	$requestType = $request["type"];
	$sid = $request["sid"];


	//echo json_encode($requestType);
	echo $requestType;
	
} elseif ($verb == "GET" ) {
	echo "get requests not yet supported";
}

//header('Content-Type: application/json');

// header('HTTP/1.0 400 BAD REQUEST');
// echo ( 'HTTP/1.0 400 BAD REQUEST:' );
// echo ("\n ");
// echo ( $_SERVER['QUERY_STRING'] );

//$time_end = microtime(true);
//header("X-Script-Runtime: " . ($time_end - $time_start) . " seconds" );


// FUNCTIONS
function get_param($in) {
	return (isset($in) ? $_GET[$in] : false);
}
?>