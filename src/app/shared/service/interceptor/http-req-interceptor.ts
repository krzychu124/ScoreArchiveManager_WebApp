import { HttpInterceptor, HttpHandler, HttpEvent, HttpRequest, HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { AuthorizationService } from "@app/shared/service/authorization.service";
import { Injectable, Injector } from "@angular/core";
import { TokenRequestData } from "@app/shared/service/token-request-data";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/switchMap";

@Injectable()
export class HttpReqInterceptor implements HttpInterceptor {
    private refreshing: boolean = false;
    constructor(private inj: Injector) {
    }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (request.method !== 'OPTIONS') {
            const token = this.getToken();
            if (token !== undefined && token !== null) {
                request = request.clone({
                    setHeaders: {
                        'Authorization': 'Bearer ' + token
                    }
                });
                return next.handle(request).catch(err => {
                    if (err instanceof HttpErrorResponse) {
                        if (err.status === 401 && !this.refreshing) {
                            this.refreshing = true;
                            sessionStorage.removeItem(AuthorizationService.access_token);
                            const auth =  this.inj.get(AuthorizationService);
                            return auth.refreshTokenData().switchMap(resp => {
                                const t = resp as TokenRequestData;
                                request = request.clone({
                                    setHeaders: {
                                        'Authorization': 'Bearer ' + t.access_token
                                    }
                                });
                                this.refreshing = false;
                                return next.handle(request);
                            });
                        }
                    }
                    return Observable.throw(err);
                });
            }
        }
        return next.handle(request);
    }
    public getToken(): string {
        return sessionStorage.getItem(AuthorizationService.access_token);
    }
}
