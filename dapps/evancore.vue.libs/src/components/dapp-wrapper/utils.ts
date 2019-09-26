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

export default class DAppWrapperUtils {
  /**
   * Get the highest dapp-wrapper reference for a specific element.
   *
   * @param      {Element}  $el     Element to search for a parent from
   * @return     {Element}  highest dapp wrapper instance or undefined
   */
  public static getActiveDAppWrapper($el: Element): Element|undefined {
    let parent: any = $el;
    let wrappers: Array<any> = [ ];

    // search until body or an wrapper body is reached
    do {
      parent = parent.parentElement;

      // collect a list of all parent wrapper bodies, to be able to take the highest one
      if (parent && parent.className.indexOf('dapp-wrapper-body') !== -1) {
        wrappers.push(parent);
      }
    } while (parent && parent !== document.body);

    return wrappers.pop();
  }
}
