var cmd = require('node-cmd');
var shell = require('shelljs');
var dateTime = require('get-date');
var phnum;
var testType;
var productName;
var dat = dateTime().toString()
var datee = dat.replace("/","-");
var date = datee.replace("/","-");
var fs = require('fs');
process.on('message',function(msg){
  phnum = msg.devId;
  testType = msg.testType.toString();
  productName = msg.pname.toString();
  shell.cd('/home/'+msg.sysname+'/stability_scripts/java');
  cmd.get('android create uitest-project -n SmartronUiTests -t "Google Inc.:Google APIs:23" -p .',function(err,data){
    if(err){
      throw err;
    }else{
      cmd.get('ant build',function(err,data){
        if(err){
          throw err;
        }else{
          cmd.get('adb -s '+phnum.toString()+' push bin/bundle.jar /data/local/tmp',function(err,data){
            if(err){
              throw err;
            }else{
              cmd.get('adb -s '+phnum.toString()+' push bin/SmartronUiTests.jar /data/local/tmp',function(err,data){
                if(err){
                  throw err;
                }else{
                  process.send({num : phnum,stat:"test running"});
                  cmd.get('adb -s '+phnum.toString()+' shell uiautomator runtest SmartronUiTests.jar',function(err,data){
                    if(err){
                      throw err;
                    }else{
                       fs.writeFile('/home/'+msg.sysname+'/'+productName+'/'+testType+'/'+date+'/'+phnum+'/console.txt',data.toString(),function(err){
                         if(err){
                           throw err;
                         }
                       });
                       process.send({num : phnum,stat:"test stopped",filespath : '/home/'+msg.sysname+'/'+productName+'/'+testType+'/'+date+'/'+phnum});
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  });
});
