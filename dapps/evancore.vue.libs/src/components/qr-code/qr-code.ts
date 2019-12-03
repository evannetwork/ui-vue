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
import EvanComponent from '../../component';
import { Prop, Watch } from 'vue-property-decorator';
import QRCode from 'qrcodejs';

/**
 * Rerender qr code for a qr-code component instance
 */
const renderQRCode = (vueInstance: QRCodeComponent) => {
  return new QRCode(vueInstance.$el, {
    colorDark: vueInstance.colorDark,
    colorLight: vueInstance.colorLight,
    correctLevel : QRCode.CorrectLevel.H,
    height: vueInstance.height,
    text: vueInstance.text,
    width: vueInstance.width,
  });
};

/**
 * Shows a animated "check" icon.
 *
 * @class         SuccessComponent
 * @selector      evan-success
 */
@Component({ })
export default class QRCodeComponent extends mixins(EvanComponent) {
  /**
   * text that should be transformed into a qr code
   */
  @Prop() text: string;

  /**
   * width of the qr-code
   */
  @Prop({ default: 128 }) width: number;

  /**
   * height of the qr-code
   */
  @Prop({ default: 128 }) height: number;

  /**
   * color definitions
   */
  @Prop({ default: '#000000' }) colorDark: string;
  @Prop({ default: '#ffffff' }) colorLight: string;

  /**
   * Watch all properties
   */
  @Watch('text') changedText() { renderQRCode(this); }
  @Watch('width') changedWidth() { renderQRCode(this); }
  @Watch('height') changedHeight() { renderQRCode(this); }
  @Watch('colorDark') changedColorDark() { renderQRCode(this); }
  @Watch('colorLight') changedColorLight() { renderQRCode(this); }

  mounted() {
    renderQRCode(this);
  }
}
