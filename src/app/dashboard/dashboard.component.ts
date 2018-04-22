import { Component, OnInit } from '@angular/core';
import { ScoreTitle } from '../shared/scoreTitle';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { FileInfo } from '../shared/fileInfo';
import { ScoreFileType } from '../shared/scoreFileType.enum';
import { saveAs as importedSaveAs } from "file-saver";
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthorizationService } from '@app/shared/service/authorization.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  //Work in progress
  title = 'Archiwum utworów';
  description = 'Playground';
  options: FormGroup;
  isExpanded = false;
  constructor(fb: FormBuilder, private auth: AuthorizationService, private router: Router) {
    this.options = fb.group({
      'fixed': true,
      'top': 0,
      'bottom': 0,
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
  showMenu() {
    
  }
  logout() {
    this.auth.logout().subscribe(() => this.router.navigate(['/']));
  }
}
