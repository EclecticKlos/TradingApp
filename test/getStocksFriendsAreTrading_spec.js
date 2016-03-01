// Questions for Andrew
// - How to test incoming data? (provided methods)
// - Testing "getFriendsListForUser" since it's a "given" method--calling the given function in wrapper function

// /// TESTS
// /*
// - Zero friends
// - Thousand friends
// - One friend always buying GOOG, one always selling GOOG
// - Friend with zero transactions
// - Validity of hash
//   - Works with rollover (throw away days, add days)
// - ParseAndFormatUserTrades produces no duplicates in a given ticker
// */

describe('getStocksFriendsAreTrading', function () {
  // UserID 0 === 4 APPL BUY, 3 FB SELL, 2 TSLA BUY, 1 GOOG SELL
  // UserID 1 === 1 APPL BUY, 1 FB BUY
  // UserID 2 === 1 APPL SELL, 1 FB SELL
  // UserID 3 === 1 APPL SELL, 1 FB BUY
  // UserID 4 === Mixed buy/sell === 0
  // UserID 5 === 1 GOOG BUY 1 TSLA SELL
  // UserID 6 ===
  // UserID with zero friends === 1000

  it('returns the correct counts', function () {
    expect(getStocksFriendsAreTrading(0, callGetFriendsListForUser, getTradeTransactionsForUser, isValidTransaction, getFriendsBuySellPerTickerAndRemoveOldTrades, getTickerTransactionCounts, sortCountsAlphabeticallyByTickers, buildNonZeroCountTickerTuples, sortAlphabeticallySortedCountsByCount, makeAlertStrings)).toEqual(["1,BUY,APPL", "1,SELL,FB", "1,BUY,GOOG", "1,SELL,TSLA"]);
  });

  it('returns the correct count for one friend one stock', function () {
    expect(getStocksFriendsAreTrading(7, callGetFriendsListForUser, getTradeTransactionsForUser, isValidTransaction, getFriendsBuySellPerTickerAndRemoveOldTrades, getTickerTransactionCounts, sortCountsAlphabeticallyByTickers, buildNonZeroCountTickerTuples, sortAlphabeticallySortedCountsByCount, makeAlertStrings)).toEqual(["1,BUY,APPL"]);
  });

  it('sorts tied buys alphabetically first', function() {
    expect(getStocksFriendsAreTrading(1, callGetFriendsListForUser, getTradeTransactionsForUser, isValidTransaction, getFriendsBuySellPerTickerAndRemoveOldTrades, getTickerTransactionCounts, sortCountsAlphabeticallyByTickers, buildNonZeroCountTickerTuples, sortAlphabeticallySortedCountsByCount, makeAlertStrings)).toEqual(["1,BUY,APPL", "1,BUY,FB"]);
  });

  it('sorts tied sells alphabetically first', function() {
    expect(getStocksFriendsAreTrading(2, callGetFriendsListForUser, getTradeTransactionsForUser, isValidTransaction, getFriendsBuySellPerTickerAndRemoveOldTrades, getTickerTransactionCounts, sortCountsAlphabeticallyByTickers, buildNonZeroCountTickerTuples, sortAlphabeticallySortedCountsByCount, makeAlertStrings)).toEqual(["1,SELL,APPL", "1,SELL,FB"]);
  });

  it('sorts tied mix buys/sells alphabetically first', function() {
    expect(getStocksFriendsAreTrading(3, callGetFriendsListForUser, getTradeTransactionsForUser, isValidTransaction, getFriendsBuySellPerTickerAndRemoveOldTrades, getTickerTransactionCounts, sortCountsAlphabeticallyByTickers, buildNonZeroCountTickerTuples, sortAlphabeticallySortedCountsByCount, makeAlertStrings)).toEqual(["1,SELL,APPL", "1,BUY,FB"]);
  });

  it('one sell nullifies any buys', function() {
    expect(getStocksFriendsAreTrading(4, callGetFriendsListForUser, getTradeTransactionsForUser, isValidTransaction, getFriendsBuySellPerTickerAndRemoveOldTrades, getTickerTransactionCounts, sortCountsAlphabeticallyByTickers, buildNonZeroCountTickerTuples, sortAlphabeticallySortedCountsByCount, makeAlertStrings)).toEqual("No friend actions to report, check back later.");
  });

  it('handles friend with zero trades', function() {
    expect(getStocksFriendsAreTrading(5, callGetFriendsListForUser, getTradeTransactionsForUser, isValidTransaction, getFriendsBuySellPerTickerAndRemoveOldTrades, getTickerTransactionCounts, sortCountsAlphabeticallyByTickers, buildNonZeroCountTickerTuples, sortAlphabeticallySortedCountsByCount, makeAlertStrings)).toEqual('No friend actions to report, check back later.');
  });

  it('handles expired trades', function() {
    expect(getStocksFriendsAreTrading(6, callGetFriendsListForUser, getTradeTransactionsForUser, isValidTransaction, getFriendsBuySellPerTickerAndRemoveOldTrades, getTickerTransactionCounts, sortCountsAlphabeticallyByTickers, buildNonZeroCountTickerTuples, sortAlphabeticallySortedCountsByCount, makeAlertStrings)).toEqual(["1,SELL,TSLA"]);
  });

  it('handles user with no friends', function() {
    expect(
      function(){
        getStocksFriendsAreTrading(1000, callGetFriendsListForUser, getTradeTransactionsForUser, isValidTransaction, getFriendsBuySellPerTickerAndRemoveOldTrades, getTickerTransactionCounts, sortCountsAlphabeticallyByTickers, buildNonZeroCountTickerTuples, sortAlphabeticallySortedCountsByCount, makeAlertStrings);
      }
    ).toThrow();
  });

  it('handles multiple friends data', function() {
    expect(getStocksFriendsAreTrading(1001, callGetFriendsListForUser, getTradeTransactionsForUser, isValidTransaction, getFriendsBuySellPerTickerAndRemoveOldTrades, getTickerTransactionCounts, sortCountsAlphabeticallyByTickers, buildNonZeroCountTickerTuples, sortAlphabeticallySortedCountsByCount, makeAlertStrings)).toEqual(["1,BUY,GOOG", "1,SELL,TSLA"]);
  });

});
