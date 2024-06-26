import { Table, Column, DataType, Model } from "sequelize-typescript";
import GuildModel from "./guild";

/**
  * Table qui stocke tous les membres à qui le bot a eu affaire (Un membre est spécifique a un serveur et il peut donc il y avoir plusieurs membres pour le meme utilisateur) 
  */
@Table({tableName: 'Members'})
export default class MemberModel extends Model {
  @Column(DataType.STRING)
  declare userId : string;
}

