import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { JobType } from '@app/shared/jobType';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RestService } from '@app/shared/service/rest.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { JobBasic } from '@app/shared/job-basic';
import { FileAddComponent } from '@app/file-add/file-add.component';

@Component({
  selector: 'app-job-form',
  templateUrl: './job-form.component.html',
  styleUrls: ['./job-form.component.css']
})
export class JobFormComponent implements OnInit {
  @ViewChild('fileAdd') fileAdd: FileAddComponent;
  name: FormControl;
  jobType: FormControl;
  description: FormControl;
  jobTypes: Array<JobType> = [];
  error: any = null;
  jobForm: FormGroup;
  attachmentsVisible: boolean = false;
  constructor(private rest: RestService, private dialoRef: MatDialogRef<JobFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.name = new FormControl('', Validators.required);
    this.jobType = new FormControl('', Validators.required);
    this.description = new FormControl('', Validators.required);
    this.jobForm = new FormGroup({
      name: this.name,
      jobType: this.jobType,
      description: this.description
    });
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

  createJob() {
    this.error = null;
    const job = { name: this.name.value, jobType: this.jobType.value, description: this.description.value, comments: [], attachedFiles: this.fileAdd ? this.fileAdd.getAllFiles(): []};
    this.rest.createJob(job).subscribe(resp => {
      this.dialoRef.close();
    }, err => this.error = err);
  }
  updateJob() {

  }
  addAttachments() {
    this.attachmentsVisible = true;
    this.dialoRef.updateSize('650px','485px');
  }
}
