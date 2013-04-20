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