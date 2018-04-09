import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ScoreBookTitle } from '../shared/scoreBookTitle';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { DataSource } from '@angular/cdk/table';
import { DataService } from '@app/shared/service/data.service';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
import { DbDictionariesService } from '@app/shared/service/db-dictionaries.service';

@Component({
  selector: 'app-score-book-titles',
  templateUrl: './score-book-titles.component.html',
  styleUrls: ['./score-book-titles.component.css']
})
export class ScoreBookTitlesComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns = ['id', 'name'];
  dataSource = new MatTableDataSource<ScoreBookTitle>();
  visible: boolean = false;
  error = null;
  canAddScoreBookTitle = true;
  constructor(private http: HttpClient, private dataService: DataService, private dbDict: DbDictionariesService) { }

  ngOnInit() {
    this.dataService.scoreBookTitles.pipe(takeUntil(this.ngUnsubscribe)).subscribe(value => { 
      this.error = null;
      this.dataSource.data = value; 
    },err=> console.error(err));
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
  refreshData($event) {
    if ($event) {
      this.dbDict.updateScoreBookTitles();
    }
  }
}
