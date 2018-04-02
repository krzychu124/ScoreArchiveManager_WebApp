import { Component, OnInit, Input, ViewChild, ElementRef, Renderer2, AfterViewInit, Output, EventEmitter, ViewChildren, QueryList, ChangeDetectorRef, ViewContainerRef, ComponentFactoryResolver, ComponentRef } from '@angular/core';
import { ScoreFileType } from '@app/shared/scoreFileType.enum';
import { ScoreTitle } from '@app/shared/scoreTitle';
import { Instrument } from '@app/shared/instrument';
import { ScoreType } from '@app/shared/scoreType.enum';
import { GenericFile } from '@app/shared/GenericFile';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import "rxjs/add/observable/merge";
import { ProcessingState } from '@app/file-add/processing-state';
import { FileLoaderItemComponent } from '@app/file-add/file-loader-item/file-loader-item.component';
import { MatListItem } from '@angular/material';

@Component({
  selector: 'app-file-loader',
  templateUrl: './file-loader.component.html',
  styleUrls: ['./file-loader.component.css'],
  entryComponents: [FileLoaderItemComponent, MatListItem]
})
export class FileLoaderComponent implements OnInit, AfterViewInit {
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('itemList', { read: ViewContainerRef }) itemList: ViewContainerRef;
  @Input() fileType: ScoreFileType = {} as ScoreFileType;
  @Input() scoreTitle: ScoreTitle = {} as ScoreTitle;
  @Input() instrument: Instrument = {} as Instrument;
  @Input() scoreType: ScoreType = {} as ScoreType;
  
  @Output() pendingFiles = new EventEmitter<boolean>();
  @Output() processing = new EventEmitter<boolean>();
  @Output() allCompleted = new EventEmitter<boolean>();
  @Output() removed = new EventEmitter<GenericFile>();
  
  private listItemsComponents: Array<ComponentRef<FileLoaderItemComponent>> = [];
  private files: Array<GenericFile> = [];
  private uploadedFilesSource = new BehaviorSubject<Array<GenericFile>>([]);
  public uploadedFiles: Observable<Array<GenericFile>> = this.uploadedFilesSource.asObservable();
  completed: boolean;
  private pendingFilesCount:number = 0;
  constructor(private renderer: Renderer2, private cd: ChangeDetectorRef, private resolver: ComponentFactoryResolver) { }

  ngOnInit() { }

  ngAfterViewInit(): void {
    this.cd.detectChanges();
  }

  createListItem(file: File, scoreFileType: ScoreFileType) {
    const fileLoaderFactory = this.resolver.resolveComponentFactory(FileLoaderItemComponent);

    const fileLoaderRef = this.itemList.createComponent(fileLoaderFactory);
    fileLoaderRef.instance.setFileProps(scoreFileType, this.scoreTitle, this.instrument, this.scoreType);
    fileLoaderRef.instance.file = file;
    fileLoaderRef.instance.componentId = this.randomString();
    this.subToEmitters(fileLoaderRef.instance);

    this.listItemsComponents.push(fileLoaderRef);
    this.cd.detectChanges();
  }
  private subToEmitters(instance: FileLoaderItemComponent) {
    if (instance) {
      instance.removed.subscribe(itemId => {
        const i = this.listItemsComponents.filter(item => item.instance.componentId === itemId)[0];//get component ref
        this.itemList.remove(this.itemList.indexOf(i.hostView));//remove component from view
        this.unsubAll(i.instance); //unsub emitters
        this.files.splice(this.files.indexOf(i.instance.savedFile), 1); //remove uploaded files from component
        this.uploadedFilesSource.next(this.files);//send updated files array to subscribers
        const index = this.listItemsComponents.indexOf(i);
        this.listItemsComponents.splice(index, 1);//remove ref from helper array
        this.pendingFilesCount--;
        this.updatePending();
      });
      instance.completed.subscribe(file => {
        this.files.push(file);
        this.uploadedFilesSource.next(this.files);
        this.updateCompleted();
      });
    }
  }
  private unsubAll(instance: FileLoaderItemComponent) {
    instance.removed.unsubscribe();
    instance.completed.unsubscribe();
  }
  protected addToUpload($event: Event) {
    const input: HTMLInputElement = $event.target as HTMLInputElement;
    for (let index = 0; index < input.files.length; index++) {
      this.createListItem(input.files[index], this.resolveScoreFileType(input.accept));
      this.pendingFilesCount++;
    }
    this.pendingFiles.emit(true);
    this.allCompleted.emit(false);
    input.value = '';
  }
  private updatePending(){
    let pending:boolean = false;
    for (let index = 0; index < this.listItemsComponents.length; index++) {
      if(!this.listItemsComponents[index].instance.fileUploaded){
        pending = true;
        break;
      }
    }
    this.pendingFiles.emit(pending);
  }

  private updateCompleted(){
    let completed:boolean = true;
    for (let index = 0; index < this.listItemsComponents.length; index++) {
      if(!this.listItemsComponents[index].instance.savedFile){
        completed = false;
        break;
      }
    }
    this.allCompleted.emit(completed);
  }

  public uploadFile(acceptFiles: string) {
    if (acceptFiles) {
      this.renderer.setAttribute(this.fileInput.nativeElement, "accept", acceptFiles);
    }
    this.fileInput.nativeElement.click();
  }

  public uploadAllFiles(){
    const observables: Array<Observable<GenericFile>> = [];
    this.listItemsComponents.forEach(file => {
      observables.push(file.instance.completed.asObservable());
      file.instance.upload();
    });
  }
  public getPendingFilesCount() {
    return this.pendingFilesCount;
  }

  public reset(saved: boolean) {
    this.files = [];
    this.uploadedFilesSource.next(this.files);
    this.listItemsComponents.forEach(item => {
      item.instance.remove(false);//.removeFile(saved);
      this.itemList.remove(this.itemList.indexOf(item.hostView));
      this.unsubAll(item.instance);
    });
    this.listItemsComponents = [];
    this.pendingFilesCount = 0;
    this.pendingFiles.emit(false);
    this.allCompleted.emit(true);
    this.processing.emit(false);
  }
  private resolveScoreFileType(acceptFiles: string) {
    switch (acceptFiles) {
      case '.pdf':
        return ScoreFileType.PDF
      case '.mscz':
        return ScoreFileType.MSCZ;
      case 'image/*':
        return ScoreFileType.IMAGE;
      default:
        return ScoreFileType.OTHER;
    }
  }
  private randomString() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
}
