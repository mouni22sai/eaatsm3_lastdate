var cmd = require('node-cmd');
var username;
cmd.get('whoami',function(err,data){
  if(err){
    throw err;
  }else{
    username = data.toString();
  }
});
var adb = require('adbkit');
var client = adb.createClient();
var childprocess = require('child_process');
var fork = childprocess.fork;
var $ = require('jquery');
var copydir = require('copy-dir');
var shell = require('shelljs');
var gmailsend = require('gmail-send');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
http.listen(8000,function(){
  console.log('Listening on 8000 : ');
});
io.on('connection',function(socket){
  console.log('client connected');
});
var socket_client = require('socket.io-client');
var socket1 = socket_client('http://localhost:4000');
var socket2 = socket_client('http://localhost:5000');
socket1.on('connect',function(){
  console.log('am connected');
});
socket2.on('connect',function(){
  console.log('am connected');
});
$(document).ready(function(){
  client.trackDevices(function(err,tracker){
    if(err){
      throw err;
    }else{
      tracker.on('add',function(device){
        setTimeout(function(){
          client.getProperties(device.id,function(err,properties){
            if(err){
              throw err;
            }else{
              if(properties["ro.build.product"]==="rimo01a"){
                $('#rimo01a').append('<li id="'+device.id.toString()+'"><h2>'+device.id.toString()+'</h2><button id="'+device.id.toString()+'-runtest" class="stability">Run Test</button><h3>Test Status : <span id="'+device.id.toString()+'-status"></span></h3></li>');
              }else if(properties["ro.build.product"]==="rimo02a"){
                $('#rimo02a').append('<li id="'+device.id.toString()+'"><h2>'+device.id.toString()+'</h2><button id="'+device.id.toString()+'-runtest" class="stability">Run Test</button><h3>Test Status : <span id="'+device.id.toString()+'-status"></span></h3></li>');
              }else if(properties["ro.build.product"]==="rimo03a"){
                $('#rimo03a').append('<li id="'+device.id.toString()+'"><h2>'+device.id.toString()+'</h2><button id="'+device.id.toString()+'-runtest" class="stability">Run Test</button><h3>Test Status : <span id="'+device.id.toString()+'-status"></span></h3></li>');
              }
              socket1.on('test running',function(data){
                console.log('test is running');
                $('#'+data.serialnum.toString()+'-runtest').prop("disabled",true);
              });
              socket2.on('test running',function(data){
                console.log('test is running');
                $('#'+data.serialnum.toString()+'-runtest').prop("disabled",true);
              });
              socket1.on('test stopped',function(data){
                console.log('test is stopped');
                $('#'+data.serialnum.toString()+'-runtest').prop("disabled",false);
              });
              socket2.on('test stopped',function(data){
                console.log('test is stopped');
                $('#'+data.serialnum.toString()+'-runtest').prop("disabled",false);
              });
              $('#'+device.id.toString()+'-runtest').on('click',function(){
                var child = fork('/home/'+username.trim()+'/Workspace/eaatsm3/stability/forked.js');
                var testtype = $(this).attr('class');
                child.send({devId : device.id.toString(),testType : testtype,pname : properties["ro.build.product"],sysname : username.trim()});
                child.on('message',function(msg){
                  if(msg.stat==="test running"){
                    $('#'+device.id.toString()+'-runtest').prop("disabled",true);
                    io.emit('test running',{serialnum : device.id.toString()});
                  }
                  $('#'+msg.num.toString()+'-status').text(msg.stat);
                  if(msg.stat==="test stopped"){
                    $('#'+device.id.toString()+'-runtest').prop("disabled",false);
                    io.emit('test stopped',{serialnum : device.id.toString()});
                    var send = gmailsend({
                      user : "nagamounika@smartron.com",
                      pass : "mounika1#",
                      to : ["rajendrakumar.chittala@smartron.com","raghavendra@smartron.com","nagamounika@smartron.com"],
                      subject : "Stability testing of "+msg.num.toString(),
                      text : "logfiles"
                    });
                    var file = [msg.filespath.toString()+'/kernel.txt',msg.filespath.toString()+'/events.txt',msg.filespath.toString()+'/radio.txt',msg.filespath.toString()+'/main.txt',msg.filespath.toString()+'/console.txt'];
                    send({
                      files : file
                    }, function (err, res) {
                      console.log('* [example1] send(): err:', err, '; res:', res);
                    });
                  }
                });
                var logchild = fork('/home/'+username.trim()+'/Workspace/eaatsm3/stability/logfork.js');
                logchild.send({devId : device.id.toString(),testType : testtype,pname : properties["ro.build.product"],sysname : username.trim()});
              });
            }
          });
        },1000);
      });
      tracker.on('remove',function(device){
        $('#'+device.id.toString()).remove();
      });
    }
  });
});
