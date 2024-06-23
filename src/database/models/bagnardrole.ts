import { Column, ForeignKey, Model, Table } from "sequelize-typescript";
import BagnardModel from "./bagnard";
import RoleModel from "./roles";

/**
  * Table de jonction pour la relation ManyToMany() de Sequelize 
  *
  * @see https://sequelize.org/docs/v6/core-concepts/assocs/#many-to-many-relationships  
  */
@Table({tableName: 'BagnardRoles'})
export default class BagnardRoleModel extends Model {
  @ForeignKey(()=> BagnardModel)
  @Column
  declare bagnardId : number
  
  @ForeignKey(() => RoleModel)
  @Column
  declare roleId : number;
}
