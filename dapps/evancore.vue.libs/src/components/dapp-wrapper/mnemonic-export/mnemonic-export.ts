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
import * as dappBrowser from '@evan.network/ui-dapp-browser';
import * as bcc from '@evan.network/api-blockchain-core';
import Component, { mixins } from 'vue-class-component';
import EvanComponent from '../../../component';

/**
 * Shows a notification at the bottom of the screen, that the user needs to export its mnemonic. On
 * click a modal is shown, where the user can read about mnemonics and where he can
 * export the mnemonic as pdf.
 *
 * @class      MnemonicExport @selector      evan-mnemonic-export
 */
@Component({})
export default class MnemonicExport extends mixins(EvanComponent) {
  mnemonic = null;
  address = '';
  alias = '';
  understood = false;
  now = null;

  async created() {
    const runtime = this.getRuntime();

    this.address = runtime.activeAccount;
    this.mnemonic = await this.getMnemonic();
    this.now = new Date();
    this.alias = window.localStorage.getItem('evan-alias');

    // Show directly the mnemonic export and do not allow closing.
    this.mnemonic && this.$nextTick(() => this.showModal());
  }

  private showModal() {
    (this.$refs.modal as any).show();
  }

  private goSecure () {
    this.mnemonic = null;
    window.localStorage.removeItem('evan-mnemonic');
    (this.$refs.modal as any).hide();
  }

  /**
   * Checks for the evan-mnemonic parameter within the localStorage. If the parameter is available
   * and the user is able to decrypt the value, the notification will be shown.
   */
  private async getMnemonic(): Promise<string[]> {
    if (window.localStorage['evan-mnemonic']) {
      const runtime = this.getRuntime();
      const encrypted = localStorage['evan-mnemonic'];
      const vault = await dappBrowser.lightwallet.loadUnlockedVault();
      const cryptor = runtime.sharing.options.cryptoProvider.getCryptorByCryptoAlgo(
        runtime.sharing.options.defaultCryptoAlgo
      );

      return (await cryptor.decrypt(bcc.buffer.from(encrypted, 'hex'), {
        key: vault.encryptionKey
      })).split(' ');
    }
  }

  private downloadMnemonics() {
    const fileName = `recovery-key-${this.alias}.txt`;
    const text = [];

    text.push(this.$t('_evan.mnemonic-export.description'));
    text.push(`\n${this.$t('_evan.mnemonic-export.account-id')}: ${this.address}`);
    text.push(`${this.$t('_evan.mnemonic-export.alias')}: ${this.alias}`);
    text.push(`\n${this.$t('_evan.mnemonic-export.recovery-key')}:`);
    text.push(`\n${this.mnemonic.join(' ')}`);

    this.downloadTextfile(fileName, text.join('\n'));
  }

  /**
   * Trigger download of text file.
   *
   * @param filename Name for the file with .txt suffix
   * @param text Content of the text tile
   */
  private downloadTextfile(filename: string, text: string) {
    const element = document.createElement('a');

    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(text)
    );
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  /**
   * Adds text to clipboard.
   *
   * @param text Text to copy
   */
  private copyToClipboard(text: string) {
    const textArea = document.createElement('textarea');

    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);

    this.$toasted.show(
      this.$t(`_evan.mnemonic-export.copied`),
      {
        duration: 3000,
        type: 'success'
      }
    );
  }

  /**
   * Open browser print dialogue.
   */
  private print() {
    window.print();
  }

  /**
   * Prevent dialog to be closed, when user did not has exported the mnemonic.
   */
  onModalClose($event) {
    if (!this.understood) {
      (this.$refs.understoodModal as any).show();
    }
  }
}
