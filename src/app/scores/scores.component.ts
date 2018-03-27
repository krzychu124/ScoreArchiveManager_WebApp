import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { Score } from '@app/shared/score';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { ScoreRow } from '@app/shared/score-row';
import { ScoreTitle } from '@app/shared/scoreTitle';
import { Instrument } from '@app/shared/instrument';
import { ScoreType } from '@app/shared/scoreType.enum';
import { DataService } from '@app/shared/service/data.service';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-scores',
  templateUrl: './scores.component.html',
  styleUrls: ['./scores.component.css']
})
export class ScoresComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns = ['id', 'scoreTitle', 'scoreType', 'instrument'];
  dataSource = new MatTableDataSource<ScoreRow>();
  canAddScore: boolean = true;
  visible = true;
  error = null;
  scoreTypes: Array<ScoreType> = [];
  scoreType: FormControl;
  instruments: Array<Instrument> = [];
  instrument: FormControl;
  searchForm: FormGroup;
  constructor(private http: HttpClient, private dataService: DataService) { }

  ngOnInit() {
    this.fetchScores();
    this.initForm();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
  fetchScores(): void {
    const scoreTypeId = this.scoreType ? this.scoreType.value.id != undefined ? this.scoreType.value.id : '1' : '1';
    const instrumentId = this.instrument ? this.instrument.value.id != 0 ? this.instrument.value.id : undefined : undefined;
    const parameters = instrumentId ?
      {
        'scoreTypeId': scoreTypeId,
        'instrumentId': instrumentId
      } ://OR
      {
        'scoreTypeId': scoreTypeId
      };
    this.http.get(environment.server + environment.score, { params: parameters }).subscribe(resp => {
      this.error = null;
      this.dataSource.data = resp as Array<ScoreRow>;
    }, err => {
      this.error = err.message;
    });
  }

  initForm(): void {
    this.dataService.scoreTypes.pipe(takeUntil(this.ngUnsubscribe)).subscribe(value => this.scoreTypes = value);
    this.dataService.instruments.pipe(takeUntil(this.ngUnsubscribe)).subscribe(values => this.instruments = values);

    this.dataSource.sort = this.sort;
    this.scoreType = new FormControl('', Validators.required);
    this.instrument = new FormControl('');
    this.searchForm = new FormGroup({
      scoreType: this.scoreType,
      instrument: this.instrument
    });
  }
}
