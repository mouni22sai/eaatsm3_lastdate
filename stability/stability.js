var adb = require('adbkit');
var client = adb.createClient();
var childprocess = require('child_process');
var fork = childprocess.fork;
var $ = require('jquery');
var cmd = require('node-cmd');
var copydir = require('copy-dir');
var shell = require('shelljs');
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
                $('#rimo01a').append('<li id="'+device.id.toString()+'"><h2>'+device.id.toString()+'</h2><button id="'+device.id.toString()+'-runtest" class="stability">Run Test</button></li>');
              }else if(properties["ro.build.product"]==="rimo02a"){
                $('#rimo02a').append('<li id="'+device.id.toString()+'"><h2>'+device.id.toString()+'</h2><button id="'+device.id.toString()+'-runtest" class="stability">Run Test</button><h3>Test Status : <span id="'+device.id.toString()+'-status"></span></p></li>');
              }else if(properties["ro.build.product"]==="rimo03a"){
                $('#rimo03a').append('<li id="'+device.id.toString()+'"><h2>'+device.id.toString()+'</h2><button id="'+device.id.toString()+'-runtest" class="stability">Run Test</button></li>');
              }
              $('#'+device.id.toString()+'-runtest').on('click',function(){
                var child = fork('/home/mounik/Workspace/eaatsm3/stability/forked.js');
                var testtype = $(this).attr('class');
                child.send({devId : device.id.toString(),testType : testtype,pname : properties["ro.build.product"]});
                child.on('message',function(msg){
                  $('#'+msg.num.toString()+'-status').text(msg.stat);
                });
                var logchild = fork('/home/mounik/Workspace/eaatsm3/stability/logfork.js');
                logchild.send({devId : device.id.toString(),testType : testtype,pname : properties["ro.build.product"]});
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
