



var codeToLabel = {0: 'Apple Granny Smith', 1: 'Apple Red Delicious', 2: 'Banana', 3: 'Lemon', 
4: 'Pepper Green', 5: 'Potato White'}

//contains the items currently within the order 
var orderList = Array();

//contains all of the items that the user has clicked 
//on within the order list
var selectOrderListProds =Array();

var orderTotal = 0;

var salesTaxRate = 0.06 ;


var model = null;


let products = {

    0:{
        name:'Apple G. Smith',
        price:1.30,
        weight:0,
        count:null,
        taxed:false,
        id:0

    },
	1:{
        name:'Apple Red Del.',
        price:1.00,
        weight:0,
        count:null,
        taxed:false,
        id:1

    },
	
	

	2:{
        name:'Banana',
        price:1.90,
        weight:0,
        count:null,
        taxed:false,
        id:2
    },


    3:{
        name:'Lemon',
        price:0.46,
        weight:0,
        count:null,
        taxed:false,
        id:3
    },

    4:{
        name:'Pepper Green',
        price:0.84,
        weight:0,
        count:null,
        taxed:false,
        id:4

    },


    5:{
        name:'Potato White',
        price:1.90,
        weight:0,
        count:null,
        taxed:false,
        id:5
    }


}


//main driver of the program 
document.addEventListener("DOMContentLoaded", function(){
    //Do this when DOM is loaded

    //Set event listeners/handlers for buttons
    //document.getElementById('product').onclick = openHome;
    
    'use strict';
	
	
	//grabbing the Deep Learning model from the server 
	getModel();
	
    const video = document.getElementById('video');
	video.style.cssText = "-moz-transform: scale(-1, 1); \
	-webkit-transform: scale(-1, 1); -o-transform: scale(-1, 1); \
	transform: scale(-1, 1); filter: FlipH;";
    //const canvas = document.getElementById('myCanvas');
    const scan = document.getElementById("scan");
    //const errorMsgElement = document.querySelector('span#errorMsg');

    const remove = document.getElementById('remove');

    const cancel = document.getElementById('cancel');
    
    const signOff = document.getElementById("signOff");

    const checkout = document.getElementById('checkout');

    const constraints = {
        audio: false,
        video: {
            width: 360, height: 260
			
        }
    };

    // Access webcam
    async function init() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia(constraints);

            handleSuccess(stream);
        } catch (e) {

            console.log("Error: "+e.toString());

        }
    }

    // Success
    function handleSuccess(stream) {
        window.stream = stream;
        video.srcObject = stream;
    }

    // Load init
    init();

    //Setting the context of the canvas element
    //this allows us to draw an image to the element 

    //Setting an eventListener for the "Scan" button
    scan.addEventListener("click", scanBtnListener); 

    remove.addEventListener('click', removeBtnListner );

    cancel.addEventListener('click', cancelBtnListener);

    signOff.addEventListener('click', signOffBtnListener);

    
    checkout.addEventListener('click', checkoutBtnListener);
});



function get_dateTime() 
{
    var dateTime= new Date();
    var date=  dateTime.toISOString().slice(0, 10).replace('T', ' ');

    
    return date;
}

function checkoutBtnListener(){
    if(orderList.length !== 0){
        checkout_info = {

            'cashier_id': window.localStorage.cashier_id,
            'total':orderTotal,
            'date': get_dateTime(),
            'products':orderList
        
        }

        //this json object is what we will use to 
        //update the products inventory 
        let orderListRequest = {}

        console.log('order list:')

        let currentId = null;
        for(let i=0; i<orderList.length; i++){

            if(orderList[i]!==null){
                console.log("product Name: "+ orderList[i].name+", id: "+ orderList[i].id);

                currentId = orderList[i].id;
                if(orderListRequest[currentId]=== undefined){
                    
                    orderListRequest[currentId] =  orderList[i].weight;
                }
                else{
                    
                    orderListRequest[currentId] = orderListRequest[currentId] +  orderList[i].weight;
                }
            }

        }

        console.log("order list request");
        for (let i in orderListRequest){
            console.log(i)
            console.log('order list weight: '+orderListRequest[i])
        }
        console.log('--------------------------');
        
        

        
        fetch("insertOrderReceipt.php",{
            method:'POST',
            body: JSON.stringify(checkout_info)

        })
        .then(res =>res.text())
        .then(res => console.log(res))
        

        
        fetch("updateProductWeight.php",{
            method:'POST',
            body: JSON.stringify(orderListRequest)

        })
        .then(res=>res.text())
        .then(res => console.log('response: '+res))  
        
        clearOrder();

    }
}


