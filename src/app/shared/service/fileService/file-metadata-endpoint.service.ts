import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Instrument } from '@app/shared/instrument';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GenericFile } from '@app/shared/GenericFile';

@Injectable()
export class FileMetadataEndpointService {
    private serv: string;
    private fileEndP: string;
    constructor(private http: HttpClient) {
        this.serv = environment.server;
        this.fileEndP = environment.fileMetadata;
    }

    getByInstrument(instrument: Instrument): Observable<GenericFile[]> {
        return this.http.get<GenericFile[]>(this.serv + this.fileEndP + '/instrument/' + instrument.id);
    }
}