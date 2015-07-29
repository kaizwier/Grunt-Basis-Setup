module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		sass: {
			options: {
				sourceMap: true,
				outputStyle: 'compressed'
			},
			dist: {
				files: {
					'css/<%= pkg.namings.css %>.css' : 'css/<%= pkg.namings.css %>.scss',
					'css/<%= pkg.namings.cssPrint %>.css' : 'css/<%= pkg.namings.cssPrint %>.scss',
				}
			}
		},
		concat: {
			options: {
				// define a string to put between each file in the concatenated output
				separator: ';'
			},
			dist: {
				// Concat all files in Folder
				//src: ['js/*.js'],
				//
				// Concat all files in Folder
				src: ['js/jQuery.js','js/additional-methods.min.js','js/html5shiv.js','js/video.js','js/respond.js','js/navigation.js','js/global.js'],
				
				dest: 'dist/<%= pkg.namings.js %>.js'
			}
		},
		uglify: {
			options: {
				// the banner is inserted at the top of the output
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
			},
			dist: {
				files: {
					'dist/<%= pkg.namings.js %>.min.js': ['<%= concat.dist.dest %>']
				}
			}
		},
		watch: {
			css: {
				files: '**/*.scss',
				tasks: ['sass']
			}
		}
	});


	grunt.event.on('watch', function(action, filepath, target) {
		grunt.log.writeln('event fired: ' + target + ': ' + filepath + ' has ' + action);
	});

	grunt.registerTask('default',['sass','concat','watch']);
	grunt.registerTask('deploy',['sass','concat','uglify','watch']);


	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
}