const guildConfig = require('../util/guildConfig.js');
const util = require('../lib/util.js');
const axios = require('axios');

const command = {};

command.description = 'Specify the Zendesk help center';

command.usage = 'example.zendesk.com|example|disabled';

command.names = ['helpcenter'];

command.execute = async (message, args, database, bot) => {
    //Permission check
    if (!message.member.hasPermission('MANAGE_GUILD')) {
        await message.channel.send('You need the "Manage Server" permission to use this command.');
        return;
    }

    if (!args[0]) {
      await message.react(util.icons.error);
      await message.channel.send("Please provide a Zendesk subdomain e.g. https://example.zendesk.com");
      return;
    }

    let subdomain = args.shift().replace(/^https?:\/\/|\.zendesk\.com(\/.*)?$/ig, '').replace(/[^a-zA-Z\d]/g, '');

    if (!subdomain || !subdomain.length) {
      await message.react(util.icons.error);
      await message.channel.send("Please provide a Zendesk subdomain e.g. https://example.zendesk.com");
      return;
    }

    if (["off","disabled","none"].includes(subdomain)) {
      subdomain = null;
    }
    else {
      try {
        await axios.get(`https://${subdomain}.zendesk.com/api/v2/help_center/articles.json`);
      } catch (e) {
        await message.channel.send('This is not a valid helpcenter subdomain!');
        return;
      }
    }

    let config = await util.getGuildConfig(message);
    config.helpcenter = subdomain;
    await util.saveGuildConfig(config);

    if (subdomain) {
      await message.channel.send(`Set helpcenter to https://${subdomain}.zendesk.com`);
    }
    else {
      await message.channel.send(`Disabled helpcenter`);
    }
};

module.exports = command;