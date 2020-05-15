const channelTracker = require('../util/channelTracker.js')
const initialize = require('../rss/initialize.js')
const serverLimit = require('../util/serverLimit.js')
const Discord = require('discord.js');
const {google} = require('googleapis');
const config = require('../config.js');
const MenuUtils = require('../structs/MenuUtils.js')
const log = require('../util/logger.js')
const moment = require('moment')
const dbOps = require('../util/dbOps.js')
const youtube = google.youtube({
    version: 'v3',
    auth: config.advanced.API_KEY,
  });

module.exports = async (bot, message) => {
    try {
        const origMatch =(/.*youtube\.com\/channel\/(.+)/.exec(message.content)); //Regex for match both channel and user: (/.*youtube\.com\/.+\/(.+)/.exec(message.content));
        let query = message.content.split(/ (.+)/)[1];
        if (!query){return message.channel.send("Error, no search term, not wasting dem api on you bitch")}
        if(origMatch != null){
            addYtFeed(origMatch[1],message);
            return;
        }
        youtube.search.list({
            type: 'channel',
            part: 'id,snippet',
            q: query,
        }).then(res => {
            const numToEmoji = [':one:',':two:',':three:',':four:',':five:']
            var msgEmbed = new Discord.RichEmbed()
            .setColor(3447003)
            .setTitle('Chanels Found')
            .setDescription('Enter the corresponding channel number')
            .setTimestamp()
            
    
        for (var i in res.data.items){
            msgEmbed.addField(numToEmoji[i],`${res.data.items[i].snippet.title}\n${res.data.items[i].snippet.description}\nhttps://youtube.com/channel/${res.data.items[i].snippet.channelId}`);
        }
        message.channel.send(msgEmbed);
            message.channel.send(`<@${message.author.id}> Please enter the corresponding channel number`);
            const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { max: 1, time: 100000 });
            collector.on('collect', m => {
                if (m.content >= 1 && m.content <= res.data.items.length) {
                    addYtFeed(res.data.items[m.content-1].snippet.channelId,message);
                } else {
                    message.channel.send(`<@${message.author.id}> Invalid input. Exiting...`);
                }
            });
            collector.on('end',(c,r)=>{
                if(r==='time') message.channel.send(`<@${message.author.id}> Session timed out. Please try running the command again.`);
            });			
        })
        .catch(error => {
            message.channel.send('Oopsie! An error occured. Please check with your friendly bot devs.')
            console.error(error);
        });
        
        
    
    } catch (err) {
      log.command.warning(`channel`, message.guild, err)
      if (err.code !== 50013) message.channel.send(err.message).catch(err => log.command.warning('channel', message.guild, err))
    }
  }
  async function addYtFeed(channelId,message){
    //console.log(channelId);
    //message.channel.send(`<@${message.author.id}> Added https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`);
    
    
    //below spam.. soz for the gay implementation, no choice            
    const [ guildRss, serverLimitData ] = await Promise.all([ dbOps.guildRss.get(message.guild.id), serverLimit(message.guild.id) ])
    const rssList = guildRss && guildRss.sources ? guildRss.sources : {}
    const vipUser = serverLimitData.vipUser


    let link = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`
    
       
    if (rssList[x].link === link && message.channel.id === rssList[x].channel) return message.channel.send("Link already is added")
        
    

    try {
        const [ addedLink ] = await initialize.addNewFeed({ channel: message.channel, link, vipUser })
        if (addedLink) link = addedLink
        channelTracker.remove(message.channel.id)
        log.command.info(`Added ${link}`, message.guild)
        dbOps.failedLinks.reset(link).catch(err => log.general.error(`Unable to reset failed status for link ${link} after rssadd`, err))
        passedAddLinks.push(link)
        ++checkedSoFar
    } catch (err) {
        let channelErrMsg = err.message
        log.command.warning(`Unable to add ${link}`, message.guild, err)
        failedAddLinks[link] = channelErrMsg
    }
    }







