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
import { Prop } from 'vue-property-decorator';

// evan.network imports
import { FileHandler, UIContainerFile } from '@evan.network/ui';

import ControlComponent from '../control/control';

/**
 * Wrapper for HTML 5 file upload. Uses the ui-core File utils, load load, return and format files
 * to handle the correct format.
 *
 * @class         FilesInputComponent
 * @selector      evan-file-input
 * @selector      evan-form-control-files
 */
@Component({ })
export default class FilesInputComponent extends mixins(ControlComponent) {
  /**
   * input accept options
   */
  @Prop({
    default: '*'
  }) accept: string;

  /**
   * Name of the input.
   */
   @Prop() name: string;

   /**
    * Empty text that shown, when no files are uploaded and the component is not disabled.
    */
   @Prop({
     default: '_evan.file-input.description'
   }) placeholder: string;

  /**
    * Empty text that shown, when no files are uploaded and the component is disabled.
    */
   @Prop({
     default: '_evan.file-input.empty'
   }) emptyText: string;

  /**
   * Disable drag & drop and the upload button
   */
  @Prop() disabled: boolean;

  /**
   * is set to an index of a file that should be removed
   */
  fileRemove = -1;

  /**
   * is dropzone hovered?
   */
  hovered = false;

  value: UIContainerFile[] = [];

  /**
   * Transform the input files to the correct format.
   */
  async created() {
    await Promise.all(this.value.map(async (file, index) =>
      this.$set(this.value, index, await FileHandler.fileToContainerFile(file))
    ));
  }

  /**
   * Handle new files
   *
   * @param      {Arrayany}  files   The files
   */
  async filesChanged(fileList: FileList) {
    // make the list iterable
    const newFiles: Array<File> = Array.from(fileList);

    // iterate through all files and check if they already exists, if not, add them
    await Promise.all(newFiles.map(async (newFile: File) => {
      const isNew = this.value.filter((existing: UIContainerFile) =>
        existing.name === newFile.name &&
        existing.size === newFile.size
      ).length === 0;

      // if it's a new file, upload the file and transform it into the correct format
      if (isNew) {
        const containerFile = await FileHandler.fileToContainerFile(newFile);
        containerFile.isNew = true;

        this.value.push(containerFile);
      }
    }));

    // trigger update event
    this.$emit('input', this.value);
  }

  /**
   * Remove a file from the value array.
   *
   * @param      {any}                         $event  bootstrap html click event
   * @param      {FileHandlerUIContainerFile}  file    ui container file
   * @param      {number}                      index   index of the file in the value list
   */
  removeFile($event: any, file: FileHandler.UIContainerFile, index: number) {
    this.$parent.$emit('setFocus', true);
    $event.preventDefault();

    // if the file is new or the user has accepted the removal, remove it
    if (file.isNew || this.fileRemove === index) {
      this.value.splice(index, 1);
      (<any>this.$refs.removeFileModal).hide();
      this.fileRemove = -1;

      // trigger update event
      this.$emit('input', this.value);
    } else {
      // if the file is not new, ask before removal
      this.fileRemove = index;
      (<any>this.$refs.removeFileModal).show();
    }

    return false;
  }
}
