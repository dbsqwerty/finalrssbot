const log = require('../../util/logger.js')

module.exports = (bot, message, command) => {
  message.delete();
  let msg = `add: !add <user> <role> \n\n rm: !rm <user> <role> \n\n`
  
  const helpMessage = msg + '\nCredits: Sean'
  message.author.send(helpMessage, { split: { prepend: '\u200b\n' } })
    .then(() => message.reply('Check your DM!').catch(err => log.command.warning('Failed to send DM notification in text channel', message.guild, err)))
    .catch(err => {
      log.command.warning(`Failed to direct message help text to user`, message.guild, message.author, err)
      message.channel.send(helpMessage, { split: { prepend: '\u200b\n' } }).catch(err => log.command.warning(`rsshelp`, message.guild, err))
    })
}
