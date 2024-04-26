const gulp = require('gulp');

require('./gulp/defoult.js');
require('./gulp/docs.js');


gulp.task('default', gulp.series(
    'clean:dev', 
    gulp.parallel('html:dev','sass:dev', 'JS:dev', 'images:dev', 'fonts:dev'),
    gulp.parallel('server:dev', 'watch:dev')
));   

gulp.task('docs', gulp.series(
    'clean:docs', 
    gulp.parallel('html:docs','sass:docs', 'JS:docs', 'images:docs', 'fonts:docs'),
    gulp.parallel('server:docs')
)); 