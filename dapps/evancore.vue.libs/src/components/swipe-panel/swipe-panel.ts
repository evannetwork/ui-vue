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

// vue imports
import Vue from 'vue';
import Component, { mixins } from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';

// evan.network imports
import EvanComponent from '../../component';
import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';

/**
 * Bootstrap dropdown menu wrapper in evan.network style.
 *
 * @class         SidePanelComponent
 * @selector      evan-dropdown
 */
@Component({ })
export default class SidePanelComponent extends mixins(EvanComponent) {
  /**
   * Which identifier should be used within the vuex store, to handle open states.
   */
  @Prop({ }) id: string;

  /**
   * Where should the popup should been attached? (left / right)
   */
  @Prop({ default: '400px' }) width: string;

  /**
   * Where should the popup should been attached? (left / right)
   */
  @Prop({ default: 'left' }) alignment: string;

  /**
   * Should the backdrop be shown?
   */
  @Prop({ default: false }) showBackdrop: boolean;

  /**
   * Should the sidebar be fixed, or mounted as child of #mountId in in DOM flow?
   */
  @Prop({ default: null }) mountId: string;

  /**
   * Animation stuff
   */
  isShown = false;

  /**
   * shows the dom elements of the modal
   */
  isRendered = false;

  /**
   * Wait until the swipe panel is rendered, so it can be shown using animation.
   */
  waitForRendered;

  mounted() {
    if (this.mountId) {
      this.$el.parentNode.removeChild(this.$el);
      const sideBar = document.getElementById(this.mountId);
      sideBar.appendChild(this.$el);
    }

    if (this.$store.state.uiState.swipePanel === this.id) {
      this.show();
    }

    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'toggleSidePanel') {
        if (state.uiState.swipePanel === this.id) {
          this.show();
        } else {
          this.hide();
        }
      }
    });
  }

  beforeDestroy() {
    if (this.mountId) {
      const sideBar = document.getElementById(this.mountId).innerHTML = '';

      // close it on destroy
      if (this.isRendered) {
        this.$store.commit('toggleSidePanel', this.id);
      }
    }
  }

  /**
   * Renders the modal element and shows it animated.
   */
  show() {
    if (!this.isShown) {
      this.isRendered = true;
      this.$store.state.uiState.swipePanel = this.id;

      // wait until swipe panel is rendered and show it
      this.waitForRendered = setInterval(() => {
        if (this.$el.querySelectorAll('.evan-swipe-panel').length > 0) {
          clearInterval(this.waitForRendered);
          setTimeout(() => this.isShown = true);
        }
      }, 10);
    }
  }

  /**
   * Remove the modal element and hide it animated.
   */
  hide($event = null) {
    if (this.isShown) {
      this.isShown = false;
      this.$store.state.uiState.swipePanel = '';
      // it the panel was faster closed than opened, remove the wait for rendered watcher
      clearInterval(this.waitForRendered);

      // remove the swipe panel content
      setTimeout(() => this.isRendered = false, 400);

      // tell parent component, that the swipe-panel is closing
      this.$emit('close');

      if ($event) {
        $event.stopPropagation();
      }
    }
  }
}
