import { HttpInterceptor, HttpHandler, HttpEvent, HttpRequest, HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { AuthorizationService } from "@app/shared/service/authorization.service";
import { Injectable } from "@angular/core";

@Injectable()
export class HttpReqInterceptor implements HttpInterceptor {
    constructor() {
    }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (request.method !== 'OPTIONS') {
            const token = this.getToken();
            if (token !== undefined && token !== null) {
                request = request.clone({
                    setHeaders: {
                        'Authorization': 'Bearer '+token
                    }
                });
                return next.handle(request);
            }
        }
        return next.handle(request);
    }
    public getToken(): string {
        return sessionStorage.getItem(AuthorizationService.access_token);
    }
}
