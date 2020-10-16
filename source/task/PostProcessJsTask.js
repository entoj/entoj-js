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

            // Nothing to do?
            if (!params.minify && !params.optimize && !params.sourceMaps)
            {
                return file;
            }

            // Start
            const work = scope.cliLogger.work('Processing file <' + file.path + '>');
            const options =
            {
                compress: params.minify,
                mangle: params.optimize,
                output:
                {
                    beautify: !(params.minify || params.optimize)
                }
            };
            if (params.minify)
            {
                /*
                //Defaults
                options.compress =
                {
                    'arguments': true,
                    booleans: true,
                    collapse_vars: true,
                    comparisons: true,
                    conditionals: true,
                    dead_code: true,
                    drop_console: false,
                    drop_debugger: true,
                    evaluate: true,
                    expression: false,
                    hoist_funs: false,
                    hoist_props: true,
                    hoist_vars: false,
                    if_return: true,
                    inline: true,
                    join_vars: true,
                    keep_fargs: true,
                    reduce_vars: true,
                    sequences: true,
                    side_effects: true,
                    switches: true,
                    toplevel: false,
                    top_retain: null,
                    typeofs: true,
                    unsafe: false,
                    unsafe_comps: false,
                    unsafe_Function: false,
                    unsafe_math: false,
                    unsafe_proto: false,
                    unsafe_regexp: false,
                    unsafe_undefined: false,
                    unused: true,
                    warnings: false
                };
                */
                // Disable all plugins
                options.compress =
                {
                    'arguments': false,
                    booleans: false,
                    collapse_vars: false,
                    comparisons: false,
                    conditionals: false,
                    dead_code: false,
                    drop_console: false,
                    drop_debugger: false,
                    evaluate: false,
                    expression: false,
                    hoist_funs: false,
                    hoist_props: false,
                    hoist_vars: false,
                    if_return: false,
                    inline: false,
                    join_vars: false,
                    keep_fargs: false,
                    reduce_vars: false,
                    sequences: false,
                    side_effects: false,
                    switches: false,
                    toplevel: false,
                    top_retain: null,
                    typeofs: false,
                    unsafe: false,
                    unsafe_comps: false,
                    unsafe_Function: false,
                    unsafe_math: false,
                    unsafe_proto: false,
                    unsafe_regexp: false,
                    unsafe_undefined: false,
                    unused: false
                };

                // Enable specific plugins
                options.compress = Object.assign(options.compress,
                    {
                        'arguments': true,
                        booleans: true,
                        collapse_vars: true,
                        comparisons: true,
                        conditionals: true,
                        dead_code: true,
                        drop_debugger: true,
                        evaluate: true,
                        hoist_props: true,
                        if_return: true,
                        inline: true,
                        join_vars: true,
                        keep_fargs: true,
                        reduce_vars: false,
                        sequences: true,
                        side_effects: true,
                        switches: true,
                        typeofs: true,
                        unused: true
                    }, (typeof options.compress == 'object') ? options.compress : {});
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
                if (result.code)
                {
                    resultFile = new VinylFile(
                        {
                            path: file.path,
                            contents: new Buffer(result.code)
                        });
                }
                else
                {
                    ErrorHandler.error(scope, result.error);
                }
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
