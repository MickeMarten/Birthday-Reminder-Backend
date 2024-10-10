import { Bot } from "https://deno.land/x/grammy@v1.30.0/mod.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";

export function assembleBot() {
  const env = config();
  const TOKEN = env.BOTTOKEN;
  if (!TOKEN) throw new Error("Något har hänt med bot-token, fråga Botfather");
  const chatID: string = env.CHATID;
  const bot = new Bot(TOKEN);
  

  return {bot, chatID}
}
