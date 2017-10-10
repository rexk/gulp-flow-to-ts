import * as stream from 'stream';
import * as fs from 'fs';
import * as path from 'path';
import * as through from 'through2';

type ReplaceArgs = [string | RegExp, string | Function];

/**
 * Given content of the file returns appropriate extname.
 *
 * if content contains react import -> .tsx
 * else .ts
 *
 * @param {string} content
 * @return {string}
 */
function TsExtname(content: string) {
  return /from \'react\'/gi.test(content) ? '.tsx' : '.ts';
}

/**
 * Examine given extname to check if the file is snapshot file.
 *
 * @param {string} extname
 * @return {boolean}
 */
function isSnapshot(extname: string): boolean {
  return extname === '.snap';
}

/**
 * Examine givne extname to check if the file is js file.
 *
 * @param {string} extname
 * @return
 */
function isJs(extname: string): boolean {
  return extname === '.js' || extname === '.jsx';
}

/**
 * Inspect snapshot file and assign appropriate extension.
 *
 * @param {any} file
 * @param {string} encoding
 * @param {Function} callback
 */
function InspectSnapshot(file: any, encoding: string, callback: Function) {
  const dirname = path.dirname(file.path);
  const basename = path.basename(file.path, 'test.js.snap');
  const original = path.join(dirname, '../..', `${basename}js`);
  fs.readFile(original, 'utf8', (err, content) => {
    if (err) {
      callback(err);
      return;
    }

    const extname = TsExtname(content);
    const b = path.basename(file.path, '.js.snap');
    file.path = path.join(dirname, `${b}${extname}.snap`);
    callback(null, file);
  });
}

/**
 * Plugin that returns a object stream to assign proper extname for flow files.
 *
 * @return {stream.Transform}
 */
function FlowToTsPlugin(): stream.Transform {
  return through.obj((file, encoding, callback) => {
    if (file.isDirectory()) {
      return callback(null, file);
    }

    const fileExtname = path.extname(file.path);
    if (isSnapshot(fileExtname)) {
      InspectSnapshot(file, encoding, callback);
      return;
    }

    if (!isJs(fileExtname)) {
      return callback(null, file);
    }

    const f = file.clone({ contents: false });
    const content = file.contents.toString();
    const extname = TsExtname(content);
    const args: Array<ReplaceArgs> = [
      [
        /(\w+): \?(\w+)/g,
        (match: string, $1: string, $2: string) => `${$1}?: void | ${$2}`
      ],
      [
        /(\w+)\?: \?(\w+)/g,
        (match: string, $1: string, $2: string) => `${$1}?: void | ${$2}`
      ],
      [/mixed/g, 'any'],
      [/\/\/ @flow/g, ''],
      [/\/\* @flow \*\//, ''],
      ['@flow', ''],
      ['import type {', 'import {'],
      ['React.Node', 'React.ReactNode']
    ];

    const contents: string = args.reduce((str, replacer) => {
      const [matcher, replacement] = replacer;
      return str.replace(matcher, replacement);
    }, content);

    f.contents = new Buffer(contents.trim() + '\n');
    f.path = path.join(
      path.dirname(f.path),
      path.basename(f.path, path.extname(f.path)) + extname
    );

    callback(null, f);
  });
}

export default FlowToTsPlugin;
