'use strict';

/**
 * Requirements
 */
const JsLinter = require(JS_SOURCE + '/linter/JsLinter.js').JsLinter;
const linterSpec = require('entoj-system/test').linter.LinterShared;


/**
 * Spec
 */
describe(JsLinter.className, function()
{
    /**
     * JsLinter Fixture
     */
    const fixture =
    {
        source: 'var a="1";',
        warningRules: { 'quotes': [1, 'single'] },
        warningCount: 1
    };

    /**
     * Linter Test
     */
    linterSpec(JsLinter, 'linter/JsLinter', fixture);
});
