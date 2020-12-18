let cashier_id = null;
let password = null;

function keypad(input_id){
	let keys = document.getElementsByClassName("keypadKey");
	Array.from(keys).forEach(element=>{
		element.addEventListener("click", keypadListener )
		element.input_id = input_id;
	})
	//window.keys = keys;

}


function keypadListener(event){
	editKeypadInput(event.currentTarget.id, event.currentTarget.input_id);
}


function removeEventHandlerKeypad(){
	let keys = document.getElementsByClassName("keypadKey");
	Array.from(keys).forEach(element=>{
		element.removeEventListener("click",  keypadListener);
	})
	//window.keys = keys;

}


async function editKeypadInput(input, input_id){
//function editKeypadInput(input){

	//let keypad_input = document.getElementById('cashier_id')
	let keypad_input = document.getElementById(input_id);
//	let keypad_input2 = document.getElementById("");
	let keypad_text = keypad_input.value;

	switch(input){

		case "DEL":

			if(""!==keypad_text){		

				keypad_input.value = keypad_text.substring(0, keypad_text.length-1);	
				

			}
			else{
				console.log("empty");
			}

			
			console.log('pressed');

			break;

		case "OK":
			

			
			if(""===keypad_text ||(input_id === "cashier_id" && keypad_text.length <3) || (input_id==="cashier_password"&& keypad_text.length<4) ){ //|| '0'===keypad_text || '00'===keypad_text ){
				alert("Incorrect input length!");
				

			}
			else if(keypad_input.id =="cashier_id" ){
				cashier_id = keypad_input.value;
				console.log("cashier id:"+cashier_id);
				removeEventHandlerKeypad();
				keypad("cashier_password");

			}
			else if(keypad_input.id == "cashier_password"){


				password = keypad_input.value;

				console.log("//////////////////////////////");
				console.log("cashier id: "+cashier_id);
				console.log("cashier password:"+password);	
				console.log('//////////////////////////////');

				//function below will call the database, will return true 
				//if password is found, false otherwise
				// **** function here********
				cashierFound = await getResponse(cashier_id, password);
				//cashierFound.then(res=>console.log(res+'!!!!!1'))

				console.log("cashier found "+ cashierFound);

				if(cashierFound){
					window.localStorage.cashier_id = cashier_id;
					window.open("orderPage.html","_self");
					console.log("we found the cashier!!");
				}
				else{

					alert("Incorrect id or password!");


					document.getElementById('cashier_id').value="";
					document.getElementById('cashier_password').value="";


					removeEventHandlerKeypad();
					keypad('cashier_id');

				}


			}
			else{
				console.log('value:' +keypad_text);
				keypad_input.value = "";
				
			}

			console.log('input val'+keypad_input.value);

		default:

			if(input_id ==="cashier_id" && (keypad_text.length < 3) && !isNaN(  parseInt(input)  ) )
			{
				keypad_input.value = keypad_text+input;
			

			}
			else if(input_id ==="cashier_password" && (keypad_text.length < 4) && !isNaN(  parseInt(input)  ) )
			{
				keypad_input.value = keypad_text+input;

			}



		
	}
	
}
async function getResponse(cashier_id, password) {
    const response = await fetch("login1.php",{
		method:'POST',
		body: JSON.stringify({"cashier_id":cashier_id , "password":password }) // JSON.stringify( {cash_id: cashier_id, password: password } )
	});
	const res = await response.text();
	

	
	if(res==="found"){
		console.log("cashier found!");
		window.localStorage.cashier_id = cashier_id;
		window.cashier_id = cashier_id;
		cashierFound =true;
	}
	else if(res==="not found"){
		console.log("cashier not found!")
		cashierFound = false;
	}
	else if(res==='email/password not provided')
	{
		console.log("cahsier id or password not provided...");
		
		cashierFound =false;
	}
	else if("connection error"===res){
		console.log("connection error...");
		cashierFound = false;
	}
	else
	{
		console.log("error....");
		cashierFound =false;
	}
	


	return cashierFound;
}



keypad("cashier_id");