import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { combineLatest, map, Observable, startWith, Subject, takeUntil } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { BooksService } from '../../../shared/services/books.service';
import { Book } from '../../../shared/models';
import { PercDataTableColumn, PercDataTableConfig } from '../../../shared/components/perc-data-table/perc-data-table.component';

@Component({
  selector: 'app-archived-books',
  templateUrl: './archived-books.component.html',
  styleUrls: ['./archived-books.component.css'],
})
export class ArchivedBooksComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  readonly searchControl = new FormControl<string>('', { nonNullable: true });
  selectedTabIndex = 1;
  
  readonly archivedBooks$: Observable<Book[]>;
  readonly filteredArchivedBooks$: Observable<Book[]>;

  readonly tableColumns: PercDataTableColumn<Book>[] = [
    {
      key: 'id',
      label: 'ID',
      sortable: true
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true
    },
    {
      key: 'archivedAt',
      label: 'Archived At',
      sortable: true,
      getValue: (book: Book) => {
        return book.archivedAt ? new Date(book.archivedAt).toLocaleString() : '';
      }
    }
  ];

  readonly tableConfig: PercDataTableConfig = {
    showEditButton: true,
    showDeleteButton: true,
    editButtonLabel: 'Restore',
    deleteButtonLabel: 'Delete',
    editButtonIcon: 'restore',
    deleteButtonIcon: 'delete_forever',
    pageSizeOptions: [5, 10, 20, 50],
    pageSize: 10,
    sortable: true,
    sortColumn: 'archivedAt',
    sortDirection: 'desc',
    emptyMessage: 'No archived books available',
    noSearchResultsMessage: 'No archived books found matching your search'
  };

  isLoading = false;

  constructor(
    private readonly booksService: BooksService,
    private readonly snackBar: MatSnackBar,
    private readonly router: Router
  ) {
    this.archivedBooks$ = this.booksService.archivedBooks$;

    // Combine archived books and search to create filtered books observable
    this.filteredArchivedBooks$ = combineLatest([
      this.archivedBooks$,
      this.searchControl.valueChanges.pipe(startWith(this.searchControl.value)),
    ]).pipe(
      map(([books, searchQuery]) => this.filterBooks(books, searchQuery))
    );
  }

  ngOnInit(): void {
    // Detectar la ruta actual para establecer el tab activo
    this.updateSelectedTab();
    
    // Escuchar cambios de navegación
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.updateSelectedTab();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onRestoreBook(book: Book): void {
    this.restore(book);
  }

  onDeletePermanently(book: Book): void {
    this.deletePermanently(book);
  }

  restore(book: Book): void {
    this.isLoading = true;
    
    setTimeout(() => {
      this.booksService.restore(book.id);
      
      this.snackBar.open('Book restored successfully', 'Cerrar', {
        duration: 3000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
        panelClass: ['success-snackbar'],
      });
      
      this.isLoading = false;
    }, 1500);
  }

  deletePermanently(book: Book): void {
    if (!confirm(`Are you sure you want to permanently delete "${book.name}"? This action cannot be undone.`)) {
      return;
    }

    this.isLoading = true;
    
    setTimeout(() => {
      this.booksService.permanentlyDelete(book.id);
      
      this.snackBar.open('Book permanently deleted', 'Cerrar', {
        duration: 3000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
        panelClass: ['success-snackbar'],
      });
      
      this.isLoading = false;
    }, 1500);
  }

  private filterBooks(books: Book[], searchQuery: string): Book[] {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return books;
    }
    return books.filter(book => 
      book.name.toLowerCase().includes(query) ||
      book.id.toLowerCase().includes(query)
    );
  }

  onTabChange(event: any): void {
    if (event.index === 0) {
      this.router.navigate(['/books']);
    } else if (event.index === 1) {
      this.router.navigate(['/books/archived']);
    }
  }

  private updateSelectedTab(): void {
    const url = this.router.url;
    if (url.includes('/archived')) {
      this.selectedTabIndex = 1;
    } else {
      this.selectedTabIndex = 0;
    }
  }
}
