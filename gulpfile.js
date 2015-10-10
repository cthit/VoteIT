var gulp = require('gulp');
var nodemon = require('gulp-nodemon');

gulp.task('build', function() {
  // place code for your default task here
});

gulp.task('serve', function (cb) {
    nodemon({
        script  : 'app.js' ,
        ext: 'js html',
        env: { 'NODE_ENV': 'development' }
    }).on('restart', function () {
      console.log('reloaded!')
    })
});
