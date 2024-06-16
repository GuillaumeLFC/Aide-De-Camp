import { Client,Collection } from "discord.js";
import { Command } from "./command";

/*
 * Cette classe permet de stocker proprement les commandes prises en charges par le bot
  */
export class CustomClient extends Client {
  public commands: Collection<string, Command> = new Collection;
}
