import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Instrument } from '../shared/instrument';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { DataService } from '@app/shared/service/data.service';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-instruments',
  templateUrl: './instruments.component.html',
  styleUrls: ['./instruments.component.css']
})
export class InstrumentsComponent implements OnInit, OnDestroy, AfterViewInit {
  private ngUnsubscribe = new Subject();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns = ['id', 'name', 'instrumentPitch', 'voiceNumber'];
  dataSource = new MatTableDataSource<Instrument>();
  visible: boolean = false;
  instruments: Array<Instrument> = [];
  error;
  canAddIntrument = true;
  constructor(private http: HttpClient, private dataService: DataService) { }

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
}
