import { AllowNull, Column, CreatedAt, HasOne, Model,  Table, UpdatedAt } from "sequelize-typescript";
import  GoulagModel  from "./goulag";

/**
  * Table qui stocke tous les serveurs du bot
  */
@Table({tableName: 'Guilds'})
export default class GuildModel extends Model {
  //Fields
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
}

GuildModel.hasOne(GoulagModel);
