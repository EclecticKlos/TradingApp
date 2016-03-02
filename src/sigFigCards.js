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

var Card = function(suit, rank) {
  this.suit = suit;
  this.rank = rank;
};

var Deck = function(){
  this.cards = [];
};

Deck.prototype.makeDeck = function(numOfCardPacksInDeck){
  var suits = ["S","C","H","D"];
  var ranks = ["2","3","4","5","6","7","8","9","10","J","Q","K","A"];

  if (numOfCardPacksInDeck === undefined) {
    numOfCardPacksInDeck = 1;
  }
  for (var n=0; n < numOfCardPacksInDeck; n++) {
    for (var i=0; i<suits.length; i++){
      for (var j=0; j<ranks.length; j++){
        this.cards.push(new Card(suits[i], ranks[j]));
      }
    }
  }
  return this;
};

Deck.prototype.shuffle = function(numOfSingleCardShuffles){
  for(var n=0; n < numOfSingleCardShuffles; n++){
    for(var j=0; j < this.cards.length; j++){
      var k = Math.floor(Math.random() * this.cards.length);
      var temp = this.cards[k];
      this.cards[k] = this.cards[j];
      this.cards[j] = temp;
    }
  }
};

Deck.prototype.cut = function(pointInDeckToCutBefore){
  var deck = this.cards;
  if (deck.length > 0) {
    var chunk = deck.splice(0,pointInDeckToCutBefore);
    var addCardsFromChunkToBackOfDeck = function(element){
      deck.push(element);
    };
    chunk.forEach(addCardsFromChunkToBackOfDeck);
    return deck;
  } else {
    throw "There are no cards in the deck!";
  }
};

Deck.prototype.dealOneCard = function() {
  if (this.cards.length > 0) {
    return this.cards.pop();
  } else {
    throw "Not enough cards in the deck.";
  }
};

Deck.prototype.discardOneCard = function() {
  if (this.cards.length > 0) {
    this.cards.pop();
    return true;
  } else {
    throw "Not enough cards in the deck.";
  }
};




var Game = function(numOfCardPacksInDeck){
  this.gameDeck = new Deck();
  this.gameDeck.makeDeck(numOfCardPacksInDeck);
  this.gameDeck.shuffle(500);
  this.hands;
};

Game.prototype.makeHands = function(numOfPlayers, cardsPerPlayer){
  var hands = {};
  var cardsDealtPerPlayer = 1;
  for (var i=1; i <= numOfPlayers; i++){
    var playerID = "Player" + i;
    hands[playerID] = {};
  }
  for (var j=1; j <= (cardsPerPlayer); j++) {
    for (var player in hands){
      var cardID = "Card" + cardsDealtPerPlayer;
      hands[player][cardID] = this.gameDeck.dealOneCard();
    }
    cardsDealtPerPlayer++;
  }
  return hands;
};

Game.prototype.communityCards = function(numOfCards) {
  var communityCards = {};
  for (var i=1; i <= numOfCards; i++) {
    var cardNumber = "Card" + i;
    communityCards[cardNumber] = this.gameDeck.dealOneCard();
  }
};













































