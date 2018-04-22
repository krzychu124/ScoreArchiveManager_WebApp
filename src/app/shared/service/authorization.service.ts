import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHandler, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Logincredentials } from '@app/shared/logincredentials';
import { environment } from 'environments/environment';
import { TokenRequestData } from '@app/shared/service/token-request-data';
import { Observable } from 'rxjs/Observable';
import { DbDictionariesService } from '@app/shared/service/db-dictionaries.service';

@Injectable()
export class AuthorizationService {
    public static readonly access_token = 'access_token';
    public static readonly refresh_token = 'refresh_token';
    public static readonly expires_in = 'token_expires_in';
    private clienName = 'app-client';
    private clientPass = 'app-secret';
    private grantType = 'password';
    private requestToken: string = '/oauth/token';
    private refreshToken: string = '/oauth/refresh';
    private logoutEndpoint: string = '/oauth/revoke-token';
    private isUserAuthorized: boolean = false;
    constructor(public http: HttpClient, private dbDict: DbDictionariesService) {
        this.setAuthorizationStatus();
    }

    login(loginCredentials: Logincredentials): Observable<TokenRequestData | any> {
        if (this.isAuthenticated()) {//logout if necessary(generates new token)
            return this.logout().mergeMap(ok => {
                return this.login(loginCredentials);
            });
        }
        let header = new HttpHeaders();
        header = header.set('Authorization', 'Basic ' + btoa(this.clienName + ':' + this.clientPass));
        header = header.append('Content-Type', 'application/x-www-form-urlencoded');
        let form = new URLSearchParams();
        form.set('username', loginCredentials.userName);
        form.set('password', loginCredentials.password);
        form.set('grant_type', this.grantType);
        return this.http.post<TokenRequestData>(environment.server + this.requestToken, form.toString(), { headers: header }).mergeMap(resp => {
            this.saveToken(resp);
            return Observable.of(resp);
        });
    }

    refreshTokenData(): Observable<Object> {
        const token = this.getRefreshToken();
        let header = new HttpHeaders();
        header = header.set('Authorization', 'Basic ' + btoa(this.clienName + ':' + this.clientPass));
        header = header.append('Content-Type', 'application/x-www-form-urlencoded');
        let form = new URLSearchParams();
        form.set('refresh_token', token);
        form.set('grant_type', AuthorizationService.refresh_token);
        return this.http.post<TokenRequestData>(environment.server + this.requestToken, form.toString(), { headers: header }).mergeMap(resp => {
            this.saveToken(resp);
            return Observable.of(resp);
        });
    }

    public logout() {
        return this.http.get<any>(environment.server + this.logoutEndpoint).mergeMap(resp => {
            this.removeToken();
            return Observable.of('logout ok');
        });
    }
    public getToken(): string {
        return sessionStorage.getItem(AuthorizationService.access_token);
    }

    public getRefreshToken(): string {
        return sessionStorage.getItem(AuthorizationService.refresh_token);
    }
    public isAuthenticated(): boolean {
        return this.isUserAuthorized;
    }
    private setAuthorizationStatus() {
        if (this.getToken()) {
            this.isUserAuthorized = true;
            this.dbDict.userAuthorized = true;
            this.dbDict.fetchAllData();
        }
    }

    private saveToken(tokenInfo: TokenRequestData) {
        sessionStorage.setItem(AuthorizationService.access_token, tokenInfo.access_token);
        sessionStorage.setItem(AuthorizationService.refresh_token, tokenInfo.refresh_token);
        sessionStorage.setItem(AuthorizationService.expires_in, tokenInfo.expires_in.toString());
        this.setAuthorizationStatus();
    }

    private removeToken() {
        sessionStorage.removeItem(AuthorizationService.access_token);
        sessionStorage.removeItem(AuthorizationService.refresh_token);
        sessionStorage.removeItem(AuthorizationService.expires_in);
        this.isUserAuthorized = false;
        this.dbDict.userAuthorized = false;
    }
}
