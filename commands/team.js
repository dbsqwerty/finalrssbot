const MenuUtils = require('../structs/MenuUtils.js')
const log = require('../util/logger.js')
const moment = require('moment')
const dbOps = require('../util/dbOps.js')
const urban = require('relevant-urban');
import { Message } from "discord.js";
import * as vexdb from "vexdb";
import { MatchesResponseObject } from "vexdb/out/constants/ResponseObjects";
import Command, { Permissions } from "../lib/command";
const MatchOutcome = {
    WIN,
    TIE,
    LOSS,
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
module.exports = async (bot, message) => {
    try {
        let arr = message.content.split(" ");
        const team = arr[1].toUpperCase();
        const season = arr.slice(2).join(" ") || "current";
        console.log(team+"\n"+season);
        if (!team) {
          message.reply(
            "You didn't specify a team! Usage: `!team BCUZ` or `!team 3796B`. Optionally list a season after to get records for that seaosn"
          );
          return;
        }
    
        let record = await vexdb.get("teams", { team }).then((res) => res[0]);
    
        if (!record) {
          message.reply("There doesn't appear to be a team with that number!");
          return;
        }
    
        const events = await vexdb.get("events", { team, season });
        const matches = await vexdb.get("matches", {
          team,
          season,
          scored: 1,
        });
        const awards = await vexdb.get("awards", { team, season });
        const rankings = await vexdb.get("rankings", { team, season });
    
        // Make the season record
        const seasonRecord = buildRecord(team, matches);
    
        const embed = new MenuUtils.Menu(message)
            .setTitle(
            `${record.team_name} (${record.number}) — ${
              season === "current" ? "Change Up" : season
            }`
          )
          .setAuthor(`https://vexdb.io/teams/view/${record.number}`)
          .setDescription(
            `${record.program == "VRC" ? "VRC" : record.grade} Team @ ${
              record.organisation
            } (${record.city}, ${record.region})\nSeason Record: ${
              seasonRecord.wins
            }-${seasonRecord.losses}-${seasonRecord.ties} (${(
              (100 * seasonRecord.wins) /
              matches.length
            ).toFixed(2)}% WR)`
          );
    
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
    
        return message.channel.send(embed);
      
    
    
            
    } catch (err) {
      log.command.warning(`team`, message.guild, err)
      if (err.code !== 50013) message.channel.send(err.message).catch(err => log.command.warning('team', message.guild, err))
    }
  }
  
