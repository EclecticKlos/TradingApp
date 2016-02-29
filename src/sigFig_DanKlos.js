// /// ASSUMPTIONS
// /*
// - From 1), "ranked high to low list of alerts" is assumed to correspond to "Alerts are prioritized by activity trend".
// - The list returned from getTradeTransactionsFromUser is presumed to be an array.
// - Assuming the output from the given code can be trusted and is tested elsewhere
//   - (No duplicates, consistent format, etc)
// - Trade date is assumed to be in format provided, which limits accuracy of one-week trade age limit to 7 days +/- 23.99 hours
// - Trades have not been filtered by date through/before getTradeTransactionsForUser
// - Trades have not been sorted by date
// */


// /// ARCHITECTURE THOUGHTS
// /*
// - It would be beneficial to be able to reuse the same list in the future for an optimization (ie, it discards old and adds the new)
//   - Perhaps a hash of arrays?
// - Architecture provides for updating trades without having to update the entire list. Ex: The last trade date for a ticker symbol could be stored and only trades since then would be added
//   friendsTradesList.prototype.checkForAndRemoveOldTrades = function(){}
// */



// /// TESTS
// /*
// - Zero friends
// - Thousand friends
// - One frined always buying GOOG, one always selling GOOG
// - Friend with zero transactions
// - Validity of hash
//   - Works with rollover (throw away days, add days)
// - ParseAndFormatUserTrades produces no duplicates in a given ticker
// */



// ////////////////////////////////////////////////////// vv PSEUDOCODE vv //////////////////////////////////////////////////////

// var stocksYourFriendsAreTrading = function(userIDToGetFriendsTrades){
//   var currentDate = Date.whatever
//   var usersFriendsIds = getFriendsListForUser(userIDToGetFriendsTrades)
//   var usersFriendsTradeData = {};



//   var getFriendsTrade = function

//   getTradeTransactionsForUser()

// }

// ////////////////////////////////////////////////////// ^^ PSEUDOCODE ^^ //////////////////////////////////////////////////////


// ////////////////////////////////////////////////////// vv CODE vv //////////////////////////////////////////////////////



// var stocksYourFriendsAreTrading = function(userIDToGetFriendsTrades){
//   var currentDate = Date.whatever                                                       // Write date function
//   var usersFriendsIdList = getFriendsListForUser(userIDToGetFriendsTrades)
//   // var usersFriendsTradeData = {};

//   var getFriendsIDs = function(friendsList){
//   var friendsIDs = [];
//     for (var i=0; i<friendsList.length; i++){
//       getTradeTransactionsForUser(friendsList[i]);
//       addAFriendTradingInstanceToFriendsTrades(friendsList[i], oneFriendsTrades)
//     }
//   }

//   var addAFriendTradingInstanceToFriendsTrades = function(currentFriendId, currentFriendTrades) {
//     var currentFriendTradesWithoutOldTrades  = removeOldTradesFromList(7, currentFriendTrades);
//   }

//   var parseIndividualTrade = function()

//   var removeOldTradesFromList = function(numOfDaysToKeep, tradeList) {
//     for (var i=0; i<tradeList.length; i++) {
//       var individualTrade = parseIndividualTrade(tradeList[i]);
//     }
//   }


// var listOfFriendsTrades = getListOfFriendsTrades(usersFriendsIdList)
// }



// ////////////////////////////////////////////////////// ^^ CODE ^^ //////////////////////////////////////////////////////


// /// DEBT
// /*
// - parameter name for stocksYourFriendsAreTrading
// */
