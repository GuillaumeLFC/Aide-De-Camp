import { ChatInputCommandInteraction} from "discord.js";
import {SlashCommandOptionsOnlyBuilder} from "@discordjs/builders";

export interface Command {
  data: SlashCommandOptionsOnlyBuilder;
  execute : (interaction : ChatInputCommandInteraction) => Promise<void>;
}

