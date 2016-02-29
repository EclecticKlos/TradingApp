// /*
// Assumptions
//   - Individuals only qualify if they've only bought or only sold; if they've bought and sold a stock in a seven day period, the net actions is 0.
//   - Trades have not been filtered by date through/before getTradeTransactionsForUser
//   - Trades have not been sorted by date
//   - All trades either have a BUY|SELL action associated with them
// */

// /*
// NOTES
// - Sort alphabetically first
// - Sort by count second (stable)
// - Do not return tickers with total of "0"
// */

// /*
// Pseudocode
// - Use getFriendListForUser for user friend list
// - Loop through list returned by getFriendListForUser using getTradeTransactionsForUser
//   - Filter each list for date qualification
//   - Determine B|S per ticker for individual
//     - Hashy hash with ticker symbol, bought:bool sold:bool
// - Determine B|S count across friends
//   - Hash with ticker:{buy:num}{sell:num}
//     - Sorting method
// */

// var getStocksFriendsAreTrading = function(currentUserID) {
//   var listOfFriendIDs = getFriendsListForUser(currentUserID);

//   var joinArraysWithAlphabeticalSwitch = function(arr1, arr2, alphabetical){
//     var p1 = 0;
//     var p2 = 0;

//     var result = [];
//     if (arr1 === undefined){
//       return arr2;
//     } else if (arr2 === undefined){
//       return arr1;
//     }

//     while (arr1[p1] !== undefined && arr2[p2] !== undefined){
//       if (alphabetical) {
//         if (arr1[p1] <= arr2[p2]){
//           result.push(arr1[p1]);
//           p1++;
//         } else {
//           result.push(arr2[p2]);
//           p2++;
//         }
//       }
//       else {
//         if (arr1[p1][1] >= arr2[p2][1]){
//           result.push(arr1[p1]);
//           p1++;
//         } else {
//           result.push(arr2[p2]);
//           p2++;
//         }
//       }
//     }

//     if (p1 === arr1.length){
//       result = result.concat(arr2.slice(p2));
//     } else if (p2 === arr2.length){
//       result = result.concat(arr1.slice(p1));
//     }

//     return result;
//   }

//   var mergeSortWithAlphabeticalSwitch = function(input, alphabetical){
//     if (input.length <= 1){
//       return input;
//     }
//     var midIndex = Math.floor(input.length/2);
//     return joinArraysWithAlphabeticalSwitch(mergeSortWithAlphabeticalSwitch(input.slice(0, midIndex), alphabetical), mergeSortWithAlphabeticalSwitch(input.slice(midIndex, input.length), alphabetical), alphabetical);
//   }

//   var isValidTransaction = function(transaction) {
//     var tradeDate = new Date(transaction.split(",")[0])
//     var currentDate = new Date();
//     var validTradeAge = 7 * 24 * 60 * 60 * 1000; // days hours minutes seconds milliseconds
//     if (currentDate - tradeDate < validTradeAge) {
//       return true;
//     }
//     else {
//       return false;
//     }
//   }
//   var getFriendBuySellActionsPerTicker = function(friendTransactionList) {
//     var tickersAndBuySell = {};
//     for (var i=0; i<friendTransactionList.length; i++){
//       if (isValidTransaction(friendTransactionList[i])){
//         var buyOrSell = friendTransactionList[i].split(",")[1];
//         var ticker = friendTransactionList[i].split(",")[2];

//         if (ticker in tickersAndBuySell) {
//           if (tickersAndBuySell[ticker].buy === false && buyOrSell === "BUY") {
//             tickersAndBuySell[ticker].buy = true;
//           }
//           else if (tickersAndBuySell[ticker].sell === false && buyOrSell === "SELL") {
//             tickersAndBuySell[ticker].sell = true;
//           }
//         }
//         else {
//           tickersAndBuySell[ticker] = {buy:false, sell:false};
//           buyOrSell === "BUY" ? tickersAndBuySell[ticker].buy = true : tickersAndBuySell[ticker].sell = true;
//         }
//       }
//     }
//     return tickersAndBuySell;
//   }
//   var getTickerTransactionCounts = function(listOfFriendIDs){
//     var tickersAndCounts = {};
//     for (var i=0; i<listOfFriendIDs.length; i++){
//       var currentFriendTransactionList = getTradeTransactionsForUser(listOfFriendIDs[i]);
//       var currentFriendBuySellActionsPerTicker = getFriendBuySellActionsPerTicker(currentFriendTransactionList);

