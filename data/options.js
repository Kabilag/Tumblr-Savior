var inputLast = 0;

document.addEventListener("DOMContentLoaded", contentLoaded);

function contentLoaded() {
  var save_btn = document.getElementById("save_btn");
  var reset_btn = document.getElementById("reset_btn");
  var load_btn = document.getElementById("load_btn");
  var listWhiteAdd = document.getElementById("listWhiteAdd");
  var listBlackAdd = document.getElementById("listBlackAdd");
  var listsTab = document.getElementById("listsTab");
  var settingsTab = document.getElementById("settingsTab");
  var saveloadTab = document.getElementById("saveloadTab");
  var aboutTab = document.getElementById("aboutTab");

  save_btn.addEventListener("click", saveOptions);
  load_btn.addEventListener("click", function() { if (confirm("Are you sure you want to load these settings?")) {importOptions()} });
  reset_btn.addEventListener("click", function() { if (confirm("Are you sure you want to restore defaults?")) {eraseOptions()} });

  listWhiteAdd.addEventListener("click", function(e) {
      addInput("White");
      e.preventDefault();
      e.stopPropagation();
  }, false);

  listBlackAdd.addEventListener("click", function(e) {
      addInput("Black");
      e.preventDefault();
      e.stopPropagation();
  }, false);

  listsTab.addEventListener("click", function(e) {
      tabClick(listsTab);
      e.preventDefault();
      e.stopPropagation();
  }, false);

  settingsTab.addEventListener("click", function(e) {
      tabClick(settingsTab);
      e.preventDefault();
      e.stopPropagation();
  }, false);
  
  saveloadTab.addEventListener("click", function(e) {
      tabClick(saveloadTab);
      e.preventDefault();
      e.stopPropagation();
  }, false);

  aboutTab.addEventListener("click", function(e) {
      tabClick(aboutTab);
      e.preventDefault();
      e.stopPropagation();
  }, false);

  loadOptions();
}

function tabClick(whichTab) {
  var tabs = document.getElementById("tabs");
  for (var tab in tabs.children) {
    var currentTab = tabs.children[tab];
    if (typeof currentTab === "object") {
      if (currentTab.id != whichTab.id) {
        currentTab.className = "";
      } else {
        currentTab.className = "selected";
      }
    }
  }

  var foregroundDiv = document.getElementById('foregroundDiv');
  var backgroundDiv = document.getElementById('backgroundDiv');
  var load_btn = document.getElementById('load_btn');
  var save_btn = document.getElementById('save_btn');
  var reset_btn = document.getElementById('reset_btn');
  var spacerDiv = document.getElementById('spacer');

  if (foregroundDiv.children[0].id != whichTab.id.replace("Tab","Div")) {  
    var switchto = document.getElementById(whichTab.id.replace("Tab","Div"));
    var switchfrom = foregroundDiv.children[0];
    backgroundDiv.appendChild(switchfrom);
    foregroundDiv.appendChild(switchto);
    switch (whichTab.id) {
      case "aboutTab":
        load_btn.style.display = "none";
        save_btn.style.display = "none";
        reset_btn.style.display = "none";
        spacerDiv.style.display = "none";
        break;
      case "saveloadTab":
        load_btn.style.display = "";
        save_btn.style.display = "none";
        reset_btn.style.display = "";
        spacerDiv.style.display = "none";
        break
      case "listsTab":
      case "settingsTab":
        load_btn.style.display = "none";
        save_btn.style.display = "";
        reset_btn.style.display = "";
        spacerDiv.style.display = "";
        break;
    }
  }
}

function parseSettings() {
  var parsedSettings;

  if (localStorage["settings"] == undefined || localStorage == null) {
    parsedSettings = defaultSettings;
  } else {
    parsedSettings = JSON.parse(localStorage["settings"]);
  }
  return parsedSettings;
}

function importOptions() {
  var inandout = document.getElementById("inandout");
  var dirtySettings = inandout.value;
  var importSettings;
  try {
    importSettings = JSON.parse(dirtySettings);
  } catch (e) {
    alert("Those are settings are corrupt, I'm sorry but I can't use them.");
    return;
  }

  localStorage["settings"] = JSON.stringify(importSettings);
  
  resetLists();
  loadOptions();
  notifyBrowsers(importSettings);
}

