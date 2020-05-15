const storage = require('../../util/storage.js')
const log = require('../../util/logger.js')
const ms = require('ms');

//
exports.normal = async (bot, message) => {
  const overrides = storage.limitOverrides
  try {
    let args = message.content.split(" ");
    let member2 = message.mentions.members.first();
    message.delete(); 
    if(!member2) return message.reply("wrong syntax u/r");
    let muteRole2 = message.mentions.roles.first();
    if(!muteRole2) return message.reply("wrong syntax u/r");
    let time2 = args[3];
    if(!time2) {
        member2.addRole(muteRole2.id);
        message.channel.send("done");
      }else {
        member2.addRole(muteRole2.id);
        message.channel.send('temp');

        setTimeout(function(){
          member2.removeRole(muteRole2.id);
          message.channel.send("done")

        }, ms(time2));

        };
        
  } catch (err) {
    log.controller.warning('...', err)
    if (err.code !== 50013) message.channel.send(err.message).catch(err => log.controller.warning('...', message.guild, err))
  }
}

