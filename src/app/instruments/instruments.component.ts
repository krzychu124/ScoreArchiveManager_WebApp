import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Instrument } from '../shared/instrument';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { DataService } from '@app/shared/service/data.service';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
import { DbDictionariesService } from '@app/shared/service/db-dictionaries.service';

@Component({
  selector: 'app-instruments',
  templateUrl: './instruments.component.html',
  styleUrls: ['./instruments.component.css']
})
export class InstrumentsComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  private ngUnsubscribe = new Subject();
  displayedColumns = ['id', 'name', 'voiceNumber', 'instrumentPitch'];
  dataSource = new MatTableDataSource<Instrument>();
  instruments: Array<Instrument> = [];
  visible: boolean = false;
  canAddIntrument: boolean = true;
  error: any;
  constructor(private http: HttpClient, private dataService: DataService, private dbDicts: DbDictionariesService) { }

  ngOnInit() {
    this.dataService.instruments.pipe(takeUntil(this.ngUnsubscribe)).subscribe(value => { this.error = null; this.dataSource.data = value })
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
      this.dbDicts.updateInstruments(true);
    }
  }
}
