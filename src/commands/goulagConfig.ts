import { SlashCommandBuilder } from "@discordjs/builders";
import { Command } from "../types/command";
import { PermissionFlagsBits } from "discord-api-types/v10";
import {ChannelType, ChatInputCommandInteraction, CommandInteractionOption, GuildMember, GuildTextChannelType, Role } from "discord.js";
import GoulagModel from "../database/models/goulag";

const goulagConfigCommand : Command = {
  data : new SlashCommandBuilder ()
    .setName('goulagconfig')
    .setDescription("mais où envoyer les bagnards ?")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addRoleOption(option  =>
      option.setName("bagnardrole")
            .setDescription("le role a ajouter au bagnard")
            .setRequired(true),
    )
    .addChannelOption(option => 
      option.setName("salonlogs")
            .setDescription("à quel service dois-je envoyer les rapports ?")
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText),
  ),
  async execute(interaction : ChatInputCommandInteraction) {

    try { 
      if (!interaction.inCachedGuild()) {
        await interaction.reply("Le server n'est pas mis en cache ???? Il y a une giga couille dans le paté contacte le support");
        return;
    };

      const bagnardRole : CommandInteractionOption['role'] = interaction.options.getRole('bagnardrole', true);
      const logsChannel : CommandInteractionOption['channel'] = interaction.options.getChannel<GuildTextChannelType>('salonlogs', true);
      const botMember : GuildMember = interaction.guild?.members.cache.get(interaction.client.user.id) as GuildMember; //On est sur que le membre existe vu que c'est le bot !

      if(bagnardRole.id === interaction.guildId){
        await interaction.reply({content: "Loin de moi l'idée de vouloir critiquer votre façon de faire mais cela n'aurait pas de sens d'ajouter le role par défaut aux bagnards... \nEt si vous en choisissiez un autre ?", ephemeral: true});
        return;
      }
      const higherRoleBot : Role = botMember.roles.highest;
      if (higherRoleBot.comparePositionTo(bagnardRole) <= 0){
        await interaction.reply({content: "Je n'aurais pas les permissions nécéssaires pour ajouter ce role aux bagnards ! Essayez de changer l'ordre des roles...", ephemeral: true});
        return;
      }

      const canWeSendMessage : boolean = logsChannel.permissionsFor(botMember).has(PermissionFlagsBits.SendMessages);
      const canWeSendEmbed : boolean = logsChannel.permissionsFor(botMember).has(PermissionFlagsBits.EmbedLinks);
      if (!canWeSendMessage || !canWeSendEmbed){
        await interaction.reply({content : "Je n'ai pas la permission d'envoyer des rapports dans ce salon...", ephemeral : true});
        return;
      }
      
      await GoulagModel.configure(interaction.guildId, logsChannel.id ,bagnardRole.id);

      await interaction.reply({content : "J'ai hate d'y envoyer du monde !"});

    } catch (error) {
      console.error("Erreur lors de l'execution d'une commande goulagConfig : \n" , error);
    }
  }
}

export default goulagConfigCommand;
