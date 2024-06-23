import {AllowNull, BelongsToMany, Column, DataType, Model, Table } from "sequelize-typescript";
import BagnardModel from "./bagnard";
import BagnardRole from "./bagnardrole";

/**
  * Table qui stocke tous les roles ayant appartenus à des bagnards
  */
@Table({tableName : "Roles"})
export default class RoleModel extends Model {
  
  @Column(DataType.STRING)
  declare discordId : string;
  @AllowNull
  @Column(DataType.STRING)
  declare roleName?: string | null;

  @BelongsToMany(() => BagnardModel, () => BagnardRole)
  declare bagnards: BagnardModel [];
}
RoleModel.belongsToMany(BagnardModel, {through: BagnardRole, uniqueKey: 'roleId'});
