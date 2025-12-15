import { NgModule } from '@angular/core';
import { archivedBooksRoutes } from './archived-books.routing';
import { RouterModule } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ArchivedBooksComponent } from './archived-books.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [
    ArchivedBooksComponent,
  ],
  imports: [
    RouterModule.forChild(archivedBooksRoutes),
    SharedModule,
    MatSnackBarModule
  ]
})
export class ArchivedBooksModule { }
