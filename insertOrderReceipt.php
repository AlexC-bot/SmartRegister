<?php
$dbServerName = "";
$dbUsername = "";
$dbPassword = "";
$dbName = "";
$conn = mysqli_connect($dbServerName, $dbUsername, $dbPassword, $dbName);


//getting the http body contents that contain the 
//the receipt from the checkout
$data =  file_get_contents("php://input") ;

$data = json_decode($data);

$email =  $data->{"cashier_id"};
echo "casher id: " . $email . ",  ";

$total = $data->{"total"};
echo "Total: " . $total ." ";

$date = $data->{"date"};
echo "date: ". $date. "\n";

$sql = "INSERT INTO Transaction(T_total,Tdate,Temail) VALUES (?,?,?)";
$stmt = mysqli_stmt_init($conn);
mysqli_stmt_prepare($stmt,$sql);
mysqli_stmt_bind_param($stmt,"dss",$total,$date,$email);
mysqli_stmt_execute($stmt);

echo "Order receipt: success";
exit();	




?>