import  GuildModel  from "./guild";
import  BagnardModel  from "./bagnard";
import {DataType, Model ,BelongsTo, Column, ForeignKey , Table, AllowNull, HasMany, Default, AutoIncrement, CreatedAt, UpdatedAt} from "sequelize-typescript";

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
  @AutoIncrement
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
}
GoulagModel.belongsTo(GuildModel, {
    foreignKey : {
    name : 'guildId',
    allowNull: false,
  }
})
GoulagModel.hasMany(BagnardModel, {
  as : 'bagnards',
})
