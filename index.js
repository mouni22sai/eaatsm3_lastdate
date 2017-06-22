const {BrowserWindow,Tray}  = require('electron').remote;
var url = require('url');
var path = require('path');
var $ = require('jquery');
let winflashing;
let winstability;
let winmonkey;
let winMTBF;
$(document).ready(function(){
  $('.flashing').click(function(){
    winflashing = new BrowserWindow();
    winflashing.maximize();
   winflashing.loadURL(url.format({
     pathname : path.join("/home/mounik/Workspace/eaatsm3/flashing","flashing.html"),
     protocol : "file:",
     slashes : true
   }));
  });
  $('.stability').click(function(){
    winstability = new BrowserWindow();
    winstability.maximize();
   winstability.loadURL(url.format({
     pathname : path.join("/home/mounik/Workspace/eaatsm3/stability","stability.html"),
     protocol : "file:",
     slashes : true
   }));
  });
  $('.monkey').click(function(){
    winmonkey = new BrowserWindow();
    winmonkey.maximize();
   winmonkey.loadURL(url.format({
     pathname : path.join("/home/mounik/Workspace/eaatsm3/monkey","monkey.html"),
     protocol : "file:",
     slashes : true
   }));
  });
  $('.MTBF').click(function(){
    winmonkey = new BrowserWindow();
    winmonkey.maximize();
   winmonkey.loadURL(url.format({
     pathname : path.join("/home/mounik/Workspace/eaatsm3/MTBF","mtbf.html"),
     protocol : "file:",
     slashes : true
   }));
  });
});
