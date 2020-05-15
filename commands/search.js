const MenuUtils = require('../structs/MenuUtils.js')
const log = require('../util/logger.js')
const moment = require('moment')
const dbOps = require('../util/dbOps.js')
const config = require('../config.js')
const youtube = google.youtube({
    version: 'v3',
    auth: config.advanced.API_KEY,
  });

module.exports = async (bot, message) => {
    try {
      
    } catch (err) {
      log.command.warning(`search`, message.guild, err)
      if (err.code !== 50013) message.channel.send(err.message).catch(err => log.command.warning('search', message.guild, err))
    }
  }
  