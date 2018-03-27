import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ScoreRow } from '@app/shared/score-row';
import { ScoreType } from '@app/shared/scoreType.enum';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Instrument } from '@app/shared/instrument';
import { HttpClient } from '@angular/common/http';
import { DataService } from '@app/shared/service/data.service';
import { environment } from 'environments/environment';
import { ScoreBook } from '@app/shared/scoreBook';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-score-books',
  templateUrl: './score-books.component.html',
  styleUrls: ['./score-books.component.css']
})
export class ScoreBooksComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns = ['id', 'scoreType', 'scoreBookTitle', 'instrument'];
  dataSource = new MatTableDataSource<ScoreBook>();
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
    this.fetchScoreBooks();
    this.initForm();
  }

  fetchScoreBooks(): void {
    const scoreTypeId = this.scoreType ? this.scoreType.value.id != undefined ? this.scoreType.value.id : '1' : '1';
    // const instrumentId = this.instrument ? this.instrument.value.id != 0 ? this.instrument.value.id : undefined : undefined;
    // const parameters = instrumentId ? {'scoreTypeId': scoreTypeId, 'instrumentId': instrumentId} : { 'scoreTypeId': scoreTypeId};
    this.http.get(environment.server + environment.scoreBook_endpoint + '/scoreType/' + scoreTypeId).subscribe(resp => {
      this.error = null;
      this.dataSource.data = resp as Array<ScoreBook>;
    }, err => {
      this.error = err.message;
    });
  }

  initForm(): void {
    this.dataService.scoreTypes.pipe(takeUntil(this.ngUnsubscribe)).subscribe(value => { this.error = null; this.scoreTypes = value; });
    this.dataService.instruments.pipe(takeUntil(this.ngUnsubscribe)).subscribe(value => { this.error = null; this.instruments = value; });
    this.scoreType = new FormControl('', Validators.required);
    this.instrument = new FormControl('');
    this.searchForm = new FormGroup({
      scoreType: this.scoreType,
      instrument: this.instrument
    });
  }

  refreshTable($event): void {
    this.fetchScoreBooks();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}