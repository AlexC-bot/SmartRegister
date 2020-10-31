
//contains the items currently within the order 
var orderList = Array();

//contains all of the items that the user has clicked 
//on within the order list
var selectOrderListProds =Array();

var orderTotal = 0;

var salesTaxRate = 0.06 ;

let products = {

    111 :{
        name:'Potato',
        price:1.30,
        weight:null,
        count:2,
        taxed:true,
        id:111

    },

    112:{
        name:'Gran. Smith Apple',
        price:1.90,
        weight:1,
        count:null,
        taxed:false,
        id:112
    }

}


//main driver of the program 
document.addEventListener("DOMContentLoaded", function(){
    //Do this when DOM is loaded

    //Set event listeners/handlers for buttons
    //document.getElementById('product').onclick = openHome;
    
    'use strict';

    const video = document.getElementById('video');
    //const canvas = document.getElementById('myCanvas');
    const scan = document.getElementById("scan");
    //const errorMsgElement = document.querySelector('span#errorMsg');

    const remove = document.getElementById('remove');

    const cancel = document.getElementById('cancel');
    
    const signOff = document.getElementById("signOff");

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
});


//The button event listener
//==============================================================


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
    
    openConfirmModal("Sign off");


    //need to include yesButton

    //need to include no button 

    //open the login window if user selects yes
    //window.open("login.html", "_self");


    //exit the modal if user selects no 




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
    
    //saving an image of the canvas element 
    //to pass into the deep learning model for classification 
    var image = canvas.toDataURL('image/png');
    
    window.myImage = image;



    /*
    In this part of the code I will process the Image through the deep learning 
    model 
    */

    //creating generic product

    let product = products[112];
    orderList.push(product);
    

    //contains the recently added products index
    //I will use this index as the id of the <li> element
    let product_index = orderList.length-1;

    addProductListElement(product_index, product);

    incrementOrderTotal(product);
}


function cancelBtnListener(){
   
    console.log('cancel button pressed!');
    let rows = Array.from(document.getElementsByTagName('tr'));
    
   //Getting all the rows that isn't the table header
    rows = rows.filter( (row)=> row.id!=="table_header");

    for(let i=0;i<rows.length ;i++){
        
        rows[i].remove();

    }

    orderList = Array();

    selectOrderListProds = Array();


}


//==============================================================


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

function openConfirmModal(message)
{
    let outMesssage = "Are you Sure you want to "+message+"?";

    let headerMessage = document.getElementById("confirm_modal_header");
    headerMessage.innerHTML = outMesssage;


    let confirmModal = document.getElementById("confirm_modal");

    confirmModal.style.display = "block";

}
