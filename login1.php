<?php
    $dbServerName = "aws-faugroup17.c5vzyypaaxx4.us-east-1.rds.amazonaws.com";
    $dbUsername = "admin";
    $dbPassword = "FAUGroup17!!";
    $dbName = "AWSFAUGroup17";
    $conn = mysqli_connect($dbServerName, $dbUsername, $dbPassword, $dbName);


    $data =  file_get_contents("php://input") ;

    $data = json_decode($data);
    $email =  $data->{"cashier_id"};
    $password = $data->{"password"};   

    //echo "password: $password" . "email: $email" ;

    /*if(empty($email) ||empty($password))
	{
        //header("Location: ../login/index.php?error=emptyfields");	
        echo "email/password not provided";

		exit();	
    }
    else{*/
        //echo $cashier_id.' '. $password;
    $sql = "SELECT email,name,password FROM Account WHERE email = ?";
    $stmt = mysqli_stmt_init($conn);
    if(!mysqli_stmt_prepare($stmt,$sql))
    {
        //header("Location: ../login/index.php?error=sqlerror");		
        echo "connection error";
        exit();
    }
    else
    {
        mysqli_stmt_bind_param($stmt, "s",$email);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_store_result($stmt);

        
        if(mysqli_stmt_num_rows($stmt) == 1)
        {                    
            mysqli_stmt_bind_result($stmt, $dbEmail, $dbname, $dbhashed_password);	
            $row = @mysqli_fetch_assoc($stmt);
                if (mysqli_stmt_fetch($stmt) && password_verify($password, $dbhashed_password))
                {	
                    session_start();				
                    $_SESSION['userId'] = $email;
                    $_SESSION['userName'] = $dbname;
                    //header("Location: ../login/index.php?login=success&".$email);
                    echo 'found';	
                    exit();
                }
                else if(password_verify($password, $dbhashed_password) == false)
                {
                    //header("Location: ../login/index.php?error=wrongpass1");
                    echo "not found";						
                    exit();
                }
                else
                {
                    //header("Location: ../login/index.php?error=wrongpass2");	
                    echo "not found";					
                    exit();
                }
        
        }
        else
		{
			echo "cashier not found";
		}
        
    }
        echo "error";
    
        
    
				


?>