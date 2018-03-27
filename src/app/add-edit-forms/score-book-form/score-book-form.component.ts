import { Component, OnInit, OnDestroy } from '@angular/core';
import { ScoreType } from '@app/shared/scoreType.enum';
import { ScoreBookTitle } from '@app/shared/scoreBookTitle';
import { Instrument } from '@app/shared/instrument';
import { ScoreBook } from '@app/shared/scoreBook';
import { HttpClient } from '@angular/common/http';
import { DataService } from '@app/shared/service/data.service';
import { FormControl, Validators, FormGroup, FormGroupDirective } from '@angular/forms';
import { environment } from 'environments/environment';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-score-book-form',
  templateUrl: './score-book-form.component.html',
  styleUrls: ['./score-book-form.component.css']
})
export class ScoreBookFormComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  scoreBook: ScoreBook;
  scoreBookTitle;
  scoreBookTitles: Array<ScoreBookTitle> = [];
  scoreType;
  scoreTypes: Array<ScoreType> = [];
  instrument;
  instruments: Array<Instrument> = [];
  scoreBookForm;
  showFiles: boolean = true;
  error;
  constructor(private http: HttpClient, private dataService: DataService) { }

  ngOnInit() {
    this.dataService.scoreTypes.pipe(takeUntil(this.ngUnsubscribe)).subscribe(value => {
      this.scoreTypes = value;
      this.error = null;
    });
    this.dataService.scoreBookTitles.pipe(takeUntil(this.ngUnsubscribe)).subscribe(value => {
      this.scoreBookTitles = value;
      this.error = null;
    });
    this.dataService.instruments.pipe(takeUntil(this.ngUnsubscribe)).subscribe(value => {
      this.instruments = value;
      this.error = null;
    });
    this.createFormControls();
    this.createForm();
  }
  createFormControls() {
    this.scoreBookTitle = new FormControl('', Validators.required);
    this.scoreType = new FormControl('', Validators.required);
    this.instrument = new FormControl('', Validators.required);
  }

  createForm() {
    this.scoreBookForm = new FormGroup({
      scoreBookTitle: this.scoreBookTitle,
      scoreType: this.scoreType,
      instrument: this.instrument
    });
  }

  add(formDirective: FormGroupDirective) {
    const scoreBook = new ScoreBook(this.scoreType.value as ScoreType, this.scoreBookTitle.value as ScoreBookTitle, this.instrument.value as Instrument);
    this.http.post(environment.server + environment.scoreBook_endpoint, scoreBook).subscribe(resp => {
      this.error = null;
      this.clear(formDirective);
    }, err => {
      this.error = err.message;
    })
  }

  clear(formDirective: FormGroupDirective) {
    this.scoreBookForm.reset();
    formDirective.resetForm();
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
