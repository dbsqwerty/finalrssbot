const MenuUtils = require('../structs/MenuUtils.js')
const log = require('../util/logger.js')
const moment = require('moment')
const dbOps = require('../util/dbOps.js')
const config = require('../config.js')


module.exports = async (bot, message) => {
    try {
        message.channel.send(message.author+"\nCommand you need to know: \n !rssadd: adds new rss link \n !rssmove: shift the updates to another channel \n\n!search: searches for youtube videos\n\n!channel: searches for youtube channels\n\nIf you dont see any response, wait for 5 minutes or you prob typed it wrongly. Thats on you, not the devs.");
        } catch (err) {
      log.command.warning(`help`, message.guild, err)
      if (err.code !== 50013) message.channel.send(err.message).catch(err => log.command.warning('help', message.guild, err))
    }
  }
  

