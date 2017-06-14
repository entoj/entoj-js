/**
 * Requirements
 */
const JsPlugin = require(JS_SOURCE + '/model/loader/documentation/JsPlugin.js').JsPlugin;
const projectFixture = require('entoj-system/test').fixture.project;
const loaderPluginSpec = require('entoj-system/test').model.loader.LoaderPluginShared;


/**
 * Spec
 */
describe(JsPlugin.className, function()
{
    /**
     * LoaderPlugin Test
     */
    loaderPluginSpec(JsPlugin, 'model.loader.documentation/JsPlugin', function(params)
    {
        params.unshift(global.fixtures.pathesConfiguration);
        return params;
    });


    /**
     * JsPlugin Test
     */
    beforeEach(function()
    {
        global.fixtures = projectFixture.createStatic();
    });
});
