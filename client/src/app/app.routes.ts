import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'books' },
  {
    path: 'books',
    loadChildren: () =>
      import('./modules/books/books.module').then((m) => m.BooksModule),
  },
];
