
const querystring = require('querystring');
const fetch = require('node-fetch');
const urban = require('relevant-urban');
const MenuUtils = require('../structs/MenuUtils.js')
const prefix = "!";
let blacklisted =["cunt","chibai","cibai","marcus","quek","fuck","fucc","shit","bitch"] //lmao, add more for fun

//vexdb shit (converting TS to JS)
const MatchOutcome = {
	WIN,
	TIE,
	LOSS
}
function outcome(team,match) {
	if (match.redscore === match.bluescore) {
	  return MatchOutcome.TIE;
	}
	if (
		(match.redscore > match.bluescore &&
		  [match.red1, match.red2, match.red3].includes(team)) ||
		(match.bluescore > match.redscore &&
		  [match.blue1, match.blue2, match.blue3].includes(team))
	  ) {
		return MatchOutcome.WIN;
	  }
	  return MatchOutcome.LOSS;
}
function buildRecord(team,matches) {
	const record = {
	  team,
	  wins: 0,
	  losses: 0,
	  ties: 0,
	  matches: 0,
	};
	for (let match of matches) {
		const result = outcome(team, match);
	
		record.matches++;
		if (result == MatchOutcome.WIN) {
			record.wins++;
		  } else if (result == MatchOutcome.LOSS) {
			record.losses++;
		  } else {
			record.ties++;
		  }
	}
	return record;
}


module.exports = async (bot, message)=>  {
	import * as vexdb from "vexdb";
	import { MatchesResponseObject } from "vexdb/out/constants/ResponseObjects";
	
		if( blacklisted.some(word => message.content.includes(word)) ) {
     			message.delete(); 
			message.reply("This word is banned by the server owner");
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
		}else if (message.content.startsWith(`${prefix}team`)) {
			let msg = message.content.split(" ");
			const team = msg[0].toUpperCase();
			const season = msg.slice(1).join(" ") || "current";
			if (team) {
				let record = await vexdb.get("teams", { team }).then((res) => res[0]);
				if (!record) {
					message.channel.send("There doesn't appear to be a team with that number!");
				}
				const events = await vexdb.get("events", { team, season });
				const matches = await vexdb.get("matches", {
					team,
					season,
					scored: 1,
				});
				const awards = await vexdb.get("awards", { team, season });
				const rankings = await vexdb.get("rankings", { team, season });
				const seasonRecord = buildRecord(team, matches);
				//embed
				const embed=new MenuUtils.Menu(message)
					.setTitle(`${record.team_name} (${record.number}) — ${season === "current" ? "Change Up" : season}`)
					.setDescription( `${record.program == "VEXU" ? "VEXU" : record.grade} Team @ ${record.organisation} (${record.city}, ${record.region})\nSeason Record: ${seasonRecord.wins}-${seasonRecord.losses}-${seasonRecord.ties} (${((100 * seasonRecord.wins) /matches.length).toFixed(2)}% WR)`)
					.addOption(`https://vexdb.io/teams/view/${record.number}`) //cus no setURL. rip
					for (let event of events) {
						const localAwards = awards.filter((award) => award.sku === event.sku);
						const ranking = rankings.find((rank) => rank.sku === event.sku);
						const eventRecord = buildRecord(
						  team,
						  matches.filter((match) => match.sku === event.sku)
						);
				  
						let output = "";
				  
						if (ranking) {
						  output += `Ranked #${ranking.rank} (${ranking.wins}-${ranking.losses}-${ranking.ties} in quals and ${eventRecord.wins}-${eventRecord.losses}-${eventRecord.ties} total)\n`;
						}
				  
						if (localAwards.length > 0) {
						  output +=
							localAwards.map((award) => award.name.split("(")[0]).join(", ") +
							"\n";
						}
				  
						if (!output || new Date(event.start).getTime() > Date.now()) {
						  output = "No Data Available";
						}
				  
						embed.addOption(
						  `${new Date(event.end).toLocaleDateString()} ${event.name}`,
						  output
						);
					  }
					  await embed.send();
					}
					else {message.channel.send("Pls enter a valid search term, im not gonna waste dem api quotas")}
			}

}

