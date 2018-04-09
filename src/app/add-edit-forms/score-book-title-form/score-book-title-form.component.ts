import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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
  @Output() scoreBookTitleAdded: EventEmitter<boolean> = new EventEmitter();
  name: FormControl;
  scoreBookTitleForm: FormGroup;
  error = null;

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
    this.http.post(environment.apiServer + environment.scoreBookTitle_endpoint, title).subscribe(resp => {
      this.clear(formDirective);
      this.scoreBookTitleAdded.emit(true);
    }, err => {
      this.error = err;
      this.scoreBookTitleAdded.emit(false);
    });
  }

  clear(formDirective: FormGroupDirective) {
    this.scoreBookTitleForm.reset();
    formDirective.resetForm();
  }

}
