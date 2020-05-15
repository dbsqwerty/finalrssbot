const MenuUtils = require('../structs/MenuUtils.js')
const log = require('../util/logger.js')
const moment = require('moment')
const dbOps = require('../util/dbOps.js')
const urban = require('relevant-urban');
const Discord = require('discord.js');
const trim = (str, max) => str.length > max ? `${str.slice(0, max - 3)}...` : str;


module.exports = async (bot, message) => {
    try {
        if (message.content.split(' ').length === 1) return await message.channel.send(`Pls enter a search term`)

        const query =message.content.split(" ").slice(1).join(" ");
                let rest= await urban(query).catch(e => {
                return message.channel.send('**Sorry, that word was not found.')
            });
            //embed
			
			const embed = new Discord.RichEmbed()
			.setColor('#EFFF00')
			.setTitle(rest.word)
			.setURL(rest.permalink)
			.addField('Definition', trim(rest.definition, 1024))
			.addField('Example', trim(rest.example, 1024))
			.addField('Rating', `${rest.thumbs_up} thumbs up. ${rest.thumbs_down} thumbs down.`);

		message.channel.send(embed);
			
			
			
            
    } catch (err) {
      log.command.warning(`urban`, message.guild, err)
      if (err.code !== 50013) message.channel.send(err.message).catch(err => log.command.warning('urban', message.guild, err))
    }
  }
  