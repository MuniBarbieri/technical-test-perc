import { Component, Input, Output, EventEmitter, ViewChild, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

export interface PercDataTableColumn<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  getValue?: (item: T) => any;
}

export interface PercDataTableConfig {
  showEditButton?: boolean;
  showDeleteButton?: boolean;
  editButtonLabel?: string;
  deleteButtonLabel?: string;
  editButtonIcon?: string;
  deleteButtonIcon?: string;
  pageSizeOptions?: number[];
  pageSize?: number;
  sortable?: boolean;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  getItemId?: (item: any) => any;
  emptyMessage?: string;
  noSearchResultsMessage?: string;
}

@Component({
  selector: 'perc-data-table',
  templateUrl: './perc-data-table.component.html',
  styleUrls: ['./perc-data-table.component.css']
})
export class PercDataTableComponent<T = any> implements AfterViewInit, OnChanges {
  @Input() data: T[] = [];
  @Input() columns: PercDataTableColumn<T>[] = [];
  @Input() config: PercDataTableConfig = {};
  @Input() selectedItem: T | null = null;
  @Input() totalDataCount: number = 0; // Total de datos originales (sin filtrar)
  @Input() isLoading: boolean = false;
  
  @Output() edit = new EventEmitter<T>();
  @Output() delete = new EventEmitter<T>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<T>([]);
  displayedColumns: string[] = [];

  private defaultConfig: PercDataTableConfig = {
    showEditButton: false,
    showDeleteButton: false,
    editButtonLabel: 'Edit',
    deleteButtonLabel: 'Delete',
    editButtonIcon: 'edit',
    deleteButtonIcon: 'delete',
    pageSizeOptions: [5, 10, 20, 50],
    pageSize: 10,
    sortable: true,
    sortColumn: 'name',
    sortDirection: 'asc',
    emptyMessage: 'No data available',
    noSearchResultsMessage: 'No results found'
  };

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.updateDisplayedColumns();
    this.updateDataSource();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['columns'] || changes['config']) {
      this.updateDisplayedColumns();
      this.updateDataSource();
    }
  }

  private updateDisplayedColumns(): void {
    const mergedConfig = { ...this.defaultConfig, ...this.config };
    this.displayedColumns = this.columns.map(col => col.key);
    
    if (mergedConfig.showEditButton || mergedConfig.showDeleteButton) {
      this.displayedColumns.push('actions');
    }
  }

  private updateDataSource(): void {
    this.dataSource.data = this.data;
    
    // Set up custom sorting for columns with getValue
    this.dataSource.sortingDataAccessor = (item: T, property: string) => {
      const column = this.columns.find(col => col.key === property);
      let value: any;
      
      if (column?.getValue) {
        value = column.getValue(item);
      } else {
        // Default: try to access property directly
        value = (item as any)[property] || '';
      }
      
      // Normalize strings for proper alphabetical sorting
      // Convert to string and lowercase for case-insensitive alphabetical comparison
      if (typeof value === 'string') {
        return value.toLowerCase();
      }
      
      return value;
    };
  }

  onEditClick(item: T, event?: MouseEvent): void {
    event?.stopPropagation();
    this.edit.emit(item);
  }

  onDeleteClick(item: T, event?: MouseEvent): void {
    event?.stopPropagation();
    this.delete.emit(item);
  }

  getCellValue(item: T, column: PercDataTableColumn<T>): any {
    if (column.getValue) {
      return column.getValue(item);
    }
    return (item as any)[column.key] || '';
  }

  isColumnSortable(column: PercDataTableColumn<T>): boolean {
    const mergedConfig = { ...this.defaultConfig, ...this.config };
    return mergedConfig.sortable !== false && (column.sortable !== false);
  }

  get configMerged(): PercDataTableConfig {
    return { ...this.defaultConfig, ...this.config };
  }

  isRowSelected(item: T): boolean {
    if (!this.selectedItem) {
      return false;
    }
    
    const mergedConfig = { ...this.defaultConfig, ...this.config };
    if (mergedConfig.getItemId) {
      return mergedConfig.getItemId(item) === mergedConfig.getItemId(this.selectedItem);
    }
    
    // Default comparison: compare by reference or by common id property
    return item === this.selectedItem || (item as any)?.id === (this.selectedItem as any)?.id;
  }

  get isEmpty(): boolean {
    return this.dataSource.data.length === 0;
  }

  get isSearchResult(): boolean {
    // Si hay datos totales pero no hay datos filtrados, es un resultado de búsqueda
    return this.totalDataCount > 0 && this.dataSource.data.length === 0;
  }

  get emptyMessage(): string {
    const mergedConfig = { ...this.defaultConfig, ...this.config };
    if (this.isSearchResult) {
      return mergedConfig.noSearchResultsMessage || 'No results found';
    }
    return mergedConfig.emptyMessage || 'No data available';
  }
}
