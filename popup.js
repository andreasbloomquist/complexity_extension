var test;

function getCurrentTabUrl(callback) {
  
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    var tab = tabs[0];
    var url = tab.url;
    console.assert(typeof url == 'string', 'tab.url should be a string');
    callback(url);
  });

}

function getBWData(url, callback, errorCallback) {
  
  // Temporarily commenting out key until later
  // var key;

  var searchUrl = 'http://api.builtwith.com/v7/api.json?KEY=' + key + '&LOOKUP=builtwith.com';
  console.log('search', searchUrl);

  var x = new XMLHttpRequest();
  x.open('GET', searchUrl);
  
  x.responseType = 'json';
  x.onload = function() {
    var response = x.response;
    callback(response);
  };
  x.onerror = function() {
    errorCallback('Network error.');
  };
  x.send();
}

function renderStatus(resultText) {
  document.getElementById('result').textContent = resultText;
}

document.addEventListener('DOMContentLoaded', function() {
  var currentPageLink = document.getElementById('curr-pg-lnk');
  var statusEl = document.getElementById('status');
  var result = document.getElementById('result');

  currentPageLink.addEventListener('click', function(e){
    e.preventDefault();
    
    getCurrentTabUrl(function(url) {
      getBWData(url, function(response) {
        renderStatus(JSON.stringify(response.Results[0]));
        console.log('response', response.Results[0]);
      }, function(errorMessage) {
      renderStatus('There was an error ' + errorMessage);
      });
    });
  })
});