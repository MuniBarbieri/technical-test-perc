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

  private readonly _archivedBooks$ = new BehaviorSubject<Book[]>([]);

  readonly books$ = this._books$.asObservable();
  readonly archivedBooks$ = this._archivedBooks$.asObservable();

  create(book: Book) {
    const current = this._books$.value;
    this._books$.next([...current, book]);
  }

  update(book: Book) {
    const current = this._books$.value;
    this._books$.next(current.map(b => (b.id === book.id ? book : b)));
  }

  archive(id: string) {
    const current = this._books$.value;
    const bookToArchive = current.find(b => b.id === id);
    
    if (bookToArchive) {
      // Archivar: mover a la lista de archivados
      const archivedBook: Book = { ...bookToArchive, archivedAt: new Date() };
      const currentArchived = this._archivedBooks$.value;
      this._archivedBooks$.next([...currentArchived, archivedBook]);
      
      // Remover de la lista activa
      this._books$.next(current.filter(b => b.id !== id));
    }
  }

  restore(id: string) {
    const currentArchived = this._archivedBooks$.value;
    const bookToRestore = currentArchived.find(b => b.id === id);
    
    if (bookToRestore) {
      // Remover archivedAt y mover de vuelta a activos
      const { archivedAt, ...restoredBook } = bookToRestore;
      const current = this._books$.value;
      this._books$.next([...current, restoredBook]);
      
      // Remover de la lista de archivados
      this._archivedBooks$.next(currentArchived.filter(b => b.id !== id));
    }
  }

  permanentlyDelete(id: string) {
    const currentArchived = this._archivedBooks$.value;
    this._archivedBooks$.next(currentArchived.filter(b => b.id !== id));
  }
}
