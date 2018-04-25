import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ScoreType } from '@app/shared/scoreType.enum';
import { Observable } from 'rxjs/Observable';
import { DbDictionariesService } from '@app/shared/service/db-dictionaries.service';
import { Instrument } from '@app/shared/instrument';
import { ScoreBookTitle } from '@app/shared/scoreBookTitle';
import { ScoreTitle } from '@app/shared/scoreTitle';
import { JobType } from '@app/shared/jobType';

@Injectable()
export class DataService {
    private scoreBookTitlesSource = new BehaviorSubject<Array<ScoreBookTitle>>(new Array<ScoreBookTitle>());
    private scoreTitlesSource = new BehaviorSubject<Array<ScoreTitle>>(new Array<ScoreTitle>());
    private scoreTypesSource = new BehaviorSubject<Array<ScoreType>>(new Array<ScoreType>());
    private instrumentsSource = new BehaviorSubject<Array<Instrument>>(new Array<Instrument>());
    private jobTypesSource = new BehaviorSubject<Array<JobType>>(new Array<JobType>());
    public readonly scoreBookTitles: Observable<Array<ScoreBookTitle>> = this.scoreBookTitlesSource.asObservable();
    public readonly scoreTitles: Observable<Array<ScoreTitle>> = this.scoreTitlesSource.asObservable();
    public readonly scoreTypes: Observable<Array<ScoreType>> = this.scoreTypesSource.asObservable();
    public readonly instruments: Observable<Array<Instrument>> = this.instrumentsSource.asObservable();
    public readonly jobTypes: Observable<Array<JobType>> = this.jobTypesSource.asObservable();

    constructor() {
    }

    public updateScoreTypes(array: Array<ScoreType>): void {
        const sorted = array.sort((v1, v2) => {
            if (v1.name_pl > v2.name_pl) {
                return 1;
            }
            if (v1.name_pl < v2.name_pl) {
                return -1;
            }
            return 0;
        });
        this.scoreTypesSource.next(sorted);
    }

    public updateInstruments(array: Array<Instrument>): void {
        const sorted = array.sort((v1, v2) => {
            if (v1.name > v2.name) {
                return 1;
            }
            if (v1.name < v2.name) {
                return -1;
            }
            return 0;
        });
        this.instrumentsSource.next(sorted);
    }
    public updateScoreBookTitles(array: Array<ScoreBookTitle>): void {
        const sorted = array.sort((v1, v2) => {
            if (v1.name > v2.name) {
                return 1;
            }
            if (v1.name < v2.name) {
                return -1;
            }
            return 0;
        });
        this.scoreBookTitlesSource.next(sorted);
    }
    public updateScoreTitles(array: Array<ScoreTitle>): void {
        const sorted = array.sort((v1, v2) => {
            if (v1.title > v2.title) {
                return 1;
            }
            if (v1.title < v2.title) {
                return -1;
            }
            return 0;
        });
        this.scoreTitlesSource.next(sorted);
    }
    public updateJobTypes(array: Array<JobType>): void {
        const sorted = array.sort((v1, v2) => {
            if (v1.name_pl > v2.name_pl) {
                return 1;
            }
            if (v1.name_pl < v2.name_pl) {
                return -1;
            }
            return 0;
        });
        this.jobTypesSource.next(sorted);
    }
}