import { Injectable } from '@angular/core';
import { ScoreType } from '@app/shared/scoreType.enum';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs/Observable';
import { DataService } from '@app/shared/service/data.service';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/takeWhile';
import 'rxjs/add/operator/delay';
import { Instrument } from '@app/shared/instrument';
import { ScoreBookTitle } from '@app/shared/scoreBookTitle';
import { ScoreTitle } from '@app/shared/scoreTitle';
import { AuthorizationService } from '@app/shared/service/authorization.service';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class DbDictionariesService {
    private stopTitlesInterval: boolean;
    private stopBookTitlesInterval: boolean;
    private stopScoreTypesInterval: boolean;
    private stopInstumentInterval: boolean;
    private scoreTypesEndpoint = environment.apiServer + environment.score + '/types';
    private scoreTitlesEndpoint = environment.apiServer + environment.scoreTitle;
    private instrumentsEndpoint = environment.apiServer + environment.instrument_endpoint;
    private scoreBookTitlesEndpoint = environment.apiServer + environment.scoreBookTitle_endpoint;
    public userAuthorized: boolean;
    private fsub: Subscription;
    private querying: boolean = false;
    private STIQuerying: boolean = false;
    private STQuerying: boolean = false;
    private IQuerying: boolean = false;
    private SBTQuerying: boolean = false;
    constructor(private http: HttpClient, private dataService: DataService) {
    }

    public updateInstruments(force?: boolean) {
        if (this.userAuthorized && force) {
            // force with retry interval on error
            this.fetchInstrments().subscribe(() => { }, err => this.updateInstruments(false));
        } else {
            if (!this.IQuerying) {
                this.IQuerying = true;
                this.stopInstumentInterval = false;
                console.log('IQuerying true');
                Observable.interval(5000).takeWhile(() => !this.stopInstumentInterval).subscribe(times => {
                    console.log('UpdateInstruments call, times:' + times);
                    if (this.userAuthorized) {
                        this.fetchInstrments().subscribe(ok => {
                            this.stopInstumentInterval = true;
                            this.IQuerying = false;
                            console.log('IQuerying false');
                        });
                    }
                });
            }
        }
    }

    public updateScoreTypes(force?: boolean) {
        if (this.userAuthorized && force) {
            // force with retry interval on error
            this.fetchScoreTypes().subscribe(() => { }, err => this.updateScoreTypes(false));
        } else {
            if (!this.STIQuerying) {
                this.STIQuerying = true;
                this.stopScoreTypesInterval = false;
                console.log('STIQuerying true');
                Observable.interval(5000).takeWhile(() => !this.stopScoreTypesInterval).subscribe(times => {
                    console.log('UpdateScoreTypes call, times:' + times);
                    if (this.userAuthorized) {
                        this.fetchScoreTypes().subscribe(ok => {
                            this.stopScoreTypesInterval = true;
                            this.STIQuerying = false;
                            console.log('STIQuerying false');
                        });
                    }
                });
            }
        }
    }

    public updateScoreTitles(force?: boolean) {
        if (this.userAuthorized && force) {
            // force with retry interval on error
            this.fetchScoreTitles().subscribe(() => { }, err => this.updateScoreTitles(false));
        } else {
            if (!this.STQuerying) {
                this.STQuerying = true;
                this.stopTitlesInterval = false;
                console.log('STQuerying false');
                Observable.interval(5000).takeWhile(() => !this.stopTitlesInterval).subscribe(times => {
                    console.log('UpdateScoreTitles call, times:' + times);
                    if (this.userAuthorized) {
                        this.fetchScoreTitles().subscribe(ok => {
                            this.stopTitlesInterval = true;
                            this.STQuerying = false;
                            console.log('STQuerying false');
                        });
                    }
                });
            }
        }
    }

    public updateScoreBookTitles(force?: boolean) {
        if (this.userAuthorized && force) {
            // force with retry interval on error
            this.fetchScoreBookTitles().subscribe(() => { }, err => this.updateScoreBookTitles(false));
        } else {
            if (!this.SBTQuerying) {
                this.SBTQuerying = true;
                this.stopBookTitlesInterval = false;
                console.log('SBTQuerying false');
                Observable.interval(5000).takeWhile(() => !this.stopBookTitlesInterval).subscribe(times => {
                    console.log('UpdateScoreBookTitles call, times: ' + times);
                    if (this.userAuthorized) {
                        this.fetchScoreBookTitles().subscribe(ok => {
                            this.stopBookTitlesInterval = true;
                            this.SBTQuerying = false;
                            console.log('SBTQuerying false');
                        });
                    }
                });
            }
        }
    }

    public fetchAllData() {
        this.updateInstruments(true);
        this.updateScoreTitles(true);
        this.updateScoreBookTitles(true);
        this.updateScoreTypes(true);
    }

    private fetchScoreTypes(): Observable<boolean> {
        const result = new Subject<boolean>();
        this.http.get(this.scoreTypesEndpoint).subscribe(resp => {
            this.dataService.updateScoreTypes(resp as Array<ScoreType>);
            console.log('Score types fetch: OK');
            result.next(true);
        }, err => {
            console.log('ScoreTypes fetch failed: ' + err.message);
            result.error(err);
        });
        return result;
    }

    private fetchScoreBookTitles(): Observable<boolean> {
        const result = new Subject<boolean>();
        this.http.get(this.scoreBookTitlesEndpoint).subscribe(resp => {
            this.dataService.updateScoreBookTitles(resp as Array<ScoreBookTitle>);
            console.log('Score book titles fetch: OK')
            result.next(true);
        }, err => {
            console.log('Score book titles fetch failed: ' + err.message);
            result.error(err);
        });
        return result;
    }

    private fetchScoreTitles(): Observable<boolean> {
        const result = new Subject<boolean>();
        this.http.get(this.scoreTitlesEndpoint).subscribe(resp => {
            this.dataService.updateScoreTitles(resp as Array<ScoreTitle>);
            console.log('Score titles fetch: OK')
            result.next(true);
        }, err => {
            console.log('Score titles fetch failed ' + err.message);
            result.error(err);
        });
        return result;
    }

    private fetchInstrments(): Observable<boolean> {
        const result = new Subject<boolean>();
        this.http.get(this.instrumentsEndpoint).subscribe(resp => {
            this.dataService.updateInstruments(resp as Array<Instrument>);
            console.log('Instruments fetch: OK');
            result.next(true);
        }, err => {
            console.log('Instruments fetch failed: ' + err.message);
            result.error(err);
        });
        return result;
    }
}
