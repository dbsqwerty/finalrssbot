const MenuUtils = require('../structs/MenuUtils.js')
const log = require('../util/logger.js')
const moment = require('moment')
const dbOps = require('../util/dbOps.js')


module.exports = async (bot, message) => {
    try {
        let name = message.content.split(" ").slice(1).join(" ")
        
        var user;
        if (name){user = name}
        else {user = "a random person"}
        const items = ["anime girls","heroin","sadness","depression","hentai","debt","all your imaginary friends","ur mum","the biggest fattest vape","donald trump's wall","death","condoms","explosives","a black hole","a chink","ur robot","ur code"]
       const rng = Math.floor(Math.random() * 101);
       const respond  =()=> items[Math.floor(Math.random() * items.length)];
       if (rng < 5) {
        message.channel.send('Threw '+respond()+' at '+user);
        }else if (rng < 15) {
        message.channel.send('Threw '+respond()+' and '+respond()+' at '+user);
        }else {
        message.channel.send('Threw '+respond()+ ' and '+respond()+ ' and '+respond()+' at '+user);
        }
    } catch (err) {
      log.command.warning(`yeet`, message.guild, err)
      if (err.code !== 50013) message.channel.send(err.message).catch(err => log.command.warning('yeet', message.guild, err))
    }
  }
  


  
    
    