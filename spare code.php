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


// SURVEY BUILDER::


<?php

$type = isset($_GET["action"]) ? $_GET["action"] : "";

// Modify an existing one (edit or delete)
if ($type != "") {
	// Set id of targeted survey
	$id = isset($_GET["id"]) ? $_GET["id"] : "";
	$name = $wpdb->get_row("SELECT title FROM " . $wpdb->prefix . "wp_survey_toolbox_surveys WHERE sid = $id", ARRAY_N)[0];
		
	if ($type == "edit") {
		?>
		<h1>Edit Survey #<?php echo $id ?>: <?php echo $name ?></h1>
		<?php
	} elseif ($type == "delete") {
		$wpdb->query( 
			$wpdb->prepare( 
				"
				DELETE FROM " . $wpdb->prefix . "wp_survey_toolbox_surveys
				WHERE sid = %d
				",
					$id 
				)
		);
		?> <span class="delete">Survey "<?php echo $name ?>" deleted</span> <?php
	}

} else { // Build a new survey
	?>

	<h1>Survey Builder</h1>
	<?php
	echo "This is the survey builder";

}
?>
<div class="clear"></div>
<input type="submit" class="button-primary" name="Save"></input>