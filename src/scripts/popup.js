'use strict';

// Function to get the current tab from the Chrome api
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

// Function to get the data from the form input
function getFormData(callback){
  console.log('getting data from the form...')

  var urlFormStr = document.getElementById('url-input').value;
  console.log('String from input ', urlFormStr);
  
  if(urlFormStr != ''){
    console.log('Initilizing callback...');
    callback(urlFormStr);
  }
}

// Function to call BW api via AJAX
function getData(url, callback, errorCallback) {
  
  // Temporarily commenting out key until later
  var key = 'b7012e96-e66d-47af-99d5-00545760acfe';

  //Using BuiltWith API
  var searchUrl = 'http://api.builtwith.com/v7/api.json?KEY=' + key + '&LOOKUP=builtwith.com';

  // Start AJAX request
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

// Function to add status text to view
function renderStatus(resultObj) {
  console.log(resultObj);
  document.getElementById('company').textContent = resultObj.Results[0].Meta.CompanyName;
  document.getElementById('url').textContent = resultObj.Results[0].Lookup;
}


// Event listener for DOM ready, cache html elements as variables as soon as ready
document.addEventListener('DOMContentLoaded', function() {
  var currentPageLink = document.getElementById('curr-pg-lnk'),
      statusEl = document.getElementById('status'),
      result = document.getElementById('result'),
      analyzeSub = document.getElementById('analyze-btn'),
      analyzeInput = document.getElementById('url-input');

  // Adds event listern for clicks on current page link
  currentPageLink.addEventListener('click', function(e){
    e.preventDefault();
    // fires function to get the data from the current tab and then from BW
    getCurrentTabUrl(function(url) {
      getData(url, function(response) {
        parseData(response);
        renderStatus(response);
      }, function(errorMessage) {
        renderStatus('Sorry! :( ' + errorMessage);
      });
    });
  });

  analyzeSub.addEventListener('click', function(e){
    e.preventDefault();
    // fires function to get the data from the input and then BW
    getFormData(function(url) {
      getData(url, function(response) {
        renderStatus(response); 
      }, function(errorMessage) {
        renderStatus('Sorry! :( ' + errorMessage);
      });
    });
  });
});
