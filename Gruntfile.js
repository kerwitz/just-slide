module.exports = function( grunt ) {
    grunt.initConfig( {
        // Compile all less files.
        less: {
            style: {
                options: {
                    compress:     true,
                    yuicompress:  true,
                    optimization: 2,
                    cleancss:     true
                },
                files: {
                    'css/just-slide.min.css': 'less/just-slide.less',
                    'css/themes/elegeant.min.css': 'less/themes/elegant.less'
                }
            }
        },
        // Minify the Javascript files.
        uglify: { js: { files: { 'js/just-slide.min.js': [ 'js/just-slide.js' ] } } },
        // Set up all watcher tasks.
        watch: {
            // Watch the less files.
            // Less files will be compiled and minified upon editing.
            // Additionally media queries will be bundled and a text banner is
            // prepended to the resulting file.
            styles: {
                files: [ 'less/**/*.less' ],
                tasks: [ 'less' ],
                options: { spawn: false }
            },
            // Watch the Javascript files any uglify them when they are changed.
            js: {
                files: [ 'js/just-slide.js' ],
                tasks: [ 'uglify' ],
                options: { spawn: false }
            },
            // Make sure we reload the Gruntfile whenever we change anything
            // within it so we watch with the most current configuration.
            grunt: { files: [ 'Gruntfile.js' ] }
        }
    } );
    grunt.loadNpmTasks( 'grunt-contrib-less' );
    grunt.loadNpmTasks( 'grunt-contrib-watch' );
    grunt.loadNpmTasks( 'grunt-contrib-uglify' );
    grunt.registerTask( 'default', [ 'less', 'uglify', 'watch' ] );
};
