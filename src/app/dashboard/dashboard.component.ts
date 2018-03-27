import { Component, OnInit } from '@angular/core';
import { ScoreTitle } from '../shared/scoreTitle';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { FileInfo } from '../shared/fileInfo';
import { ScoreFileType } from '../shared/scoreFileType.enum';
import { saveAs as importedSaveAs } from "file-saver";
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  //Work in progress
  title = 'Score Archive Manager';
  description = 'Playground';
  events = [];
  options: FormGroup;
  isExpanded = false;
  fileList: FileList;
  titles = Array<ScoreTitle>();
  scoreTypes = ["OTHER", "FUNERAL", "MARCH"];
  newTitle = { id: null, title: null, number: null, scoreType: null } as ScoreTitle;
  storageFileList: Array<string> = [];
  constructor(fb: FormBuilder, private http: HttpClient) {
    this.options = fb.group({
      'fixed': true,
      'top': 0,
      'bottom': 0,
    });
  }
  onClick($event) {
    console.log(this.fileList);
    this.http.get(environment.server + environment.scoreTitle).subscribe(resp => {
      this.titles = resp as Array<ScoreTitle>;
    }, err => {
      console.log(err);
    });
    // $event.preventDefault();
  }
  add() {
    const scoreTitle = this.newTitle;
    this.http.post(environment.server + environment.scoreTitle, scoreTitle).subscribe(resp => {
      this.onClick(null);
    }, err => {
      console.log(err);
    });
  }
  save() {
    let formData = new FormData();
    formData.append('file', this.fileList[0]);
    const fileInfo = { name: this.fileList[0].name, scoreType: 'OTHER' } as FileInfo;
    formData.append('fileInfo', new Blob([JSON.stringify(fileInfo)], { type: 'application/json' }));
    this.http.post(environment.server + environment.pdfEndpoint, formData).subscribe(resp => {
      console.log(resp);
    }, err => {
      console.log(err);
    });
  }
  get() {
    let params = new HttpParams();
    params = params.append('name', 'textFile');
    this.http.get(environment.server + environment.pdfEndpoint, { params: params }).subscribe(resp => {
      console.log(resp);
      const blob = new Blob([resp]);
      let f = new FileReader();
      importedSaveAs(new Blob([resp]), 'files.mss');
    }, err => {
      console.log(err);
    });
  }
  selectFile(event) {
    this.fileList = event.target.files;
  }

  getFileList() {
    const fileType = ScoreFileType.PDF;
    let params = new HttpParams();
    params = params.append('fileType', ScoreFileType[fileType]);
    this.http.get(environment.server + environment.storage + '/fileList', { params: params }).subscribe(resp => {
      console.log(resp);
      this.storageFileList = resp as Array<string>;
    }, err => {
      console.log(err);
    });
  }
  mouseOver($event) {
    if (!this.isExpanded) {
      this.isExpanded = true;
    }
  }
  mouseOut($event) {
    if (this.isExpanded) {
      this.isExpanded = false;
    }
  }
}
