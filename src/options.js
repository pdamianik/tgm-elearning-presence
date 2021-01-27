let form = document.forms[0]; // the <form> which houses the settings
let enabled = form.enable; // checkbox to control whether the extension should be enabled

// On a change in settings, save the new settings
enabled.addEventListener('change', event => 
	browser.storage.local.set({
		'enabled': event.target.checked
	}).then(function () {}, console.error));

// Display updated settings when the settings get changed
browser.storage.onChanged.addListener(function (changes, areaName) {
	if (areaName !== 'local')
		return;
	if (Object.keys(changes).includes('enabled'));
		enabled.checked = changes.enabled.newValue;
});

// Inital display of saved settings
browser.storage.local.get({'enabled': false}).then(results => 
	enabled.checked = results.enabled, console.error);