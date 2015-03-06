module.exports = function(grunt) {

  const DEST = 'dist/vorm.js';
  const DEST_MIN = 'dist/vorm.min.js';

  var pkg = grunt.file.readJSON('package.json');

  grunt.initConfig({
    pkg: pkg,
    meta: {
      banner:
        '/**\n' +
        ' * <%= pkg.name %> - v<%= pkg.version %>\n' +
        ' * update: <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        ' * Author: <%= pkg.author %> [<%= pkg.website %>]\n' +
        ' * Github: <%= pkg.repository.url %>\n' +
        ' * License: Licensed under the <%= pkg.license %> License\n' +
        ' */'
    },
    typescript: {
      options: {
        comments: true,
        declaration: true
      },
      dist: {
        src: 'src/index.ts',
        dest: '__tmp/bare-vorm.js'
      }
    },
    concat: {
      dist: {
        options: {
          banner: '<%= meta.banner %>' + '\n' +
          '\n' +
          ''
        },
        src: [
          'src/__wrap/__intro.js',
          '<%= typescript.dist.dest %>',
          'src/__wrap/__outro.js'
        ],
        dest: DEST
      }
    },
    uglify: {
      dist: {
        options: {
          banner: '<%= meta.banner %>' + '\n' +
          '\n' +
          '',
          report: 'gzip',
          sourceMap: true
        },
        src: [DEST],
        dest: DEST_MIN
      },
    },
    qunit: {
      all: [
        'test/*.html'
      ]
    },
    watch: {
      scripts: {
        files: [
          'src/*.ts',
          'src/**/*.ts',
        ],
        tasks: [
          'typescript',
          'concat',
          'uglify'
        ],
        options: {
          interrupt: true
        }
      }
    }
  });

  grunt.registerTask('default', [
    'typescript',
    'concat',
    'uglify',
    'qunit'
  ]);

  grunt.loadNpmTasks('grunt-typescript');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-qunit');

};
