import { Column, CreatedAt, HasOne, Model,  Table, Unique, UpdatedAt } from "sequelize-typescript";
import  GoulagModel  from "./goulag";

/**
  * Table qui stocke tous les serveurs du bot
  */
@Table({tableName: 'Guilds'})
export default class GuildModel extends Model {
  //Field
  @Unique
  @Column
  declare guildDiscordId: string;
  
  //Timestamps
  @CreatedAt
  declare readonly createdAt: Date;
  @UpdatedAt
  declare readonly updatedAt:Date
  
  //Associations
  @HasOne(() => GoulagModel)
  declare goulag : GoulagModel | null;

  public static async registerGuild(guildDiscordId : string){
    try {
      if (await GuildModel.findOne({where : {guildDiscordId: guildDiscordId}})){
        return;
      }
      await GuildModel.create({guildDiscordId: guildDiscordId});
    } catch (error) {
      console.error("Erreur lors de l'ajout à la base de donnée d'un serveur : \n", error);
      throw error;
    }
  }
}

