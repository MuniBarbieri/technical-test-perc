import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { booksRoutes } from './books.routing';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BooksComponent } from './books.component';
import { PercDataTableComponent } from '../../shared/components/perc-data-table/perc-data-table.component';
import { PercButtonComponent } from '../../shared/components/perc-button/perc-button.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';


@NgModule({
  declarations: [BooksComponent, PercDataTableComponent, PercButtonComponent],
  imports: [
    RouterModule.forChild(booksRoutes),
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatProgressBarModule
  ]
})
export class BooksModule { }
