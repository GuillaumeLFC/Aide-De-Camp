import  GuildModel  from "./guild";
import  BagnardModel  from "./bagnard";
import {DataType, Model ,BelongsTo, Column, ForeignKey , Table, AllowNull, HasMany, Default, AutoIncrement, CreatedAt, UpdatedAt} from "sequelize-typescript";
import { throwErrorIfNull } from "../../utils/helpers";

/**
  * Table stockant toutes les configurations des eventuels goulags dans tous les serveurs
  */
@Table({tableName: "Goulags"})
export default class GoulagModel extends Model  {
  //Fields
  @Column(DataType.STRING)
  declare logsChannelId : string;
  @AllowNull
  @Column(DataType.STRING)
  declare mineChannelId : string | null;
  @Default(0)
  @Column(DataType.INTEGER)
  declare nbBagnards : number;
  @Column(DataType.STRING)
  declare bagnardRoleDiscordId : string;

  //Timestamps 
  @CreatedAt
  declare createdAt :  Date;
  @UpdatedAt
  declare updatedAt : Date;

  //Associations
  @ForeignKey(() => GuildModel)
  @Column
  declare guildId: number;
  @BelongsTo(() => GuildModel)
  declare guild : GuildModel;

  @HasMany(() => BagnardModel)
  declare bagnards : BagnardModel [];

  /**
  * Méthode permettant d'ajuster les propriétés du goulag ou de le créer si il n'existe pas pour le serveur 
  */
  static async configure(guildDiscordId : string, newLogsChannelDiscordId : string, newBagnardRoleDiscordId : string){
  try {
    let goulagDbInstance : GoulagModel | null = await GoulagModel.findOne<GoulagModel>({
      include : {
        model: GuildModel,
        required: true,
        where: {
         guildDiscordId : guildDiscordId
        }
      }
    })
    if (!goulagDbInstance) {
      const guildInstance : GuildModel = throwErrorIfNull<GuildModel>(await GuildModel.findOne({
        attributes: ['id'],
        where : { guildDiscordId : guildDiscordId}
      }), "Serveur non repertorié dans la base de données ??");
      goulagDbInstance  = GoulagModel.build({guildId : guildInstance.id});
    }
    goulagDbInstance.set({
      logsChannelId : newLogsChannelDiscordId,
      bagnardRoleDiscordId : newBagnardRoleDiscordId,
    })

    await goulagDbInstance.save();
  
  } catch (error) {
    console.error("Erreur lors de l'ajout à la base de donnée des modifications au goulag\n", error);
    throw error;
  }
  }
}
