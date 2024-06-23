import { Intents, Collection } from "discord.js";
import {CustomClient} from "./types/client";
import  fs  from "node:fs";
import path  from "node:path";
import { Command } from "./types/command";
import { sequelize, DatabaseConnection } from "./database/sequelize"

//Ce code est nécessaire pour bien fermer les connections à la base de donnée en cas d'erreurs 

async function shutdown() {
  try {
    await sequelize.close();
    console.log("Connexion à la base de donnée fermée");
    process.exit(0);
  } catch (error) {
    console.error("Impossible de fermer la connexion à la base de donnée !", error);
    process.exit(1);
  }
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  shutdown();
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  shutdown();
});

DatabaseConnection();

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
