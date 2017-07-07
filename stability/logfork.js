var cmd = require('node-cmd');
var shell = require('shelljs');
var mkdirp = require('mkdirp');
var dateTime = require('get-date');
var phnum;
var testType;
var productName;
var dat = dateTime().toString()
var datee = dat.replace("/","-");
var date = datee.replace("/","-");
process.on('message',function(msg){
  console.log(date);
  phnum = msg.devId.toString();
  testType = msg.testType.toString();
  productName = msg.pname.toString();
  shell.cd('/home/'+msg.sysname+'/'+productName+'/'+testType);
  mkdirp(date+'/'+phnum,function(err){
    if(err){
      throw err;
    }else{
      shell.cd('/home/'+msg.sysname+'/'+productName+'/'+testType+'/'+date+'/'+phnum);
      cmd.run('adb -s '+phnum.toString()+' logcat -v time -b main > main.txt');
      cmd.run('adb -s '+phnum.toString()+' logcat -v time -b radio > radio.txt');
      cmd.run('adb -s '+phnum.toString()+' logcat -v time events > events.txt');
      cmd.run('adb -s'+phnum.toString()+' shell cat /proc/kmsg > kernel.txt');
    }
  });

});
