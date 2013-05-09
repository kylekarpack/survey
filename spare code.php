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


//SURVEY MANAGER OLD
<h1>Your Surveys</h1>

<?php
	global $wpdb;
?>

<div class="wrap">

<table class="widefat">
	<thead>
		<tr>
			<th>
				ID
			</th>
			<th>
				Survey Name
			</th>
			<th>
				Responses
			</th>
			<th>
				Date
			</th>
			<th>
				Actions
			</th>
		</tr>
	</thead>
	<?php
	$rows = $wpdb->get_var("SELECT count(*) FROM " . $wpdb->prefix . "wp_survey_toolbox_surveys");
	
	for ($i = 0; $i < $rows; $i++) {
	
		$surveyInfo = $wpdb->get_row("SELECT * FROM " . $wpdb->prefix . "wp_survey_toolbox_surveys", ARRAY_N, $i); // add to a loop
	?>
	<tr <?php if ($i % 2 == 0) { echo "class='alternate'"; } ?>>
		<td><?php echo $surveyInfo[0] ?></td>
		<td><?php echo $surveyInfo[1] ?></td>
		<td></td>
		<td></td>
		<?php $buildDir = admin_url() . "admin.php?page=" . plugin_basename("wp-survey-toolbox/wp-survey-toolbox-builder.php"); ?>
		<?php $resultsDir = admin_url() . "admin.php?page=" . plugin_basename("wp-survey-toolbox/wp-survey-toolbox-results.php"); ?>
		<td>
			<a href="<?php echo $buildDir . '&action=edit&id=' . $surveyInfo[0] ?>">Edit</a> | 
			<a href="<?php echo $resultsDir . '&id=' . $surveyInfo[0] ?>">See Results</a> | 
			<span class="delete"><a href="<?php echo $resultsDir . '&id=' . $surveyInfo[0] ?>&action=delete">Delete</a></span>
		</td>
	</tr>
	<?php } //end for ?>

</table>

<div class="clear"></div>

<h1>Overview</h1>
<div class="stats">
	<?php
		$nQuestions = $wpdb->get_var("SELECT count(*) FROM " . $wpdb->prefix . "wp_survey_toolbox_questions");
		$nResponses = $wpdb->get_var("SELECT count(*) FROM " . $wpdb->prefix . "wp_survey_toolbox_responses");
	?>
	<p><b>Total Surveys:</b> <?php echo $rows ?></p>
	<p><b>Total Questions:</b> <?php echo $nQuestions ?></p>
	<p><b>Total Responses:</b> <?php echo $nResponses ?></p>
	<p><b>Responses per Survey:</b> <?php if ($nQuestions != 0 && $rows != 0) { echo $nResponses / $nQuestions / $rows; } else { echo "0"; }  ?></p>
</div>
</div>