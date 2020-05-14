const querystring = require('querystring');
const fetch = require('node-fetch');
const urban = require('relevant-urban');
const MenuUtils = require('../structs/MenuUtils.js')
const prefix = "!";
let blacklisted =[]

module.exports = async (bot, message)=>  {
		if( blacklisted.some(word => message.content.includes(word)) ) {
     			message.delete(); 
			message.reply("This word is banned by the server owner");
    		}
		else if(message.content == "!ping"){ // Cm
			message.channel.send("Pinging ...") // Placeholder for pinging ... 
			.then((msg) => { // Resolve promise
			msg.edit("Ping: " + (Date.now() - msg.createdTimestamp)+ " ms\n this is not v. accurate") // Edits message with current timestamp minus timestamp of message
			});
		}else if (message.content === `${prefix}beep`) {
			message.channel.send('Boop.');
   		}else if (message.content === `${prefix}help`) {
		 	message.channel.send(message.author+"Command you need to know: \n !rssadd: adds new rss link \n !rssmove: shift the updates to another channel \n");
   		}else if (message.content.startsWith(`${prefix}urban`)) {
			const query =message.content.split(" ").slice(1).join(" ");
			let array = message.content.split(" ");
				
			if (query) {
				let res= await urban(query).catch(e => {
					return message.channel.send('**Sorry, that word was not found.')
				});
				//embed
				const embed=new MenuUtils.Menu(message,null,{ numbered: false, maxPerPage: 9 })
					.setTitle(`Word: ${res.word}`)
					.setDescription(`**Definition:**\n${res.definition}\n\n**Example:**\n${res.example}`)
					.addOption('**Rating**',`**\`Upvotes: ${res.thumbsUp} | Downvotes: ${res.thumbsDown}\`**`)
				if (res.tags.length>0 && res.tags.join(', ').length<1024){
					embed.addField('Tags', res.tags.join(', '),true)
				}
				await embed.send();
			}else {message.channel.send("Pls enter a word")}
		}else if (message.content.startsWith(`${prefix}yeet`)) {
			let array1 = message.content.split(" ");
			let user = array1[1];
			const items = ["anime girls","heroin","sadness","depression","hentai","debt","all your imaginary friends","logan paul and his dead body","ur mum","the biggest fattest vape","donald trump's wall","death","condoms","explosives","a black hole","a chink"]
   			const rng = Math.floor(Math.random() * 101);
   			const respond  =()=> items[Math.floor(Math.random() * items.length)];
   			if (rng < 5) {
				message.channel.send('Threw '+respond()+' at '+user);
			}else if (rng < 15) {
				message.channel.send('Threw '+respond()+' and '+respond()+' at '+user);
			}else {
				message.channel.send('Threw '+respond()+ ' and '+respond()+ ' and '+respond()+' at '+user);
			}
		}







}

