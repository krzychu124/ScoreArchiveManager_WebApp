import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { RestService } from '@app/shared/service/rest.service';
import { JobFull } from '@app/shared/job-full';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { JobType } from '@app/shared/jobType';
import { DatePipe } from '@angular/common';
import { GenericFile } from '@app/shared/GenericFile';
import { PdfPreviewComponent } from '@app/storage-manager/pdf-preview/pdf-preview.component';
import { ScoreFileType } from '@app/shared/scoreFileType.enum';

@Component({
  selector: 'app-job-view-edit-dialog',
  templateUrl: './job-view-edit-dialog.component.html',
  styleUrls: ['./job-view-edit-dialog.component.css']
})
export class JobViewEditDialogComponent implements OnInit {
  jobEditForm: FormGroup;
  name: FormControl;
  jobType: FormControl;
  description: FormControl;
  creator: FormControl;
  lastModifiedBy: FormControl;
  created: FormControl;
  modified: FormControl;
  deleted: FormControl;
  jobInfo: JobFull;
  error: any;
  jobTypes: JobType[] = [];
  constructor(private rest: RestService, private dialogRef: MatDialogRef<JobViewEditDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private dialog:MatDialog) { }

  ngOnInit() {
    if (this.data) {
      this.fetchJobTypes();
      this.initForm();
      this.loadData(this.data);
    }
  }

  loadData(data: any) {
    this.rest.getFullJobData(data).subscribe(resp => {
      this.jobInfo = resp;
      this.fillForm(resp);
    }, err => {
      console.error(err);
      this.dialogRef.close();
    });
  }
  initForm() {
    this.name = new FormControl('', Validators.required);
    this.jobType = new FormControl('', Validators.required);
    this.description = new FormControl('', Validators.required);
    this.creator = new FormControl({ value: '', disabled: true }, Validators.required);
    this.created = new FormControl({ value: '', disabled: true }, Validators.required);
    this.lastModifiedBy = new FormControl({ value: '', disabled: true }, Validators.required);
    this.modified = new FormControl({ value: '', disabled: true }, Validators.required);
    this.deleted = new FormControl({ value: '', disabled: true }, Validators.required);
    this.jobEditForm = new FormGroup({
      name: this.name,
      jobType: this.jobType,
      description: this.description,
      creator: this.creator,
      created: this.created,
      lastModifiedBy: this.lastModifiedBy,
      modified: this.modified,
      deleted: this.deleted
    });
  }
  fillForm(data: JobFull) {
    const datePipe= new DatePipe('en-US');
    const job = this.jobTypes.find(j=>j.id === data.jobType.id);
    this.jobEditForm.setValue({
      name: data.name,
      description: data.description,
      jobType: job,
      creator: data.creator,
      created: datePipe.transform(data.created, 'dd/MM/yyyy hh:mm:ss'),
      lastModifiedBy: data.lastModifiedBy,
      modified: datePipe.transform(data.modified, 'dd/MM/yyyy hh:mm:ss'),
      deleted: data.deleted? 'Tak':'Nie'
    });
  }
  fetchJobTypes() {
    this.rest.getJobTypes().subscribe(resp => {
      this.jobTypes = resp.sort((a, b) => {
        if (a.name_pl > b.name_pl)
          return 1;
        else if (a.name_pl < b.name_pl)
          return -1;
        else
          return 0;
      });
    }, err => {
      console.error(err);
    });
  }
  updateJob() {

  }
  close() {
    this.dialogRef.close();
  }
  preview(item:GenericFile) {
    if(item.scoreFileType.toString() == "PDF"){
    const dialogRef = this.dialog.open(PdfPreviewComponent, { data: item.fileName});
    }
  }
}
