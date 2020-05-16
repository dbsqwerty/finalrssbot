const dbOps = require('../util/dbOps.js')
const FeedSelector = require('../structs/FeedSelector.js')
const log = require('../util/logger.js')
const MenuUtils = require('../structs/MenuUtils.js')

async function feedSelectorFn (m, data) {
  const { guildRss, rssName } = data
  const source = guildRss.sources[rssName]

  return { guildRss: guildRss,
    rssName: rssName,
    next: {
      embed: {
        description: `**Feed Title:** ${source.title}\n**Feed Link:** ${source.link}` }
    }
  }
}

module.exports = async (bot, message, command, role) => {
  try {
    const guildRss = await dbOps.guildRss.get(message.guild.id)
    const feedSelector = new FeedSelector(message, feedSelectorFn, { command: command }, guildRss)
    const data = new MenuUtils.MenuSeries(message, [feedSelector]).start()


  } catch (err) {
    log.command.warning(`list`, message.guild, err)
    if (err.code !== 50013) message.channel.send(err.message).catch(err => log.command.warning('list', message.guild, err))
  }
}
