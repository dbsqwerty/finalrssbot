const querystring = require('querystring');
const fetch = require('node-fetch');
const urban = require('relevant-urban');
const MenuUtils = require('../structs/MenuUtils.js')
const prefix = "!";
let blacklisted =["cunt","chibai","cibai","marcus","quek","fuck","fucc","shit","bitch"] //lmao, add more for fun
let other_prefix = ['$','%','^','&','*','-'];
 

module.exports = async (bot, message)=>  {
	
	
		if( blacklisted.some(word => message.content.includes(word)) ) {
     			message.delete(); 
			message.reply("This word is banned by the server owner");
		}else if (other_prefix.some(pre => message.content.startsWith(pre))) {
			message.reply("Wrong prefix used, pls use the correct prefix: " + prefix);
    	}else if(message.content == "!ping"){ 
			message.channel.send("Pinging ...") // Placeholder for pinging ... 
			.then((msg) => { // Resolve promise
			msg.edit("Ping: " + (Date.now() - msg.createdTimestamp)+ " ms\n this is not v. accurate") // Edits message with current timestamp minus timestamp of message
			});
		}else if (message.content === `${prefix}beep`) {
			message.channel.send('Boop.');
   		}else if (message.content === `${prefix}help`) {
		 	message.channel.send(message.author+"\nCommand you need to know: \n !rssadd: adds new rss link \n !rssmove: shift the updates to another channel \n");
   		}else if (message.content.startsWith(`${prefix}urban`)) {
			const query =message.content.split(" ").slice(1).join(" ");
			let array = message.content.split(" ");
				
			if (query) {
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
			}else {message.channel.send("Pls enter a word")}
		}else if (message.content.startsWith(`${prefix}yeet`)) {
			let array1 = message.content.split(" ");
			var user;
			if (array1[1]){user = array1[1]}
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
		}
}

