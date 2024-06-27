import { SlashCommandBuilder } from "@discordjs/builders";
import {ChatInputCommandInteraction, GuildMember } from "discord.js";
import { PermissionFlagsBits} from "discord-api-types/v10"
import { Command } from "../types/command";
import { sanitizeStringJS } from "../utils/sanitization";
import { hasGreaterPermissions } from "../utils/roles";
import { envoyerGoulag } from "../lib/goulag";

/**
 * Commande permettant d'envoyer au goulag les éléments pertubateurs
**/
const goulagCommand : Command = {
  data: new SlashCommandBuilder ()
    .setName('goulag')
    .setDefaultMemberPermissions(
      PermissionFlagsBits.ModerateMembers
    )
    .setDMPermission(false)
    .setDescription("Envoyons le au goulag sans autre forme de procès")
    .addUserOption(option => 
      option.setName('soldat')
            .setDescription("Le soldat dissident")
            .setRequired(true),
    )
    .addStringOption(option => 
      option.setName("prétexte")
            .setDescription("Ça fait très joli sur les rapports")
            .setRequired(false)
    )
    .addIntegerOption(option => 
      option.setName("durée")
            .setDescription("Le temps de son séjour en minutes")
            .setRequired(false)
  ),
    
  async execute (interaction : ChatInputCommandInteraction) { 
   
    try {
       if (!interaction.inCachedGuild()) {
        await interaction.reply("Le server n'est pas mis en cache ???? Il y a une giga couille dans le paté contacte le support");
        return;
    };

      const cible : GuildMember | null = interaction.options.getMember("soldat")
      if (!cible) {
        await interaction.reply({content : "Tiens ? Je n'ai trouvé aucun soldat de ce nom dans les dossiers administratifs, êtes vous sûr de son nom ?", ephemeral : true});
        return;
      }
      const commanditaire : GuildMember = interaction.member;
      const motif : string | null = sanitizeStringJS(interaction.options.getString("prétexte", false));
      const dureeMinutes : number | null = interaction.options.getInteger("durée", false);

      if (!hasGreaterPermissions(commanditaire, cible, interaction.guild)){
        await interaction.reply("Navré, le pot de vin n'est pas suffisant pour que j'envoie au goulag un de tes supérieurs.")
        return;
      }
      
      if (!cible.manageable){
        await interaction.reply({content : `Oula si je donnais l'ordre d'envoyer ${cible.displayName} au goulag, je me ferais executer sur place ! \nÊtes vous sûr que j'ai l'accréditation nécéssaire ?`, ephemeral: true});
        return;
      }
      await interaction.reply("https://tenor.com/view/swat-gif-17979428");
      try {
        await envoyerGoulag(cible, commanditaire,motif, dureeMinutes);
      } catch (goulagError) {

      }
    } catch (error) {
      console.error(error);
    }
    },
};

export default goulagCommand;
