import { Bot } from 'grammy';
import { BOT_TOKEN } from './config';
import { startHandler } from './handlers/start';
import { contactHandler } from './handlers/contact';
import { adminCallbacks } from './handlers/admin-callbacks';
import { leadsHandler } from './handlers/leads';
import { broadcastHandler } from './handlers/broadcast';
import { supportHandler } from './handlers/support';
import { inlineQueryHandler } from './handlers/inline-query';
import { adminOnly } from './middlewares/role.middleware';
import { startAbandonedTestCron } from './cron/abandoned-tests';

const bot = new Bot(BOT_TOKEN);

bot.command('start', startHandler);
bot.command('leads', adminOnly, leadsHandler);
bot.command('broadcast', adminOnly, broadcastHandler);
bot.command('support', supportHandler);
bot.on(':contact', contactHandler);
bot.callbackQuery(/^admin:/, adminCallbacks);
bot.on('inline_query', inlineQueryHandler);
startAbandonedTestCron(bot);

bot.start();