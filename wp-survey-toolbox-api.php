<?php

/*
Behavior:
*/

// TODO: Add exit on get if not admin
// Prevent POSTS not from correct origin

// Load up WordPress functionality
define( 'SHORTINIT', true );
require_once( dirname(dirname(dirname(dirname(__FILE__)))) . '/wp-load.php' ); // A bit hacky, is there a better way?

header('Content-type: application/json');


global $wpdb;

//var_dump ($_SERVER);

$time_start = microtime(true);

$verb = $_SERVER['REQUEST_METHOD'];

if ($verb == "POST") {

	$request = file_get_contents('php://input');

	$request = json_decode($request, true);

	$requestType = $request["create"];
	
	if ($requestType == "q") { // Create or update a question
	
		$qid = $request["qid"];
		$sid = $request["sid"];
		//$sid = $request["sid"] != null ? :
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
							",
							$qid, $text, $qType, $answers
					)
		);
		
		// And the foreign key to the lookup table
		$wpdb->query(
					$wpdb->prepare(
							"
							INSERT INTO " . $wpdb->prefix . "wp_survey_toolbox_lookup
							 VALUES (%d, %d)
							",
							$sid, $qid
					)
		);
		echo json_encode(array("question created" => true)); // For a valid Backbone response
	
	
	} else { // $requestType == "s" ... Create or update a survey
		
		$sid = $request["sid"];
		$title = $request["title"];
		
		$wpdb->query(
					$wpdb->prepare(
							"
							INSERT INTO " . $wpdb->prefix . "wp_survey_toolbox_questions
							 VALUES (%d, %s)
							",
							$sid, $title
					)
		);
	}
	
} elseif ($verb == "GET" ) {
	// TODO: Add limiting
	$limit = isset($_GET["limit"]) ? intval($_GET["limit"]) : 18446744073709551615;
	
	// GET A SPECIFIC SURVEY
	// GET ALL SURVEY
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
		$allQuestions = $wpdb->get_results("SELECT * FROM " . $wpdb->prefix . "wp_survey_toolbox_surveys");
		echo json_encode($allQuestions);
		//var_dump ($_SERVER);
	
	}
		// } else { //echo all surveys
			// $allSurveys = $wpdb->get_results("SELECT * FROM " . $wpdb->prefix . "wp_survey_toolbox_surveys");
			// echo json_encode($allSurveys);
		// }	
	
} elseif ($verb == "DELETE") {
	
	$requestType = $_DELETE["create"];
	$id =  $_DELETE["id"];
	
	// Delete a question
	if ($requestType == "q") {
		$wpdb->query( 
			$wpdb->prepare( 
				"
				DELETE FROM " . $wpdb->prefix . "wp_survey_toolbox_questions
				 WHERE qid = %d
				",
					$id
				)
		);
		
	
	// Delete a survey
	} else {
		$wpdb->query( 
			$wpdb->prepare( 
				"
				DELETE FROM " . $wpdb->prefix . "wp_survey_toolbox_surveys
				 WHERE sid = %d
				",
					$id
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