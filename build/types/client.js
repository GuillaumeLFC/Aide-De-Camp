"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomClient = void 0;
const discord_js_1 = require("discord.js");
/*
 * Cette classe permet de stocker proprement les commandes prises en charges par le bot
  */
class CustomClient extends discord_js_1.Client {
    constructor() {
        super(...arguments);
        this.commands = new discord_js_1.Collection;
    }
}
exports.CustomClient = CustomClient;
