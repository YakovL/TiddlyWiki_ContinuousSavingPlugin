/***
|Name        |ContinousSavingPlugin|
|Description ||
|Source      |https://github.com/YakovL/TiddlyWiki_ContinousSavingPlugin/blob/master/ContinousSavingPlugin.js|
|Author      |Yakov Litvin|
|Version     |0.1.0|
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
		const result = { id, ok: false }

		let existingHandle = this.fileHandles[id]
		if(!existingHandle || !existingHandle.load) {
			const handles = await window.showOpenFilePicker(this.pickerOptions)
			if(handles[0]) {
				if(!existingHandle) this.fileHandles[id] = {}
				this.fileHandles[id].load = handles[0]
			} else {
				result.reason = 'cancelled by user'
				return result
			}
		}

		existingHandle = this.fileHandles[id]
		if(!existingHandle || !existingHandle.load) {
			result.reason = `after picking, fileHandles[id]${existingHandle ? '.load' : ''} is still ${
				existingHandle ? existingHandle.load : existingHandle} (id is ${id})`
			return result
		}

		const file = await existingHandle.load.getFile()
		result.content = await file.text()
		result.ok = true
		return result
	},

	save: async function(id, content) {
	}
}
//}}}