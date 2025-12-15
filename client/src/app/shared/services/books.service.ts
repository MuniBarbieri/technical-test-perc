import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Book } from '../models'

@Injectable({ providedIn: 'root' })
export class BooksService {
  private readonly _books$ = new BehaviorSubject<Book[]>([
    { id: '1', name: 'Clean Code' },
    { id: '2', name: 'Domain-Driven Design' },
    { id: '3', name: 'The Pragmatic Programmer' },
  ]);

  readonly books$ = this._books$.asObservable();

  create(book: Book) {
    const current = this._books$.value;
    this._books$.next([...current, book]);
  }

  update(book: Book) {
    const current = this._books$.value;
    this._books$.next(current.map(b => (b.id === book.id ? book : b)));
  }

  remove(id: string) {
    const current = this._books$.value;
    this._books$.next(current.filter(b => b.id !== id));
  }
}
