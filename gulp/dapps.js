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

  You can be released from the requirements of the GNU Affero General Public
  License by purchasing a commercial license.
  Buying such a license is mandatory as soon as you use this software or parts
  of it on other blockchains than evan.network.

  For more information, please contact evan GmbH at this address:
  https://evan.network/license/
*/

const { lstatSync, readdirSync } = require('fs');
const gulp = require('gulp');
const path = require('path');
const del = require('del');
const exec = require('child_process').exec;
const { runExec, scriptsFolder, isDirectory, getDirectories, nodeEnv } = require('./lib');

const dappDirs = getDirectories(path.resolve('../dapps'));
let longestDAppName = 0;

for (let dappDir of dappDirs) {
  const dappNameLength = dappDir.split('/').pop().length;

  if (longestDAppName < dappNameLength) {
    longestDAppName = dappNameLength;
  }
}

/**
 * Fill dapp name with spaces to create an clean watching log.
 *
 * @param      {string}  dappName  dapp name
 * @return     {string}  filled dapp name
 */
const getFilledDAppName = (dappName) => {
  while (dappName.length < longestDAppName + 5) {
    dappName += ' ';
  }

  return dappName;
}

/**
 * save latest serve and build status
 */
const serves = { };
dappDirs.forEach(dappDir => {
  const dappName = dappDir.split('/').pop();

  serves[dappName] = { duration: 0, lastDuration: 0 };
});

/**
 * Show the current wachting status
 */
const logServing = () => {
  console.clear();

  console.log(`Watching DApps: ${ nodeEnv }`);
  console.log('--------------\n');

  for (let dappDir of dappDirs) {
    const dappName = dappDir.split('/').pop();
    const logDAppName = getFilledDAppName(dappName);

    // load the status of the dapp
    const timeLog = `(${ serves[dappName].duration }s / ${ serves[dappName].lastDuration }s)`;
    if (serves[dappName].rebuild) {
      console.log(`  ${ logDAppName }:     rebuilding ${ timeLog }`);
    } else if (serves[dappName].loading) {
      console.log(`  ${ logDAppName }:   building ${ timeLog }`);
    } else {
      console.log(`  ${ logDAppName }: watching ${ timeLog }`);
    }

    if (serves[dappName].error) {
      console.log();
      console.log(serves[dappName].error);
    }
  }

  console.log('\n');
}

/**
 * Build a specific DApp and log the status.
 *
 * @param      {string}  dappDir  the directory of the dapp
 * @return     {Promise<void>}  resolved when done
 */
const buildDApp = async (dappDir) => {
  // if its not already building, build the dapp
  const dappName = dappDir.split('/').pop();
  if (!serves[dappName].loading) {
    serves[dappName].loading = true;
    serves[dappName].error = '';
    logServing();

    // track the build time
    const startTime = Date.now();
    const timeCounter = setInterval(() => {
      serves[dappName].duration = Math.round((Date.now() - startTime) / 1000);
      logServing();
    }, 1000);

    try {
      // navigate to the dapp dir and run the build command
      process.chdir(dappDir);

      await runExec('npm run build', dappDir);

      // clear timer and calculate time
      serves[dappName].lastDuration = Math.round((Date.now() - startTime) / 1000);

      delete serves[dappName].error;
    } catch (ex) {
      serves[dappName].error = ex.stderr;
    }

    clearInterval(timeCounter);

    // reset loading, rebuild if nessecary
    serves[dappName].loading = false;
    if (serves[dappName].rebuild) {
      buildDApp(dappDir);
    } else {
      logServing();
    }

    // remove rebuilding flag
    delete serves[dappName].rebuild;
  } else {
    // if multiple files were changed, set the rebuild flag
    serves[dappName].rebuild = true;
  }
}

// Run Express, auto rebuild and restart on src changes
gulp.task('dapps-serve', () => {
  dappDirs.forEach(dappDir =>
    gulp.watch(`${dappDir}/src/**/*`, (event) => buildDApp(dappDir))
  );

  setTimeout(() => logServing());
});

// Run Express, auto rebuild and restart on src changes
gulp.task('dapps-build', async function () {
  for (let dappDir of dappDirs) {
    try {
      // navigate to the dapp dir and run the build command
      await buildDApp(dappDir);
    } catch (ex) {
      console.error(ex);
    }
  }
});

gulp.task('default', [ 'dapps-build' ]);
