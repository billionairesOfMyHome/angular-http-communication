import { HttpContextToken, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { tap } from "rxjs/operators";
import { HttpCacheService } from "./http-cache.service";

export const CACHEABLE: HttpContextToken<boolean> = new HttpContextToken(() => true);

@Injectable()
export class CacheInterceptor implements HttpInterceptor {

    constructor(private cacheService: HttpCacheService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // only cache requests configured to be cacheable
        if (!req.context.get(CACHEABLE)) {
            console.log(`cache is not allow`);
            return next.handle(req);
        }

        // pass along non-cacheable requests and invalidate cache
        if (req.method !== 'GET') {
            console.log(`Invalidating cache: ${req.method} ${req.url}`);
            this.cacheService.invalidateCache();
            return next.handle(req);
        }

        // attempt to retrieve a cached response
        const cachedResponse: HttpResponse<any> = this.cacheService.get(req.url);

        // return cached response
        if (cachedResponse) {
            console.log(`Returning a cached response: ${cachedResponse.url}`, cachedResponse);
            return of(cachedResponse);
        }

        // send request to server and add response to cache
        return next.handle(req)
            .pipe(
                tap(event => {
                    if (event instanceof HttpResponse) {
                        console.log(`Adding item to cache: ${req.url}`);
                        this.cacheService.put(req.url, event)
                    }
                })
            );
    }

}