import { ChatInputCommandInteraction, Client, Events, Interaction } from "discord.js";
import {CustomEvent} from "../types/event";
import { CustomClient } from "../types/client";
import { Command } from "../types/command";

// TODO : le code commenté ci dessous utilise une class safe pour représenter les events mais elle n'est pas importable pour l'instant, il faut modifier le code dans index.ts puis réutiliser cette bonne classe.

// export const interactionCreate : CustomEvent<Events.InteractionCreate> = new CustomEvent<Events.InteractionCreate>(Events.InteractionCreate,
//   async (client : CustomClient, interaction : Interaction) => {
//  if (!interaction.isCommand()) return;
//
//   const command : Command | undefined = client.commands.get(interaction.commandName);
//
//   try {
//     await command?.execute(interaction);
//   } catch (error) {
//     console.error(error);
//     if (interaction.replied || interaction.deferred){
//       await interaction.followUp({content : "Oh oh il y a eu un problème :(", ephemeral: true})
//     } else {
//       await interaction.reply({content : "Aie j'ai eu un problème lors de l'execution de la commande :(", ephemeral: true});
//     }
//   }
// })

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction : ChatInputCommandInteraction ) {
  if (!interaction.isCommand()) return;

  const command : Command | undefined = (interaction.client as CustomClient).commands.get(interaction.commandName);

  try {
    await command?.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred){
      await interaction.followUp({content : "Oh oh il y a eu un problème :(", ephemeral: true})
    } else {
      await interaction.reply({content : "Aie j'ai eu un problème lors de l'execution de la commande :(", ephemeral: true});
    }
  }

  }
}
