import { Component, OnInit, Input, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { ScoreFileType } from '@app/shared/scoreFileType.enum';
import { Instrument } from '@app/shared/instrument';
import { ScoreTitle } from '@app/shared/scoreTitle';
import { Observable } from 'rxjs/Observable';
import { PDFFile } from '@app/shared/PDFFile';
import { RestService } from '@app/shared/service/rest.service';
import { ScoreType } from '@app/shared/scoreType.enum';
import { GenericFile } from '@app/shared/GenericFile';
import { FileInfo } from '@app/file-add/fileInfo';
import { clearTimeout } from 'timers';

@Component({
  selector: 'app-file-loader-item',
  templateUrl: './file-loader-item.component.html',
  styleUrls: ['./file-loader-item.component.css']
})
export class FileLoaderItemComponent implements OnInit {
  @ViewChild('inp') inp: ElementRef;
  @Input() loaded: boolean = false; //output
  @Input()
  set file(file: File) {
    this._file = file;
    if (file) {
      this.loading = true;
      this.fileName = file.name;
      this.timeout = setTimeout(() => {
        this.uploadFile(file);
      }, 1000);
    }
  }
  get file() { return this._file; }
  @Input() loading: boolean = false;
  @Output() removed: EventEmitter<number> = new EventEmitter();
  @Output() completed: EventEmitter<GenericFile> = new EventEmitter();
  private _file: File;
  public status = this.loaded ? 'done' : 'clear';
  private timeout;
  private timeout2;
  @Input() fileType: ScoreFileType = {} as ScoreFileType;
  @Input() scoreTitle: ScoreTitle = {} as ScoreTitle;
  @Input() instrument: Instrument = {} as Instrument;
  @Input() scoreType: ScoreType = {} as ScoreType;
  fileName = '';
  savedFile: GenericFile;

  constructor(private restService: RestService) { }
  ngOnInit() {
  }
  iconClick() {
    clearTimeout(this.timeout);
    clearTimeout(this.timeout2);
    this.fileName = undefined;
    this.loading = false; this.loaded = true;
    this.file = undefined;
    this.fileType = undefined;
    this.scoreTitle = undefined;
    this.instrument = undefined;
    this.scoreType = undefined;
    this.savedFile = undefined;
    this.completed.unsubscribe();
    this.removed.emit();
    this.removed.unsubscribe();
  }

  private uploadFile(file: File): void {
    this.loading = true;
    this.fileName = file.name;
    let fileInfo = {
      instrumentId: this.instrument.id,
      scoreTypeId: this.scoreType.id,
      titleId: this.scoreTitle.id,
      scoreFileType: this.fileType
    } as FileInfo;
    const fileN = { fileExtension: ScoreFileType[this.fileType], scoreTitle: this.scoreTitle, instrument: this.instrument, id: 0, scoreFileType: this.fileType, scoreType: this.scoreType } as GenericFile;
    // this.completed.emit(fileN); 
    this.timeout2= setTimeout(() => {
      this.loading = false;
      this.loaded = true;
      this.savedFile = fileN;
      this.completed.emit(fileN);
    }, 4000);
    // if (fileInfo.instrumentId && fileInfo.titleId && fileInfo.scoreTypeId) {
    //   this.genericRestFileUpload(file, fileInfo).subscribe(resp => {
    //     this.loading = false;
    //     this.loaded = true;
    //     this.savedFile = resp;
    //     this.completed.emit(resp);
    //   }, err => {
    //     console.log(err);
    //     this.loading = false;
    //     this.loaded = true;
    //   });
    // } else {
    //   this.loading = false;
    //   this.loaded = true;

    //   console.log('i ' + fileInfo.instrumentId + 't ' + fileInfo.titleId + 'st ' + fileInfo.scoreTypeId);
    // }
  }

  createPDF(resp: PDFFile) {
    return null;
  }
  genericRestFileUpload(file: File, fileInfo: FileInfo): Observable<GenericFile> {
    let genericFile: GenericFile;
    switch (fileInfo.scoreFileType) {
      case ScoreFileType.PDF:
        this.restService.uploadPDF(file, fileInfo).subscribe(resp => {
          genericFile = resp;
        }, err => console.log(err));
        break;
      case ScoreFileType.MSCZ:
        this.restService.uploadMSCZ(file, fileInfo).subscribe(resp => {
          genericFile = resp;
        }, err => console.log(err));
      case ScoreFileType.IMAGE:
        this.restService.uploadImage(file, fileInfo).subscribe(resp => {
          genericFile = resp;
        }, err => console.log(err));
        break;
      case ScoreFileType.OTHER:
        this.restService.uploadOther(file, fileInfo).subscribe(resp => {
          genericFile = resp;
        }, err => console.log(err));
        break;
    }
    return Observable.create(genericFile);
  }
}
