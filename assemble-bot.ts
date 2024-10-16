import { Bot } from 'https://deno.land/x/grammy@v1.30.0/mod.ts';
import { config } from 'https://deno.land/x/dotenv/mod.ts';

const env = config();
const TOKEN = Deno.env.get('BOTTOKEN') || env.BOTTOKEN;
const chatID = Deno.env.get('CHATID') || env.CHATID;

if (!TOKEN) throw new Error('Något har hänt med bot-token, fråga Botfather');

const bot = new Bot(TOKEN);

await bot.api.setWebhook("https://mikaelmrten-birthdaybac-11-pchzt1711n6j.deno.dev/webhook");

export { bot, chatID };