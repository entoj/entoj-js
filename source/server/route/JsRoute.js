'use strict';

/**
 * Requirements
 * @ignore
 */
const Route = require('entoj-system').server.route.Route;
const CliLogger = require('entoj-system').cli.CliLogger;
const PathesConfiguration = require('entoj-system').model.configuration.PathesConfiguration;
const assertParameter = require('entoj-system').utils.assert.assertParameter;


/**
 * A route to serve js files
 *
 * @memberOf server.route
 */
class JsRoute extends Route
{
    /**
     * @param {cli.CliLogger} cliLogger
     */
    constructor(cliLogger, pathesConfiguration)
    {
        super(cliLogger.createPrefixed('route.jspmroute'));

        //Check params
        assertParameter(this, 'pathesConfiguration', pathesConfiguration, true, PathesConfiguration);

        // Assign options
        this._pathesConfiguration = pathesConfiguration;
    }


    /**
     * @inheritDocs
     */
    static get injections()
    {
        return { 'parameters': [CliLogger, PathesConfiguration] };
    }


    /**
     * @inheritDocs
     */
    static get className()
    {
        return 'server.route/JsRoute';
    }


    /**
     * @type {model.configuration.PathesConfiguration}
     */
    get pathesConfiguration()
    {
        return this._pathesConfiguration;
    }


    /**
     * @inheritDocs
     */
    register(server)
    {
        const promise = super.register(server);
        promise.then(() =>
        {
            this.addStaticFileHandler('/*', this.pathesConfiguration.sites, ['.js', '.json']);
        });
        return promise;
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.JsRoute = JsRoute;
