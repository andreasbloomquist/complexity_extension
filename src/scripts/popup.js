'use strict';

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

function getFormData(callback){
  console.log('getting data from the form...')
  var urlFormStr = document.getElementById('url-input').value;
  
  console.log('String from input ', urlFormStr);
  
  if(urlFormStr != ''){
    console.log('Initilizing callback...');
    callback(urlFormStr);
  }
}

function getData(url, callback, errorCallback) {
  
  // Temporarily commenting out key until later
  var key = 'b7012e96-e66d-47af-99d5-00545760acfe';

  //Using BuiltWith API
  var searchUrl = 'http://api.builtwith.com/v7/api.json?KEY=' + key + '&LOOKUP=builtwith.com';

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

function renderCallback(url){
  getData(url, function(response) {
    renderStatus(JSON.stringify(response.Results[0]));
    }, function(errorMessage) {
      renderStatus('Sorry! :( ' + errorMessage);
    }
  )
}

document.addEventListener('DOMContentLoaded', function() {
  var currentPageLink = document.getElementById('curr-pg-lnk'),
      statusEl = document.getElementById('status'),
      result = document.getElementById('result'),
      analyzeSub = document.getElementById('analyze-btn'),
      analyzeInput = document.getElementById('url-input');


  currentPageLink.addEventListener('click', function(e){
    e.preventDefault();
    getCurrentTabUrl(renderCallback(url));
  });

  analyzeSub.addEventListener('click', function(e){
    e.preventDefault();
    getFormData(renderCallback(url));
  });



});
