// shuffle
// cut
// deal to each player n cards face-down
// deal to each player n cards face-up
// deal to one player n cards face-down
// deal to one player n cards face-up
// burn n cards face-down
// burn n cards face-up
// deal n cards face-down
// deal n cards face-up
// fold




// var deckOfCards = function(){
//   this.cards = [];
// }

// deckOfCards.prototype.makeDeck = function(numOfCardPacksForDeck){
//   var suits = ["S","C","H","D"];
//   var ranks = ["2","3","4","5","6","7","8","9","10","J","Q","K","A"];

//   for (var n=0; n < numOfCardPacksForDeck; n++) {
//     for (var i=0; i<suits.length; i++){
//       for (var j=0; j<ranks.length; j++){
//         this.cards.push(ranks[j] + suits[i]);
//       }
//     }
//   }
// }

// deckOfCards.prototype.shuffle = function(numOfSingleCardShuffles){
//   for(var n=0; n < numOfSingleCardShuffles; n++){
//     for(var j=0; j < this.cards.length; j++){
//       var k = Math.floor(Math.random() * this.cards.length);
//       var temp = this.cards[k];
//       this.cards[k] = this.cards[j];
//       this.cards[j] = temp;
//     }
//   }
// }

// deckOfCards.prototype.cut = function(pointInDeckToCutBefore){
//   var deck = this.cards;
//   if (deck.length > 0) {
//     var chunk = deck.splice(0,pointInDeckToCutBefore);
//     var addCardsFromChunkToBackOfDeck = function(element){
//       deck.push(element)
//     }
//     chunk.forEach(addCardsFromChunkToBackOfDeck);
//     return deck;
//   } else {
//     throw "There are no cards in the deck!";
//   }
// }

// deckOfCards.prototype.dealOneCardFaceDown = function() {
//   if (this.cards.length > 0) {
//     return this.cards.pop();
//   } else {
//     throw "Not enough cards in the deck.";
//   }
// }

// deckOfCards.prototype.dealPlayersOneCardAtATimePerPlayer = function(cardsPerPlayer, numOfPlayers) {
//   var deck = this.cards;
//   debugger;
//   if (this.cards.length >= (cardsPerPlayer * numOfPlayers)) {
//     for (var i=0; i <= cardsPerPlayer; i++) {
//       for (var j=0; j <= numOfPlayers; j++) {
//         deck.dealOneCardFaceDown();
//       }
//     }
//   }
//   else {
//     throw "There are not enough cards left in the deck, time to make a new one.";
//   }
// }

// deckOfCards.prototype.dealPlayersNCardsAtATimePerPlayer = function(totalCardsPerPlayer, numOfPlayers, cardsAtATime) {
//   if (this.cards.length >= (totalCardsPerPlayer * numOfPlayers)) {
//     for (var i=0; i <= totalCardsPerPlayer) {
//       for (var j=0; j <= numOfPlayers; j++) {
//         while (n <= cardsAtATime) {
//           return this.cards.pop();
//         }
//       }
//     }
//   }
//   else {
//     throw "There are not enough cards left in the deck, time to make a new one.";
//   }
// }



// // deckOfCards.prototype.deal = function(numOfPlayers, numOf)
