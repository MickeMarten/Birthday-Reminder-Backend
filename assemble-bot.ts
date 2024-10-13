import { Bot } from "https://deno.land/x/grammy@v1.30.0/mod.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";

const env = config();
const TOKEN = env.BOTTOKEN;
console.log('tokej',TOKEN);
if (!TOKEN) throw new Error("Något har hänt med bot-token, fråga Botfather");

const bot = new Bot(TOKEN);

bot.command("start", (ctx) => ctx.reply("Bot is awake"));

export default bot; 