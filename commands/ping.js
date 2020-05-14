const MenuUtils = require('../structs/MenuUtils.js')
const log = require('../util/logger.js')
const moment = require('moment')
const dbOps = require('../util/dbOps.js')

module.exports = async (bot, message) => {
    try {
      
        message.channel.send("Pinging ...") 
        .then((msg) => { // Resolve promise
        msg.edit("Ping: " + (Date.now() - msg.createdTimestamp)+ " ms\n this is not v. accurate") // Edits message with current timestamp minus timestamp of message
      	});
    } catch (err) {
      log.command.warning(`ping`, message.guild, err)
      if (err.code !== 50013) message.channel.send(err.message).catch(err => log.command.warning('ping', message.guild, err))
    }
  }
  