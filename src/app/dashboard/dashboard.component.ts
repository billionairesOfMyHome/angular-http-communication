import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Title } from '@angular/platform-browser';

import { Book } from "app/models/book";
import { Reader } from "app/models/reader";
import { DataService } from 'app/core/data.service';
import { BookTrackerError } from 'app/models/bookTrackerError';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: []
})
export class DashboardComponent implements OnInit {

  allBooks: Book[];
  allReaders: Reader[];
  mostPopularBook: Book;

  constructor(private dataService: DataService,
    private title: Title,
    private route: ActivatedRoute) { }

  ngOnInit() {
    let resolveData: Book[] | BookTrackerError = this.route.snapshot.data['resolvedBooks']
    // console.log(resolveData instanceof BookTrackerError);

    if (resolveData instanceof BookTrackerError) {
      console.error(resolveData.friendlyMessage);
    }
    else {
      this.allBooks = <Book[]>resolveData;
    }
    /* this.dataService.getAllBooks()
      .subscribe(
        (data: Book[] | BookTrackerError) => this.allBooks = <Book[]>data,
        (err: BookTrackerError) => console.error(err.friendlyMessage),
        () => console.log('All done getting books')
      ); */
    this.allReaders = this.dataService.getAllReaders();
    this.mostPopularBook = this.dataService.mostPopularBook;

    this.title.setTitle(`Book Tracker`);
  }

  deleteBook(bookID: number): void {
    this.dataService.deleteBook(bookID)
      .subscribe(
        (data: void) => {
          const index: number = this.allBooks.findIndex(book => bookID === book.bookID);
          // 这里需要更新 dashboard 上面 allBooks 数据
          this.allBooks.splice(index, 1);
        },
        (err: any) => console.error(err)
      );
  }

  deleteReader(readerID: number): void {
    console.warn(`Delete reader not yet implemented (readerID: ${readerID}).`);
  }

}
