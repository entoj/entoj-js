'use strict';

/**
 * Requirements
 */
const PostProcessJsTask = require(JS_SOURCE + '/task/PostProcessJsTask.js').PostProcessJsTask;
const CliLogger = require('entoj-system/').cli.CliLogger;
const BuildConfiguration = require('entoj-system').model.configuration.BuildConfiguration;
const taskSpec = require('entoj-system/test').task.TaskShared;
const through2 = require('through2');
const VinylFile = require('vinyl');
const co = require('co');


/**
 * Spec
 */
describe(PostProcessJsTask.className, function()
{
    /**
     * Task Test
     */
    taskSpec(PostProcessJsTask, 'task/PostProcessJsTask', function(parameters)
    {
        const cliLogger = new CliLogger();
        cliLogger.muted = true;
        return [cliLogger];
    });


    /**
     * PostProcessSassTask Test
     */
    beforeEach(function()
    {
        global.fixtures.cliLogger = new CliLogger();
        global.fixtures.cliLogger.muted = true;
        global.fixtures.buildConfiguration = new BuildConfiguration();
        const sourceStream = through2(
            {
                objectMode: true
            });
        sourceStream.write(new VinylFile(
            {
                path: 'test.js',
                contents: new Buffer('/* add */function add(first, second) { a = 5; return first + second; }')
            }));
        sourceStream.end();
        global.fixtures.sourceStream = sourceStream;
    });

    // Creates a js build configuration
    function prepareBuildSettings(options)
    {
        const opts =
        {
            environments:
            {
                development:
                {
                    js: options
                }
            }
        };
        return new BuildConfiguration(opts);
    }


    describe('#stream()', function()
    {
        it('should not touch files when no options are set', function()
        {
            const promise = co(function *()
            {
                const testee = new PostProcessJsTask(global.fixtures.cliLogger);
                const data = yield taskSpec.readStream(testee.stream(global.fixtures.sourceStream,
                    prepareBuildSettings({})));
                for (const file of data)
                {
                    expect(file.contents.toString()).to.be.equal('/* add */function add(first, second) { a = 5; return first + second; }');
                }
            });
            return promise;
        });

        it('should inline source maps in all files when build configuration sourceMaps == true', function()
        {
            const promise = co(function *()
            {
                const testee = new PostProcessJsTask(global.fixtures.cliLogger);
                const data = yield taskSpec.readStream(testee.stream(global.fixtures.sourceStream,
                    prepareBuildSettings({ sourceMaps: true })));
                for (const file of data)
                {
                    expect(file.contents.toString()).to.contain('sourceMappingURL=data:application/json');
                }
            });
            return promise;
        });

        it('should minify all files when minify == true', function()
        {
            const promise = co(function *()
            {
                const testee = new PostProcessJsTask(global.fixtures.cliLogger);
                const data = yield taskSpec.readStream(testee.stream(global.fixtures.sourceStream,
                    prepareBuildSettings({ minify: true })));
                for (const file of data)
                {
                    expect(file.contents.toString()).to.not.contain('/* add */');
                    expect(file.contents.toString()).to.not.contain(';');
                    expect(file.contents.toString()).to.contain('first');
                }
            });
            return promise;
        });

        it('should minify all files when optimize == true', function()
        {
            const promise = co(function *()
            {
                const testee = new PostProcessJsTask(global.fixtures.cliLogger);
                const data = yield taskSpec.readStream(testee.stream(global.fixtures.sourceStream,
                    prepareBuildSettings({ optimize: true })));
                for (const file of data)
                {
                    expect(file.contents.toString()).to.not.contain('/* add */');
                    expect(file.contents.toString()).to.not.contain(';');
                    expect(file.contents.toString()).to.not.contain('first');
                }
            });
            return promise;
        });
    });
});
