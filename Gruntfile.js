module.exports = function(grunt) {
    require('time-grunt')(grunt);
    // load npmTasks which named with pattern 'grunt-*' and 'grunt-contrib-*'
    require('grunt-task-loader')(grunt, {
        /* see issue https://github.com/yleo77/grunt-task-loader/issues/1 */
        mapping: {
            cachebreaker: 'grunt-cache-breaker',
            ngAnnotate: 'grunt-ng-annotate'
        }
    });

    // project configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        /* ========== Tasks ===========*/
        watch: {
            gruntfile: {
                files: ['Gruntfile.js'],
                options: {
                    reload: true
                }
            },
            sass: {
                files: ['scss/**/*.scss'],
                tasks: ['sass:dev', 'sass:publish']
            },
            leaf: {
                files: ['www/js/leaf/*.js'],
                tasks: ['clean:leaf', 'concat:leaf']
            },
            livereload: {
                options: { livereload: 35729 },
                files: 'www/**/*'
            },
        },
        connect: {
            dev: {
                options: {
                    hostname: '0.0.0.0',
                    port: 9000,
                    open: false,
                    livereload: 35729,
                    base: '.',
                    middleware: function(connect, options, middlewares) {
                        return [connect.static('www')];
                    }
                }
            }
        },
        clean: {
            css: ['www/css/*.css'],
            leaf: ['www/js/leaf.js']
        },
        concat: {
            leaf: {
                src: ['www/js/leaf/intro.js',
                     'www/js/vendors/angular.min.js',
                     'www/js/vendors/iscroll-probe.js',
                     'www/js/vendors/swiper.min.js',
                     'www/js/leaf/leafUi.js',
                     'www/js/leaf/leafUltis.js',
                     'www/js/leaf/leaf.js',
                     'www/js/leaf/outro.js'],
                dest: 'www/js/leaf.js',
            }
        },
        ngAnnotate: {
            options: {
                singleQuotes: true
            },
            leaf: {
                files: {
                    'www/js/leaf.annotated.js': ['www/js/leaf.js']
                }
            }
        },
        uglify: {
            options: {},
            leaf: {
                files: {
                    'www/js/leaf.min.js': ['www/js/leaf.annotated.js']
                }
            }
        },
        copy: {
        },
        sass: {
            dev: {
                options: {
                    style: 'expanded',
                    sourcemap: 'none',
                    lineNumbers: true
                },
                files: [{
                    expand: true,
                    cwd: 'scss',
                    src: ['*.scss', 'leaf/leaf.scss'],
                    dest: 'www/css',
                    ext: '.css',
                }]
            },
            publish: {
                options: {
                    style: 'compressed',
                    sourcemap: 'none',
                    lineNumbers: false
                },
                files: [{
                    expand: true,
                    cwd: 'scss',
                    src: ['*.scss', 'leaf/leaf.scss'],
                    dest: 'www/css',
                    ext: '.min.css',
                }]
            }
        },
        apimocker: {
            options: {
                configFile: 'mocker.json'
            }
        }
    });

    // grunt task registration
    grunt.registerTask('default', ['apimocker', 'clean', 'connect:dev', 'sass:dev', 'sass:publish', 'concat:leaf', 'watch']);
    grunt.registerTask('publish', ['sass:publish', 'concat:leaf', 'ngAnnotate', 'uglify']);
};
