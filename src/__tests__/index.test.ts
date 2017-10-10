import * as stream from 'stream';
import * as path from 'path';
import * as gulp from 'gulp';
import * as fs from 'vinyl-fs';
import * as through2 from 'through2';
import FlowToJsonPlugin from '../index';

function toMatchExtname(extname: string) {
  return through2.obj((file, enc, callback) => {
    expect(path.extname(file.path)).toBe(extname);
    expect(file.contents.toString()).toMatchSnapshot();
    callback(null, file);
  });
}

const fixture = (str: string) =>
  path.join(__dirname, '..', '__fixtures__', str);

describe('FlowToJsonPlugin', () => {
  const tests: [string, string, string][] = [
    ['should convert to jsx', fixture('ReactComponent.js'), '.tsx'],
    ['should convert to ts', fixture('Es6Js.js'), '.ts'],
    ['should remove flow comment', fixture('BlockFlow.js'), '.tsx'],
    ['should convert nullable', fixture('Nullable.js'), '.ts'],
    ['should convert import type statement', fixture('ImportType.js'), '.tsx'],
    ['should convert React.Node to ReactNode', fixture('ReactNode.js'), '.tsx'],
    ['should convert mixed to any', fixture('MixToAny.js'), '.ts']
  ];

  tests.forEach(t => {
    const [message, src, extname] = t;
    test(message, done => {
      gulp
        .src(src)
        .pipe(FlowToJsonPlugin())
        .pipe(toMatchExtname(extname))
        .on('error', done)
        .on('finish', done);
    });
  });
});
