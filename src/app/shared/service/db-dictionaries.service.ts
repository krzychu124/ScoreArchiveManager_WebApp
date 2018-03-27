import { Injectable } from '@angular/core';
import { ScoreType } from '@app/shared/scoreType.enum';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs/Observable';
import { DataService } from '@app/shared/service/data.service';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/takeWhile';
import { Instrument } from '@app/shared/instrument';
import { ScoreBookTitle } from '@app/shared/scoreBookTitle';
import { ScoreTitle } from '@app/shared/scoreTitle';

@Injectable()
export class DbDictionariesService {
    stopTitlesInterval: boolean;
    stopBookTitlesInterval: boolean;
    stopScoreTypesInterval: boolean;
    stopInstumentInterval: boolean;
    scoreTypesEndpoint = environment.server + environment.score + '/types';
    scoreTitlesEndpoint = environment.server + environment.scoreTitle;
    instrumentsEndpoint = environment.server + environment.instrument_endpoint;
    scoreBookTitlesEndpoint = environment.server + environment.scoreBookTitle_endpoint;

    constructor(private http: HttpClient, private dataService: DataService) {
        this.fetchData();
    }

    private fetchScoreTypes() {
        this.stopScoreTypesInterval = false;
        this.http.get(this.scoreTypesEndpoint).subscribe(resp => {
            this.dataService.updateScoreTypes(resp as Array<ScoreType>);
            this.stopScoreTypesInterval = true;
            console.log('Score types fetch: OK')
        }, err => {
            console.log('ScoreTypes  fetch failed ' + err.message);
        });
    }

    private fetchScoreBookTitles() {
        this.stopBookTitlesInterval = false;
        this.http.get(this.scoreBookTitlesEndpoint).subscribe(resp => {
            this.dataService.updateScoreBookTitles(resp as Array<ScoreBookTitle>);
            this.stopBookTitlesInterval = true;
            console.log('Score book titles fetch: OK')
        }, err => {
            console.log('Score book titles  fetch failed ' + err.message);
        });
    }

    private fetchScoreTitles() {
        this.stopTitlesInterval = false;
        this.http.get(this.scoreTitlesEndpoint).subscribe(resp => {
            this.dataService.updateScoreTitles(resp as Array<ScoreTitle>);
            this.stopTitlesInterval = true;
            console.log('Score titles fetch: OK')
        }, err => {
            console.log('Score titles  fetch failed ' + err.message);
        });
    }

    private fetchInstrments() {
        this.stopInstumentInterval = false;
        this.http.get(this.instrumentsEndpoint).subscribe(resp => {
            this.dataService.updateInstruments(resp as Array<Instrument>);
            this.stopInstumentInterval = true;
            console.log('Instruments fetch: OK');
        }, err => {
            console.log('Instruments fetch failed ' + err.message);
        })
    }
    private fetchData() {
        this.updateInstruments();
        this.updateScoreTitles();
        this.updateScoreBookTitles();
        this.updateScoreTypes();
    }

    public updateInstruments() {
        this.fetchInstrments();
        Observable.interval(3000).takeWhile(() => !this.stopInstumentInterval).subscribe(() =>{
            this.fetchInstrments();
            console.log('Repeating failed instruments fetch: ' + new Date(Date.now()).toLocaleString());
        });
    }

    public updateScoreTypes() {
        this.fetchScoreTypes();
        Observable.interval(3000).takeWhile(() => !this.stopScoreTypesInterval).subscribe(() => {
            this.fetchScoreTypes(); 
            console.log('Repeating failed scoreTypes fetch: ' + new Date(Date.now()).toLocaleString());
        });
    }

    public updateScoreTitles() {
        this.fetchScoreTitles();
        Observable.interval(3000).takeWhile(() => !this.stopTitlesInterval).subscribe(() =>{
            this.fetchScoreTitles();
            console.log('Repeating failed score titles fetch: ' + new Date(Date.now()).toLocaleString());
        });
    }

    public updateScoreBookTitles() {
        this.fetchScoreBookTitles();
        Observable.interval(3000).takeWhile(() => !this.stopBookTitlesInterval).subscribe(() =>{
            this.fetchScoreBookTitles();
            console.log('Repeating failed score book titles fetch: ' + new Date(Date.now()).toLocaleString());
        });
    }
}
