import { Intents, Collection } from "discord.js";
import {CustomClient} from "./types/client";
import dotenv  from "dotenv";
import  fs  from "node:fs";
import path  from "node:path";
import { Command } from "./types/command";

dotenv.config();
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

const client : CustomClient = new CustomClient({intents: [Intents.FLAGS.GUILDS] });


client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const commandModule = require(filePath);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	if (commandModule.default && commandModule.default.data && commandModule.default.execute){
    client.commands.set(commandModule.default.data.name, commandModule.default);
  }else {
    console.error(`Commande mal déclarée dans le fichier ${filePath}`)
  }
}

client.once('ready', () => {
  console.log("Bot lancé !");
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const command : Command | undefined = client.commands.get(interaction.commandName);

  try {
    await command?.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({content : "Oh oh il y a eu un problème :(", ephemeral: true});
  }
});

client.login(DISCORD_TOKEN);
