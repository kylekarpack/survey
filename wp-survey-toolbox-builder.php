<?php
global $current_user; ?>

<link type="text/css" rel="stylesheet" media="screen" href="<?php echo(plugins_url( 'css/survey_build.css', __FILE__ ));?> ">
<script>
	var STBroot = "<?php echo plugins_url() . "/wp-survey-toolbox/"; ?>";
	var author = "<?php echo wp_get_current_user()->user_login ?>";
</script>
<script data-main="<?php echo(plugins_url( '/js/init/init_survey_build.js', __FILE__ )); ?>" src="<?php echo(plugins_url( '/js/libs/require.js', __FILE__ ));?>"></script>


<body>
    <div id="container">
        <div id="survey-toolbox-toolbar">
            <button id="save-survey" type="button">Save</button>
            <span class="stb-title">Currently editing...</span>
        </div>
        <div id="question-container">
        </div>
        <button id="add-question" type="button">New Question</button>
    </div>