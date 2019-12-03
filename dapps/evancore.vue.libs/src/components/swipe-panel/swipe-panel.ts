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
import Component, { mixins } from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';

// evan.network imports
import EvanComponent from '../../component';

/**
 * Bootstrap dropdown menu wrapper in evan.network style.
 *
 * @class         SidePanelComponent
 * @selector      evan-dropdown
 */
@Component({ })
export default class SidePanelComponent extends mixins(EvanComponent) {
  /**
   * Passes the current open state into the side panel, so it will be openable / closable with one
   * param.
   */
  @Prop() isOpen: string;

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
   * Should the close button be shown?
   */
  @Prop({ default: false }) hideCloseButton: boolean;

  /**
   * Should the sidebar be fixed, or mounted as child of #mountId in in DOM flow?
   */
  @Prop({ default: null }) mountId: string;

  /**
   * Show fixed title in the Swipe Panel
   */
  @Prop() title: string;

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

  /**
   * Original element that contains this element
   */
  originParentElement: any;

  @Watch('mountId')
  onMountIdChange(val: string) {
    this.mountIdChanged(val);
  }

  @Watch('isOpen')
  onIsOpenChange(val: boolean) {
    val ? this.show() : this.hide();
  }

  mounted() {
    this.originParentElement = this.$el.parentElement;

    // check for mount id and render it directly if wanted
    this.mountIdChanged();
  }

  beforeDestroy() {
    // clear parent element references to be sure, that gc is working
    this.originParentElement = null;

    // close it on destroy
    this.isRendered && this.hide();

    // remove it from current mount id
    if (this.mountId) {
      this.$el.parentNode.removeChild(this.$el);
    }
  }

  /**
   * Renders the modal element and shows it animated.
   */
  show() {
    if (!this.mountId && !this.isShown) {
      this.isRendered = true;

      // wait until swipe panel is rendered and show it
      this.waitForRendered = setInterval(() => {
        if (this.$el.querySelectorAll('.evan-swipe-panel').length > 0) {
          clearInterval(this.waitForRendered);
          setTimeout(() => {
            this.isShown = true;
            this.$emit('show');
          });
        }
      }, 10);
    }
  }

  /**
   * Remove the modal element and hide it animated.
   */
  hide($event = null) {
    if (!this.mountId && this.isShown) {
      this.isShown = false;

      // it the panel was faster closed than opened, remove the wait for rendered watcher
      clearInterval(this.waitForRendered);

      // remove the swipe panel content
      setTimeout(() => this.isRendered = false, 400);

      // tell parent component, that the swipe-panel is closing
      this.$emit('hide');

      if ($event) {
        $event.stopPropagation();
      }
    }
  }

  /**
   * Check if a mount id is specified and render it directly. Else apply swipe logic
   */
  mountIdChanged(mountId = this.mountId) {
    if (mountId) {
      document.getElementById(mountId).appendChild(this.$el);
      this.isRendered = true;
      this.isShown = true;
      this.$emit('show');
    } else {
      // move the element to it's original position
      if (this.originParentElement !== this.$el.parentElement) {
        this.originParentElement.appendChild(this.$el);
      }

      if (this.isOpen) {
        this.show();
      } else {
        this.isRendered = false;
        this.isShown = false;
        this.$emit('hide');
      }
    }
  }
}
