/***
|Name        |ContinuousSavingPlugin|
|Description |Makes loading and saving work via just one file picking per session|
|Source      |https://github.com/YakovL/TiddlyWiki_ContinuousSavingPlugin/blob/main/ContinuousSavingPlugin.js|
|Author      |Yakov Litvin|
|Version     |0.4.0|
|Browsers    |Up to date support can be checked [[here|https://caniuse.com/?search=showOpenFilePicker]], as of 02.2024 it's Chromium-based desktop browsers and Edge|
|~CoreVersion|2.10.0|
|Contact     |Create an [[issue|https://github.com/YakovL/TiddlyWiki_ContinuousSavingPlugin/issues]] or start a new thread in the [[Google Group|https://groups.google.com/g/tiddlywikiclassic/]]|
|License     |[[MIT|https://github.com/YakovL/TiddlyWiki_ContinuousSavingPlugin/blob/master/LICENSE]]|
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
		const result = { id, ok: false }

		if(!this.fileHandles[id]) {
			// load handler is preferrable, but won't work for creating a file
			const handle = await window.showSaveFilePicker(this.pickerOptions)
			if(handle) {
				this.fileHandles[id] = { save: handle }
			} else {
				result.reason = 'cancelled by user'
				return result
			}
		}

		if(!this.fileHandles[id]) {
			result.reason = `after picking, fileHandles[id] is still ${
				this.fileHandles[id]} (id is ${id})`
			return result
		}

		const handle = this.fileHandles[id].load || this.fileHandles[id].save
		const writable = await handle.createWritable()
		if(!writable) {
			result.reason = `writable (for id ${id}) is ${writable}`
			return result
		}
		await writable.write(content)
		await writable.close()
		result.ok = true
		result.content = content
		return result
	}
}

config.options.chkPreventAsyncSaving = false

if(window.tw && tw.io && tw.io.loadFile && !tw.io.orig_nonContinuous_loadFile) {
	tw.io.orig_nonContinuous_loadFile = tw.io.loadFile
	tw.io.loadFile = function(fileUrl, callback) {
		const newCallback = function(result, details) {
			if(result) callback(result, details)
			else config.extensions.fileIO.load(fileUrl)
				.then(({ content }) => callback(content))
		}

		return tw.io.orig_nonContinuous_loadFile(fileUrl, newCallback)
	}

	tw.io.orig_nonContinuous_asyncSaveFile = tw.io.asyncSaveFile
	tw.io.asyncSaveFile = function(fileUrl, content, callback) {
		const newCallback = function(result, details) {
			if(result) callback(result, details)
			else config.extensions.fileIO.save(fileUrl, content)
				.then(result => callback(result.ok, result))
		}

		return tw.io.orig_nonContinuous_asyncSaveFile(fileUrl, content, newCallback)
	}
}
//}}}