var cmd = require('node-cmd');
var phnum;
var testType;
var productName;
var packName;
var dateTime = require('get-date');
var dat = dateTime().toString()
var datee = dat.replace("/","-");
var date = datee.replace("/","-");
var shell = require('shelljs');
process.on('message',function(msg){
  phnum = msg.devId;
  testType = msg.testType.toString();
  productName = msg.pname.toString();
  packName = msg.package;
  if(packName === ""){
    process.send({num : phnum,stat:"test running"});
    cmd.get(' adb -s '+phnum.toString()+' shell monkey -v --ignore-timeouts --ignore-crashes --ignore-security-exceptions -s 100 --throttle 500 1000000',function(err,data){
      if(err){
        throw err;
      }else{
         process.send({num : phnum,stat:"test stopped",filespath : '/home/'+msg.sysname.toString()+'/'+productName+'/'+testType+'/'+date+'/'+phnum});
      }
    });
  }else{
    process.send({num : phnum,stat:"test running"});
    cmd.get('adb -s '+phnum.toString()+' shell monkey -v --ignore-timeouts --ignore-crashes --ignore-security-exceptions -p com.'+packName.toString()+' -s 100 --throttle 500 1000000',function(err,data){
      if(err){
        throw err;
      }else{
         process.send({num : phnum,stat:"test stopped",filespath : '/home/'+msg.sysname.toString()+'/'+productName+'/'+testType+'/'+date+'/'+phnum});
      }
    });
  }
});
