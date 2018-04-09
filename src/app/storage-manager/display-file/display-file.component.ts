import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FileWithMetadata } from '@app/shared/fileWithMetadata';
import { GenericFile } from '@app/shared/GenericFile';
import { RestService } from '@app/shared/service/rest.service';
import { saveAs as importedSaveAs } from "file-saver";
import { MatDialog } from '@angular/material';
import { PdfPreviewComponent } from '@app/storage-manager/pdf-preview/pdf-preview.component';
import { ScrollStrategyOptions, RepositionScrollStrategy } from '@angular/cdk/overlay';

@Component({
  selector: 'app-display-file',
  templateUrl: './display-file.component.html',
  styleUrls: ['./display-file.component.css']
})
export class DisplayFileComponent implements OnInit {
  @Input() data: GenericFile;
  @Output() removed: EventEmitter<boolean> = new EventEmitter();
  protected title: string;
  protected subtitle: string;
  protected scoreType: string;
  protected fileType: string;
  protected fileSize: number;
  protected deleted: boolean;
  protected attached: number;
  protected imageData: string;
  constructor(private rest: RestService, private dialog: MatDialog) { }

  ngOnInit() {
    this.title = this.data.scoreTitle.title;
    this.subtitle = this.data.instrument.name + ' ' + this.data.instrument.voiceNumber;
    this.scoreType = this.data.scoreType.name_pl;
    this.fileSize = this.data.fileSize / 1000;
    this.fileType = this.data.fileExtension;
    this.deleted = this.data.deleted;
    this.attached = this.data.scoreId;
    this.imageData = 'data:image/png;base64,' + this.data.thumbnail;
  }

  preview() {

  }
  download($event) {
    this.rest.downloadFile(this.data.fileName).subscribe(resp => {
      var contentDispositionHeader = resp.headers.get('Content-Disposition');
      var result = contentDispositionHeader.split(';')[1].trim().split(':')[1].trim();
      const fileName = result.replace(/"/g, '');
      importedSaveAs(resp.body, fileName);
    }, err => {
      console.error(err);
      alert(JSON.stringify(err));
    });
    $event.preventDefault();
  }
  openDialog() {
    const dialogRef = this.dialog.open(PdfPreviewComponent, { data: this.data.fileName});
  }
  remove() {
    this.removed.emit(true);
  }
  generateThumb() {
    this.rest.generateThumb(this.data.fileName).subscribe(resp => {
    }, err => console.error(err));
  }
}
