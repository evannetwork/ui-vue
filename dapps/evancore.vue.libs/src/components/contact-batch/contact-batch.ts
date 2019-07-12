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

// vue imports
import Component, { mixins } from 'vue-class-component';
import EvanComponent from '../../component';
import Vue from 'vue';
import { Prop, Watch } from 'vue-property-decorator';

/**
 * Displays a small colored batch for previewing a users account / name.
 *
 * @class         ContactBatchComponent
 * @selector      evan-batch-component
 */
@Component({ })
export default class ContactBatchComponent extends mixins(EvanComponent) {
  /**
   * String for that the batch should be generated
   */
  @Prop() value: string;

  /**
   * Short batch title (Test User => TU, Employee => EM)
   */
  batch = '';

  /**
   * Batch specific random hex color code.
   */
  bgColor = '';

  /**
   * text color for the specific background color.
   */
  textColor = '';

  /**
   * Watch for value changes for life updates
   */
  @Watch('value')
  onChildChanged(val: string, oldVal: string) {
    this.setupBatchColors();
  }

  /**
   * Parse the incoming value and generate a hex color code.
   */
  created() {
    this.setupBatchColors();
  }

  /**
   * Takes the current value and generates random colors for the batch.
   */
  setupBatchColors() {
    const value = (this.value || '  ').toString();
    let batch: any = (value.startsWith('0x') ?
      value.slice(2, value.length) :
      value
    ).split('.');

    // fill empty characters
    batch[0] = this.filledText(batch[0]);
    batch[1] = this.filledText(batch[1], batch[0]);

    this.batch = `${ batch[0][0] }${ batch[1][1] }`;

    const rgb = this.getRGBForText(value);
    this.bgColor = `rgb(${ rgb.join(', ') })`;
    this.textColor = this.getContrastColor(rgb);
  }

  /**
   * Fill empty strings.
   *
   * @return     {string}  text with 2 characters
   */
  filledText(text = '', fallback = ''): string {
    const result = [ ];

    result[0] = text[0] || fallback[0] || ' ';
    result[1] = text[1] || fallback[1] || ' ';

    return result.join('');
  }

  /**
   * Use a text to generate a random color code
   * (https://gist.github.com/0x263b/2bdd90886c2036a1ad5bcf06d6e6fb37/).
   *
   * @param      {string}  text    text that shiould be analyzed
   */
  getRGBForText(text: string): Array<number> {
    let hash = 0;
    let rgb = [0, 0, 0];

    if (text.length === 0) {
      return rgb;
    };

    // disable tslint for bitwise operations
    /* tslint:disable */
    for (let i = 0; i < text.length; i++) {
      hash = text.charCodeAt(i) + ((hash << 5) - hash);
      hash = hash & hash;
    }
    for (let i = 0; i < 3; i++) {
      let value = (hash >> (i * 8)) & 255;
      rgb[i] = value;
    }
    /* tslint:enable */

    return rgb;
  }

  /**
   * Load the correct contrast color for a specific
   *
   * @param      {Arraystring}  rgb     The rgb
   */
  getContrastColor(rgb: Array<any>) {
    // http://www.w3.org/TR/AERT#color-contrast
    const o = Math.round((
      (parseInt(rgb[0], 10) * 299) +
      (parseInt(rgb[1], 10) * 587) +
      (parseInt(rgb[2], 10) * 114)) / 1000
    );

    return (o > 125) ? '#000000' : '#ffffff';
  }
}
