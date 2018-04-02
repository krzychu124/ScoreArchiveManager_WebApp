import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Score } from '@app/shared/score';
import { FormControl, Validators, FormGroup, FormGroupDirective, FormArray, Form, AbstractControl, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { ScoreTitle } from '@app/shared/scoreTitle';
import { Instrument } from '@app/shared/instrument';
import { DataService } from '@app/shared/service/data.service';
import { ScoreType } from '@app/shared/scoreType.enum';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { FileAddComponent } from '@app/file-add/file-add.component';

@Component({
  selector: 'app-score-form',
  templateUrl: './score-form.component.html',
  styleUrls: ['./score-form.component.css']
})
export class ScoreFormComponent implements OnInit, OnDestroy {
  @ViewChild('fileAdd') fileAdd: FileAddComponent;
  private ngUnsubscribe = new Subject();
  score: Score;
  scoreForm: FormGroup;
  typeGroup: FormGroup;
  titleGroup: FormGroup;
  instrumentGroup: FormGroup;
  scoreTitle: FormControl;
  scoreType: FormControl;
  instrument: FormControl;
  scoreTitles: Array<ScoreTitle> = [];
  scoreTypes: Array<ScoreType> = [];
  instruments: Array<Instrument> = [];
  showFiles: boolean = true;
  pendingFiles: boolean = false;
  error: any;
  // get formArray(): AbstractControl | null { return this.scoreForm.get('formArray'); }
  constructor(private http: HttpClient, private dataService: DataService) { }

  ngOnInit() {
    this.dataService.scoreTypes.pipe(takeUntil(this.ngUnsubscribe)).subscribe(value => this.scoreTypes = value);
    this.dataService.scoreTitles.pipe(takeUntil(this.ngUnsubscribe)).subscribe(value => this.scoreTitles = value);
    this.dataService.instruments.pipe(takeUntil(this.ngUnsubscribe)).subscribe(value => this.instruments = value);
    this.createFormControls();
    this.createForm();
  }
  createFormControls() {
    this.scoreTitle = new FormControl('', Validators.required);
    this.titleGroup = new FormGroup({
      scoreTitle: this.scoreTitle
    });
    this.scoreType = new FormControl('', [Validators.required]);
    this.typeGroup = new FormGroup({
      scoreType: this.scoreType
    });
    this.instrument = new FormControl('', Validators.required);
    this.instrumentGroup = new FormGroup({
      instrument: this.instrument
    });
  }

  createForm() {
    this.scoreForm = new FormGroup({
      1: this.titleGroup,
      2: this.typeGroup,
      3: this.instrumentGroup
    });
  }

  add(formDirective: FormGroupDirective) {
    const score = new Score(this.scoreTitle.value, this.scoreType.value, this.instrument.value);
    const pdf = this.fileAdd.getPdfFiles();
    const mscz = this.fileAdd.getMsczFiles();
    const image = this.fileAdd.getImageFiles();
    const other = this.fileAdd.getOtherFiles();
    score.pdfFiles = score.pdfFiles.concat(pdf);
    score.museScoreFiles = score.museScoreFiles.concat(mscz);
    score.imageFiles = score.imageFiles.concat(image);
    score.othersFiles = score.othersFiles.concat(other);
    this.http.post(environment.server + environment.score, score).subscribe(resp => {
      this.error = null;
      this.clear(formDirective, true);
    }, err => {
      this.error = err.message;
    });
  }

  clear(formDirective: FormGroupDirective, skipRemoveFromDB: boolean) {
    formDirective.resetForm();
    this.createFormControls();
    this.createForm();
    this.fileAdd.reset(skipRemoveFromDB);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
  processing($event) {
    this.pendingFiles = $event;
  }
}
