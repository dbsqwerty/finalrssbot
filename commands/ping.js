const MenuUtils = require('../structs/MenuUtils.js')
const log = require('../util/logger.js')
const moment = require('moment')
const dbOps = require('../util/dbOps.js')

module.exports = async (bot, message) => {
    try {
      message.channel.send('Pong!')
    } catch (err) {
      log.command.warning(`rssstats`, message.guild, err)
      if (err.code !== 50013) message.channel.send(err.message).catch(err => log.command.warning('rssstats 1', message.guild, err))
    }
  }
  