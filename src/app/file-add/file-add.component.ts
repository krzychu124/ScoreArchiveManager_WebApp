import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ScoreFileType } from '@app/shared/scoreFileType.enum';
import { ScoreTitle } from '@app/shared/scoreTitle';
import { ScoreType } from '@app/shared/scoreType.enum';
import { Instrument } from '@app/shared/instrument';
import { GenericFile } from '@app/shared/GenericFile';
import { FileLoaderComponent } from '@app/file-add/file-loader/file-loader.component';
import { ProcessingState } from '@app/file-add/processing-state';

@Component({
  selector: 'app-file-add',
  templateUrl: './file-add.component.html',
  styleUrls: ['./file-add.component.css']
})
export class FileAddComponent implements OnInit, AfterViewInit {
  @ViewChild('pdfFiles') pdfFiles: FileLoaderComponent;
  @ViewChild('msczFiles') msczFiles: FileLoaderComponent;
  @ViewChild('imageFiles') imageFiles: FileLoaderComponent;
  @ViewChild('otherFiles') otherFiles: FileLoaderComponent;
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
  constructor() { }

  ngOnInit() {
  }
  ngAfterViewInit(){
    if(this.pdfFiles) {
      this.pdfFiles.uploadedFiles.subscribe(files => {
        this.pdf=files; 
        console.log(files.length);
      });
    }
    if(this.msczFiles) {
      this.msczFiles.uploadedFiles.subscribe(files => {
        this.mscz =files; 
        console.log(files.length);
      });
    }
    if(this.imageFiles) {
      this.imageFiles.uploadedFiles.subscribe(files => {
        this.image = files;  
        console.log(files.length);
      });
    }
    if(this.otherFiles) {
      this.otherFiles.uploadedFiles.subscribe(files => {
        this.other = files;  
        console.log(files.length);
      });
    }
  }
  addPdf() {
    if(this.pdfFiles) {
      this.pdfFiles.uploadFile();
    }
  }
  addMscz() {
    if(this.msczFiles) {
      this.msczFiles.uploadFile();
    }
  }
  addImage() { 
    if(this.imageFiles) {
      this.imageFiles.uploadFile();
    }
  }
  addOther() { 
    if(this.otherFiles){
      this.otherFiles.uploadFile();
    }
  }

  reset() {
    this.pdf = [];
    this.mscz = [];
    this.image = [];
    this.other = [];
    this.pdfProcessing = false;
    this.msczProcessing = false;
    this.imageProcessing = false;
    this.otherProcessing = false;
  }
  processing($event: ProcessingState) {
    switch($event.fileType) {
      case ScoreFileType.PDF:
      this.pdfProcessing = $event.inProgress;
      break;
      case ScoreFileType.MSCZ:
      this.msczProcessing = $event.inProgress;
      break;
      case ScoreFileType.IMAGE:
      this.imageProcessing = $event.inProgress;
      break;
      case ScoreFileType.OTHER:
      this.otherProcessing = $event.inProgress;
      break;
    }
  }
}
