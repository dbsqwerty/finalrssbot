const MenuUtils = require('../structs/MenuUtils.js')
const log = require('../util/logger.js')
const moment = require('moment')
const dbOps = require('../util/dbOps.js')

module.exports = async (bot, message) => {
    try {
      message.channel.send('Boop')
    } catch (err) {
      log.command.warning(`beep`, message.guild, err)
      if (err.code !== 50013) message.channel.send(err.message).catch(err => log.command.warning('beep', message.guild, err))
    }
  }
  