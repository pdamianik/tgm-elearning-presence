var extensionId = "agnaejlkbiiggajjmnpmeheigkflbnoo"; //Chrome
if(typeof browser !== 'undefined' && typeof chrome !== "undefined"){
	extensionId = "{57081fef-67b4-482f-bcb0-69296e63ec4f}"; //Firefox
}

// Register Presence
chrome.runtime.sendMessage(extensionId, {mode: 'active'}, function(_response) {});

// Wait for presence Requests
chrome.runtime.onMessage.addListener(function(info, _sender, sendResponse) {
	if(info.action === 'joinRequest') {
	// If request is a joinRequest then show confirm and send response
		if (confirm(info.user.username+'#'+info.user.discriminator+' wants to join you')) {
			sendResponse('YES');
		} else {
			sendResponse('NO');
		}
	}else{
		sendResponse(getPresence());
	}
});

// Return Presence
var time = Date.now()
function getPresence(){
	try{
		let course = document.querySelector('h1') || document.querySelector('title');
		let task = document.querySelector('h2');
		let details = typeof course && typeof task ? (course.textContent + ': ' + task.textContent) : (typeof course ? course.textContent : (typeof task ? task.textContent : 'Unknown website type'));

		
		if(typeof details) {
			return {
				clientId: '802152044126273556',
				presence: {
					details: details,
					largeImageKey: "twitch",
					smallImageKey: "live",
					partyId: "party:"+course.textContent.replace(' ', '-'),
					partySize: 1,
					partyMax: 5,
					joinSecret: window.location.pathname + window.location.search,
					instance: true,
				}
			};
		}
	}catch(e) {
		console.error(e);
	}
	return {};
}