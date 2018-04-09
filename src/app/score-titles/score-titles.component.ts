import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ScoreTitle } from '@app/shared/scoreTitle';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { ScoreType } from '@app/shared/scoreType.enum';
import { DataService } from '@app/shared/service/data.service';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
import { DbDictionariesService } from '@app/shared/service/db-dictionaries.service';

@Component({
  selector: 'app-score-titles',
  templateUrl: './score-titles.component.html',
  styleUrls: ['./score-titles.component.css']
})
export class ScoreTitlesComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns = ['id', 'title', 'number', 'scoreType'];
  dataSource = new MatTableDataSource<ScoreTitle>();
  visible: boolean = false;
  error;
  canAddScoreTitle = true;
  scoreTypes: Array<ScoreType> = [];
  constructor(private http: HttpClient, private dataService: DataService, private dbDict: DbDictionariesService) { }

  ngOnInit() {
    this.dataService.scoreTitles.pipe(takeUntil(this.ngUnsubscribe)).subscribe(value => this.dataSource.data = value);
    this.dataService.scoreTypes.pipe(takeUntil(this.ngUnsubscribe)).subscribe(value => this.scoreTypes = value);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  getScoreTypeTranslation(value: ScoreType): string {
    return value.name_pl;
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
  refreshData($event) {
    if ($event) {
      this.dbDict.updateScoreTitles();
    }
  }
}
