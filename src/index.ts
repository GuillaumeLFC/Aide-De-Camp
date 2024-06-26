import { ClientEvents, Collection, GatewayIntentBits } from "discord.js";
import {CustomClient} from "./types/client";
import  fs  from "node:fs";
import path  from "node:path";
import { sequelize, DatabaseConnection } from "./database/sequelize"
import { configDotenv } from "dotenv";

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


const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

const client : CustomClient = new CustomClient({intents: [GatewayIntentBits.Guilds] });

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

// TODO : ce code pour importer les events n'est pas du bon typescript, il faut le refaire pour garantir un bon typage
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

async function main(){
  await DatabaseConnection();
  client.login(DISCORD_TOKEN);
}
main();
