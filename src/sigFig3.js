/**
 * ASSUMPTIONS:
 *    "ranked high to low list of alerts" is assumed to correspond to "Alerts are prioritized by activity trend"
 *    The list returned from getTradeTransactionsFromUser is presumed to be an array.
 *    The aforementioned list can be trusted to have been properly tested
 *    Trade date is assumed to be in the format provided
 *    Trade dates have not been filtered for expired trades
 *    Trades have not been sorted by dates
 *    Trades are to be ordered alphabetically if equal trade count values are present between two stocks, requiring a second stable sort
 */

/**
 * TIME AND SPACE COMPLEXITY:
 *    TIME: n*m (where 'n' is the number of friends, and 'm' is the average number of transactions per friend.  n + n*m + n*m + n*m + n + n + n + n === 3nm + 5n === nm)
 *    AUX SPACE: n*m  (where 'n' is the number of friends, and 'm' is the average number of transactions per friend. n*m + n + n + 1 + n + 1 === n*m + 3n + 3 === n*m)
 */


var getStocksFriendsAreTrading = function(currentUserID, callGetFriendsListForUser, getTradeTransactionsForUser, isValidTransaction, getFriendsBuySellTickerActionsAndRemoveOldTrades, getTickerTransactionCounts, sortCountsAlphabeticallyByTickers, buildNonZeroCountTickerTuples, sortAlphabeticallySortedCountsByCount, makeAlertStrings) {

  var listOfFriendsIDs = callGetFriendsListForUser(currentUserID); // T:n AS:n
  var listOfFriendsTransactions = getFriendsTransactions(listOfFriendsIDs); // T:n*m  AS: m
  var friendsTickerBuySellList = getFriendsBuySellTickerActionsAndRemoveOldTrades(listOfFriendsTransactions); // T:n*m AS: n*m
  var tickerTransactionCounts = getTickerTransactionCounts(friendsTickerBuySellList); // T: n*m AS: n
  var countsSortedAlphabeticallyByTickers = sortCountsAlphabeticallyByTickers(tickerTransactionCounts); // T: n S: n
  var nonZeroCountTickerTuples = buildNonZeroCountTickerTuples(countsSortedAlphabeticallyByTickers, tickerTransactionCounts); //T: n S (1)
  var fullySortedCounts = sortAlphabeticallySortedCountsByCount(nonZeroCountTickerTuples); // T: n S: n
  var alertStringsList = makeAlertStrings(fullySortedCounts); //T:n S: 1
  return alertStringsList;
};

var callGetFriendsListForUser = function(currentUserID) {
  var friendsListForUser = getFriendsListForUser(currentUserID);
  if (friendsListForUser.length !== 0) {
    return friendsListForUser;
  }
  else {
    throw "You have no friends. Get on that.";
  }
};

var getFriendsTransactions = function(listOfFriendsIDs){
  var listOfFriendsTransactions = [];
  for (var i=0; i<listOfFriendsIDs.length; i++) {
    listOfFriendsTransactions.push(getTradeTransactionsForUser(listOfFriendsIDs[i]));
  }
  return listOfFriendsTransactions;
};

var isValidTransaction = function(transaction) {
  var tradeDate = transaction.split(",")[0];
  if (typeof(tradeDate) === "string") {
    tradeDate = parseInt(tradeDate);
  }
  tradeDate = new Date(tradeDate);
  var currentDate = new Date();
  var validTradeAge = 7 * 24 * 60 * 60 * 1000; // days hours minutes seconds milliseconds
  if (currentDate - tradeDate < validTradeAge) {
    return true;
  }
  else {
    return false;
  }
};

var TradeBuySell =  function() {
  this.hasBought = false,
  this.hasSold = false;
};

TradeBuySell.prototype.updateStatus = function(tradeAction) {
  if (tradeAction === "BUY") {
    this.hasBought = true;
  }
  else if (tradeAction === "SELL") {
   this.hasSold = true;
  }
};

