//const discord = require('discord.js');
//const client = new discord.Client();

const prefix = "!";

module.exports = async (bot, message)=>  {
	if(message.content == "!ping"){ // Check if message is "!ping"
			message.channel.send("Pinging ...") // Placeholder for pinging ... 
			.then((msg) => { // Resolve promise
				msg.edit("Ping: " + (Date.now() - msg.createdTimestamp)+ " ms\n this is not v. accurate") // Edits message with current timestamp minus timestamp of message
			});
		}
   else if (message.content === `${prefix}beep`) {
		message.channel.send('Boop.');
   } 


	 else if (message.content === `${prefix}help`) {
		 message.channel.send('Go help yourself'+' '+message.author);
   }

   








else if (message.content.startsWith(`${prefix}yeet`)) {   
const userMention = message.mentions.users.first()
var user;
if (userMention == null) { user = "a random person"}
else { user = userMention;}
//const user = userMention   
//var user = 'me';
   const items = ["anime girls","heroin","sadness","depression","hentai","debt","all your imaginary friends","logan paul and his dead body","ur mum","the biggest fattest vape","donald trump's wall","death","condoms","explosives","a black hole","a chink"]
   const rng = Math.floor(Math.random() * 101);
   const respond  =()=> items[Math.floor(Math.random() * items.length)];
   if (rng < 5) {
	message.channel.send('Threw '+respond()+' at '+user);
}
else if (rng < 15) {
message.channel.send('Threw '+respond()+' and '+respond()+' at '+user);
}
else {
message.channel.send('Threw '+respond()+ ' and '+respond()+ ' and '+respond()+' at '+user);
}

}








}

