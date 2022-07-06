import {Component, EventEmitter, HostListener, Input, Output} from '@angular/core';

@Component({
  selector: 'app-file-drop-area',
  templateUrl: './file-drop-area.component.html',
  styleUrls: ['./file-drop-area.component.scss']
})
export class FileDropAreaComponent {
  @Output() fileChange = new EventEmitter<File[]>();

  @Input() multi = false;
  @Input() instructionText = 'Drag a file here...';
  @Input() showFiles = true;

  dragIndicator = false;

  files: File[] = [];

  onFileChange(event: any) {
    let files: FileList = event.target.files;
    this.saveFiles(files);
  }

  @HostListener("dragover", ["$event"]) onDragOver(event: any) {
    this.dragIndicator = true;
    event.preventDefault();
  }
  @HostListener("dragenter", ["$event"]) onDragEnter(event: any) {
    this.dragIndicator = true;
    event.preventDefault();
  }
  @HostListener("dragend", ["$event"]) onDragEnd(event: any) {
    this.dragIndicator = false;
    event.preventDefault();
  }
  @HostListener("dragleave", ["$event"]) onDragLeave(event: any) {
    this.dragIndicator = false;
    event.preventDefault();
  }
  @HostListener("drop", ["$event"]) onDrop(event: any) {
    this.dragIndicator = false;
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files) {
      let files: FileList = event.dataTransfer.files;
      this.saveFiles(files);
    }
  }

  async saveFiles(files: FileList) {
    this.files = Array.from(files);
    this.fileChange.emit(this.files);
  }

  onClear(i: number) {
    this.files.splice(i, 1);
  }

  clear() {
    this.files = [];
  }
}
