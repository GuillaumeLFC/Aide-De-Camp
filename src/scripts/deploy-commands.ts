import { REST } from "@discordjs/rest";
import {Routes } from "discord-api-types/v9";
import dotenv  from "dotenv";
import path from "path";
import fs from "fs";

dotenv.config();
const DISCORD_TOKEN: string = process.env.DISCORD_TOKEN ?? '';
const GUILD_ID : string = process.env.GUILD_ID ?? '';
const CLIENT_ID : string = process.env.CLIENT_ID ?? '';

//Error handling a refaire quand on voudra deployer des commandes globalement
if (!DISCORD_TOKEN || !GUILD_ID || !CLIENT_ID){
  console.error("Variables d'environnement mal définies");
  process.exit(1);
}

const commands  = [];
const commandsPath = path.join(__dirname, '../commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const moduleCommand = require(filePath);
  if (moduleCommand.default && moduleCommand.default.data ){
	  commands.push(moduleCommand.default.data.toJSON());
  } else {
    console.error(`Commande mal déclarée dans le ficher ${filePath}`)
  }
}

const rest : REST = new REST({version: '9'}).setToken(DISCORD_TOKEN);

rest.put(Routes.applicationGuildCommands(CLIENT_ID,GUILD_ID), {body : commands})
  .then(() => console.log("Commandes enregistrés auprès de discord !"))
  .catch(console.error);



