import {Sequelize  } from "sequelize-typescript";
import {Namespace, createNamespace} from "cls-hooked";
import GoulagModel from "./models/goulag";
import BagnardModel from "./models/bagnard";
import GuildModel from "./models/guild";
import MemberModel from "./models/member";
import BagnardRoleModel from "./models/bagnardrole";
import RoleModel from "./models/roles";

const POSTGRES_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME  = process.env.DB_NAME;

const namespace : Namespace = createNamespace("aide-de-camp")
Sequelize.useCLS(namespace);

//@ts-ignore
//Le test pour savoir si les variables sont bien définies sera effectué dans la fonction de test de connexion
export const sequelize : Sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host : POSTGRES_HOST,
  dialect : "postgres",
  models: ['./models/']
  // models : [GuildModel, GoulagModel, MemberModel, BagnardRoleModel, RoleModel, BagnardModel]
});

export async function DatabaseConnection() {
  if (!POSTGRES_HOST ||  !DB_USER ||  !DB_PASSWORD || ! DB_NAME){
    console.error("Variable d'environnement manquante pour l'initialisation de la base de donnée");
    process.exit(1);
  }
  try { 
    // FIXME : Il faudrait que pouvoir utiliser la ligne commentée si dessous pour importer dynamiquement les modèles et ne pas avoir à les délcarer explicitement comme çi dessous
    // sequelize.addModels([__dirname + './models/'])
    sequelize.addModels([GuildModel, GoulagModel, MemberModel, BagnardRoleModel, RoleModel, BagnardModel]); 

    await sequelize.authenticate();
    console.log("Connection réussie à la base de donnée !")
    try {
      await sequelize.sync({alter: true});
      console.log("Base de donnée synchronisée !");
    } catch (error) {
      console.error("Erreur lors de la synchronisation de la base de donnée : \n", error);
      process.exit(1);
    }
  } catch (error) {
    console.error("Problème lors de la connexion à la base de donnée :", error);
    process.exit(1);
  }
}

