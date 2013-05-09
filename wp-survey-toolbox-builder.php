<link type="text/css" rel="stylesheet" media="screen" href="<?php echo(plugins_url( 'css/build-survey.css', __FILE__ ));?> ">
<script>
	var STBroot = "<?php echo plugins_url() . "/wp-survey-toolbox/"; ?>";
	console.log(STBroot);
</script>
<script data-main="<?php echo(plugins_url( '/js/init/initSurveyBuild.js', __FILE__ )); ?>" src="<?php echo(plugins_url( '/js/libs/require.js', __FILE__ ));?>"></script>

<body>
    <div id="container">
        <div id="title-box">
            <input id="survey-title" placeholder="Survey Title" type="text" size="44" />
        </div>
        <div id="question-container">
        </div>
        <button id="add-question" type="button">New Question</button>
    </div>