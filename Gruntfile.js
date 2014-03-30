var exec, fs, growl, initDirectories, output, path, util;

growl = require('growl');

fs = require('fs');

path = require('path');

exec = require('child_process').exec;

util = require('util');

output = './www';

initDirectories = function(dirs) {
  var dir, _i, _len, _results;
  _results = [];
  for (_i = 0, _len = dirs.length; _i < _len; _i++) {
    dir = dirs[_i];
    if (!fs.existsSync(dir)) {
      _results.push(fs.mkdirSync(dir, function(err) {}));
    } else {
      _results.push(void 0);
    }
  }
  return _results;
};

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      javascript: {
        files: ['src/javascript/*.js', 'src/javascript/**/*.js'],
        tasks: ['browserify', 'reload'],
        options: {
          nospawn: true
        }
      },
      stylus: {
        files: ['src/stylus/*'],
        tasks: ['stylus', 'reload'],
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
      },
      companion: {
        files: ['src/companion.html'],
        tasks: ['companion', 'reload'],
        options: {
          nospawn: true
        }
      }
    },
    ngtemplates: {
      app: {
        options: {
          base: 'src/html/'
        },
        src: ['src/html/**/*.html'],
        dest: 'www/angular-templates.js'
      }
    },
    stylus: {
      'www/custom.css': ['src/stylus/custom.styl', 'src/stylus/reports.styl', 'src/stylus/animation.styl', 'src/stylus/option2.styl', 'src/stylus/console.styl', 'src/stylus/setup.styl', 'src/stylus/files_custom.styl'],
      'www/coke.css': ['src/stylus/coke.styl'],
      options: {
        paths: ['lib', 'lib/nib'],
        "import": ['mobile', 'border', 'clearfix', 'color-image', 'config', 'flex', 'gradients', 'iconic', 'image', 'overflow', 'positions', 'reset', 'vendor', 'text/aliases', 'text/aliases', 'text/ellipsis', 'text/hide-text', 'text/replace-text'],
        compress: false
      }
    },
    clean: ["./www"],
    concat: {
      './www/libs.js': ['./vendor/jquery/jquery.min.js', './lib/jquery.highlight-4.closure.js', './lib/localytics.js', './lib/forceios/cordova-2.3.0.js', './lib/forceios/cordova.force.js', './lib/forceios/forcetk.mobilesdk.js', './vendor/angular/angular.min.js', './vendor/angular-touch/angular-touch.min.js', './vendor/angular-route/angular-route.min.js', './vendor/angular-animate/angular-animate.min.js', './vendor/fastclick/fastclick.js']
    },
    browserify: {
      'www/module.js': ['src/javascript/main.js'],
      options: {
        debug: true,
        transform: ['es6ify']
      }
    },
    bower: {
      install: {},
      options: {
        targetDir: 'vendor'
      }
    },
    jslint: {
      src: ['src/javascript/**/*.js']
    },
    copy: [
      {
        expand: true,
        cwd: './static/',
        src: ['./**'],
        dest: './www/'
      }
    ]
  });
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-angular-templates');
  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-jslint');
  grunt.registerTask('index', function() {
    fs.writeFileSync("./www/index.html", fs.readFileSync("./src/index.html", 'utf8'));
    return fs.writeFileSync("./www/bootconfig.json", fs.readFileSync("./lib/forceios/bootconfig.json", 'utf8'));
  });
  grunt.registerTask('companion', function() {
    return fs.writeFileSync("./www/companion.html", fs.readFileSync("./src/companion.html", 'utf8'));
  });
  grunt.registerTask('reload', function() {
    exec('osascript -e \'tell application \"Google Chrome Canary\" to tell the active tab of its first window to reload\'');
    return growl('Reloaded', {
      title: 'Chrome',
      name: 'Grunt'
    });
  });
  grunt.registerTask('dev', ['copy', 'watch', 'reload']);
  grunt.registerTask('default', ['clean', 'bower', 'concat', 'copy', 'index', 'companion', 'ngtemplates', 'browserify', 'stylus', 'reload', 'watch']);
  return grunt.registerTask('heroku:production', ['clean', 'bower', 'concat', 'copy', 'index', 'companion', 'ngtemplates', 'browserify', 'stylus']);
};

