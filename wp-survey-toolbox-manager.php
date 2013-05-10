<link type="text/css" rel="stylesheet" media="screen" href="<?php echo(plugins_url( 'css/layout.css', __FILE__ ));?> ">
<script>	
	var STBroot = "<?php echo plugins_url() . "/wp-survey-toolbox/"; ?>";
	console.log(STBroot);
	console.log("<?php echo(plugins_url( '/js/init/initSurvey.js', __FILE__ )); ?>");
</script>
<script data-main="<?php echo(plugins_url( '/js/init/initSurveyManager.js', __FILE__ )); ?>" src="<?php echo(plugins_url( '/js/libs/require.js', __FILE__ ));?>"></script>

<body>
    <div id="container">
        <table class="survey-table wp-list-table widefat fixed posts">
            <thead>
                <tr>
                    <th scope="col" id="cb" class="manage-column column-cb check-column" style=""><label class="screen-reader-text" for="cb-select-all-1">Select All</label><input id="cb-select-all-1" type="checkbox"></th>
                    <th scope="col" id="title" class="manage-column column-title sortable asc" style=""><a href="#"><span>Survey Name</span><span class="sorting-indicator"></span></a></th>
                    <th scope="col" id="opened" class="manage-column column-opened sortable desc" style=""><a href="#"><span>Open Date</span><span class="sorting-indicator"></span></a></th>
                    <th scope="col" id="closed" class="manage-column column-closed sortable desc" style=""><a href="#"><span>Close Date</span><span class="sorting-indicator"></span></a></th>
                    <th scope="col" id="author" class="manage-column column-author sortable desc" style=""><a href="#"><span>Author</span><span class="sorting-indicator"></span></a></th>
                    <th scope="col" id="results" class="manage-column column-results" style="">Results</th>
                    <th scope="col" id="status" class="manage-column column-status" style="">Status</th>
                </tr>
            </thead>
        </table>
    </div>