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
					'css/global.css' : 'css/global.scss',
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

	grunt.registerTask('default',['sass','watch']);

	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
}