import {Client, Events} from "discord.js"
import {CustomEvent} from "../types/event"

// TODO : le code commenté ci dessous utilise une class safe pour représenter les events mais elle n'est pas importable pour l'instant, il faut modifier le code dans index.ts puis réutiliser cette bonne classe.

// export const eventReady : CustomEvent<Events.ClientReady> = new CustomEvent<Events.ClientReady>(Events.ClientReady,
//   (client : Client) =>{
//     console.log("Bot lancé");
//   },
//   true, //La propriété once
// )

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(){
    console.log("Bot lancé !");
  }
}