//this function sends the receipt data to the database
async function sendReceiptData(cashier_id, password) {
    const response = await fetch("insert.php",{
        method:'POST',
        body: JSON.stringify({"cashier_id":cashier_id , "password":password }) // JSON.stringify( {cash_id: cashier_id, password: password } )
    });
    const json = await response.json();
    

    console.log("response from php: " + res);
    if(res==="found"){
        console.log("cashier found!");
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


//This button removes all of the selected items within the 
//order list
function removeBtnListner(){

    //removing all of the row elements that are a part of the 
    //product_selected class
    let product_selected = Array.from(document.getElementsByClassName('product_selected'));
    for(let i=0;i<product_selected.length;i++){
        product_selected[i].remove();
    }

    let index = 0;
    //updating the orderList array 
    //and the orderTotal
    for(let i in selectOrderListProds){

        //selectOrderListProds contains the reference
        //indexes to the values wihtin the orderList array
        //I set each relevant element within the orderList 
        //to null
        
        index = selectOrderListProds[i];

        //update the ordre total 
        decrementOrderTotal(orderList[index])

        //remove the object from the order list
        orderList[index] = null;


    }

    //console.log("current selected:"+selectOrderListProds)
    //After all of the actions take place
    //I reset the selectOrderListProds array
    selectOrderListProds = [];

    //console.log("After removal: "+selectOrderListProds)



}



function signOffBtnListener(){
    let confirmModal = document.getElementById("confirm_modal");

    confirmModal.style.display = "block";    
    openConfirmModal("sign off", signOffUser);





}

//this functions signs the user off by sending the 
//sign off data to the server and opening the login
//button 
function signOffUser(){
    window.open("index.html", "_self");
}


//Getting arrays 
//Array.from(pts).forEach((prod)=>prod.onclick= () => prod.style.color="blue" )
//let products = document.getElementsByClassName('product')


//This function is the event listner for the scan button 
function scanBtnListener(){
    const modal = document.getElementById("modal");
    const canvas = document.getElementById('myCanvas');
 
    modal.style.display = "block";

    var context = canvas.getContext('2d');
   

    //drawing an image of the video steram to the
    //canvas element
    //640 480
    context.drawImage(video, 0, 0, 360, 260);
    
	var image = context.getImageData(0, 0, 360, 260);

	
    //saving an image of the canvas element 
    //to pass into the deep learning model for classification 
    //var image = canvas.toDataURL('image/png');
    
	window.myImage  = canvas;



    /*
    In this part of the code I will process the Image through the deep learning 
    model 
    */
	
	//gettig the prediction for the window.myImage webcam image 
	getPrediction();
	
	
	//This object holds the results for the machine learning model
	console.log(window.modelResult);
	

	
	//getting the max percentage from the 
	//prediction results
	let first = window.modelResult[0];
	let firstIndex =0 ;

	let second = -999999;//window.modelResult[1];
	let secondIndex = -1;
	for(let i=1; i<window.modelResult.length ;i++){
		let firstHolder;

		let firstHolderIndex;
		if(first<window.modelResult[i] ){

			firstHolder = first;
			firstHolderIndex = firstIndex;

			first = window.modelResult[i];
			firstIndex = i; 
			
			if(second < firstHolder ){
				
				console.log("second over here:"+second);
				second = firstHolder;
				secondIndex = firstHolderIndex;
			}

			
		}
		else if(second<window.modelResult[i]){
			second = window.modelResult[i];
			secondIndex = i;
		}
	
	}

	let third = -111;
	let thirdIndex = 1000;
	for(let i=0;i<window.modelResult.length;i++){

		if(firstIndex ===i || secondIndex===i ){
			continue;	
			
		}
		if(third < window.modelResult[i]){
			third = window.modelResult[i];
			thirdIndex = i;
		}
	}	
		
	
	console.log("first : "+first+" index:"+firstIndex);

	console.log("second: "+second+" index: "+secondIndex);

	console.log("third: "+third+" index: "+thirdIndex);	

		

	
	let img1 = document.getElementById("classImg1");
    let classPerc1 = document.getElementById("class1Perc");
    img1.onclick = ()=> classSelected(firstIndex);

	let img2 = document.getElementById("classImg2");
	let classPerc2 = document.getElementById("class2Perc");
    img2.onclick = ()=>  classSelected(secondIndex) //console.log(secondIndex);
	
	let img3 = document.getElementById("classImg3");
	let classPerc3 = document.getElementById("class3Perc");
    img3.onclick = ()=> classSelected(thirdIndex);


	
	
	
	img1.src = codeToLabel[firstIndex]+".jpg";
	img1.width = "250";
	img1.height = "250";
	classPerc1.innerHTML = codeToLabel[firstIndex]+":"+(window.modelResult[firstIndex]*100).toFixed(2)+"%";
	
	
	img2.src = codeToLabel[secondIndex]+".jpg";
	img2.width = "250";
	img2.height = "250";
	classPerc2.innerHTML = codeToLabel[secondIndex]+":"+(window.modelResult[secondIndex]*100).toFixed(2)+"%";
	
	
	img3.src = codeToLabel[thirdIndex]+".jpg";
	img3.width = "250";
	img3.height = "250";
	classPerc3.innerHTML = codeToLabel[thirdIndex]+":"+(window.modelResult[thirdIndex]*100).toFixed(2)+"%";
	
	
	
		
}



//This function gests called when the user clicks on 
//the image of the class within the classification modal 
function classSelected(index){

    hideModal()
    
    //getting the product attributes to add
    //a new product to the order
    let product = {
        name : products[index].name,
        price : products[index].price,
        weight : products[index].weight,
        count : products[index].count,
        taxed : products[index].taxed,
        id : products[index].id
    }

    
    //getting the weight from the scale
    let socket =io();
    socket.emit("get weight", "need");
    socket.on("weight", (weight)=>price.weight=weight )

    //getting the price from the weight
    product.price = product.price * product.weight;
    
    //pushing the product into the orderlist
    orderList.push(product);


 
    

    //contains the recently added products index
    //I will use this index as the id of the <li> element
    let product_index = orderList.length-1;

    addProductListElement(product_index, product);

    incrementOrderTotal(product);
}


function cancelBtnListener(){
   
    console.log('cancel button pressed!');

    openConfirmModal("cancel the order", clearOrder )


}

//clears all of the items from the orderlist 
//UI and model
function clearOrder(){

    let rows = Array.from(document.getElementsByTagName('tr'));
    
   //Getting all the rows that isn't the table header
    rows = rows.filter( (row)=> row.id!=="table_header");

    for(let i=0;i<rows.length ;i++){
        
        rows[i].remove();

    }

    orderTotal = 0;
    let totalElement= document.getElementById("total_text");
    totalElement.innerHTML = "Total: $"+orderTotal.toFixed(2)
    orderList = Array();

    selectOrderListProds = Array();

    //hides the confirm modal from the user 
    let confirmModal = document.getElementById("confirm_modal");
    confirmModal.style.display = "none";

}



//Adds a new product list element to the
//order table 
//It takes in two items: id and product
//id will be added as the product id
function addProductListElement(index, product){

    var table = document.getElementById("order_table");
    var row = table.insertRow();
    row.id = index ;
    //adding product name to the row 
    var productName= row.insertCell(0);
    productName.innerHTML = product.name;

    //adding the product price to the row
    var price = row.insertCell(1);
    price.innerHTML = "$"+product.price.toFixed(2);

    var weight_quantity = row.insertCell(2);
    //adding the weight/quantity
    if(product.count !== null){
        weight_quantity.innerHTML = product.count + "qty";
    }
    else{
        weight_quantity.innerHTML = product.weight+"lbs";
    }

    var taxed = row.insertCell(3);
    if(product.taxed){
        taxed.innerHTML = "T";
    }   
    else{
        taxed.innerHTML= "F";
    } 
    

    //finally, I add an click listener for the element if
    //the user clicks on it
    row.addEventListener("click", () =>productElementClicked(row.id) )
}



function productElementClicked(elementId){
    let row = document.getElementById(elementId);
    row.className = 'product_selected';
    
    let cells = Array.from(row.cells);
    
    for (var i=0; i<cells.length;i++ ){
        cells[i].style.backgroundColor ='#dddddd';
    }

    //pushing the product onto the selected 
    //elements list
    //The elementId for the row/product is 
    //the index of the element within the 
    //orderList array 
    selectOrderListProds.push(elementId)
}


//This function updates the table 
function incrementOrderTotal(product){

    let totalElement = document.getElementById("total_text");



    if(product.taxed)
    {
        // Add the product tax to teh order
        orderTotal += (salesTaxRate*product.price)+product.price;
    }
    else{
        orderTotal += product.price;
    }


    totalElement.innerHTML = "Total: $"+orderTotal.toFixed(2);
}


//This function updates the table 
function decrementOrderTotal(product){

    let totalElement = document.getElementById("total_text");



    if(product.taxed)
    {
        // Add the product tax to teh order
        orderTotal -= (salesTaxRate*product.price)+product.price;
    }
    else{
        orderTotal -= product.price;
    }


    totalElement.innerHTML = "Total: $"+orderTotal.toFixed(2);
}





//Grabbing all of the modals and setting
//their display value to none (occurs when the user 
//selects the X button within the modal)
 function hideModal(){    

    let modals= Array.from(document.getElementsByClassName('modal'));
    
    for(let i=0;i<modals.length ; i++){
        modals[i].style.display = "none";
    }

}

function openConfirmModal(message, yesFunction)
{
    let outMesssage = "Are you sure you want to "+message+"?";

    let headerMessage = document.getElementById("confirm_modal_header");
    headerMessage.innerHTML = outMesssage;


    let confirmModal = document.getElementById("confirm_modal");

    confirmModal.style.display = "block";
    document.getElementById("yes").onclick = yesFunction;

    document.getElementById("no").onclick = ()=> confirmModal.style.display = "none";
}





/*
	DEEP LEARNING SUBSYSTEM
	========================================
	This section contains all of the deep learning
	sub system 
	==========================================


*/

//crops the images
function cropImage(img) {
  const width = img.shape[0];
  const height = img.shape[1];

  // use the shorter side as the size to which we will crop
  const shorterSide = Math.min(img.shape[0], img.shape[1]);

  // calculate beginning and ending crop points
  const startingHeight = (height - shorterSide) / 2;
  const startingWidth = (width - shorterSide) / 2;
  const endingHeight = startingHeight + shorterSide;
  const endingWidth = startingWidth + shorterSide;

  // return image data cropped to those points
  return img.slice([startingWidth, startingHeight, 0], [endingWidth, endingHeight, 3]);
}


function preprocessImage(img){
	
	img = tf.browser.fromPixels(img); 	
	
	//cropping the image to be a square
	img = cropImage(img);

	//resizing the image to [244, 244, 3] 
    img = tf.image.resizeBilinear(img, [244, 244]);
	
	//added the dimension forth dimension to the model
	img = img.expandDims(0);
	
	//scaling the image between 1 and -1 
  	img = img.toFloat().div(tf.scalar(127)).sub(tf.scalar(1));
	

	//img.print();


	img = img.reshape([-1,244,244,3]);
	return img;
	
}

 function getPrediction(){
	//on nginx 
	//http://localhost/jsProduceModel/model.json'
	//const model = await tf.loadLayersModel('http://localhost:8080/html1/jsProduceModel/model.json');
    
    //getting the image taken by the camera
	var img =  window.myImage;
	img = preprocessImage(img);
	
	
	//getting the image prediction 
	let imgPred = model.predict(img );
    
    //turning the image results into 
    //a usable array
	let predResults;
	predResults= imgPred.arraySync();
	
    //printing and the get the array location that 
    //stores the classification results
	console.log("the array index 0:"+predResults);
	window.modelResult = predResults[0];
	

}

async function getModel(){
	model = await tf.loadLayersModel('http://localhost:8080/html1/jsProduceModel/model.json');
}