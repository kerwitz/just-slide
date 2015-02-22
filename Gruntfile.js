module.exports = function( grunt ) {
    grunt.initConfig( {
        less: {
            style: {
                options: {
                    compress:     true,
                    yuicompress:  true,
                    optimization: 2,
                    cleancss:     true
                },
                files: { 'css/main.min.css': 'less/main.less' }
            }
        },
        watch: {
            styles: {
                files: [ 'less/**/*.less' ],
                tasks: [ 'less' ],
                options: { spawn: false }
            },
            grunt: { files: [ 'Gruntfile.js' ] }
        }
    } );
    grunt.loadNpmTasks( 'grunt-contrib-less' );
    grunt.loadNpmTasks( 'grunt-contrib-watch' );
    grunt.registerTask( 'default', [ 'less', 'watch' ] );
};
