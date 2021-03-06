/*
* slack-bot
* https://github.com/usubram/slack-bot
*
* Copyright (c) 2017 Umashankar Subramanian
* Licensed under the MIT license.
*/

'use strict';

// Load modules
const uuid = require('uuid');
const path = require('path');
const url = require('url');

const externals = {};
const internals = {};

/**
*
* Represents the state and events for custom webhook.
*
*/
externals.Hook = class {
  /**
  * Creates a new Hook instance.
  * @param {string} botId bot id.
  * @param {object} server http server instance.
  *
  * @class
  */
  constructor (botId, server) {
    this.botId = botId;
    this.server = server;
    this.purpose = {};
  }

  /**
  * Function to generate hook.
  * @param {string} purposeId unique uuid for hook identifier.
  *
  * @return {Object} Hook details for the given purpose id.
  */
  generateHook (purposeId) {
    this.purpose[purposeId] = internals.generateHookId();

    return this.purpose[purposeId];
  }

  /**
  * Function to get generated hook.
  * @param {string} purposeId unique uuid for hook identifier.
  *
  * @return {Object} Hook details for the input purpose id.
  */
  getHookPurpose (purposeId) {
    if (!this.server) {
      return;
    }

    if (!this.purpose[purposeId] || !this.purpose[purposeId].id) {
      this.purpose[purposeId] = this.purpose[purposeId] || {};
      this.purpose[purposeId].id = internals.generateHookId();
    }

    this.purpose[purposeId].url = internals
      .getHookUrl(this, this.purpose[purposeId], this.server);

    return this.purpose[purposeId];
  }
};

/**
* Function to get uuid for hook.
*
* @return {string} unique uuid.
*/
internals.generateHookId = function () {
  return uuid.v4();
};

/**
* Function to get uuid for hook.
*
* @param {object} context hook context.
* @param {object} purpose hook instance.
* @param {object} server http server instance.
*
* @return {object} standard url object.
*/
internals.getHookUrl = function (context, purpose, server) {
  const urlObj = {};

  if (server.address().address === '::' ||
    server.address().address === '127.0.0.1') {
    urlObj.hostname = '0.0.0.0';
  } else {
    urlObj.hostname = server.address().address;
  }

  urlObj.port = server.address().port;
  urlObj.protocol = server.address().protocol || 'http';
  urlObj.pathname = path.join('hook', context.botId, purpose.id);

  return url.format(urlObj, false);
};

module.exports = externals.Hook;
