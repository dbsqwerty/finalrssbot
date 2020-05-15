const querystring = require('querystring');
const fetch = require('node-fetch');
const urban = require('relevant-urban');
const MenuUtils = require('../structs/MenuUtils.js')
const prefix = "!";
let blacklisted =["cunt","chibai","cibai","marcus","quek","fuck","fucc","shit","bitch"] //lmao, add more for fun
let other_prefix = ['$','%','^','&','*','-'];
const loadCommand = file => require(`../commands/${file}.js`)

module.exports = async (bot, message)=>  {
	
	
		if( blacklisted.some(word => message.content.includes(word)) ) {
     			message.delete(); 
			message.reply("This word is banned by the server owner");
			
		}else if (message.content === `${prefix}test`) {
			loadCommand(rssadd)(bot, message, name)
   		}
	
	}

