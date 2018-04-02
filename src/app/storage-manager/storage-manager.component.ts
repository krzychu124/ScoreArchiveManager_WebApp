import { Component, OnInit } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { ScoreFileType } from '@app/shared/scoreFileType.enum';
import { GenericFile } from '@app/shared/GenericFile';
import { RestService } from '@app/shared/service/rest.service';
import { ScoreType } from '@app/shared/scoreType.enum';
import { PdfPreviewComponent } from '@app/storage-manager/pdf-preview/pdf-preview.component';

@Component({
  selector: 'app-storage-manager',
  templateUrl: './storage-manager.component.html',
  styleUrls: ['./storage-manager.component.css']
})
export class StorageManagerComponent implements OnInit {
  protected metaDataPDFList: Array<GenericFile> = [];
  protected metaDataMSCZList: Array<GenericFile> = [];
  protected metaDataImageList: Array<GenericFile> = [];
  protected metaDataOtherList: Array<GenericFile> = [];

  constructor(private http: HttpClient, private rest: RestService) { }

  ngOnInit() {
    this.getMetadataList(ScoreFileType.PDF);
    this.getMetadataList(ScoreFileType.MSCZ);
    this.getMetadataList(ScoreFileType.IMAGE);
    this.getMetadataList(ScoreFileType.OTHER);
  }
  getMetadataList(scoreType: ScoreFileType) {
    const e = environment;
    this.rest.getFileMetadataByType(scoreType).subscribe(resp => {
      switch (scoreType) {
        case ScoreFileType.PDF:
          this.metaDataPDFList = resp;
          break;
        case ScoreFileType.MSCZ:
          this.metaDataMSCZList = resp;
          break;
        case ScoreFileType.IMAGE:
          this.metaDataImageList = resp;
          break;
        case ScoreFileType.OTHER:
          this.metaDataOtherList = resp;
          break;
      }
    }, err => {
      console.error(err);
    })
  }
  remove($event) {
    const file = this.metaDataPDFList[$event];
    this.rest.deletePermanently(file.id).subscribe(resp => {
      this.metaDataPDFList.splice($event, 1);
    }, err => {
      console.error(err);
    });
  }
}
