/**
 * Requirements
 */
const JsParser = require(JS_SOURCE + '/parser/documentation/JsParser.js').JsParser;
const parserSpec = require('entoj-system/test').parser.ParserShared;


/**
 * Spec
 */
describe(JsParser.className, function()
{
    /**
     * Parser Test
     */
    parserSpec(JsParser, 'parser.documentation/JsParser');
});
