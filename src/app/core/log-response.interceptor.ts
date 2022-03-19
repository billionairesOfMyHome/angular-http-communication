import { HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class LogResponseInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log('From LogResponseInterceptor', req.url);

        return next.handle(req)
            .pipe(
                tap(event => {
                    if (event.type === HttpEventType.Response) {
                        console.log('Http interceptor response:', event.body);
                    }
                })
            )
    }
}