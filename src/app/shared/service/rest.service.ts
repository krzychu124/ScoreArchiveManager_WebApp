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
import { Instrument } from '@app/shared/instrument';
import { FileMetadataEndpointService } from '@app/shared/service/fileService/file-metadata-endpoint.service';
import { User } from '@app/shared/user';
import { JobStatus } from '@app/shared/jobStatus';
import { JobType } from '@app/shared/jobType';
import { JobBasic } from '@app/shared/job-basic';
import { JobFull } from '@app/shared/job-full';

@Injectable()
export class RestService {
    private env = environment;

    constructor(private http: HttpClient, private fileMetadataRest: FileMetadataEndpointService) { 
    }

    public downloadFile(fileName: string): Observable<HttpResponse<Blob>> {
        const e = this.env;
        const param = new HttpParams().append('fileName', fileName);
        return this.http.get(e.apiServer + e.filesEndpoint, { observe: 'response', responseType: 'blob', params: param });
    }

    public uploadFile(file: File, info: FileInfo): Observable<PDFFile> {
        const e = this.env;
        let formData = new FormData();
        formData.append('file', file);
        formData.append('fileInfo', new Blob([JSON.stringify(info)], { type: 'application/json' }));
        return this.http.post<PDFFile>(e.apiServer + e.pdfEndpoint, formData);
    }

    public uploadFile2(file: File, info: FileInfo): Observable<GenericFile> {
        const e = this.env;
        let formData = new FormData();
        formData.append('file', file);
        formData.append('fileInfo', new Blob([JSON.stringify(info)], { type: 'application/json' }));
        return this.http.post<GenericFile>(e.apiServer + e.filesEndpoint, formData);
    }

    public removeFile(fileName: string): Observable<Object> {
        const e = this.env;
        return this.http.delete<Object>(e.apiServer + e.filesEndpoint + '/fileName/' + fileName);
    }

    public deletePermanently(fileId: number) {
        const e = this.env;
        return this.http.delete<Object>(e.apiServer + e.filesEndpoint + '/' + fileId);
    }

    public uploadPDF(file: File, info: FileInfo): Observable<PDFFile> {
        const e = this.env;
        let formData = new FormData();
        formData.append('file', file);
        formData.append('fileInfo', new Blob([JSON.stringify(info)], { type: 'application/json' }));
        return this.http.post<PDFFile>(e.apiServer + e.pdfEndpoint, formData);
    }

    public uploadMSCZ(file: File, info: FileInfo): Observable<MuseScoreFile> {
        const e = this.env;
        let formData = new FormData();
        formData.append('file', file);
        formData.append('fileInfo', new Blob([JSON.stringify(info)], { type: 'application/json' }));
        return this.http.post<MuseScoreFile>(e.apiServer + e.msczEndpoint, formData);
    }

    public uploadImage(file: File, info: FileInfo): Observable<MuseScoreFile> {
        const e = this.env;
        let formData = new FormData();
        formData.append('file', file);
        formData.append('fileInfo', new Blob([JSON.stringify(info)], { type: 'application/json' }));
        return this.http.post<MuseScoreFile>(e.apiServer + e.imageEndpoint, formData);
    }

    public uploadOther(file: File, info: FileInfo): Observable<MuseScoreFile> {
        const e = this.env;
        let formData = new FormData();
        formData.append('file', file);
        formData.append('fileInfo', new Blob([JSON.stringify(info)], { type: 'application/json' }));
        return this.http.post<MuseScoreFile>(e.apiServer + e.otherEndpoint, formData);
    }

    public generateThumb(fileName: string): Observable<Object> {
        const e = this.env;
        return this.http.put(e.apiServer + e.filesEndpoint + '/' + fileName + '/thumb', null);
    }

    public getFileMetadataByType(fileType: ScoreFileType): Observable<GenericFile[]> {
        const e = this.env;
        const param = new HttpParams().set('fileType', ScoreFileType[fileType]);
        return this.http.get<GenericFile[]>(e.apiServer + e.fileMetadata, { params: param });
    }
    
    public getFileMetadataByInstrument(instrument: Instrument): Observable<GenericFile[]> {
        return this.fileMetadataRest.getByInstrument(instrument);
    }

    public getPDFBase64(fileName: string): Observable<FileWithMetadata> {
        const e = this.env;
        const param = new HttpParams().set('fileName', fileName);
        return this.http.get<FileWithMetadata>(e.apiServer + e.filesEndpoint + '/base64', { params: param });
    }

    public registerUser(newUser: User): Observable<Object> {
        return this.http.post<Object>(this.env.server + this.env.userEndpoint + '/register', newUser);
    }

    public getJobStatuses(): Observable<JobStatus[]>{
        return this.http.get<JobStatus[]>(this.env.apiServer + this.env.jobEndpoint + '/statuses');
    }

    public getJobTypes(): Observable<JobType[]> {
        return this.http.get<JobType[]>(this.env.apiServer + this.env.jobEndpoint + '/types');
    }

    public createJob(job: any): Observable<JobBasic> {
        return this.http.post<JobBasic>(this.env.apiServer + this.env.jobEndpoint, job);
    }
    public getNewJobs(): Observable<JobBasic[]> {
        return this.http.get<JobBasic[]>(this.env.apiServer + this.env.jobEndpoint + '/byStatus/' + 1);
    }
    public getInProgressJobs(): Observable<JobBasic[]> {
        return this.http.get<JobBasic[]>(this.env.apiServer + this.env.jobEndpoint + '/byStatus/' + 3);
    }
    public getFinishedJobs(): Observable<JobBasic[]> {
        return this.http.get<JobBasic[]>(this.env.apiServer + this.env.jobEndpoint + '/byStatus/' + 5);
    }
    public getFullJobData(id: number): Observable<JobFull> {
        return this.http.get<JobFull>(this.env.apiServer + this.env.jobEndpoint + '/allInfo/' +id);
    }
}