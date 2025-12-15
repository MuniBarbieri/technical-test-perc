
import { BooksComponent } from './books.component';
import { Routes } from '@angular/router';

export const booksRoutes: Routes = [
  { path: '', component: BooksComponent },
  {
    path: 'archived',
    loadChildren: () =>
      import('./archived-books/archived-books.module').then((m) => m.ArchivedBooksModule),
  }
];

