import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { inject } from "@angular/core/testing";
import { Observable } from "rxjs";

@Injectable()
export class AddHeaderInterceptor implements HttpInterceptor {
    
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log('From AddHeaderInterceptor', req.url);

        const jsonReq: HttpRequest<any> = req.clone({
            setHeaders: {
                "Context-Type": "application/json"
            }
        })
        return next.handle(jsonReq);
    }
}