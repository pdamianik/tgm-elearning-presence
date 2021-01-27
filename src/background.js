// The extensionId of the discord rich presence host extension
var extensionId = "agnaejlkbiiggajjmnpmeheigkflbnoo"; //Chrome
if(typeof browser !== 'undefined' && typeof chrome !== "undefined"){
	extensionId = "{57081fef-67b4-482f-bcb0-69296e63ec4f}"; //Firefox
}

// Listenes for events/messages from the discord rich presence extension host
function interactionListener(request, _sender, sendResponse) {
	if(request.action == "presence") {
		//Pass request to content script.
		chrome.tabs.sendMessage(request.tab, {action: 'presence', info: request.info}, function(response){
			sendResponse(response);
		});
	}else if(request.action == "join"){
		//Elearning launch request.
		chrome.tabs.create({url: 'https://elearning.tgm.ac.at'+request.secret}, function (_tab) {
		});
	}else if(request.action == "joinRequest"){
		chrome.tabs.sendMessage(request.tab, {action: 'joinRequest', user: request.user}, function(response){
			sendResponse(response);
		});
	}
	return true;
}

// Returns an empty presence to hide any previously active presence status
function disabledInteractionListener(request, _sender, sendResponse) {
	if (request.action == "presence") {
		sendResponse({});
	}
}

// Register the extensions handlers to enable the extension
function register() {
	if (!chrome.runtime.onMessageExternal.hasListener(interactionListener))
		chrome.runtime.onMessageExternal.addListener(interactionListener);
	if (chrome.runtime.onMessageExternal.hasListener(disabledInteractionListener))
		chrome.runtime.onMessageExternal.removeListener(disabledInteractionListener);

	//Register party listener. Needed for reacting to invitations
	chrome.runtime.sendMessage(extensionId, {action: 'party', clientId: '802152044126273556'}, function(_response) {});
}

// Unregister the extensions handlers to disable the extension
function unregister() {
	if (chrome.runtime.onMessageExternal.hasListener(interactionListener))
		chrome.runtime.onMessageExternal.removeListener(interactionListener);
	if (!chrome.runtime.onMessageExternal.hasListener(disabledInteractionListener))
		chrome.runtime.onMessageExternal.addListener(disabledInteractionListener);
}

// check whether the extension should be enabled
function checkSettings() {
	browser.storage.local.get({'enabled': false}).then(function(results) {
		if (results.enabled)
			register();
		else
			unregister();
	}, function(error) {
		alert(error);
	});
}

// Everytime the settings get changed check whether the extension should be enabled
browser.storage.onChanged.addListener(function (changes, areaName) {
	if (areaName !== 'local')
		return;
	if (Object.keys(changes).includes('enabled'));
		checkSettings();
});

// Check if the extension should be enabled
checkSettings();

// On startup, show the privacy notice and the disclaimer and ask the user for consent
chrome.runtime.onInstalled.addListener(function(details) {
	if (details.reason === "install") {
		browser.storage.local.get({'startup': true}).then(function(results) {
			if (results.startup) {
				chrome.tabs.create({url: chrome.runtime.getURL('startup.html')}, function(_tab) {});
				browser.storage.local.set({'startup': false});
			}
		});
	}
});