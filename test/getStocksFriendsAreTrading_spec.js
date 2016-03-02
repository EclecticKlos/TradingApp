/**
 *  ADDTIONAL TESTS
 *      Improper date formatting is handled
 *      Improper ticker formatting is handled
 *      Improper BUY/SELL formatting is handled
 *      Large data volumes are handled
 *
 */

describe('getStocksFriendsAreTrading', function () {

  it('counts friends buy/sell activity', function () {
    expect(getStocksFriendsAreTrading(0, callGetFriendsListForUser, getTradeTransactionsForUser, isValidTransaction, getFriendsBuySellTickerActionsAndRemoveOldTrades, getTickerTransactionCounts, sortCountsAlphabeticallyByTickers, buildNonZeroCountTickerTuples, sortAlphabeticallySortedCountsByCount, makeAlertStrings)).toEqual(["1,BUY,APPL", "1,SELL,FB", "1,BUY,GOOG", "1,SELL,TSLA"]);
  });

  it('sorts alphabetically equal buy counts', function() {
    expect(getStocksFriendsAreTrading(1, callGetFriendsListForUser, getTradeTransactionsForUser, isValidTransaction, getFriendsBuySellTickerActionsAndRemoveOldTrades, getTickerTransactionCounts, sortCountsAlphabeticallyByTickers, buildNonZeroCountTickerTuples, sortAlphabeticallySortedCountsByCount, makeAlertStrings)).toEqual(["1,BUY,APPL", "1,BUY,FB"]);
  });

  it('sorts alphabetically equal sell counts', function() {
    expect(getStocksFriendsAreTrading(2, callGetFriendsListForUser, getTradeTransactionsForUser, isValidTransaction, getFriendsBuySellTickerActionsAndRemoveOldTrades, getTickerTransactionCounts, sortCountsAlphabeticallyByTickers, buildNonZeroCountTickerTuples, sortAlphabeticallySortedCountsByCount, makeAlertStrings)).toEqual(["1,SELL,APPL", "1,SELL,FB"]);
  });

  it('sorts alphabetically equal buy/sell counts', function() {
    expect(getStocksFriendsAreTrading(3, callGetFriendsListForUser, getTradeTransactionsForUser, isValidTransaction, getFriendsBuySellTickerActionsAndRemoveOldTrades, getTickerTransactionCounts, sortCountsAlphabeticallyByTickers, buildNonZeroCountTickerTuples, sortAlphabeticallySortedCountsByCount, makeAlertStrings)).toEqual(["1,SELL,APPL", "1,BUY,FB"]);
  });

  it('creates a 0 count per friend for tickers with both buys and sells from one friend', function() {
    expect(getStocksFriendsAreTrading(4, callGetFriendsListForUser, getTradeTransactionsForUser, isValidTransaction, getFriendsBuySellTickerActionsAndRemoveOldTrades, getTickerTransactionCounts, sortCountsAlphabeticallyByTickers, buildNonZeroCountTickerTuples, sortAlphabeticallySortedCountsByCount, makeAlertStrings)).toEqual("No friend actions to report, check back later.");
  });

  it('handles friends with zero trades', function() {
    expect(getStocksFriendsAreTrading(5, callGetFriendsListForUser, getTradeTransactionsForUser, isValidTransaction, getFriendsBuySellTickerActionsAndRemoveOldTrades, getTickerTransactionCounts, sortCountsAlphabeticallyByTickers, buildNonZeroCountTickerTuples, sortAlphabeticallySortedCountsByCount, makeAlertStrings)).toEqual('No friend actions to report, check back later.');
  });

  it('discards expired trades', function() {
    expect(getStocksFriendsAreTrading(6, callGetFriendsListForUser, getTradeTransactionsForUser, isValidTransaction, getFriendsBuySellTickerActionsAndRemoveOldTrades, getTickerTransactionCounts, sortCountsAlphabeticallyByTickers, buildNonZeroCountTickerTuples, sortAlphabeticallySortedCountsByCount, makeAlertStrings)).toEqual(["1,SELL,TSLA"]);
  });

  it('returns the correct count for one friend with action', function () {
    expect(getStocksFriendsAreTrading(7, callGetFriendsListForUser, getTradeTransactionsForUser, isValidTransaction, getFriendsBuySellTickerActionsAndRemoveOldTrades, getTickerTransactionCounts, sortCountsAlphabeticallyByTickers, buildNonZeroCountTickerTuples, sortAlphabeticallySortedCountsByCount, makeAlertStrings)).toEqual(["1,BUY,APPL"]);
  });

  it('handles users with no friends', function() {
    expect(
      function(){
        getStocksFriendsAreTrading(1000, callGetFriendsListForUser, getTradeTransactionsForUser, isValidTransaction, getFriendsBuySellTickerActionsAndRemoveOldTrades, getTickerTransactionCounts, sortCountsAlphabeticallyByTickers, buildNonZeroCountTickerTuples, sortAlphabeticallySortedCountsByCount, makeAlertStrings);
      }
    ).toThrow();
  });

  it('handles all cases combined', function() {
    expect(getStocksFriendsAreTrading(1001, callGetFriendsListForUser, getTradeTransactionsForUser, isValidTransaction, getFriendsBuySellTickerActionsAndRemoveOldTrades, getTickerTransactionCounts, sortCountsAlphabeticallyByTickers, buildNonZeroCountTickerTuples, sortAlphabeticallySortedCountsByCount, makeAlertStrings)).toEqual(["2,SELL,TSLA", "1,BUY,APPL", "1,BUY,GOOG"]);
  });

});
