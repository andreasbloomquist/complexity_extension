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
  console.log('getting data from the form...');
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

  //Starting ajax request
  var x = new XMLHttpRequest();
  x.open('GET', searchUrl);
  
  x.responseType = 'json';

  //if the request loads ok
  x.onload = function() {
    var response = x.response;
    callback(response);
  };
  //otherwise if the request errors
  x.onerror = function() {
    errorCallback('Network error.');
  };
  x.send();
}

//Function to add the text from the api call to the view
function renderStatus(resultText) {
  document.getElementById('result').textContent = resultText;
}

//Extracted logic into renderCallBack function
//This function takes a string and searches the BW api for that url
//The result of that api call is rendered by invoking the renderStatus() function
function renderCallback(url){
  getData(url, function(response) {
    renderStatus(JSON.stringify(response.Results[0]));
    }, function(errorMessage) {
      renderStatus('Sorry! :( ' + errorMessage);
    });
  });
}

//////////////////////
//EVENT LISTENERS
/////////////////////
// Creating an event listener on the document for DOM READy

document.addEventListener('DOMContentLoaded', function() {
  var currentPageLink = document.getElementById('curr-pg-lnk'),
      statusEl = document.getElementById('status'),
      result = document.getElementById('result'),
      analyzeSub = document.getElementById('analyze-btn'),
      analyzeInput = document.getElementById('url-input');

  //inside of DOM ready I'm adding a click listener on the current page link
  // On firing of click action, the render callback is fired with the proper data
  // This calls the api and renders the data accordingly
  currentPageLink.addEventListener('click', function(e){
    e.preventDefault();
    getCurrentTabUrl(renderCallback(url));
  });
  
  //Similar click listener for the form submission button
  //After the button is clicked I pull the value from the input and then call the api
  //and render the data accordingly
  analyzeSub.addEventListener('click', function(e){
    e.preventDefault();
    getFormData(renderCallback(url));
  });

});
