import { Component, OnInit, Input, ViewChild, ElementRef, Renderer2, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { ScoreFileType } from '@app/shared/scoreFileType.enum';
import { ScoreTitle } from '@app/shared/scoreTitle';
import { Instrument } from '@app/shared/instrument';
import { ScoreType } from '@app/shared/scoreType.enum';
import { GenericFile } from '@app/shared/GenericFile';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { ProcessingState } from '@app/file-add/processing-state';

@Component({
  selector: 'app-file-loader',
  templateUrl: './file-loader.component.html',
  styleUrls: ['./file-loader.component.css']
})
export class FileLoaderComponent implements OnInit, AfterViewInit {
  @ViewChild('fileInput') fileInput: ElementRef;
  @Input() Title: string = 'Title';
  @Input() fileType: ScoreFileType = {} as ScoreFileType;
  @Input() scoreTitle: ScoreTitle = {} as ScoreTitle;
  @Input() instrument: Instrument = {} as Instrument;
  @Input() scoreType: ScoreType = {} as ScoreType;
  @Output() processing = new EventEmitter<ProcessingState>();
  private files: Array<GenericFile> = [];
  private uploadedFilesSource = new BehaviorSubject<Array<GenericFile>>([]);
  protected uploadingFiles = [];
  public uploadedFiles: Observable<Array<GenericFile>> = this.uploadedFilesSource.asObservable();

  constructor(private renderer: Renderer2) { }
  ngOnInit() { }
  ngAfterViewInit(): void {
  }

  uploadNewFile($event: Event) {
    // console.log($event);
    const input: HTMLInputElement = $event.target as HTMLInputElement;
    this.uploadingFiles.push(input.files[0]);
    input.value = '';
    this.processing.emit({inProgress: true, fileType: this.fileType} as ProcessingState);
  }
  fileRemoved(index: number) {
    console.log('removed file with index: ' + index + ' fileExt: '+ this.files[index].fileExtension);
    // add rest call to remove from db
    this.files.splice(index, 1);
    this.uploadedFilesSource.next(this.files);
    this.uploadingFiles.splice(index, 1);
    this.processing.emit({inProgress: false, fileType: this.fileType} as ProcessingState);//cancel processing
  }
  completed(file: GenericFile) {
    console.log(file);
    this.files.push(file);
    this.uploadedFilesSource.next(this.files);
    this.processing.emit({inProgress: false, fileType: this.fileType} as ProcessingState);
  }
  uploadFile() {
    this.fileInput.nativeElement.click();
  }
}
