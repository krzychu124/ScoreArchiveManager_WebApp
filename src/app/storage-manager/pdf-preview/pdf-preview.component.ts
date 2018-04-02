import { Component, OnInit, Inject } from '@angular/core';
import { RestService } from '@app/shared/service/rest.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-pdf-preview',
  templateUrl: './pdf-preview.component.html',
  styleUrls: ['./pdf-preview.component.css']
})
export class PdfPreviewComponent implements OnInit {
  protected downloading: boolean;
  protected imageSource: string;
  constructor(private rest: RestService, @Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<PdfPreviewComponent>) { }

  ngOnInit() {
    this.downloading = true;
    this.rest.getPDFBase64(this.data).subscribe(resp => {
      this.downloading = false;
      this.imageSource = 'data:image/png;base64,' + resp.content;
    }, err => {
      this.downloading = false;
      console.error(err);
      this.dialogRef.close();
    });
  }

}
