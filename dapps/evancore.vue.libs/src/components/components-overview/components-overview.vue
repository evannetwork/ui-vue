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

<template>
  <div class="rounded-pill text-center">

    <h1>Components Overview</h1>

    <div class="container">
      <h2>Success Component</h2>

      <evan-success label="Test Button" />
    </div>

    <div class="container">
      <h2>Buttton Components</h2>
      <p>The buttons have been clicked <b>{{ btnCounter }}</b> times.</p>

      <div class="row">
        <div class="col-md-6">
          <evan-button label="Test label :)" @click="btnCounter += 1" type="primary" />
          <evan-button label="primary disabled" @click="btnCounter += 1" disabled type="primary"/>
          <br />
          <br />
          <evan-button label="primary icon" @click="btnCounter += 1" icon="mdi-arrow-right" type="primary" />
          <evan-button label="primary icon left" @click="btnCounter += 1" icon="mdi-arrow-left" icon-position="left" type="primary" />
          <br />
          <br />
          <evan-button @click="btnCounter += 1" icon="mdi-pencil" type="primary" />
          <evan-button @click="btnCounter += 1" icon="mdi-delete" />
        </div>

        <div class="col-md-6">
          <evan-button label="secondary" @click="btnCounter += 1" type="secondary" />
          <evan-button label="secondary disabled" @click="btnCounter += 1" disabled type="secondary" />
          <br />
          <br />
          <evan-button label="secondary icon" @click="btnCounter += 1" icon="mdi-arrow-right" />
          <evan-button label="secondary icon left" @click="btnCounter += 1" icon="mdi-arrow-left" icon-position="left" />
          <evan-button label="danger" @click="btnCounter += 1" type="danger" icon="mdi-delete" icon-position="left" />
        </div>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
  import Component from './components-overview';
  export default Component;
</script>

<style lang="scss" scoped>
  @import './components-overview.scss';
</style>
