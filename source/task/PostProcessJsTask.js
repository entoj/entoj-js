'use strict';

/**
 * Requirements
 * @ignore
 */
const TransformingTask = require('entoj-system').task.TransformingTask;
const CliLogger = require('entoj-system').cli.CliLogger;
const ErrorHandler = require('entoj-system').error.ErrorHandler;
const VinylFile = require('vinyl');
const co = require('co');
const uglifyJs = require('uglify-js');


/**
 * @memberOf task
 * @extends task.TransformingTask
 */
class PostProcessJsTask extends TransformingTask
{
    /**
     * @inheritDocs
     */
    static get injections()
    {
        return { 'parameters': [CliLogger] };
    }


    /**
     * @inheritDocs
     */
    static get className()
    {
        return 'task/PostProcessJsTask';
    }


    /**
     * @returns {String}
     */
    get sectionName()
    {
        return 'Post-processing JS';
    }


    /**
     * @inheritDocs
     */
    prepareParameters(buildConfiguration, parameters)
    {
        const promise = super.prepareParameters(buildConfiguration, parameters)
            .then((params) =>
            {
                params.sourceMaps = false;
                params.optimize = false;
                params.minify = false;
                if (buildConfiguration)
                {
                    params.sourceMaps = buildConfiguration.get('js.sourceMaps', params.sourceMaps);
                    params.optimize = buildConfiguration.get('js.optimize', params.optimize);
                    params.minify = buildConfiguration.get('js.minify', params.minify);
                }
                return params;
            });
        return promise;
    }


    /**
     * @returns {Stream}
     */
    processFile(file, buildConfiguration, parameters)
    {
        const scope = this;
        const promise = co(function*()
        {
            // Prepare
            const params = yield scope.prepareParameters(buildConfiguration, parameters);

            /* istanbul ignore next */
            if (!file || !file.isNull)
            {
                scope.cliLogger.info('Invalid file <' + file + '>');
                return false;
            }

            // Start
            const work = scope.cliLogger.work('Processing file <' + file.path + '>');
            const options =
            {
                compress: params.minify,
                mangle: params.optimize,
                warnings: true
            };
            if (params.optimize)
            {
                options.compress =
                {
                    reduce_vars: true,
                    join_vars: true,
                    dead_code: true,
                    conditionals: true,
                    unused: true
                };
            }
            if (params.sourceMaps)
            {
                options.sourceMap =
                {
                    url: 'inline'
                };
            }
            let resultFile;
            try
            {
                const result = uglifyJs.minify(file.contents.toString(), options);
                resultFile = new VinylFile(
                    {
                        path: file.path,
                        contents: new Buffer(result.code)
                    });
            }
            catch(e)
            {
                /* istanbul ignore next */
                ErrorHandler.error(scope, e);
            }

            // Done
            scope.cliLogger.end(work);
            return resultFile;
        }).catch(ErrorHandler.handler(scope));
        return promise;
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.PostProcessJsTask = PostProcessJsTask;
