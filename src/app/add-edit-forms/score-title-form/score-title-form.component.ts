import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ScoreType } from '@app/shared/scoreType.enum';
import { FormControl, FormGroup, Validators, FormGroupDirective, FormControlDirective } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { ScoreTitle } from '@app/shared/scoreTitle';
import { isNumber } from 'util';
import { Observable } from 'rxjs/Observable';
import { DataService } from '@app/shared/service/data.service';
import { DbDictionariesService } from '@app/shared/service/db-dictionaries.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-score-title-form',
  templateUrl: './score-title-form.component.html',
  styleUrls: ['./score-title-form.component.css']
})
export class ScoreTitleFormComponent implements OnInit, OnDestroy {
  @Output() scoreTitleAdded: EventEmitter<boolean> = new EventEmitter();
  private ngUnsubscribe = new Subject();
  scoreTypes: Array<any> = [];
  title: FormControl;
  number: FormControl;
  scoreType: FormControl;
  error = null;
  scoreTitleForm: FormGroup;
  processingAnim: boolean = false; //TODO add animations
  constructor(private http: HttpClient, private dataService: DataService) { }

  ngOnInit() {
    this.dataService.scoreTypes.pipe(takeUntil(this.ngUnsubscribe)).subscribe(value => this.scoreTypes = value);
    this.createFormControls();
    this.createForm();
  }
  createFormControls() {
    this.title = new FormControl('', Validators.required);
    this.number = new FormControl('', [Validators.required, Validators.min(1)]);
    this.scoreType = new FormControl('', Validators.required);
  }

  createForm() {
    this.scoreTitleForm = new FormGroup({
      title: this.title,
      number: this.number,
      scoreType: this.scoreType
    });
  }

  add(formDirective: FormGroupDirective) {
    const scoreTitle = new ScoreTitle(this.title.value, this.number.value, this.scoreType.value);
    this.error = null;
    this.http.post(environment.apiServer + environment.scoreTitle, scoreTitle).subscribe(resp => {
      this.error = null;
      this.clear(formDirective);
      this.scoreTitleAdded.emit(true);
    }, err => {
      this.error = JSON.stringify(err.message);
      this.scoreTitleAdded.emit(false);
    });
  }

  clear(formDirective: FormGroupDirective) {
    this.scoreTitleForm.reset();
    formDirective.resetForm();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
