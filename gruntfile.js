'use strict';
module.exports = function(grunt) {

  // ===========================================================================
  // CONFIGURE GRUNT ===========================================================
  // ===========================================================================
  grunt.initConfig({

    // get the configuration info from package.json ----------------------------
    // this way we can use things like name and version (pkg.name)
    pkg: grunt.file.readJSON('package.json'),

    // configure jshint to validate js files -----------------------------------
    jshint: {
      options: {
        reporter: require('jshint-stylish'),
        jshintrc: true
      },
      all: ['grunfile.js', 'client/js/**/*.js']
    },

    // configure uglify to minify js files -------------------------------------
    uglify: {
      options: {
        banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n',
        mangle: false
      },
      build: {
        files: {
          'public/js/main.min.js': 'client/**/*.js'
        }
      }
    },

    // compile less stylesheets to css -----------------------------------------
    less: {
      build: {
        files: {
          'public/css/main.css': 'client/less/main.less'
        }
      }
    },

    // configure cssmin to minify css files ------------------------------------
    cssmin: {
      options: {
        banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
      },
      build: {
        files: {
          'public/css/main.min.css': 'public/css/main.css'
        }
      }
    },

    // configure watch to auto update ------------------------------------------
    watch: {
      stylesheets: {
        files: ['client/less/**/*.less'],
        tasks: ['less', 'cssmin']
      },
      scripts: {
        files: 'client/js/**/*.js',
        tasks: ['jshint', 'uglify']
      }
    },
    
    // Run Mongo DB !!
    shell: {
    	mongo: {
    		command: 'mongod --dbpath ./data',
    		options: {
    			async: true,
    			stdout: false,
    			stderr: true
    		}
    	}
    },
    
    // Run Node Server
    nodemon: {
        prod: {
        	script: 'server.js',
        	options: {
        		watch: 'nothing.js'
        	}
        },
        dev: {
        	script: 'server.js'
        }
    },
    
    concurrent: {
    	default: {
            tasks: ['shell:mongo','nodemon:dev', 'watch'], 
            options: {
                logConcurrentOutput: true
            }
    	},
    	prod: {
            tasks: ['shell:mongo','nodemon:prod'], 
            options: {
                logConcurrentOutput: true
            }
    	},
    	openshift: {
            tasks: ['nodemon:prod'], 
            options: {
                logConcurrentOutput: true
            }
    	}
    }    

  });

  // ===========================================================================
  // LOAD GRUNT PLUGINS ========================================================
  // ===========================================================================
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // ===========================================================================
  // CREATE TASKS ==============================================================
  // ===========================================================================
  grunt.registerTask('prepare', ['jshint', 'uglify', 'less', 'cssmin']);
  grunt.registerTask('default', ['prepare', 'concurrent:default']);
  grunt.registerTask('prod', ['prepare', 'concurrent:prod']);
  grunt.registerTask('openshift', ['prepare', 'concurrent:openshift']);

};