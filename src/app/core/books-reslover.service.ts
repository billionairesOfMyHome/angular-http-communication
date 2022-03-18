import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Book } from "app/models/book";
import { BookTrackerError } from "app/models/bookTrackerError";
import { Observable, of, pipe } from "rxjs";
import { catchError } from "rxjs/operators";
import { DataService } from "./data.service";

@Injectable({
    providedIn: 'root'
})
export class BooksResolverService implements Resolve<Book[] | BookTrackerError>{

    constructor(private dataService: DataService) { }

    // 使用这个 Resolver (BooksResolverService) 的每条路由都执行该 resolve 方法
    // 更适用于组件只有一个 http 请求的情况，否则因为一个请求很慢就阻止了整个路由切换

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Book[] | BookTrackerError | Observable<Book[] | BookTrackerError> | Promise<Book[] | BookTrackerError> {

        // 不需要 subscribe，angular 会自动 subscribe 它，并将 resolver 的数据作为路由的一部分传递

        return this.dataService.getAllBooks()
            .pipe(
                catchError(err => of(err)) // 可以出错时路由到另一个组件
            );
    }
}