// Ideally this would be re-factored into two separate functions
var getFriendsBuySellTickerActionsAndRemoveOldTrades = function(friendsTransactionList) {
  var friendsTickerBuySellList = [];
  if (friendsTransactionList.length === 1 && friendsTransactionList[0].length === 0) {
    return friendsTransactionList;
  }

  for (var i=0; i<friendsTransactionList.length; i++){
    var friendTradeBuySellPerTicker = {};

    for (var j=0; j<friendsTransactionList[i].length; j++){
      if (isValidTransaction(friendsTransactionList[i][j])){
        var tradeBuySellAction = friendsTransactionList[i][j].split(",")[1];
        var ticker = friendsTransactionList[i][j].split(",")[2];
        var friendTradeBuySell;

        if (friendTradeBuySellPerTicker[ticker]) {
         friendTradeBuySell[ticker] = friendTradeBuySell.updateStatus(tradeBuySellAction);
        }
        else {
          friendTradeBuySell = new TradeBuySell();
        }
        friendTradeBuySell.updateStatus(tradeBuySellAction);
        friendTradeBuySellPerTicker[ticker] = friendTradeBuySell;
      }
    }
    friendsTickerBuySellList.push(friendTradeBuySellPerTicker);
  }
  return friendsTickerBuySellList;
};

var getTickerTransactionCounts = function(friendsTickerBuySellList){
  var tickerTransactionCounts = {};

  for (var i=0; i<friendsTickerBuySellList.length; i++){
    var singleFriendTickerNetCounts = friendsTickerBuySellList[i];
    for (var ticker in singleFriendTickerNetCounts){
      if ((ticker in tickerTransactionCounts) !== true) {
        tickerTransactionCounts[ticker] = 0;
      }
      if (singleFriendTickerNetCounts[ticker].hasBought === true && singleFriendTickerNetCounts[ticker].hasSold === false) {
        tickerTransactionCounts[ticker] = tickerTransactionCounts[ticker] +1;
      }
      else if (singleFriendTickerNetCounts[ticker].hasBought === false && singleFriendTickerNetCounts[ticker].hasSold === true) {
        tickerTransactionCounts[ticker] = tickerTransactionCounts[ticker] -1;
      }
    }
  }

  return tickerTransactionCounts;
};

var sortCountsAlphabeticallyByTickers = function(tickerTransactionCounts){
  var tickers = [];
  for (var ticker in tickerTransactionCounts) {
    tickers.push(ticker);
  }
  var sortedTickers = mergeSortWithAlphabeticalSwitch(tickers, true);
  return sortedTickers;
};

var buildNonZeroCountTickerTuples = function(alphabeticallySortedCountList, tickerTransactionCounts){
  var tuples = [];
  for (var i=0; i<alphabeticallySortedCountList.length; i++){
    if (tickerTransactionCounts[alphabeticallySortedCountList[i]] !== 0) {
      var tickerVotes = [];
      if (tickerTransactionCounts[alphabeticallySortedCountList[i]] > 0){
        tickerVotes[0] = alphabeticallySortedCountList[i];
        tickerVotes[1] = tickerTransactionCounts[alphabeticallySortedCountList[i]];
        tickerVotes[2] = "BUY";
      }
      else if (tickerTransactionCounts[alphabeticallySortedCountList[i]] < 0){
        tickerVotes[0] = alphabeticallySortedCountList[i];
        tickerVotes[1] = Math.abs(tickerTransactionCounts[alphabeticallySortedCountList[i]]);
        tickerVotes[2] = "SELL";
      }
      tuples.push(tickerVotes);
    }
  }
  return tuples;
};

var sortAlphabeticallySortedCountsByCount = function(tickerTuples) {
  var fullySortedCounts = mergeSortWithAlphabeticalSwitch(tickerTuples, false);
  return fullySortedCounts;
};

var makeAlertStrings = function(fullySortedCounts) {
  var alertList = [];
  for (var i=0; i<fullySortedCounts.length; i++){
    var alertString = fullySortedCounts[i][1] + "," + fullySortedCounts[i][2] + "," + fullySortedCounts[i][0];
    alertList.push(alertString);
  }
  if (alertList.length !== 0) {
    return alertList;
  }
  else {
    return "No friend actions to report, check back later.";
  }
};


/**
 * Sorts by numerical count values if "alphabetical" === false, else sorts alphabetically
 */
