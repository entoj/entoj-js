'use strict';

/**
 * Configure path
 */
const path = require('path');
global.JS_SOURCE = path.resolve(__dirname + '/../source');
global.JS_FIXTURES = path.resolve(__dirname + '/__fixtures__');
global.JS_TEST = __dirname;


/**
 * Configure chai
 */
const chai = require('chai');
chai.config.includeStack = true;
global.expect = chai.expect;
