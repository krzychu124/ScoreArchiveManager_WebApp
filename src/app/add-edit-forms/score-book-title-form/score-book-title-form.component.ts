import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormGroupDirective } from '@angular/forms';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { ScoreBookTitle } from '@app/shared/scoreBookTitle';

@Component({
  selector: 'app-score-book-title-form',
  templateUrl: './score-book-title-form.component.html',
  styleUrls: ['./score-book-title-form.component.css']
})
export class ScoreBookTitleFormComponent implements OnInit {
  name: FormControl;
  error = null;
  scoreBookTitleForm: FormGroup;
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.createFormControls();
    this.createForm();
  }
  createFormControls() {
    this.name = new FormControl('', Validators.required);
  }

  createForm() {
    this.scoreBookTitleForm = new FormGroup({
      name: this.name
    });
  }

  add(formDirective: FormGroupDirective) {
    const title = new ScoreBookTitle(this.name.value);
    this.error = null;
    this.http.post(environment.server + environment.scoreBookTitle_endpoint, title).subscribe(resp => {
      this.clear(formDirective);
    }, err => {
      this.error = err;
    })
  }

  clear(formDirective: FormGroupDirective) {
    this.scoreBookTitleForm.reset();
    formDirective.resetForm();
  }

}
