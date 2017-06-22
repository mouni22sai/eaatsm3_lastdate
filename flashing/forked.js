var shell = require('shelljs');
var cmd = require('node-cmd');
var phnum;
process.on('message',function(msg){
  phnum = msg.srnum.toString();
  shell.cd(msg.folder.toString());
  cmd.get('adb -s '+phnum+' shell getprop ro.serialno.hw',function(err,data){
    if(err){
      throw err;
    }else{
      var fastbootnum = data.toString();
      cmd.get('adb -s '+phnum+' reboot bootloader',function(err,data){
        if(err){
          throw err;
        }else{
          cmd.get('sudo fastboot -s '+fastbootnum.trim()+' flash boot boot.img',function(err,data){
            if(err){
              throw err;
            }else{
              cmd.get('sudo fastboot -s '+fastbootnum.trim()+' flash modem NON-HLOS.bin',function(err,data){
                if(err){
                  throw err;
                }else{
                  cmd.get('sudo fastboot -s '+fastbootnum.trim()+' flash userdata userdata.img',function(err,data){
                    if(err){
                      throw err;
                    }else{
                      cmd.get('sudo fastboot -s '+fastbootnum.trim()+' flash system system.img',function(err,data){
                        if(err){
                          throw err;
                        }else{
                          cmd.get('sudo fastboot -s '+fastbootnum.trim()+' flash persist persist.img',function(err,data){
                            if(err){
                              throw err;
                            }else{
                              cmd.get('sudo fastboot -s '+fastbootnum.trim()+' reboot',function(err,data){
                                if(err){
                                  throw err;
                                }else{
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
            }
          });
        }
      });
    }
  });
});