function loadOptions() {
  var loadSettings;
  
  loadSettings = parseSettings();
  
  var hide_source_cb = document.getElementById("hide_source_cb");
  hide_source_cb.checked = loadSettings["hide_source"];
  
  var show_notice_cb = document.getElementById("show_notice_cb");
  show_notice_cb.checked = loadSettings["show_notice"];
  
  var show_words_cb = document.getElementById("show_words_cb");
  show_words_cb.checked = loadSettings["show_words"];
  
  var pagetracker_cb = document.getElementById("pagetracker_cb");
  pagetracker_cb.checked = loadSettings["no_pagetracker"];
  
  var match_words_cb = document.getElementById("match_words_cb");
  match_words_cb.checked = loadSettings["match_words"];
  
  var promoted_tags_cb = document.getElementById("promoted_tags_cb");
  promoted_tags_cb.checked = loadSettings["promoted_tags"];
  
  var promoted_posts_cb = document.getElementById("promoted_posts_cb");
  promoted_posts_cb.checked = loadSettings["promoted_posts"];
  
  var context_menu_cb = document.getElementById("context_menu_cb");
  context_menu_cb.checked = loadSettings["context_menu"];

  var toolbar_butt_cb = document.getElementById("toolbar_butt_cb");
  toolbar_butt_cb.checked = loadSettings["toolbar_butt"];
  
  var white_notice_cb = document.getElementById("white_notice_cb");
  white_notice_cb.checked = loadSettings["white_notice"];

  var black_notice_cb = document.getElementById("black_notice_cb");
  black_notice_cb.checked = loadSettings["black_notice"];

  var hide_pinned_cb = document.getElementById("hide_pinned_cb");
  hide_pinned_cb.checked = loadSettings["hide_pinned"];
  
  var auto_unpin_cb = document.getElementById("auto_unpin_cb");
  auto_unpin_cb.checked = loadSettings["auto_unpin"];
  
  var show_tags_cb = document.getElementById("show_tags_cb");
  show_tags_cb.checked = loadSettings["show_tags"];
  
  var hide_premium_cb = document.getElementById("hide_premium_cb");
  hide_premium_cb.checked = loadSettings["hide_premium"];
  
  for (var itemBlack in loadSettings["listBlack"]) {
    addInput("Black", loadSettings["listBlack"][itemBlack]);
  }
  
  for (var itemWhite in loadSettings["listWhite"]) {
    addInput("White", loadSettings["listWhite"][itemWhite]);
  }
  
  addInput("Black"); //prepare a blank input box.
  addInput("White"); //prepare a blank input box.
  
  var version_div = document.getElementById("version_div");
  version_div.innerHTML = "v"+defaultSettings["version"]; //use default so we're always showing current version regardless of what people have saved.

  var browser_span = document.getElementById("browser_span");

  if (typeof opera != "undefined") {
    var context_menu_div = document.getElementById("context_menu_div");
    context_menu_div.setAttribute("style", "display:none;");
    
    browser_span.innerHTML = "for Opera&trade;";
  } else if (typeof chrome != "undefined" || typeof safari != "undefined") {
    var toolbar_butt_div = document.getElementById("toolbar_butt_div");
    toolbar_butt_div.setAttribute("style", "display:none;");
    
    browser_span.innerHTML = "for Chrome&trade;";          
  } else if (typeof safari != "undefined") {
    browser_span.innerHTML = "for Safari&trade;";
  } else { // You must be firefox.
    browser_span.innerHTML = "for Firefox&trade;";
  }
  
  var inandout = document.getElementById("inandout");
  inandout.innerHTML = JSON.stringify(loadSettings);
}