//       for (ticker in currentFriendBuySellActionsPerTicker){
//         if ((ticker in tickersAndCounts) !== true) {
//           tickersAndCounts[ticker] = 0;
//         }
//         if (currentFriendBuySellActionsPerTicker[ticker].buy === true && currentFriendBuySellActionsPerTicker[ticker].sell === false){
//           tickersAndCounts[ticker] = tickersAndCounts[ticker] +1;
//         }
//         else if (currentFriendBuySellActionsPerTicker[ticker].buy === false && currentFriendBuySellActionsPerTicker[ticker].sell === true){
//           tickersAndCounts[ticker] = tickersAndCounts[ticker] -1;
//         }
//       }
//     }
//     return tickersAndCounts;
//   }

//   var sortCountsAlphabeticallyByTickers = function(){
//     var unsortedTickerTransactionCounts = getTickerTransactionCounts(listOfFriendIDs);
//     var tickers = [];
//     for (ticker in unsortedTickerTransactionCounts) {
//       tickers.push(ticker);
//     };
//     var sortedTickers = mergeSortWithAlphabeticalSwitch(tickers, true);
//     return sortedTickers;
//   }

//   var buildValidTickerTuples = function(alphabeticallySortedCountList){
//     var unsortedTickerTransactionCounts = getTickerTransactionCounts(listOfFriendIDs);
//     var sortedTickers = sortCountsAlphabeticallyByTickers();
//     var alphabeticallySortedCounts = [];
//     for (var i=0; i<sortedTickers.length; i++){
//       if (unsortedTickerTransactionCounts[sortedTickers[i]] !== 0) {var tickerVotes = []};
//       if (unsortedTickerTransactionCounts[sortedTickers[i]] > 0){
//         tickerVotes[0] = sortedTickers[i]
//         tickerVotes[1] = unsortedTickerTransactionCounts[sortedTickers[i]];
//         tickerVotes[2] = "BUY";
//       }
//       else if (unsortedTickerTransactionCounts[sortedTickers[i]] < 0){
//         tickerVotes[0] = sortedTickers[i]
//         tickerVotes[1] = Math.abs(unsortedTickerTransactionCounts[sortedTickers[i]]);
//         tickerVotes[2] = "SELL";
//       }
//       alphabeticallySortedCounts.push(tickerVotes)
//     }
//     return alphabeticallySortedCounts;
//   }

//   // var alphaSorted = sortCountsAlphabeticallyByTickers();
//   // return alphaSorted;

//   var sortAlphabeticallySortedCountsByCount = function() {
//     var alphabeticallySortedCounts = sortCountsAlphabeticallyByTickers();
//     var tickerTuples = buildValidTickerTuples(alphabeticallySortedCounts);
//     var fullySortedCounts = mergeSortWithAlphabeticalSwitch(tickerTuples, false);
//     return fullySortedCounts;
//   }

//   // var fullySorted = sortAlphabeticallySortedCountsByCount();
//   // return fullySorted;

//   var makeAlertStrings = function() {
//     var fullySorted = sortAlphabeticallySortedCountsByCount();

//   }
// }

// // PROVIDED FUNCTIONS

// var getFriendsListForUser = function(currentUserID) {
//   return [0,1,2];
// };

// var getTradeTransactionsForUser = function(friendUserID) {
//   var fakeTrades = [["2016-02-19,SELL,TSLA", "2016-02-22,BUY,APPL", "2016-02-21,BUY,APPL", "2016-02-22,SELL,APPL", "2016-02-19,BUY,APPL"],
//   ["2016-02-22,BUY,GOOG", "2016-02-21,BUY,GOOG", "2016-02-19,BUY,GOOG", "2016-02-22,BUY,APPL", "2016-02-21,BUY,APPL", "2016-02-22,SELL,APPL", "2016-02-19,BUY,APPL"],
//   ["2016-02-21,BUY,GOOG", "2016-02-19,BUY,GOOG", "2016-02-22,BUY,APPL", "2016-02-22,BUY,FB", "2016-02-21,BUY,APPL", "2016-02-22,SELL,APPL", "2016-02-19,SELL,TSLA", "2016-02-19,BUY,KLOS"]]

//   return fakeTrades[friendUserID] //GOOG 3 APPL 0 TSLA -2 KLOS 1
// }
