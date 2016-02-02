module.exports = function(grunt) {

    grunt.initConfig({
        clean: {
            site: {
                files: [{
                    expand: true,
                    cwd: '_site/',
                    src: ['*']
                }]
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'dist/',
                    src: ['*']
                }]
            }
        },
        shell: {
            jekyllBuild: {
                command: 'bundle exec jekyll build'
            },
            httpServer: {
                command: [
                    'cd dist',
                    'python -m SimpleHTTPServer 4000'
                ].join('&&')
            }
        },
        cssmin: {
            target: {
                files: [
                    {src: 'dist/public/css/poole.css', dest: 'dist/public/css/poole.css'},
                    {src: 'dist/public/css/lanyon.css', dest: 'dist/public/css/lanyon.css'},
                    {src: 'dist/public/css/ir-black.css', dest: 'dist/public/css/ir-black.css'},
                ]
            }
        },
        htmlmin: {
            target: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: [{
                    expand: true,
                    cwd: 'dist',
                    src: '**/*.html',
                    dest: 'dist/'
                }]
            }
        },
        copy: {
            main: {
                files: [{
                    expand: true,
                    cwd: '_site/',
                    src: ['**'],
                    dest: 'dist/'
                }]
            }
        },
        buildcontrol: {
            options: {
                dir: 'dist',
                commit: true,
                push: true
            },
            gh_pages_master: {
                options: {
                    remote: 'https://github.com/pavdmyt/pavdmyt.github.io.git',
                    branch: 'master'
                }
            }
        }
    });

    // Load tasks.
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-build-control');

    // Register tasks.
    grunt.registerTask('dist-watch', ['shell:httpServer']);

    grunt.registerTask('deploy', ['buildcontrol']);

    grunt.registerTask('build', [
        'clean',
        'shell:jekyllBuild',
        'copy',
        'cssmin',
        'htmlmin'
    ]);

    grunt.registerTask('default', [
        'build',
        'dist-watch'
    ]);
};
