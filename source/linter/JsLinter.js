'use strict';

/**
 * Requirements
 * @ignore
 */
const Linter = require('entoj-system').linter.Linter;
const CLIEngine = require('eslint/lib/cli-engine');


/**
 * A javascript linter
 */
class JsLinter extends Linter
{
    /**
     * @param {Object} options
     */
    constructor(rules, options)
    {
        super();

        const opts = options || {};
        const ruleMap = rules || {};
        const linterOptions =
        {
            useEslintrc: opts.useDefaultRules || false
        };
        if (Object.keys(ruleMap).length)
        {
            linterOptions.rules = ruleMap;
        }
        if (!opts.useDefaultRules)
        {
            linterOptions.envs = opts.envs || ['es6', 'browser', 'amd'];
            linterOptions.globals = opts.globals || ['window: true'];
            if (opts.ecmaFeatures)
            {
                linterOptions.parserOptions.ecmaFeatures = opts.ecmaFeatures;
            }
        }
        this._linter = new CLIEngine(linterOptions);
    }


    /**
     * @inheritDocs
     */
    static get injections()
    {
        return { 'parameters': ['linter/JsLinter.rules', 'linter/JsLinter.options'] };
    }


    /**
     * @inheritDocs
     */
    static get className()
    {
        return 'linter/JsLinter';
    }


    /**
     * @type {eslint}
     */
    get linter()
    {
        return this._linter;
    }


    /**
     * @inheritDocs
     */
    lint(content, options)
    {
        if (!content || content.trim() === '')
        {
            return Promise.resolve(
                {
                    success: true,
                    errorCount: 0,
                    warningCount: 0,
                    messages:[]
                });
        }

        const linted = this.linter.executeOnText(content);
        const result =
        {
            success: (linted.errorCount == 0 && linted.warningCount == 0),
            errorCount: linted.errorCount,
            warningCount: linted.warningCount,
            messages: linted.results[0].messages
        };

        const opts = options || {};
        const scope = this;
        result.messages = result.messages.map(function(message)
        {
            if (opts.filename)
            {
                message.filename = opts.filename;
            }
            message.linter = scope.className;
            return message;
        });

        return Promise.resolve(result);
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.JsLinter = JsLinter;
