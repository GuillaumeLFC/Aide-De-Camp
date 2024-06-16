"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
const rest_1 = require("@discordjs/rest");
const v9_1 = require("discord-api-types/v9");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
dotenv_1.default.config();
const DISCORD_TOKEN = (_a = process.env.DISCORD_TOKEN) !== null && _a !== void 0 ? _a : '';
const GUILD_ID = (_b = process.env.GUILD_ID) !== null && _b !== void 0 ? _b : '';
const CLIENT_ID = (_c = process.env.CLIENT_ID) !== null && _c !== void 0 ? _c : '';
//Error handling a refaire quand on voudra deployer des commandes globalement
if (!DISCORD_TOKEN || !GUILD_ID || !CLIENT_ID) {
    console.error("Variables d'environnement mal définies");
    process.exit(1);
}
const commands = [];
const commandsPath = path_1.default.join(__dirname, '../commands');
const commandFiles = fs_1.default.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const filePath = path_1.default.join(commandsPath, file);
    const moduleCommand = require(filePath);
    if (moduleCommand.default && moduleCommand.default.data) {
        commands.push(moduleCommand.default.data.toJSON());
    }
    else {
        console.error(`Commande mal déclarée dans le ficher ${filePath}`);
    }
}
const rest = new rest_1.REST({ version: '9' }).setToken(DISCORD_TOKEN);
rest.put(v9_1.Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands })
    .then(() => console.log("Commandes enregistrés auprès de discord !"))
    .catch(console.error);
