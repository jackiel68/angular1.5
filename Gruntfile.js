/*global module:false*/
module.exports = function (grunt) {
    var modules = {
        'main': 'main',
        'common': 'common',
        'user': 'user',
        'data': 'data',
        'reports': 'reports'
    };
    var app_styles = [];
    var app_js = [];
    for (var mod in modules) {
        app_styles.push(modules[mod] + "/styles.less");
        app_js.push(modules[mod] + "/init.js");
        app_js.push(modules[mod] + "/**/*.js");
        app_js.push('!' + modules[mod] + "/**/*example.js");
    }

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
        // Task configuration.
        copy: {
            fonts: {
                files: [
                    {
                        expand: true,
                        src: [
                            'vendor/bootstrap/fonts/*.*',
                            'vendor/fontawesome/fonts/*.*',
                            'vendor/angular-ui-grid/ui-grid.ttf',
                            'vendor/angular-ui-grid/ui-grid.svg',
                            'vendor/angular-ui-grid/ui-grid.woff',
                            'vendor/angular-ui-grid/ui-grid.eot',
                        ],
                        dest: 'assets/fonts',
                        flatten: true
                    }
                ]
            },
            images: {
                files: [
                    {
                        expand: true,
                        src: [
                            'images/*.*'
                        ],
                        dest: 'assets/img',
                        flatten: true
                    }
                ]
            }
        },
        less: {
            webui: {
                options: {
                    dumpLineNumbers: 'all',
                    sourceMap: true
                },
                files: {
                    'assets/css/app.css': app_styles
                }
            }
        },
        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: true
            },
            css: {
                files: {
                    'assets/css/libs.css': [
                        'vendor/bootstrap/dist/css/bootstrap-theme.min.css',
                        'vendor/bootstrap/dist/css/bootstrap.min.css',
                        'vendor/fontawesome/css/font-awesome.css',
                        'vendor/angular-ui-grid/ui-grid.min.css',
                        'vendor/bootstrap-switch/dist/css/bootstrap3/bootstrap-switch.css',
                        'vendor/angular-xeditable/dist/css/xeditable.css',
                        'vendor/angular-growl-v2/build/angular-growl.min.css',
                        'vendor/angular-ivh-treeview/dist/ivh-treeview.min.css',
                        'vendor/angular-loading-bar/src/loading-bar.css',
                        'vendor/ui-select/dist/select.css',
                        'vendor/ng-tags-input/ng-tags-input.min.css',
                    ]
                }
            },
            lib_js: {
                files: {
                    'assets/js/libs.js': [
                        'vendor/jquery/dist/jquery.min.js',
                        'vendor/angular/angular.min.js',
                        'vendor/angular-cookies/angular-cookies.min.js',
                        'vendor/angular-ui-router/release/angular-ui-router.min.js',
                        'vendor/angular-sanitize/angular-sanitize.min.js',
                        'vendor/angular-bootstrap/ui-bootstrap.min.js',
                        'vendor/angular-bootstrap/ui-bootstrap-tpls.min.js',
                        'vendor/angular-google-chart/ng-google-chart.js',
                        'vendor/angular-local-storage/dist/angular-local-storage.min.js',
                        'vendor/angular-ui-grid/ui-grid.min.js',
                        'vendor/bootstrap-switch/dist/js/bootstrap-switch.js',
                        'vendor/angular-bootstrap-switch/dist/angular-bootstrap-switch.js',
                        'vendor/pdfmake/build/pdfmake.js',
                        'vendor/pdfmake/build/vfs_fonts.js',
                        'vendor/angular-xeditable/dist/js/xeditable.js',
                        'vendor/angular-growl-v2/build/angular-growl.min.js',
                        'vendor/angular-ivh-treeview/dist/ivh-treeview.min.js',
                        'vendor/angular-loading-bar/src/loading-bar.js',
                        'vendor/angular-file-upload/dist/angular-file-upload.min.js',
                        'vendor/ui-select/dist/select.js',
                        'vendor/angular-pageslide-directive/src/angular-pageslide-directive.js',
                        'vendor/moment/moment.js',
                        'vendor/underscore/underscore.js',
                        'vendor/angular-confirm-modal/angular-confirm.min.js',
                        'vendor/highcharts-ng/dist/highcharts-ng.min.js',
                        'vendor/ng-csv/build/ng-csv.min.js',
                        'vendor/ng-tags-input/ng-tags-input.min.js'
                    ]
                }
            },
            app_js: {
                files: {
                    'assets/js/app.js': app_js
                }
            }
        },
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            lib_js: {
                 src: 'assets/js/libs.js',
                 dest: 'assets/js/libs.min.js'
            },
            app_js: {
                 src: 'assets/js/app.js',
                 dest: 'assets/js/app.min.js'
            }
        },
        jshint: {
            options: {
                curly: true,
                eqeqeq: false,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                unused: false,
                boss: true,
                eqnull: true,
                browser: true,
                asi: true,
                globals: {
                    "angular": false,
                    "jasmine": false,
                    "$": false,
                    "_": false,
                    "module": false,
                    "require": false,
                    "ga": false
                }
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            lib_test: {
                src: ['lib/**/*.js', 'test/**/*.js']
            },
            js: {
                src: app_js
            }
        },
        qunit: {
            files: ['test/**/*.html']
        },
        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile','concat','less','copy']
            },
            lib_test: {
                files: '<%= jshint.lib_test.src %>',
                tasks: ['jshint:lib_test', 'qunit']
            },
            scripts: {
                files: app_js,
                tasks: ['concat:app_js']
            },
            vendor: {
                files: 'vendor/**/*.js',
                tasks: ['concat:lib_js']
            },
            less: {
                files: '**/*.less',
                tasks: ['less']
            }
        },
        connect: {
            server: {
                options: {
                    base: '.',
                    hostname: 'localhost',
                    keepalive: true,
                    open: true,
                    port: 9000
                }
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');

    // Default task.
    grunt.registerTask('default', ['copy', 'less', 'concat']);
};