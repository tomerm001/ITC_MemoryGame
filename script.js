// alert("hello");
var currentGame;


function cardGame (level) {
        this.levelGame = level;
        this.cards = [];
        this.amountCards = 12;
        this.gameComplete = false;
        this.backGroundCard = "./Images/texture.jpg";
        this.amountSelected = 0;
        this.imageSource = "web";
        this.webImages = [];
        this.keyword = "surf";
        currentGame = this;
    
}


//update amount of cards
cardGame.prototype.updateAmountOfCards = function(e){

    currentGame.amountCards = e.currentTarget.value;
    
}

//update game subject
cardGame.prototype.updateSubject = function(e){


}

//generate html for game based on amount of cards
cardGame.prototype.generateCards = function(amountOfCards){

    //calcualte amount of rows and coll
    var cardsPerRow = 4;
    
    var amountOfColl = cardsPerRow;
    var amountOfRows = Math.ceil(amountOfCards / cardsPerRow);


    //create rows and images
    var cardContainer = document.querySelector("#container-game");
    var cardNumber = 1;

    for(var j = 0; j < amountOfRows; j++){
        
        var newRow = document.createElement('div');
        newRow.classList = 'cardRow';
        newRow.id = 'r' + j;

        //create imgs
        for(var i = 0; i < amountOfColl; i++){

            //create 3D card container
            var container3D = document.createElement("div");
            container3D.className = 'container3D';
            container3D.id = 'c' + cardNumber;
            container3D.addEventListener('click', this.cardClicked);
            container3D.style.width = (((100-20)/cardsPerRow)-4) + "vw";
            container3D.style.height = (((100-20)/cardsPerRow)-4) + "vw";


            //create image wrapper
            var cardWrapper = document.createElement("div");
            cardWrapper.id = 'w' + cardNumber;
            cardWrapper.className = 'cardWrapper';

            //add front image
            var newImg = document.createElement('img');
            newImg.className = 'cardFront';
            newImg.id = 'f' + cardNumber;
            // newImg.addEventListener('click', this.cardClicked);


            //add background image
            var newBackImg = document.createElement('img');
            newBackImg.className = 'cardBack';
            newBackImg.src = this.backGroundCard;
            newBackImg.id = 'b' + cardNumber;


            //append all ellements
            cardWrapper.appendChild(newImg);
            cardWrapper.appendChild(newBackImg);
            container3D.appendChild(cardWrapper);

            newRow.appendChild(container3D);


            cardNumber++; //counter for card id
        }

        cardContainer.appendChild(newRow);
    }

} 

//generate the images for front
cardGame.prototype.assignImages = function (){
    
    var allCards = document.querySelectorAll(".cardFront");
    console.log(allCards);

    var amountOfCards = this.amountCards;
    var amountOfUniqueImages = Math.floor(amountOfCards/2);


    //generate array of images (2 duplicate images)
    var arrayAllImages = [];

    var counterForArray = 0;

    for (var i = 0; i < amountOfUniqueImages; i++){

        var imageObject ={ src: '', value: ''};


        if(this.imageSource == "web"){
           imageObject.src = this.webImages[i];
           
        }
        else {
            imageObject.src = './Images/'+ (i+1) + '.jpg';
        }
        
        
        imageObject.value = "img" + (i+1);

        arrayAllImages[counterForArray] = imageObject;
        arrayAllImages[counterForArray+1] = imageObject;

        counterForArray += 2;
    }
    
    //shuffle the image array
    this.shuffleArray(arrayAllImages, 1000);

    //alocate images to card and assign value
    for(var i = 0; i < amountOfCards; i++){
        allCards[i].src = arrayAllImages[i].src;
        allCards[i].alt = arrayAllImages[i].value;
    }

}

//shuffle array ised by assignImages
cardGame.prototype.shuffleArray = function(array, times){
    
    for(var i = 0; i <times; i++){
        var count = array.length,
            randomnumber,
            temp;

        while( count ){
            randomnumber = Math.random() * count-- | 0;
            temp = array[count];
            array[count] = array[randomnumber];
            array[randomnumber] = temp
        }
    }
    return array;
}

//generate cards object for this game from DOM
cardGame.prototype.generateCardArray = function(game){

    var allBackDOM = document.querySelectorAll(".cardBack");
    var allFrontDOM = document.querySelectorAll(".cardFront");
    var allWrapDOM = document.querySelectorAll(".cardWrapper");
    var allConDOM = document.querySelectorAll(".container3D");

    for(var i = 0; i < allConDOM.length; i ++){

        var card = {
            domCon: allConDOM[i],
            domWrap: allWrapDOM[i],
            domFront: allFrontDOM[i],
            domBack: allBackDOM[i],
            id: allConDOM[i].id.replace('c',''),
            alt: allFrontDOM[i].getAttribute('alt'),
            selected : false,
            guessed: false,
        }

        game.cards[i] = card;
    }
}

//eventlistner for clicked
cardGame.prototype.cardClicked = function(e){
    var cardId = e.currentTarget.id;  //id of pressed div
    var indexCards = cardId.replace('c','') - 1 ; //equivalent id in cards array

    if(currentGame.amountSelected < 2){
        currentGame.amountSelected++; //add one more as selected

        currentGame.cards[indexCards].selected = true;
        currentGame.updateSelectedDOM(); //update the DOM class to selected
        
        setTimeout(currentGame.gameLogic,2000); //time to allow transition
    }
    


    
   
}

