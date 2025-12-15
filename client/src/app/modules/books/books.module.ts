import { NgModule } from '@angular/core';
import { booksRoutes } from './books.routing';
import { RouterModule } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BooksComponent } from './books.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [BooksComponent],
  imports: [
    RouterModule.forChild(booksRoutes),
    SharedModule,
    MatSnackBarModule
  ]
})
export class BooksModule { }
