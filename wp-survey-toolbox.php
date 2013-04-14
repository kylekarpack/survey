<?php
/*
Plugin Name: WP Survey Toolbox
Plugin URI: http://kylekarpack.com
Description: Allows WordPress users to create surveys and collect and view the results from the WordPress dashboard 
Version: 0.1
Author: Kyle Karpack, Wiley Bennett, Brad Arnesen, and Michellene Steinberg
Author URI: http://kylekarpack.com
License: GPLv2 or later
*/

/*
This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
*/

// Make sure we don't expose any info if called directly
if ( !function_exists( 'add_action' ) ) {
	echo 'It was worth a shot, but you can\'t access plugin functionality this way. Sorry!';
	exit;
}

add_action('admin_menu', 'surveytoolbox_menu');
function surveytoolbox_menu() {
	if (function_exists('add_menu_page')) {
		add_menu_page(__('WP Survey Toolbox', 'survey'), __('WP Survey Toolbox', 'survey'), 'manage_surveys', 'wp-survey-toolbox/admin.php', '', plugins_url('wp-polls/images/poll.png'));
	}
}	
	
?>