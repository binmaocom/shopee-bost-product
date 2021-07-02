// Create the button
var button = document.createElement("button");
button.innerHTML = "Save to Google Spreadsheets";

// Append to header
var header = document.querySelector('#menu-item-28');
header.appendChild(button);

// Add event handler
button.addEventListener ("click", function() {
  var data = {
    title: document.querySelector('#menu-item-28').textContent,
    url: window.location.href,
  }
  chrome.runtime.sendMessage(data, function(response) {
    console.log('response', response);
  });
});
