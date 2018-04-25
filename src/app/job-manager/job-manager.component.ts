import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { JobFormComponent } from '@app/add-edit-forms/job-form/job-form.component';
import { JobBasic } from '@app/shared/job-basic';
import { RestService } from '@app/shared/service/rest.service';
import { JobViewEditDialogComponent } from '@app/dialogs/job-view-edit-dialog/job-view-edit-dialog.component';
import 'rxjs/add/observable/throw';

@Component({
  selector: 'app-job-manager',
  templateUrl: './job-manager.component.html',
  styleUrls: ['./job-manager.component.css']
})
export class JobManagerComponent implements OnInit {

  newJobs: JobBasic[] = [];
  inProgressJobs: JobBasic[] = [];
  finishedJobs: JobBasic[] = [];
  constructor(private dialog: MatDialog, private rest: RestService) { }

  ngOnInit() {
    this.refreshNewJobsList();
    this.refreshInProgress();
    this.refreshFinished();
  }
  createJob() {
    const jobDialog = this.dialog.open(JobFormComponent, { minWidth: '400px' });
    jobDialog.afterClosed().subscribe(() => {
      this.refreshNewJobsList();
    });
  }
  refreshNewJobsList() {
    this.rest.getNewJobs().subscribe(resp => {
      this.newJobs = resp.sort((a, b) => {
        return b.id - a.id;
      });
    }, err => console.error(err));
  }
  refreshInProgress() {
    this.rest.getInProgressJobs().subscribe(resp => {
      this.inProgressJobs = resp.sort((a, b) => {
        return b.id - a.id;
      });
    }, err => console.error(err));
  }
  refreshFinished() {
    this.rest.getFinishedJobs().subscribe(resp => {
      this.finishedJobs = resp.sort((a, b) => {
        return b.id - a.id;
      });
    }, err => console.error(err));
  }
  details(id: number) {
    const dialog = this.dialog.open(JobViewEditDialogComponent, { data: id, minWidth: '400px' });
    dialog.afterClosed().subscribe(val => {
      if (val) {
        this.refreshInProgress();
        this.refreshFinished();
      }
    });
  }
}
