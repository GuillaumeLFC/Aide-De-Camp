import  GuildModel  from "./guild";
import  BagnardModel  from "./bagnard";
import {DataType, Model ,BelongsTo, Column, ForeignKey , Table, AllowNull, HasMany, Default, CreatedAt, UpdatedAt} from "sequelize-typescript";
import { throwErrorIfNull } from "../../utils/helpers";

/**
  * Table stockant toutes les configurations des eventuels goulags dans tous les serveurs
  */
@Table({tableName: "Goulags"})
export default class GoulagModel extends Model  {
  /**
   * ID du canal de logs Discord
   */
  @Column(DataType.STRING)
  declare logsChannelId: string;

  /**
   * ID du canal de mine Discord (peut être null)
   */
  @AllowNull
  @Column(DataType.STRING)
  declare mineChannelId: string | null;

  /**
   * Nombre de bagnards (prisonniers) dans le goulag
   */
  @Default(0)
  @Column(DataType.INTEGER)
  declare nbBagnards: number;

  /**
   * ID du rôle de bagnard Discord
   */
  @Column(DataType.STRING)
  declare bagnardRoleDiscordId: string;

  /**
   * Date de création de l'entrée dans la base de données
   */
  @CreatedAt
  declare createdAt: Date;

  /**
   * Date de dernière mise à jour de l'entrée dans la base de données
   */
  @UpdatedAt
  declare updatedAt: Date;

  /**
   * ID de la guilde (serveur Discord) associée
   */
  @ForeignKey(() => GuildModel)
  @Column
  declare guildId: number;

  /**
   * Référence à la guild (serveur Discord) associée
   */
  @BelongsTo(() => GuildModel)
  declare guild: GuildModel;

  /**
   * Liste des références des bagnards (prisonniers) dans le goulag
   */
  @HasMany(() => BagnardModel)
  declare bagnards: BagnardModel[];

  /**
  * Méthode permettant d'ajuster les propriétés du goulag ou de le créer si il n'existe pas pour le serveur 
  * @param guildDiscordId - ID du serveur Discord
  * @param newLogsChannelDiscordId - ID du nouveau canal de logs Discord
  * @param newBagnardRoleDiscordId - ID du nouveau rôle de bagnard Discord
  */
  static async configure(guildDiscordId : string, newLogsChannelDiscordId : string, newBagnardRoleDiscordId : string){
  try {
    await GuildModel.registerGuild(guildDiscordId);
    const guildInstance : GuildModel = throwErrorIfNull<GuildModel>(await GuildModel.findOne({
        attributes: ['id'],
        where : { guildDiscordId : guildDiscordId}
      }), "Serveur non repertorié dans la base de données ? Comment est-ce possible on vient de l'enregistrer !");

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
