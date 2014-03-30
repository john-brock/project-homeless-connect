
/*
Copyright (c) 2014, salesforce.com, inc. All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
Neither the name of salesforce.com, inc. nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
var exec, fs, growl, path, sass, util;

growl = require('growl');

fs = require('fs');

path = require('path');

exec = require('child_process').exec;

util = require('util');

sass = require('node-sass');

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-angular-templates');
  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      javascript: {
        files: ['src/javascript/**/*.js'],
        tasks: ['browserify', 'reload'],
        options: {
          nospawn: true
        }
      },
      sass: {
        files: ['src/sass/*', 'src/sass/**/*.scss'],
        tasks: ['node-sass', 'reload'],
        options: {
          nospawn: true
        }
      },
      html: {
        files: ['src/html/*', 'src/html/**/*.html'],
        tasks: ['ngtemplates', 'reload'],
        options: {
          nospawn: true
        }
      },
      index: {
        files: ['src/index.html'],
        tasks: ['index', 'reload'],
        options: {
          nospawn: true
        }
      }
    },
    clean: ["./www"],
    ngtemplates: {
      app: {
        options: {
          base: 'src/html/'
        },
        src: ['src/html/**.html'],
        dest: 'www/ng-templates.js'
      }
    },
    concat: {
      './www/libs.js': ['./bower_components/jquery/jquery.min.js', './bower_components/angular/angular.min.js', './bower_components/angular-touch/angular-touch.min.js', './bower_components/angular-route/angular-route.min.js', './bower_components/angular-animate/angular-animate.min.js']
    },
    browserify: {
      'www/module.js': ['src/javascript/main.js'],
      options: {
        debug: true,
        transform: ['es6ify']
      }
    },
    bower: {
      options: {
        cleanBowerDir: false,
        copy: false
      },
      install: {}
    },
    copy: [
      {
        expand: true,
        cwd: './assets/',
        src: ['**'],
        dest: './www/'
      }
    ]
  });
  grunt.registerTask('node-sass', function() {
    var css;
    css = sass.renderSync({
      file: 'src/sass/styles.scss'
    });
    return fs.writeFileSync("www/styles.css", css);
  });
  grunt.registerTask('index', function() {
    if (!fs.existsSync('./www')) {
      fs.mkdirSync('./www', '0777');
    }
    fs.writeFileSync("./www/index.html", fs.readFileSync("./src/index.html", 'utf8'));
    return fs.writeFileSync("./www/angular.min.js.map", fs.readFileSync("./bower_components/angular/angular.min.js.map", 'utf8'));
  });
  grunt.registerTask('reload', function() {
    exec('osascript -e \'tell application \"Google Chrome Canary\" to tell the active tab of its first window to reload\'');
    return growl('Reloaded', {
      title: 'Chrome',
      name: 'Grunt'
    });
  });
  return grunt.registerTask('default', ['clean', 'bower', 'index', 'copy', 'concat', 'ngtemplates', 'node-sass', 'browserify', 'reload', 'watch']);
};
