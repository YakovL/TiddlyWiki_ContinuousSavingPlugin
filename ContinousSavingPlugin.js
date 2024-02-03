/***
|Name        |ContinousSavingPlugin|
|Description ||
|Source      |https://github.com/YakovL/TiddlyWiki_ContinousSavingPlugin/blob/master/ContinousSavingPlugin.js|
|Author      |Yakov Litvin|
|Version     |0.0.1|
|Browsers    |Up to date support can be checked [[here|https://caniuse.com/?search=showOpenFilePicker]], as of 02.2024 it's Chromium-based desktop browsers and Edge|
|Contact     |Create an [[issue|https://github.com/YakovL/TiddlyWiki_ContinousSavingPlugin/issues]] or start a new thread in the [[Google Group|https://groups.google.com/g/tiddlywikiclassic/]]|
|License     |[[MIT|https://github.com/YakovL/TiddlyWiki_ContinousSavingPlugin/blob/master/LICENSE]]|
***/
//{{{
config.extensions.fileIO = !window.showOpenFilePicker ? null : {
	pickerOptions: { types: [
		// specifying types here, like  { accept: { "text/plain": [".txt"] }, description: "Text file" },
		// forces user to select the type of picking; empty list makes *.* default, so no extra clicks are required
	] },

	// map of { id: { load, save } }
	fileHandles: {},

	load: async function(id) {
	},

	save: async function(id, content) {
	}
}
//}}}