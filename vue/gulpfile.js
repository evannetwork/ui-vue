/*
  Copyright (C) 2018-present evan GmbH.

  This program is free software: you can redistribute it and/or modify it
  under the terms of the GNU Affero General Public License, version 3,
  as published by the Free Software Foundation.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
  See the GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public License
  along with this program. If not, see http://www.gnu.org/licenses/ or
  write to the Free Software Foundation, Inc., 51 Franklin Street,
  Fifth Floor, Boston, MA, 02110-1301 USA, or download the license from
  the following URL: https://evan.network/license/
*/

const { lstatSync, readdirSync } = require('fs');
const del = require('del');
const fs = require('fs');
const gulp = require('gulp');
const path = require('path');
const exec = require('child_process').exec;
const dappDir = process.argv[process.argv.indexOf('--dapp') + 1];
const { runExec, scriptsFolder, isDirectory, getDirectories } = require('../gulp/lib');

// Run Express, auto rebuild and restart on src changes
gulp.task('build', async function () {
  process.chdir(dappDir);

  // load the dapp dbcp
  const dbcp = require(`${ dappDir }/dbcp.json`);
  const dappConfig = dbcp.public.dapp;
  const runtimeFolder = `../../node_modules/@evan.network/ui-dapp-browser/runtime/external/${dbcp.public.name}`;

  const distSources = [
    `${ dappDir }/dist/**/*`,
    `!${ dappDir }/dist/build-cache`,
    `!${ dappDir }/dist/build-cache/**/*`,
    `!${ dappDir }/dist/${ dbcp.public.name }.d.ts`,
  ];  

  // clear the dist folder
  del.sync(distSources, { force: true });

  try {
    // bundle everything using webpack
    await runExec('../../node_modules/webpack/bin/webpack.js', dappDir, 'stdout');
  } catch (ex) {
    process.stderr.write(ex.message || ex, () => process.exit(1))
  }

  // copy the dbcp.json and all css files into the runtimeFolder
  await new Promise((resolve, reject) => {
    gulp
      .src([
        `${ dappDir }/dbcp.json`,
        `${ dappDir }/src/**/*.css`,
      ])
      .pipe(gulp.dest(`${ dappDir }/dist`))
      .on('end', () => resolve());
  });

  // copy all assets to the dist assets folder
  await new Promise((resolve, reject) => {
    gulp
      .src([
        `${ dappDir }/src/assets/**`,
      ])
      .pipe(gulp.dest(`${ dappDir }/dist/assets`))
      .on('end', () => resolve());
  });

  // create dbcp origin path json
  fs.writeFileSync(
    `${ dappDir }/dist/dbcpPath.json`,
    JSON.stringify({ dbcpPath: `${ dappDir }/dbcp.json` })
  );

  // copy the build files into the runtimeFolder
  await new Promise((resolve, reject) => {
    gulp
      .src(distSources)
      .pipe(gulp.dest(runtimeFolder))
      .on('end', () => resolve());
  });
});

gulp.task('default', [ 'build' ]);
