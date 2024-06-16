import { SlashCommandBuilder } from "@discordjs/builders";
import {CommandInteraction, } from "discord.js";
import { Command } from "../types/command";

/*
 * Commande permettant d'envoyer au goulag les éléments pertubateurs
  */
const goulagCommand : Command = {
  data: new SlashCommandBuilder()
    .setName('goulag')
    .setDescription('Envoie la cible au goulag sans autre forme de procès'),
  async execute (interaction : CommandInteraction) { 
    await interaction.reply("On va le chercher");
  },
};

export default goulagCommand;
