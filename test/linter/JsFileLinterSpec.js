'use strict';

/**
 * Requirements
 */
const JsFileLinter = require(JS_SOURCE + '/linter/JsFileLinter.js').JsFileLinter;
const fileLinterSpec = require('entoj-system/test').linter.FileLinterShared;


/**
 * Spec
 */
describe(JsFileLinter.className, function()
{
    /**
     * JsFileLinter Fixture
     */
    const fixture =
    {
        root: require('entoj-system/test').fixture.files,
        glob: ['/mixed/*.js', '/js/*.js'],
        globCount: 2
    };

    /**
     * FileLinter Test
     */
    fileLinterSpec(JsFileLinter, 'linter/JsFileLinter', fixture);
});
