const MenuUtils = require('../structs/MenuUtils.js')
const log = require('../util/logger.js')
const moment = require('moment')
const dbOps = require('../util/dbOps.js')
const config = require('../config.js')
const request = require('request');
const uuidv4 = require('uuid/v4');
//check
var region = config.advanced.region;
var subscriptionKey = config.advanced.KEY;
var endpoint_var = 'TRANSLATOR_TEXT_ENDPOINT';
var endpoint = config.advanced.endpoint;
var message = "\nCommand you need to know: \n !rssadd: adds new rss link \n !rssmove: shift the updates to another channel \n\n!search: searches for youtube videos\n\n!channel: searches for youtube channels\n\nIf you dont see any response, wait for 5 minutes or you prob typed it wrongly. Thats on you, not the devs."
let options = {
  method: 'POST',
  baseUrl: endpoint,
  url: 'translate',
  qs: {
    'api-version': '3.0',
    'to': 'zh-Hans'
  },
  headers: {
    'Ocp-Apim-Subscription-Key': subscriptionKey,
    'Ocp-Apim-Subscription-Region' : region,
    'Content-type': 'application/json',
    'X-ClientTraceId': uuidv4().toString()
  },
  body: [{
    'text': message
}],
json: true,
};
module.exports = async (bot, message) => {
    try {
      let array1 = message.content.split(" ");
        var language;
        if (array1[1]){
          message.channel.send(message.author+"\nCommand you need to know: \n !rssadd: adds new rss link \n !rssmove: shift the updates to another channel \n\n!search: searches for youtube videos\n\n!channel: searches for youtube channels\n\nIf you dont see any response, wait for 5 minutes or you prob typed it wrongly. Thats on you, not the devs.");
        } else{
        request(options, function(err, res, body){
          message.channel.send(message.author+JSON.stringify(body, null, 4));
      });
    }
        } catch (err) {
      log.command.warning(`help`, message.guild, err)
      if (err.code !== 50013) message.channel.send(err.message).catch(err => log.command.warning('help', message.guild, err))
    }
  }
  

