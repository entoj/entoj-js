'use strict';

/**
 * Requirements
 */
const JsFileParser = require(JS_SOURCE + '/parser/documentation/JsFileParser.js').JsFileParser;
const fileParserSpec = require('entoj-system/test').parser.FileParserShared;


/**
 * Spec
 */
describe(JsFileParser.className, function()
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
    fileParserSpec(JsFileParser, 'parser.documentation/JsFileParser', fixture);
});
