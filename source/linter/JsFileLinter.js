'use strict';

/**
 * Requirements
 * @ignore
 */
const FileLinter = require('entoj-system').linter.FileLinter;
const JsLinter = require('./JsLinter.js').JsLinter;


/**
 * A js file linter
 */
class JsFileLinter extends FileLinter
{
    /**
     * @param {Object} options
     */
    constructor(rules, options)
    {
        super(rules, options);

        const opts = options || {};
        this._linter = new JsLinter(rules || {}, opts);
        this._glob = opts.glob || ['/js/*.js'];
    }


    /**
     * @inheritDocs
     */
    static get injections()
    {
        return { 'parameters': ['linter/JsFileLinter.rules', 'linter/JsFileLinter.options'] };
    }


    /**
     * @inheritDocs
     */
    static get className()
    {
        return 'linter/JsFileLinter';
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.JsFileLinter = JsFileLinter;
