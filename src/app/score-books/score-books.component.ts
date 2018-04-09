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
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  private ngUnsubscribe = new Subject();
  protected displayedColumns = ['id', 'scoreBookTitle', 'instrument', 'scoreType'];
  dataSource = new MatTableDataSource<ScoreBook>();
  instruments: Array<Instrument> = [];
  scoreTypes: Array<ScoreType> = [];
  searchForm: FormGroup;
  instrument: FormControl;
  scoreType: FormControl;
  canAddScore: boolean = true;
  visible: boolean = true;
  error: any;

  constructor(private http: HttpClient, private dataService: DataService) { }

  ngOnInit() {
    this.fetchScoreBooks();
    this.initForm();
  }

  fetchScoreBooks(): void {
    const scoreTypeId = this.scoreType ? this.scoreType.value.id != undefined ? this.scoreType.value.id : '1' : '1';
    this.http.get(environment.apiServer + environment.scoreBook_endpoint + '/scoreType/' + scoreTypeId).subscribe(resp => {
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
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  refreshTable($event): void {
    if ($event) {
      this.fetchScoreBooks();
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
