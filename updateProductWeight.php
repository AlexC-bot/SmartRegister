<?php
    
    $dbServerName = "";
    $dbUsername = "";
    $dbPassword = "";
    $dbName = "";
    $conn = mysqli_connect($dbServerName, $dbUsername, $dbPassword, $dbName);
    
    //getting the http body contents that contain the 
    //the receipt from the checkout
    $data =  file_get_contents("php://input") ;
    
    $data = json_decode($data, true);
    foreach ($data as $Pid => $weight) {
        // $arr[3] will be updated with each value from $arr...
        echo "{$Pid} => {$weight} ";
        
        
        
        $sql = "SELECT weight  FROM Produce WHERE Pid =?;";
        echo "SQL: ".$sql."\n";
        $stmt = mysqli_stmt_init($conn);
        if(!mysqli_stmt_prepare($stmt,$sql))
        {
            echo "Error 1\n";
            exit();
        }
        //$email=1;

        mysqli_stmt_bind_param($stmt,"s",$Pid);
        mysqli_stmt_execute($stmt);
        $resultData = mysqli_stmt_get_result($stmt);
        if($row = mysqli_fetch_assoc($resultData))
        {
            echo "\nweight: ". $row["weight"] . "\n";
            $total_weight = $row["weight"];

        }
        

        
        $weight = $total_weight - $weight; 
        
        echo "weight after subtraction: " . $weight;
        
        $sql = "UPDATE Produce SET weight = ? WHERE Pid = ?";
        $stmt = mysqli_stmt_init($conn);
        if(!mysqli_stmt_prepare($stmt,$sql))
        {
            echo "Error 1\n";
            exit();
        }
        mysqli_stmt_bind_param($stmt,"di",$weight,$Pid);

        mysqli_stmt_execute($stmt);
        
        
        
        
    }
    
    
    
    echo  "Success";

    exit();
   
?>