//update classed for selected elements
cardGame.prototype.updateSelectedDOM = function(){

    var allCards =  currentGame.cards;

    for(var i = 0 ; i < allCards.length; i++){

        var selected = allCards[i].selected;
        
        var classes = allCards[i].domWrap.className;  

        //check if allready selected class
        var includes = classes.includes("selected");

        if(selected && (!includes)){
            allCards[i].domWrap.className = classes + " selected";
        }
        if (!selected && includes){
            allCards[i].domWrap.className = classes.replace(" selected","");
        }
    }
}

//logic of the game
cardGame.prototype.gameLogic = function(){
    
    //check if two cards are selected and if they are equal [true if two cards, true if same img]
    var result = currentGame.checkTwoPressed()
    console.log(result);
    
    var twoCards = result[0];
    var sameImg = result[1];
    
    if(twoCards){
        if(sameImg){
            //if two image same update guessed to true and remove selected
            currentGame.changeSelectedToGuessed();
            //update all guessed to  pointer-events: none;
            currentGame.updatePointerAvent();

            //change all cards to selected = false
            currentGame.resetCardsNotSelected();
            
            //update the DOM with selected all false
            
            setTimeout(currentGame.updateSelectedDOM,1500);
            
            //update the already guessed items in DOM
            setTimeout(currentGame.updateGuessedDOM,2500);//allow time for selected to update
            
            
            if(currentGame.checkIfGameCompleted()){
                alert("you won");
            }
            
        }
        else{
             //if two image are not the same, remove selected
            currentGame.resetCardsNotSelected();
            setTimeout(currentGame.updateSelectedDOM,1500);
        }

        currentGame.amountSelected = 0; //allow buttons to be clickable again
    }
}

//check if two cards are pressed
cardGame.prototype.checkTwoPressed = function(){
    
    var amountOfCards = currentGame.cards.length;
    var counterAmount = 0;
    var indexSelected = [];
    
    for(var i = 0; i < amountOfCards; i ++){
        var selected = currentGame.cards[i].selected;

        if(selected){
            indexSelected.push(i);
            counterAmount++;
        }
    }

    if(counterAmount >= 2){
        
        if((currentGame.cards[indexSelected[0]].alt) == (currentGame.cards[indexSelected[1]].alt)){
            return [true,true]; //incase 2 cards pressed and are the same image
        }
        
        return [true,false];//incase 2 cards pressed but are not the same
    }
    else {
        return [false, false]; //if only one card is pressed
    }
}

//check if all cards are guessed
cardGame.prototype.checkIfGameCompleted = function(){

    var allCards = currentGame.cards;
    var cardsNotGuessed = false;
    
    for(var i = 0; i < allCards.length; i++){
        if(!(allCards[i].guessed)){
            cardsNotGuessed = true;
        }
    }
    
    if(!cardsNotGuessed){
        currentGame.gameComplete = true;
    }

    return currentGame.gameComplete;

}

//set all guessed elements to non active (can not be pressed)
cardGame.prototype.updatePointerAvent = function() {
    var allCards =  currentGame.cards;

    for(var i = 0 ; i < allCards.length; i++){

        var guessed = allCards[i].guessed;
        if(guessed){
            allCards[i].domCon.style.pointerEvents = "none";
        }

    }

}

//every card that has selected = true --> guessed = true
cardGame.prototype.changeSelectedToGuessed = function(){
    
    var amountCards = currentGame.cards.length;

    for(var i = 0; i < amountCards; i++){

        var selected = currentGame.cards[i].selected;

        if(selected){
            currentGame.cards[i].guessed = true;
        }   
    }
}

//resents all the cards to not selected in card object
cardGame.prototype.resetCardsNotSelected = function(){

    var amountCards = currentGame.cards.length;

    for(var i = 0; i < amountCards; i++){

        currentGame.cards[i].selected = false;
    
    }
}

//update the dom with all guessed classed
cardGame.prototype.updateGuessedDOM = function(){

    var allCards =  currentGame.cards;

    for(var i = 0 ; i < allCards.length; i++){

        var guessed = allCards[i].guessed;
        
        var classes = allCards[i].domWrap.className;  

        //check if allready selected class
        var includes = classes.includes("guessed");

        if(guessed && (!includes)){
            allCards[i].domWrap.className = classes + " guessed";
        }
        if (!guessed && includes){
            allCards[i].domWrap.className = classes.replace(" guessed","");
        }
    }

}

//generate random images
cardGame.prototype.generateRandomImage = function(i){


        $.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?",
        {
            tags: currentGame.keyword,
            tagmode: "any",
            format: "json"
        },
        function(data) {

            console.log(data);
            
            var rnd = Math.floor(Math.random() * data.items.length);
            // var rnd = i+1;

            var image_src = data.items[rnd]['media']['m'].replace("_m", "_b");

            currentGame.webImages.push(image_src); //add to iamge src

        });
}




cardGame.prototype.init = function(){
    this.generateCards(this.amountCards);  //generate actual html with spaces
    
    this.keyword = prompt("Enter picture subject");

    var amountImages = Math.ceil(this.amountCards/2);

    for(var i = 0; i < amountImages; i++){
      this.generateRandomImage(i);
    }

    



    setTimeout(function(){
        currentGame.assignImages(); // assign image srcs and details for each img div
        
        var game = currentGame; //needed to refer to this specific game
        currentGame.generateCardArray(game);  //update game object with cards

    console.log(this.cards);},2000);

}

////////////////////////////////////////////
var game1 = new cardGame(2);
game1.init();
