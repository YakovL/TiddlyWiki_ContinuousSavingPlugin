This plugin for TiddlyWiki 2.x makes loading and saving work via just one file picking per session
(making experience much closer to the good old days than download saving).

Unlike the core "download saving", it allows you to save like this:

1. On the first saving attempt, it asks to pick the file (the TW itself);
2. It then asks to confirm the write file access;
3. Then it saves, and during the session (until the tab or the browser is reloaded), it saves without further interactions.

Unfortunately, it is only supported by [some browsers](https://caniuse.com/?search=showOpenFilePicker);
at the time of writing, they are desktop Chrome, Chromium-based (Opera, Vivaldi, etc.), and Edge.
For more details, see the [discussion](https://groups.google.com/g/tiddlywikiclassic/c/Pp_lGvxGn0k).

Installation
------------
The plugin can be installed as usual:

1. Create a new tiddler, set title to ContinuousSavingPlugin;
2. Copy the content of [ContinuousSavingPlugin.js](https://github.com/YakovL/TiddlyWiki_ContinuousSavingPlugin/blob/main/ContinuousSavingPlugin.js) to tiddler text, add `systemConfig` to tags;
3. Click 'done', save your TiddlyWiki, reload it.
   * If you saved via the default "download saving", make sure you are opening the downloaded file (normally, you should substitute the original file on downloading; otherwise, saving creates a new file – the one that you need).

Alternatively, it can be installed via [ExtensionsExplorerPlugin](https://github.com/YakovL/TiddlyWiki_ExtensionsExplorerPlugin), but it's not recommended if you are new to TiddlyWiki and use the "download saving".
