import { HttpContextToken, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CACHEABLE } from "./cache.interceptor";

export const CONTENT_TYPE = new HttpContextToken(() => 'application/json');

@Injectable()
export class AddHeaderInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log('From AddHeaderInterceptor', req.url);

        const jsonReq: HttpRequest<any> = req.clone({
            context: req.context.set(CACHEABLE, false),
            setHeaders: {
                "Content-Type": req.context.get(CONTENT_TYPE)
            }
        })
        return next.handle(jsonReq);
    }
}