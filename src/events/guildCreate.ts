import { Events, Guild } from "discord.js";
import GuildModel from "../database/models/guild"

module.exports = {
  name : Events.GuildCreate,
  async execute(guild : Guild){
    try {
      await GuildModel.registerGuild(guild.id);
    } catch (error) {
      console.error("Problème lors de l'ajout d'un serveur à la base de donnée : \n", error);
    }
  }
}