var mergeSortWithAlphabeticalSwitch = function(input, alphabetical){
  var joinArraysWithAlphabeticalSwitch = function(arr1, arr2, alphabetical){
    var p1 = 0;
    var p2 = 0;

    var result = [];
    if (arr1 === undefined){
      return arr2;
    }
    else if (arr2 === undefined){
      return arr1;
    }

    while (arr1[p1] !== undefined && arr2[p2] !== undefined){
      if (alphabetical) {
        if (arr1[p1] <= arr2[p2]){
          result.push(arr1[p1]);
          p1++;
        }
        else {
          result.push(arr2[p2]);
          p2++;
        }
      }
      else {
        if (arr1[p1][1] >= arr2[p2][1]){
          result.push(arr1[p1]);
          p1++;
        }
        else {
          result.push(arr2[p2]);
          p2++;
        }
      }
    }

    if (p1 === arr1.length){
      result = result.concat(arr2.slice(p2));
    }
    else if (p2 === arr2.length){
      result = result.concat(arr1.slice(p1));
    }

    return result;
  };

  if (input.length <= 1){
    return input;
  }
  var midIndex = Math.floor(input.length/2);
  return joinArraysWithAlphabeticalSwitch(mergeSortWithAlphabeticalSwitch(input.slice(0, midIndex), alphabetical), mergeSortWithAlphabeticalSwitch(input.slice(midIndex, input.length), alphabetical), alphabetical);
};


/**
 * PROVIDED FUNCTIONS
 * Faux implementation for test cases
 */

var getFriendsListForUser = function(currentUserID) {
  var friendsIDListOfUser = [currentUserID];  // For the sake of testing with dummy function, just passing currentUserID as friend's ID
  if (currentUserID === 1000) {
    return [];
  }
  else if (currentUserID === 1001) {
    friendsIDListOfUser = [0,1,2,3,4,5,6,7];
    return friendsIDListOfUser;
  }
  else {
    return friendsIDListOfUser;
  }
};

var getTradeTransactionsForUser = function(friendID) {
  var oneDayAgo = new Date() - (1 * 24 * 60 * 60 * 1000);  // days hours minutes seconds milliseconds
  var eightDaysAgo = new Date() - (8 * 24 * 60 * 60 * 1000);  // days hours minutes seconds milliseconds
  var validBuyApple = oneDayAgo + ",BUY," + "APPL";
  var validBuyFB = oneDayAgo + ",BUY," + "FB";
  var validBuyGOOG = oneDayAgo + ",BUY," + "GOOG";
  var validBuyTSLA = oneDayAgo + ",BUY," + "TSLA";
  var validSellApple = oneDayAgo + ",SELL," + "APPL";
  var validSellFB = oneDayAgo + ",SELL," + "FB";
  var validSellGOOG = oneDayAgo + ",SELL," + "GOOG";
  var validSellTSLA = oneDayAgo + ",SELL," + "TSLA";
  var invalidBuyApple = eightDaysAgo + ",BUY," + "APPL";
  var invalidBuyFB = eightDaysAgo + ",BUY," + "FB";
  var invalidBuyGOOG = eightDaysAgo + ",BUY," + "GOOG";
  var invalidBuyTSLA = eightDaysAgo + ",BUY," + "TSLA";
  var invalidSellApple = eightDaysAgo + ",SELL," + "APPL";
  var invalidSellFB = eightDaysAgo + ",SELL," + "FB";
  var invalidSellGOOG = eightDaysAgo + ",SELL," + "GOOG";
  var invalidSellTSLA = eightDaysAgo + ",SELL," + "TSLA";

  var fourAPPLBuysThreeFBSellsTwoTSLABuysOneGOOGSell = [validBuyApple, validBuyApple, validBuyApple, validBuyApple, validSellFB, validSellFB, validSellFB, validSellTSLA, validSellTSLA, validBuyGOOG];
  var countTieWithBuys = [validBuyFB, validBuyFB, validBuyApple, validBuyApple]; // 1 APPL BUY, 1 FB BUY
  var countTieWithSells = [validSellFB, validSellFB, validSellApple, validSellApple]; // 1 APPL SELL, 1 SELL FB
  var countTieWithBuySell = [validBuyFB, validBuyFB, validSellApple, validSellApple]; // 1 APPL SELL, 1 FB BUY
  var oneSellMakesCountZero = [validBuyApple, validBuyApple, validBuyApple, validSellApple]; // 0
  var noTradesAtAll = [];
  var invalidDatesNotCounted = [invalidSellTSLA, invalidSellApple, invalidBuyGOOG, validSellTSLA]; // 1 TSLA SELL
  var oneFriendOneStock = [validBuyApple]; // 1 APPL BUY

  var transactions = [
    /*0*/ fourAPPLBuysThreeFBSellsTwoTSLABuysOneGOOGSell,
    /*1*/ countTieWithBuys,
    /*2*/ countTieWithSells,
    /*3*/ countTieWithBuySell,
    /*4*/ oneSellMakesCountZero,
    /*5*/ noTradesAtAll,
    /*6*/ invalidDatesNotCounted,
    /*7*/ oneFriendOneStock
  ];

  return transactions[friendID];

};
