import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { ScoreFileType } from '@app/shared/scoreFileType.enum';
import { ScoreTitle } from '@app/shared/scoreTitle';
import { ScoreType } from '@app/shared/scoreType.enum';
import { Instrument } from '@app/shared/instrument';
import { GenericFile } from '@app/shared/GenericFile';
import { FileLoaderComponent } from '@app/file-add/file-loader/file-loader.component';
import { ProcessingState } from '@app/file-add/processing-state';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-file-add',
  templateUrl: './file-add.component.html',
  styleUrls: ['./file-add.component.css']
})
export class FileAddComponent implements OnInit, AfterViewInit {
  @ViewChild('attachedFiles') attachedFiles: FileLoaderComponent;
  // @ViewChild('pdfFiles') pdfFiles: FileLoaderComponent;
  // @ViewChild('msczFiles') msczFiles: FileLoaderComponent;
  // @ViewChild('imageFiles') imageFiles: FileLoaderComponent;
  // @ViewChild('otherFiles') otherFiles: FileLoaderComponent;
  protected uploadedFiles: Array<GenericFile> = [];
  protected filesToUpload: Array<File> = [];
  protected pdf: Array<GenericFile> = [];
  protected mscz: Array<GenericFile> = [];
  protected image: Array<GenericFile> = [];
  protected other: Array<GenericFile> = [];
  protected pdfProcessing = false;
  protected msczProcessing = false;
  protected imageProcessing = false;
  protected otherProcessing = false;
  protected PDF = ScoreFileType.PDF;
  protected MSCZ = ScoreFileType.MSCZ;
  protected IMAGE = ScoreFileType.IMAGE;
  protected OTHER = ScoreFileType.OTHER;
  @Input() scoreTitle: ScoreTitle;
  @Input() scoreType: ScoreType;
  @Input() instrument: Instrument;
  @Input() showList: boolean = true;
  @Output() processingFiles: EventEmitter<boolean> = new EventEmitter();
  protected pendingFiles: boolean;
  protected allSent: boolean;
  constructor() { }

  ngOnInit() {
  }
  ngAfterViewInit() {
    if (this.attachedFiles) {
      this.attachedFiles.uploadedFiles.subscribe(files => {
        this.uploadedFiles = files;
      });
    }
    if (this.attachedFiles) {
      this.attachedFiles.pendingFiles.subscribe(state => {
        this.pendingFiles = state;
      });
    }
    if (this.attachedFiles) {
      this.attachedFiles.allCompleted.subscribe(state => {
        this.allSent = state;
      });
    }
  }
  completed($event) {
    this.allSent = $event;
  }
  sendAll($event) {
    this.attachedFiles.uploadAllFiles();
  }
  addPdf() {
    if (this.attachedFiles) {
      this.attachedFiles.uploadFile('.pdf');
    }
  }
  getPdfFiles() {
    return this.uploadedFiles.filter(items => items.scoreFileType.toString() == ScoreFileType[ScoreFileType.PDF]);
  }
  addMscz() {
    if (this.attachedFiles) {
      this.attachedFiles.uploadFile('.mscz');
    }
  }
  getMsczFiles() {
    return this.uploadedFiles.filter(items => items.scoreFileType.toString() == ScoreFileType[ScoreFileType.MSCZ]);
  }
  addImage() {
    if (this.attachedFiles) {
      this.attachedFiles.uploadFile('image/*');
    }
  }
  getImageFiles() {
    return this.uploadedFiles.filter(items => items.scoreFileType.toString() == ScoreFileType[ScoreFileType.IMAGE]);
  }
  addOther() {
    if (this.attachedFiles) {
      this.attachedFiles.uploadFile(' ');
    }
  }
  getOtherFiles() {
    return this.uploadedFiles.filter(items => items.scoreFileType.toString() == ScoreFileType[ScoreFileType.OTHER]);
  }
  getAllFiles() {
    return this.uploadedFiles;
  }
  reset(saved: boolean) {
    this.attachedFiles.reset(saved);
  }
}
