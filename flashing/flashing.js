const {dialog} = require('electron').remote
var adb = require('adbkit');
var childprocess = require('child_process');
var fs = require('fs');
var fork = childprocess.fork;
var client = adb.createClient();
var $ = require('jquery');
var cmd = require('node-cmd');
var shell = require('shelljs');
var devid;
var inpvalue;
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
                $('#rimo01a').append('<li id="'+device.id.toString()+'"><h2>'+device.id.toString()+' '+properties["ro.build.product"]+'</h2><input value="" id="'+device.id.toString()+'-path"><button id="'+device.id.toString()+'-build">Select Build</button><button id="'+device.id.toString()+'-flash">Flash</button></li>');
              }else if(properties["ro.build.product"]==="rimo02a"){
                $('#rimo02a').append('<li id="'+device.id.toString()+'"><h2>'+device.id.toString()+' '+properties["ro.build.product"]+'</h2><input value="" id="'+device.id.toString()+'-path"><button id="'+device.id.toString()+'-build">Select Build</button><button id="'+device.id.toString()+'-flash">Flash</button></li>');
              }else if(properties["ro.build.product"]==="rimo03a"){
                $('#rimo03a').append('<li id="'+device.id.toString()+'"><h2>'+device.id.toString()+' '+properties["ro.build.product"]+'</h2><input value="" id="'+device.id.toString()+'-path"><button id="'+device.id.toString()+'-build">Select Build</button><button id="'+device.id.toString()+'-flash">Flash</button></li>');
              }
              $('#'+device.id.toString()+'-build').on('click',function(){
                 dialog.showOpenDialog({
                   properties : ['openDirectory']
                 },function(folderpath){
                    $('#'+device.id.toString()+'-path').val(folderpath);
                 });
              });
              $('#'+device.id.toString()+'-flash').on('click',function(){
                 devid = $(this).closest("li").prop("id");
                 inpvalue = $('#'+device.id.toString()+'-path').val().toString();
                 var child = fork('/home/mounik/Workspace/eaatsm3/flashing/forked.js');
                 child.send({srnum : devid,folder : inpvalue});
              })
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
