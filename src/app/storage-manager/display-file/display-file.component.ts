import { Component, OnInit, Input } from '@angular/core';
import { FileWithMetadata } from '@app/shared/fileWithMetadata';
import { GenericFile } from '@app/shared/GenericFile';
import { RestService } from '@app/shared/service/rest.service';
import { saveAs as importedSaveAs } from "file-saver";

@Component({
  selector: 'app-display-file',
  templateUrl: './display-file.component.html',
  styleUrls: ['./display-file.component.css']
})
export class DisplayFileComponent implements OnInit {
  @Input() data: GenericFile;
  title: string;
  subtitle: string;
  scoreType: string;
  fileType: string;
  fileSize: number;
  constructor(private rest: RestService) { }

  ngOnInit() {
    this.title = this.data.scoreTitle.title;
    this.subtitle = this.data.instrument.name + ' ' + this.data.instrument.voiceNumber;
    this.scoreType = this.data.scoreType.name_pl;
    this.fileSize = this.data.fileSize / 1000;
    this.fileType = this.data.fileExtension;
  }

  preview() {

  }
  download($event) {
    this.rest.downloadFile(this.data.fileName).subscribe(resp => {
      // console.log(resp);
      var contentDispositionHeader = resp.headers.get('Content-Disposition');
      var result = contentDispositionHeader.split(';')[1].trim().split(':')[1].trim();
      const fileName =  result.replace(/"/g, '');
      importedSaveAs(resp.body, fileName);
    }, err => console.error(err));
    $event.preventDefault();
  }
}
