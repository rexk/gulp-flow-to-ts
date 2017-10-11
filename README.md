# gulp-flow-to-ts

Gulp plugin that converts flow-typed javascripts into typescript files.

## Conversions

* Converts `.jsx` or `.js` with jsx tag to `.tsx`.
* Converts `.js` to `.ts` if no jsx tag is found.
* Converts `mixed` type to `any`
* Converts `import type` statement to `import`
* Converts `?` to `void | OtherType`
* Removes `@flow` pragma
* Converts `React.Node` to `React.ReactNode`

## Usuage

```js
const FlowToTs = require('gulp-flow-to-ts');

gulp.task('convert', () => {
  gulp.src('./src/**')
    .pipe(FlowToTs())
    .pipe(gulp.dest('./src-ts'));
});
```
