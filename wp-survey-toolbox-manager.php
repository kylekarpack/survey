<link type="text/css" rel="stylesheet" media="screen" href="<?php echo(plugins_url( 'css/layout.css', __FILE__ ));?> ">
<script>	
	var STBroot = "<?php echo plugins_url() . "/wp-survey-toolbox/"; ?>";
	console.log(STBroot);
	console.log("<?php echo(plugins_url( '/js/init/initSurvey.js', __FILE__ )); ?>");
</script>
<script data-main="<?php echo(plugins_url( '/js/init/initSurveyManager.js', __FILE__ )); ?>" src="<?php echo(plugins_url( '/js/libs/require.js', __FILE__ ));?>"></script>

<body>
    <div id="container">
        <div id="question-container"></div>
    </div>