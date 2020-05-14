const MenuUtils = require('../structs/MenuUtils.js')
const log = require('../util/logger.js')
const moment = require('moment')
const dbOps = require('../util/dbOps.js')
const urban = require('relevant-urban');


module.exports = async (bot, message) => {
    try {
        if (message.content.split(' ').length === 1) return await message.channel.send(`Pls enter a search term`)

        const query =message.content.split(" ").slice(1).join(" ");
                let rest= await urban(query).catch(e => {
                return message.channel.send('**Sorry, that word was not found.')
            });
            //embed
            const embed=new MenuUtils.Menu(message,null,{ numbered: false, maxPerPage: 9 })
                .setTitle(`Word: ${rest.word}`)
                .setDescription(`**Definition:**\n${rest.definition}\n\n**Example:**\n${rest.example}`)
                .addOption('**Rating**',`**\`Upvotes: ${rest.thumbsUp} | Downvotes: ${rest.thumbsDown}\`**`)
            if (rest.tags.length>0 && rest.tags.join(', ').length<1024){
                embed.addField('Tags', rest.tags.join(', '),true)
            }
            await embed.send();
            
    } catch (err) {
      log.command.warning(`urban`, message.guild, err)
      if (err.code !== 50013) message.channel.send(err.message).catch(err => log.command.warning('urban', message.guild, err))
    }
  }
  