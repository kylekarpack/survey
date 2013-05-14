<?php

/*
Behavior:
*/

// TODO: Add exit on get if not admin
// Prevent POSTS not from correct origin

// Load up WordPress functionality
define( 'SHORTINIT', true );
require_once( dirname(dirname(dirname(dirname(__FILE__)))) . '/wp-load.php' ); // A bit hacky, is there a better way?
//require_once( dirname(dirname(dirname(dirname(__FILE__)))) . '/wp-includes/pluggable.php' ); // A bit hacky, is there a better way?
//require_once( dirname(dirname(dirname(dirname(__FILE__)))) . '/wp-blog-header.php'); // A bit hacky, is there a better way?

//var_dump (wp_get_current_user());

//var_dump (get_currentuserinfo());
//exit;

header('Content-type: application/json');

global $wpdb;

//var_dump ($_SERVER);

$time_start = microtime(true);

$verb = $_SERVER['REQUEST_METHOD'];

if ($verb == "POST") {

	$request = file_get_contents('php://input');

	$request = json_decode($request, true);
	
	// If the survey id is set, add a question to it (else create the survey
	if (isset($request["sid"])) { // Create or update a question
	
		$sid = $request["sid"];		
		
		$qid = isset($request["qid"]) ? $request["qid"] : rand(0, 100000);
		$index = $request["index"];
		$qType = $request["type"];
		$text = $request["question"];
		$answers = serialize($request["answers"]);
		//$val = $request["val"];

		// Insert the question into the database
		$wpdb->query(
					$wpdb->prepare(
							"
							INSERT INTO " . $wpdb->prefix . "wp_survey_toolbox_questions
							 VALUES (%d, %s, %s, %s)
							 ON DUPLICATE KEY UPDATE qid = %d
							",
							$qid, $text, $qType, $answers, $qid + 1
					)
		);
		
		// And the foreign key to the lookup table
		$wpdb->query(
					$wpdb->prepare(
							"
							INSERT INTO " . $wpdb->prefix . "wp_survey_toolbox_lookup
							 VALUES (%d, %d, %d)
							",
							$sid, $qid, $index
					)
		);
		echo json_encode(array("question created" => true)); // For a valid Backbone response
	
	
	} else { // Create a survey. Return a JSON-encoded sid to the front end
			
		//$sid = $request["sid"];
		$title = isset($request["title"]) ? $request["title"] : "";
		$time = current_time('timestamp'); // store current time
		$author = $request["author"];
		
		$wpdb->query(
					$wpdb->prepare(
							"
							INSERT INTO " . $wpdb->prefix . "wp_survey_toolbox_surveys
							 VALUES ('', %s, 'Open', %d, %d, %d, %d, %s)
							",
							$title, $time, $time, $time, $time, $author
					)
		);
		
		$ret = $wpdb->get_var("SELECT sid FROM " . $wpdb->prefix . "wp_survey_toolbox_surveys ORDER BY sid DESC LIMIT 1;"); // this could be better?
		$ret = intval($ret);
		echo json_encode(array("sid" => $ret)); // return an int giving the current survey id
	}
	
} elseif ($verb == "GET" ) {
	// TODO: Add limiting
	$limit = isset($_GET["limit"]) ? intval($_GET["limit"]) : 18446744073709551615;
	
	// GET A SPECIFIC SURVEY (TODO)
	// GET ALL SURVEYS
	// GET ALL QUESTIONS IN A SURVEY
	if (isset($_GET["sid"])) {
		$sid = $_GET["sid"];
		$questions = $wpdb->get_results(
							$wpdb->prepare(
								"
								SELECT * FROM " . $wpdb->prefix . "wp_survey_toolbox_questions q
								JOIN devlocal_wp_survey_toolbox_lookup l
								ON l.qid = q.qid
								WHERE l.sid = %d
								",
								$sid						
							)
						);
		echo json_encode($questions);
	} else {
		$allSurveys = $wpdb->get_results("SELECT * FROM " . $wpdb->prefix . "wp_survey_toolbox_surveys");
		echo json_encode($allSurveys);
	}
	
	
} elseif ($verb == "DELETE") {
	
	$requestType = $_DELETE["create"];
	
	// Delete a question
	if (isset($_DELETE["qid"])) {
		$qid =  $_DELETE["qid"];

		$wpdb->query( 
			$wpdb->prepare( 
				"
				DELETE FROM " . $wpdb->prefix . "wp_survey_toolbox_questions
				 WHERE qid = %d
				",
					$qid
				)
		);
		
	
	// Delete a survey
	} else {
		$sid =  $_DELETE["sid"];

		$wpdb->query( 
			$wpdb->prepare( 
				"
				DELETE FROM " . $wpdb->prefix . "wp_survey_toolbox_surveys
				 WHERE sid = %d
				",
					$sid
				)
		);
	}
	echo true; // Validate for Backbone
	
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