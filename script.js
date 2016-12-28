// alert("hello");
var currentGame;


function cardGame (level) {
        this.levelGame = level;
        this.cards = [];
        this.gameComplete = false;
        currentGame = this;
    
}
        



cardGame.prototype.cardClicked = function(e){
    var cardId = e.target.id;  //id of pressed div
    var indexCards =   cardId.replace('c','') - 1 ; //equivalent id in cards array

    currentGame.cards[indexCards].selected = true;

    currentGame.updateSelectedDOM(); //update the DOM class to selected
    
    setTimeout(currentGame.gameLogic,2000); //time to allow transition
   
}

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

            currentGame.resetCardsNotSelected();
            currentGame.updateSelectedDOM();
            setTimeout(currentGame.updateGuessedDOM,500);//allow time for selected to update
            
            
            
            if(currentGame.checkIfGameCompleted()){
                alert("you won");
            }
            
        }
        else{
             //if two image are not the same, remove selected
            currentGame.resetCardsNotSelected();
            currentGame.updateSelectedDOM();
        }
    }
}

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

cardGame.prototype.updatePointerAvent = function() {
    var allCards =  currentGame.cards;

    for(var i = 0 ; i < allCards.length; i++){

        var guessed = allCards[i].guessed;
        if(guessed){
            allCards[i].dom.style.pointerEvents = "none";
        }

    }

}

cardGame.prototype.changeSelectedToGuessed = function(){
    
    var amountCards = currentGame.cards.length;

    for(var i = 0; i < amountCards; i++){

        var selected = currentGame.cards[i].selected;

        if(selected){
            currentGame.cards[i].guessed = true;
        }   
    }
}

cardGame.prototype.resetCardsNotSelected = function(){

    var amountCards = currentGame.cards.length;

    for(var i = 0; i < amountCards; i++){

        currentGame.cards[i].selected = false;
    
    }
}

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
            var newImg = document.createElement('img');
            newImg.className = 'card';
            newImg.id = 'c' + cardNumber;
            newImg.style.width = ((100/cardsPerRow)-4) + "vw";
            newImg.style.height = ((100/cardsPerRow)-4) + "vw";
            newImg.addEventListener('click', this.cardClicked);

            newRow.appendChild(newImg);

            cardNumber++; //counter for card id
        }

        cardContainer.appendChild(newRow);
    }

} 

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

cardGame.prototype.assignImages = function (){
    
    var allCards = document.querySelectorAll(".card");
    console.log(allCards);

    var amountOfCards = allCards.length;
    var amountOfUniqueImages = Math.floor(amountOfCards/2);


    //generate array of images (2 duplicate images)
    var arrayAllImages = [];

    var counterForArray = 0;

    for (var i = 0; i < amountOfUniqueImages; i++){

        var imageObject ={ src: '', value: ''};

        imageObject.src = './Images/'+ (i+1) + '.jpg';
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

cardGame.prototype.generateCardArray = function(game){

    var allCardsDOM = document.querySelectorAll(".card");

    for(var i = 0; i < allCardsDOM.length; i ++){

        var card = {
            dom: allCardsDOM[i],
            id: allCardsDOM[i].getAttribute("id"),
            alt: allCardsDOM[i].getAttribute("alt"),
            selected : false,
            guessed: false,
        }

        game.cards[i] = card;
    }
}

cardGame.prototype.updateSelectedDOM = function(){

    var allCards =  currentGame.cards;

    for(var i = 0 ; i < allCards.length; i++){

        var selected = allCards[i].selected;
        
        var classes = allCards[i].dom.className;  

        //check if allready selected class
        var includes = classes.includes("selected");

        if(selected && (!includes)){
            allCards[i].dom.className = classes + " selected";
        }
        if (!selected && includes){
            allCards[i].dom.className = classes.replace(" selected","");
        }
    }
}

cardGame.prototype.updateGuessedDOM = function(){

    var allCards =  currentGame.cards;

    for(var i = 0 ; i < allCards.length; i++){

        var guessed = allCards[i].guessed;
        
        var classes = allCards[i].dom.className;  

        //check if allready selected class
        var includes = classes.includes("guessed");

        if(guessed && (!includes)){
            allCards[i].dom.className = classes + " guessed";
        }
        if (!guessed && includes){
            allCards[i].dom.className = classes.replace(" guessed","");
        }
    }



}

cardGame.prototype.init = function(){
    this.generateCards(12);  //generate actual html with spaces
    this.assignImages(); // assign image srcs and details for each img div
    
    var game = this; //needed to refer to this specific game
    this.generateCardArray(game);  //update game object with cards

    console.log(this.cards);

}

////////////////////////////////////////////
var game1 = new cardGame(2);
game1.init();