function addInput(whichList, itemValue) {
  if (itemValue == undefined) {
    itemValue = "";
  }
  var listDiv = document.getElementById("list"+whichList);
  var listAdd = document.getElementById("list"+whichList+"Add");
  var optionInput = document.createElement("input");
  optionInput.value = itemValue;
  optionInput.name = "option"+whichList;
  var currentLength = inputLast++;
  optionInput.id = "option"+whichList+currentLength;
  var optionAdd = document.createElement("a");
  optionAdd.href = "#";
  optionAdd.addEventListener(
    "click",
    function (e) {
      var removeThis = e.target;
      while (removeThis.tagName !== "DIV") {
        removeThis = removeThis.parentNode;
      }
      if (removeThis.id.indexOf("_div") >= 0) {
        removeInput(removeThis.id);
      }
      e.preventDefault();
      e.stopPropagation();
    },
    false
  );
  optionAdd.innerHTML = "<img src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAHCAYAAADEUlfTAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAGFJREFUeNpiXLVmfTwDA8MEIHYICwm8COTrA9kHgLiAEch5D2QIAPEHkABUIZjPBNIBlQAJLEBS6MAEMgqqAxkUgMQZkewQQJKE6ESSAAkkIFlxgAlq5AeoaxciuaEAIMAAiDAi7M96B5wAAAAASUVORK5CYII=\" />&nbsp;";
  var optionLinebreak = document.createElement("br");
  var optionDiv = document.createElement("div");
  optionDiv.id = "option"+whichList+currentLength+"_div";
  optionDiv.appendChild(optionAdd);
  optionDiv.appendChild(optionInput);
  optionDiv.appendChild(optionLinebreak);
  listDiv.insertBefore(optionDiv,listAdd);
}

function removeInput(optionWhich) {
  var optionInput = document.getElementById(optionWhich);
  if (typeof optionInput == "undefined") {
    return;
  }
  optionInput.parentNode.removeChild(optionInput);
}

function saveOptions() {
  var oldSettings = parseSettings();
  var newSettings = {};

  var hide_source_cb = document.getElementById("hide_source_cb");
  newSettings["hide_source"] = hide_source_cb.checked;
  
  var show_notice_cb = document.getElementById("show_notice_cb");
  newSettings["show_notice"] = show_notice_cb.checked;
  
  var show_words_cb = document.getElementById("show_words_cb");
  newSettings["show_words"] = show_words_cb.checked;
  
  var pagetracker_cb = document.getElementById("pagetracker_cb");
  newSettings["no_pagetracker"] = pagetracker_cb.checked;
  
  var match_words_cb = document.getElementById("match_words_cb");
  newSettings["match_words"] = match_words_cb.checked;
  
  var promoted_tags_cb = document.getElementById("promoted_tags_cb");
  newSettings["promoted_tags"] = promoted_tags_cb.checked;
  
  var promoted_posts_cb = document.getElementById("promoted_posts_cb");
  newSettings["promoted_posts"] = promoted_posts_cb.checked;
  
  var context_menu_cb = document.getElementById("context_menu_cb");
  newSettings["context_menu"] = context_menu_cb.checked;
  
  var toolbar_butt_cb = document.getElementById("toolbar_butt_cb");
  newSettings["toolbar_butt"] = toolbar_butt_cb.checked;
  
  var white_notice_cb = document.getElementById("white_notice_cb");
  newSettings["white_notice"] = white_notice_cb.checked;
  
  var black_notice_cb = document.getElementById("black_notice_cb");
  newSettings["black_notice"] = black_notice_cb.checked;

  var hide_pinned_cb = document.getElementById("hide_pinned_cb");
  newSettings["hide_pinned"] = hide_pinned_cb.checked;
  
  var auto_unpin_cb = document.getElementById("auto_unpin_cb");
  newSettings["auto_unpin"] = auto_unpin_cb.checked;
  
  var show_tags_cb = document.getElementById("show_tags_cb");
  newSettings["show_tags"] = show_tags_cb.checked;
  
  var hide_premium_cb = document.getElementById("hide_premium_cb");
  newSettings["hide_premium"] = hide_premium_cb.checked;

  newSettings["listWhite"] = [];
  newSettings["listBlack"] = [];
  newSettings["version"] = defaultSettings["version"]; //always update version info from default.

  var options = document.getElementsByTagName("input");
  for (var i = 0; i< options.length; i++) {
    if (options[i].value != "") {
      if (options[i].name.substring(0,11) == "optionWhite") {
        newSettings["listWhite"].push(options[i].value);
      } else if (options[i].name.substring(0,11) == "optionBlack") {
        newSettings["listBlack"].push(options[i].value);
      }
    }
  }

  if (newSettings["context_menu"]){
    if (oldSettings["context_menu"]==false) {
      if (typeof chrome != "undefined") {
        var cmAddToBlackList = chrome.contextMenus.create({
          "type":"normal",
          "title":"Add '%s' to Tumblr Savior black list",
          "contexts": ["selection"],
          "documentUrlPatterns": ["http://*.tumblr.com/*"],
          "onclick": chromeAddToBlackList
        });
      }
    }
  } else {
    if (typeof chrome != "undefined") {
      chrome.contextMenus.removeAll();
    }
  }

  if (newSettings["toolbar_butt"]!=oldSettings["toolbar_butt"]) {
    if (typeof opera != "undefined") {
      opera.extension.postMessage("toolbar");
    }
  }

  localStorage["settings"] = JSON.stringify(newSettings);
  notifyBrowsers(newSettings);
  resetLists();
  loadOptions();
}

