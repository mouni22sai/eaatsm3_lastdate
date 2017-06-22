const {BrowserWindow, app, Tray} = require('electron');
var url = require('url');
var path = require('path');
let win;
app.on('ready',function(){
  win = new BrowserWindow({
    icon : path.join('/home/mounik/Workspace/eaatsm3','appicon.png')
  });
  win.maximize();
  win.loadURL(url.format({
    pathname: path.join("/home/mounik/Workspace/eaatsm3", 'index.html'),
    protocol: 'file:',
    slashes: true
  }));
});
app.on('window-all-closed',function(){
  app.quit();
});
