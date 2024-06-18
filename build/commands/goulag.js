"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const v10_1 = require("discord-api-types/v10");
const sanitization_1 = require("../utils/sanitization");
const roles_1 = require("../utils/roles");
const goulag_1 = require("../lib/goulag");
/**
 * Commande permettant d'envoyer au goulag les éléments pertubateurs
**/
const goulagCommand = {
    data: new builders_1.SlashCommandBuilder()
        .setName('goulag')
        .setDefaultMemberPermissions(v10_1.PermissionFlagsBits.ModerateMembers)
        .setDMPermission(false)
        .setDescription("Envoyons le au goulag sans autre forme de procès")
        .addUserOption(option => option.setName('soldat')
        .setDescription("Le soldat dissident")
        .setRequired(true))
        .addStringOption(option => option.setName("prétexte")
        .setDescription("Ça fait très joli sur les rapports")
        .setRequired(false))
        .addIntegerOption(option => option.setName("durée")
        .setDescription("Le temps de son séjour en minutes")
        .setRequired(false)), //Typescript a visiblement pas compris le type
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!interaction.inCachedGuild()) {
                    yield interaction.reply("Le server n'est pas mis en cache ???? Il y a une giga couille dans le paté mentionne CX");
                    return;
                }
                ;
                const cible = interaction.options.getMember("soldat");
                if (!cible) {
                    yield interaction.reply({ content: "Tiens ? Je n'ai trouvé aucun soldat de ce nom dans les dossiers administratifs, êtes vous sûr de son nom ?", ephemeral: true });
                    return;
                }
                const commanditaire = interaction.member;
                const motif = (0, sanitization_1.sanitizeStringJS)(interaction.options.getString("prétexte", false));
                const dureeMinutes = interaction.options.getInteger("durée", false);
                if (!(0, roles_1.hasGreaterPermissions)(commanditaire, cible, interaction.guild)) {
                    yield interaction.reply("Navré, le pot de vin n'est pas suffisant pour que j'envoie au goulag un de tes supérieurs.");
                    return;
                }
                if (!cible.manageable) {
                    yield interaction.reply({ content: `Oula si je donnais l'ordre d'envoyer ${cible.displayName} au goulag, je me ferais executer sur place ! \nÊtes vous sûr que j'ai l'accréditation nécéssaire ?`, ephemeral: true });
                }
                yield interaction.reply("https://tenor.com/view/swat-gif-17979428");
                try {
                    yield (0, goulag_1.envoyerGoulag)(cible, commanditaire, motif, dureeMinutes);
                }
                catch (goulagError) {
                }
            }
            catch (error) {
                console.error(error);
                yield interaction.reply({ content: "Aie, un problème est survenu :(", ephemeral: true });
            }
        });
    },
};
exports.default = goulagCommand;
