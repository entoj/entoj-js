'use strict';

/**
 * Requirements
 */
const JsRoute = require(JS_SOURCE + '/server/route/JsRoute.js').JsRoute;
const routeSpec = require('entoj-system/test').server.RouteShared;
const projectFixture = require('entoj-system/test').fixture.project;
const request = require('supertest');


/**
 * Spec
 */
describe(JsRoute.className, function()
{
    /**
     * Route Test
     */
    routeSpec(JsRoute, 'server.route/JsRoute', function(parameters)
    {
        const fixture = projectFixture.createStatic();
        return [fixture.cliLogger, fixture.pathesConfiguration];
    });


    /**
     * StaticFileRoute Test
     */

    // Create a initialized testee
    const createTestee = function(allowedExtensions)
    {
        const fixture = projectFixture.createStatic();
        return new JsRoute(fixture.cliLogger, fixture.pathesConfiguration);
    };


    describe('serving...', function()
    {
        it('should serve js files from the sites directory', function(done)
        {
            const testee = createTestee();
            routeSpec.createServer([testee]);
            global.fixtures.server.addRoute(testee);
            global.fixtures.server.start().then(function(server)
            {
                request(server)
                    .get('/base/modules/m-teaser/js/m-teaser.js')
                    .expect(200, done);
            });
        });
    });
});