function eraseOptions() {
  localStorage["settings"] = JSON.stringify(defaultSettings);
  notifyBrowsers(defaultSettings);
  resetLists();
  loadOptions();
}

function resetLists() {
  var listsDiv = document.getElementById('listsDiv');
  var listsInputs = listsDiv.getElementsByTagName("input");

  var arrayRemove = new Array(); // put stuff in an array because firefox is dumb.

  for (var i=0;i<listsInputs.length;i++) {
    arrayRemove.push(listsInputs[i].id+"_div");
  }
  
  while (arrayRemove.length>0) {
    var toRemove = arrayRemove.pop();
    removeInput(toRemove);
  }
}

function notifyBrowsers(newSettings) {
  if (typeof chrome != "undefined") {
    chrome.tabs.getAllInWindow(null, chromeNotifyTumblr);
  } else if (typeof opera != "undefined") {
    opera.extension.postMessage("refreshSettings");
  } else if (typeof safari != "undefined") {
    safari.self.tab.dispatchMessage("refreshSettings", newSettings);
  } else { // You must be Firefox.
    addon.postMessage(JSON.stringify(newSettings));
  }
}

function chromeNotifyTumblr(tabs) {
  for (tab in tabs) {
    if(checkurl(tabs[tab].url, ["http://*.tumblr.com/*"])) {
/*      if (typeof chrome.tabs.sendMessage != "undefined") {
        chrome.tabs.sendMessage(tabs[tab].id, "refreshSettings");
      } else */ if (typeof chrome.tabs.sendRequest != "undefined") {
        chrome.tabs.sendRequest(tabs[tab].id, "refreshSettings");
      }
    }
  }
}

function chromeAddToBlackList(info, tab) {
  var oldSettings = parseSettings();
  if(info.selectionText) {
    for(var v=0;v<oldSettings["listBlack"].length;v++){
      if(oldSettings.listBlack[v].toLowerCase()==info.selectionText.toLowerCase()) {
        alert("'"+info.selectionText+"' is already on your black list.");
        return;
      }
    }
    oldSettings.listBlack.push(info.selectionText.toLowerCase());
    localStorage["settings"] = JSON.stringify(oldSettings);
  }
  var chromeViews = chrome.extension.getViews();
  for(chromeView in chromeViews) {
    if(chromeViews[chromeView].location==chrome.extension.getURL("options.html")) {
      chromeViews[chromeView].location.reload();
    }
  }
/*  if (typeof chrome.tabs.sendMessage != "undefined") {
    chrome.tabs.sendMessage(tab.id, "refreshSettings");
  } else */ if (typeof chrome.tabs.sendRequest != "undefined") {
    chrome.tabs.sendRequest(tab.id, "refreshSettings");
  }
}

function safariMessageHandler(event) {
  switch (event.name) {
    case "reload":
      location.reload();
      break;
    case "updateSettings":
      localStorage["settings"] = event.message;
      location.reload();
      break;
  }
}

function firefoxMessageHandler(data) {
  addon.postMessage(localStorage["settings"]);
}


function checkurl(url, filter) {
  for (var f in filter) {
    var filterRegex;
    filterRegex=filter[f].replace(/\x2a/g, "(.*?)");
    var re = new RegExp(filterRegex);
    if (url.match(re)) {
      return true;
    }
  }
  return false;
}

if (typeof safari != "undefined") {
  safari.self.addEventListener("message", safariMessageHandler, false);
} else if (typeof chrome == "undefined" && typeof opera == "undefined") {
  addon.on("message", firefoxMessageHandler);
}