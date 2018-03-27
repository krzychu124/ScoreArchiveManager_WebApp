import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { PDFFile } from '@app/shared/PDFFile';
import { FileInfo } from '@app/file-add/fileInfo';
import { Observable } from 'rxjs/Observable';
import { MuseScoreFile } from '@app/shared/MuseScoreFile';
import { FileWithMetadata } from '@app/shared/fileWithMetadata';
import { ScoreFileType } from '@app/shared/scoreFileType.enum';
import { GenericFile } from '@app/shared/GenericFile';

@Injectable()
export class RestService {
    private env = environment;
    constructor(private http: HttpClient) { }

    downloadFile(fileName: string): Observable<HttpResponse<Blob>> {
        const e = this.env;
        const param = new HttpParams().append('fileName', fileName);
        return this.http.get(e.server + e.filesEndpoint,{observe: 'response', responseType:'blob', params: param});
    }
    uploadFile(file: File, info: FileInfo): Observable<PDFFile> {
        const e = this.env;
        let formData = new FormData();
        formData.append('file', file);
        formData.append('fileInfo', new Blob([JSON.stringify(info)], { type: 'application/json' }));
        return this.http.post<PDFFile>(e.server + e.pdfEndpoint, formData);
    }
    uploadFile2(file: File, info: FileInfo): Observable<Object> {
        const e = this.env;
        let formData = new FormData();
        formData.append('file', file);
        formData.append('fileInfo', new Blob([JSON.stringify(info)], { type: 'application/json' }));
        return this.http.post(e.server + e.filesEndpoint, formData);
    }
    removeFile(fileName: string): Observable<Object> {
        const e = this.env;
        return this.http.delete<Object>(e.server + e.filesEndpoint +'/fileName/'+ fileName);
    }
    uploadPDF(file: File, info: FileInfo): Observable<PDFFile> {
        const e = this.env;
        let formData = new FormData();
        formData.append('file', file);
        formData.append('fileInfo', new Blob([JSON.stringify(info)], { type: 'application/json' }));
        return this.http.post<PDFFile>(e.server + e.pdfEndpoint, formData);
    }
    uploadMSCZ(file: File, info: FileInfo): Observable<MuseScoreFile> {
        const e = this.env;
        let formData = new FormData();
        formData.append('file', file);
        formData.append('fileInfo', new Blob([JSON.stringify(info)], { type: 'application/json' }));
        return this.http.post<MuseScoreFile>(e.server + e.msczEndpoint, formData);
    }
    uploadImage(file: File, info: FileInfo): Observable<MuseScoreFile> {
        const e = this.env;
        let formData = new FormData();
        formData.append('file', file);
        formData.append('fileInfo', new Blob([JSON.stringify(info)], { type: 'application/json' }));
        return this.http.post<MuseScoreFile>(e.server + e.imageEndpoint, formData);
    }
    uploadOther(file: File, info: FileInfo): Observable<MuseScoreFile> {
        const e = this.env;
        let formData = new FormData();
        formData.append('file', file);
        formData.append('fileInfo', new Blob([JSON.stringify(info)], { type: 'application/json' }));
        return this.http.post<MuseScoreFile>(e.server + e.otherEndpoint, formData);
    }

    public getFileMetadataByType(fileType: ScoreFileType): Observable<Array<GenericFile>> {
        const e = this.env;
        const param = new HttpParams().set('fileType',ScoreFileType[fileType]);
        return this.http.get<Array<GenericFile>>(e.server + e.fileMetadata, {params: param});
    }
}