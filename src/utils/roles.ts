import { GuildMember, Guild } from "discord.js";

/**
 * Fonction comparant le pouvoir de deux membres
 * @param member1 Le premier membre
 * @param member2 Le second membre
 * @return true si le premier a strictement plus de pouvoir que le second, false sinon
 **/
export function hasGreaterPermissions(member1 : GuildMember, member2 : GuildMember, guild : Guild) : boolean {
  if (member1.id === guild.ownerId) return true;
  if (member2.id === guild.ownerId ) return false;

  if (member1.roles.highest.position > member2.roles.highest.position ) {
    return true;
  }
  return false

}

