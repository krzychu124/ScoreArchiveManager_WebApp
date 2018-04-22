import { Component, OnInit, Input, ViewChild, ElementRef, EventEmitter, Output, AfterViewInit } from '@angular/core';
import { ScoreFileType } from '@app/shared/scoreFileType.enum';
import { Instrument } from '@app/shared/instrument';
import { ScoreTitle } from '@app/shared/scoreTitle';
import { Observable } from 'rxjs/Observable';
import { PDFFile } from '@app/shared/PDFFile';
import { RestService } from '@app/shared/service/rest.service';
import { ScoreType } from '@app/shared/scoreType.enum';
import { GenericFile } from '@app/shared/GenericFile';
import { FileInfo } from '@app/file-add/fileInfo';
import 'rxjs/add/operator/mergeMap';
import { mergeMap } from 'rxjs/operators';
import 'rxjs/add/observable/of';


@Component({
  selector: 'app-file-loader-item',
  templateUrl: './file-loader-item.component.html',
  styleUrls: ['./file-loader-item.component.css']
})
export class FileLoaderItemComponent implements OnInit {
  private _file;
  @Input()
  set file(file: File) { this._file = file; if (file) { this.fileName = file.name; } };
  get file() { return this._file; };
  @Input() loading: boolean = false;
  @Output() removed: EventEmitter<string> = new EventEmitter();
  @Output() completed: EventEmitter<GenericFile> = new EventEmitter()
  @Input() fileType: ScoreFileType = {} as ScoreFileType;
  @Input() scoreTitle: ScoreTitle = {} as ScoreTitle;
  @Input() instrument: Instrument = {} as Instrument;
  @Input() scoreType: ScoreType = {} as ScoreType;
  protected fileName: string;
  public fileUploaded: boolean = false;
  public componentId: string;
  public savedFile: GenericFile;
  public removing;
  public readyToUpload = true;
  public status = this.fileUploaded ? 'done' : 'clear';
  constructor(private restService: RestService) { }
  ngOnInit() {
  }
  reset() {
    this.loading = false;
    this.fileUploaded = false;
    this.file = undefined;
    this.fileName = undefined;
    this.scoreTitle = undefined;
    this.instrument = undefined;
    this.scoreType = undefined;
    this.savedFile = undefined;
    this.removed.emit(this.componentId);
    this.fileType = undefined;
    this.removed.unsubscribe();
    this.completed.unsubscribe();
  }
  public upload() {
    if (this.file) {
      this.fileName = this.file.name;
      this.uploadFile(this.file);
    }
  }
  public setFileProps(fileType: ScoreFileType, scoreTitle: ScoreTitle, instrument: Instrument, scoreType: ScoreType) {
    this.fileType = fileType;
    this.scoreTitle = scoreTitle;
    this.instrument = instrument;
    this.scoreType = scoreType;
  }
  private uploadFile(file: File): void {
    this.loading = true;
    let fileInfo = {
      instrumentId: (this.instrument && this.instrument.id) || 0,
      scoreTypeId: (this.scoreType && this.scoreType.id) || 0,
      titleId: (this.scoreTitle && this.scoreTitle.id) || 0,
      scoreFileType: this.fileType
    } as FileInfo;
    // if (fileInfo.instrumentId && fileInfo.titleId && fileInfo.scoreTypeId) {
      this.genericRestFileUpload(file, fileInfo).subscribe(resp => {
        this.loading = false;
        this.fileUploaded = true;
        this.file = null;
        this.savedFile = resp;
        this.completed.emit(resp);
      }, err => {
        console.log(err);
        this.loading = false;
        this.fileUploaded = false;
      });
    // } else {
    //   this.loading = false;
    //   this.fileUploaded = false;
    //   console.error('Missing info to send file...: ' + 'fileType' + fileInfo.scoreFileType + 'instrumentId: ' + fileInfo.instrumentId + ' titleId: ' + fileInfo.titleId + ' scoreTypeId: ' + fileInfo.scoreTypeId);
    // }
  }
  remove(emit?) {
    this.removing = false;
    this.file = null;
    this.fileName = null;
    this.savedFile = null;
    if (emit) {
      this.removed.emit(this.componentId);
    }
  }

  /**
   * Removes file from view and from database only if parameter set to false or skipped 
   * @param skipFileRemovalFromDB set true if want to skip removing uploaded file from database
   */
  removeFile(skipFileRemovalFromDB?: boolean) {
    if (!skipFileRemovalFromDB && this.savedFile && this.savedFile.id) {
      this.removing = true;
      this.restService.deletePermanently(this.savedFile.id).subscribe(resp => {
        this.removing = false;
        this.file = null;
        this.savedFile = null;
        this.fileName = null;
        if (this.removed.observers.length > 0) {
          this.removed.emit(this.componentId);
        }
      }, err => {
        this.removing = false;
        console.error("File remove failed :/");
        console.error(err);
      });
    } else {
      this.remove();
    }
  }
  removeFromDB(): Observable<boolean> {
    return this.restService.deletePermanently(this.savedFile.id).flatMap(resp => {
      this.removing = false;
      this.file = null;
      this.savedFile = null;
      this.fileName = null;
      if (this.removed.observers.length > 0) {
        this.removed.emit(this.componentId);
      }
      return Observable.of(true);
    });
  }

  genericRestFileUpload(file: File, fileInfo: FileInfo): Observable<GenericFile> {
    return this.restService.uploadFile2(file, fileInfo);
  }
}
