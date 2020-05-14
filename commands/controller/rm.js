const storage = require('../../util/storage.js')
const config = require('../../config.js')
const log = require('../../util/logger.js')
const dbOps = require('../../util/dbOps.js')
//
exports.normal = async (bot, message) => {
  const overrides = storage.limitOverrides
  try {
    let args = message.content.split(" ");
    let member3 = message.mentions.members.first();
    message.delete(); 
    if(!member3) return message.reply("wrong syntax u/r");

    let muteRole3 = message.mentions.roles.first();
    if(!muteRole3) return message.reply("wrong syntax u/r");

    member3.removeRole(muteRole3.id);
    message.channel.send('done');

  }
        
   catch (err) {
    log.controller.warning('***', err)
    if (err.code !== 50013) message.channel.send(err.message).catch(err => log.controller.warning('***', message.guild, err))
  }
}

