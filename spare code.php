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