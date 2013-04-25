<?php

header('Content-Type: application/json');

define( 'SHORTINIT', true );
require_once( dirname(dirname(dirname(dirname(__DIR__)))) . '/wp-load.php' );

global $wpdb;

$a = $wpdb->get_var("SELECT count(*) FROM " . $wpdb->prefix . "wp_survey_toolbox_surveys");
$b = $wpdb->get_row("SELECT * FROM " . $wpdb->prefix . "wp_survey_toolbox_surveys", 'ARRAY_N');

$results = array("number of surveys in the database" => $a,
				"query string you supplied" => $_SERVER['QUERY_STRING'],
				"results" => $b
);
echo json_encode($results);



?>