<?php
require "lessc.inc.php";

$less = new lessc;
//$less->checkedCompile("input.less", "output.css");

$text = file_get_contents(WP_PLUGIN_DIR . '/wp-survey-toolbox/input.less');

echo "Here is proof that LESS is working: ";
?> <pre>
<?php
echo $less->compile($text);
?>
</pre>