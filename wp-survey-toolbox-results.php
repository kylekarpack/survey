<h1>Results</h1>
<?php
	echo "This is the results page";
?>
<br>
<button>Export to CSV</button>

<?php
// EXPORT TO CSV

// $result = $db_con->query('SELECT * FROM `some_table`');
// $fp = fopen('php://output', 'w');
// if ($fp && $result) {
    // header('Content-Type: text/csv');
    // header('Content-Disposition: attachment; filename="export.csv"');
    // while ($row = $result->fetch_array(MYSQLI_NUM)) {
        // fputcsv($fp, array_values($row));
    // }
    // die;
// }
global $current_user;
get_currentuserinfo();
var_dump ($current_user);

?>