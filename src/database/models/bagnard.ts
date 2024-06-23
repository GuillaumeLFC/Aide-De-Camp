import {Table, Model ,DataType, Column, AllowNull, BelongsTo, ForeignKey, BelongsToMany, CreatedAt, UpdatedAt} from "sequelize-typescript";
import  MemberModel  from "./guild";
import  RoleModel from "./roles";
import BagnardRoles from "./bagnardrole";
import GoulagModel from "./goulag";

/**
  * Table stockant tous les bagnards actuellement au goulag
  */
@Table({tableName: 'Bagnards'})
export default class BagnardModel extends Model {
  // Fields
  @AllowNull
  @Column(DataType.DATE)
  declare liberationDate ?: Date| null;
  @AllowNull
  @Column(DataType.STRING)
  declare motif ?: string | null;
  @AllowNull
  @Column(DataType.INTEGER)
  declare dureeMinutes ?: number | null;
  @AllowNull
  @Column(DataType.NUMBER) 
  declare nbMinage?: number | null;

  //Timestamps
  @CreatedAt
  declare createdAt : Date;
  @UpdatedAt
  declare updatedAt : Date

  //Associations declarations
  @ForeignKey(() => MemberModel)
  @Column
  declare memberId : number;
  @BelongsTo(() => MemberModel, 'memberId')
  declare member : MemberModel;

  @ForeignKey(() => MemberModel)
  @Column
  declare commanditaireId : number
  @BelongsTo(() => MemberModel, 'commanditaireId')
  declare commanditaire : MemberModel;

  @ForeignKey(() => GoulagModel)
  declare goulagId : number 
  @BelongsTo(() => GoulagModel)
  declare goulag : GoulagModel;

  @BelongsToMany(() => RoleModel, () => BagnardRoles)
  declare bagnardRoles : RoleModel [];
}

//Associations

BagnardModel.belongsTo(MemberModel,{
    as : 'memberId',
    foreignKey: { allowNull: false}
  });

BagnardModel.belongsTo(MemberModel, {
  as: 'commanditaireId',
  foreignKey: {allowNull: false}
})

BagnardModel.belongsToMany(RoleModel, {
  as: 'bagnardId',
  through : BagnardRoles});

