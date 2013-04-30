<?php

/*
Behavior:


*/

// TODO: Add exit on get if not admin
// Prevent POSTS not from correct origin

header('Content-Type: application/json');

define( 'SHORTINIT', true );
require_once( dirname(dirname(dirname(__DIR__))) . '/wp-load.php' );

global $wpdb;

$time_start = microtime(true);


$a = $wpdb->get_var("SELECT count(*) FROM " . $wpdb->prefix . "wp_survey_toolbox_surveys");
$b = $wpdb->get_row("SELECT * FROM " . $wpdb->prefix . "wp_survey_toolbox_surveys", 'ARRAY_N');


$results = array("number of surveys in the database" => $a,
				"query string you supplied" => $_SERVER['QUERY_STRING'],
				"results" => $b
);
//echo json_encode($results);
$request = file_get_contents('php://input');

//echo $request->type;

echo json_encode ( $results );

$time_end = microtime(true);
header("X-Script-Runtime: " . ($time_end - $time_start) . " seconds" );

//echo json_encode($request);


// FUNCTIONS
function param($in) {
	return (isset($in) ? $_GET[$in] : "");
}
?>