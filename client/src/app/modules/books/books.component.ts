import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { combineLatest, map, Observable, startWith, Subject, takeUntil } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BooksService } from '../../shared/services/books.service';
import { Book } from '../../shared/models';
import { PercDataTableColumn, PercDataTableConfig } from '../../shared/components/perc-data-table/perc-data-table.component';

const MIN_BOOK_NAME_LENGTH = 2;
const MAX_BOOK_NAME_LENGTH = 100;

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css'],
})
export class BooksComponent implements OnDestroy {
  private readonly destroy$ = new Subject<void>();

  readonly searchControl = new FormControl<string>('', { nonNullable: true });
  readonly form = new FormGroup({
    id: new FormControl<string | null>({ value: null, disabled: true }, [Validators.required]),
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(MIN_BOOK_NAME_LENGTH), Validators.maxLength(MAX_BOOK_NAME_LENGTH)],
    }),
  });

  readonly books$: Observable<Book[]>;
  readonly filteredBooks$: Observable<Book[]>;

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
    }
  ];

  readonly tableConfig: PercDataTableConfig = {
    showEditButton: true,
    showDeleteButton: true,
    editButtonLabel: 'Edit',
    deleteButtonLabel: 'Delete',
    pageSizeOptions: [5, 10, 20, 50],
    pageSize: 10,
    sortable: true,
    sortColumn: 'name',
    sortDirection: 'asc',
    emptyMessage: 'No books available',
    noSearchResultsMessage: 'No books found matching your search'
  };

  selectedBook: Book | null = null;
  private currentBooks: Book[] = [];
  isLoading = false;

  constructor(
    private readonly booksService: BooksService,
    private readonly snackBar: MatSnackBar
  ) {
    this.books$ = this.booksService.books$;

    // Combine books and search to create filtered books observable
    this.filteredBooks$ = combineLatest([
      this.books$,
      this.searchControl.valueChanges.pipe(startWith(this.searchControl.value)),
    ]).pipe(
      map(([books, searchQuery]) => this.filterBooks(books, searchQuery))
    );

    this.setupIdValidator();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onEditBook(book: Book): void {
    this.selectRow(book);
  }

  onDeleteBook(book: Book): void {
    this.delete(book);
  }

  selectRow(book: Book): void {
    this.selectedBook = book;
    this.form.patchValue({
      id: book.id,
      name: book.name,
    });
  }

  clearSelection(): void {
    this.selectedBook = null;
    this.form.reset({ name: '' });
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.controls.id.setErrors(null);
    this.form.controls.name.setErrors(null);
    this.updateNextId();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.getFormValue();
    if (!formValue) {
      return;
    }

    // Simular carga en DB tanto al crear como al editar
    this.isLoading = true;
    
    // Simular una operación asíncrona de base de datos (1.5 segundos)
    setTimeout(() => {
      if (this.isEditing) {
        this.booksService.update(formValue);
        this.snackBar.open('Book updated successfully', 'Cerrar', {
          duration: 3000,
          verticalPosition: 'bottom',
          horizontalPosition: 'center',
          panelClass: ['success-snackbar'],
        });
      } else {
        this.booksService.create(formValue);
        this.snackBar.open('New Book created successfully', 'Cerrar', {
          duration: 3000,
          verticalPosition: 'bottom',
          horizontalPosition: 'center',
          panelClass: ['success-snackbar'],
        });
      }
      this.clearSelection();
      this.isLoading = false;
    }, 1500);
  }

  delete(book: Book): void {
    // Simular carga en DB al borrar un libro
    this.isLoading = true;
    
    // Simular una operación asíncrona de base de datos (1.5 segundos)
    setTimeout(() => {
      this.booksService.remove(book.id);
      
      this.snackBar.open('Book deleted successfully', 'Cerrar', {
        duration: 3000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
        panelClass: ['success-snackbar'],
      });

      if (this.selectedBook?.id === book.id) {
        this.clearSelection();
      }
      
      this.isLoading = false;
    }, 1500);
  }

  get isEditing(): boolean {
    return this.selectedBook !== null;
  }

  get isSubmitDisabled(): boolean {
    return this.form.invalid || !this.form.controls.id.value || !this.form.controls.name.value?.trim();
  }

  get idError(): string | null {
    return this.getControlError(this.form.controls.id, {
      required: 'ID is required',
    });
  }

  get nameError(): string | null {
    return this.getControlError(this.form.controls.name, {
      required: 'Name is required',
      minlength: `Name must be at least ${MIN_BOOK_NAME_LENGTH} characters`,
      maxlength: `Name must be less than ${MAX_BOOK_NAME_LENGTH} characters`,
    });
  }

  private setupIdValidator(): void {
    this.books$.pipe(takeUntil(this.destroy$)).subscribe(books => {
      this.currentBooks = books;
      if (!this.isEditing) {
        this.updateNextId();
      }
    });
  }

  private getNextId(): string {
    if (this.currentBooks.length === 0) {
      return '1';
    }

    const maxId = Math.max(
      ...this.currentBooks.map(book => Number.parseInt(book.id, 10))
    );
    return (maxId + 1).toString();
  }

  private updateNextId(): void {
    if (!this.isEditing) {
      const nextId = this.getNextId();
      this.form.controls.id.setValue(nextId, { emitEvent: false });
    }
  }

  private filterBooks(books: Book[], searchQuery: string): Book[] {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return books;
    }
    return books.filter(book => book.name.toLowerCase().includes(query));
  }

  private getFormValue(): Book | null {
    const idControl = this.form.controls.id;
    const nameControl = this.form.controls.name;

    const id = this.isEditing ? this.selectedBook?.id : idControl.value;
    const name = nameControl.value.trim();

    if (!id || !name) {
      return null;
    }

    return { id, name };
  }

  private getControlError(
    control: AbstractControl,
    errorMessages: Record<string, string>
  ): string | null {
    if (!control.touched && !control.dirty) {
      return null;
    }

    const errorEntry = Object.entries(errorMessages).find(([errorKey]) =>
      control.hasError(errorKey)
    );

    if (!errorEntry) {
      return null;
    }

    const [, message] = errorEntry;
    return message;
  }
}
