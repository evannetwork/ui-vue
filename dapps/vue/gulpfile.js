/*
  Copyright (c) 2018-present evan GmbH.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

const { lstatSync, readdirSync } = require('fs');
const gulp = require('gulp');
const path = require('path');
const del = require('del');
const exec = require('child_process').exec;
const dappDir = process.cwd();

/**
 * Executes and console command
 *
 * @param      {string}       command  command to execute
 * @return     {Promise<any}  resolved when command is finished
 */
async function runExec(command) {
  return new Promise((resolve, reject) => {
    exec(command, { }, async (err, stdout, stderr) => {
      if (err) {
        reject(stdout);
      } else {
        resolve(stdout);
      }
    });
  });
}

// Run Express, auto rebuild and restart on src changes
gulp.task('build', async function () {
  // load the dapp dbcp
  const dbcp = require(`${ dappDir }/dbcp.json`);
  const dappConfig = dbcp.public.dapp;
  const runtimeFolder = `../../node_modules/@evan.network/ui-dapp-browser/runtime/external/${dbcp.public.name}`;

  // clear the dist folder
  del.sync(`${dappDir}/dist`, { force: true });

  try {
    // bundle everything using webpack
    await runExec('../../node_modules/webpack/bin/webpack.js');

    // copy the dbcp.json and all css files into the runtimeFolder
    await new Promise((resolve, reject) => {
      gulp
        .src([
          `${ dappDir }/dbcp.json`,
          `${ dappDir }/src/**/*.css`,
        ])
        .pipe(gulp.dest(`${ dappDir }/dist`))
        .pipe(gulp.dest(runtimeFolder))
        .on('end', () => resolve());
    });

    // copy the build files into the runtimeFolder
    await new Promise((resolve, reject) => {
      gulp
        .src(`${ dappDir }/dist/**/*`)
        .pipe(gulp.dest(runtimeFolder))
        .on('end', () => resolve());
    });
  } catch (ex) {
    console.error(ex);
  }
});

gulp.task('default', [ 'build' ]);
