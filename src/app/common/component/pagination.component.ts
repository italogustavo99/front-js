import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html'
})
export class PaginationComponent implements OnInit {
  @Input() limit: number = 1;
  @Input() size: number = 1;
  @Input() range: number = 3;
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

  pages: Observable<number[]>;
  @Input() currentPage: number = 1;
  totalPages: number;

  constructor() { }

  ngOnInit() {
    this.getPages(this.limit, this.size);
  }

  getPages(limit: number, size: number) {
    this.totalPages = this.getTotalPages(limit, size);
	
    this.pages = Observable.range(-this.range, this.range * 2 + 1)
      .map(offset => this.currentPage + offset)
      .filter(page => this.isValidPageNumber(page, this.totalPages))
      .toArray();
  }

  isValidPageNumber(page: number, totalPages: number): boolean {
	this.getPages(this.limit, this.size); 
    return page > 0 && page <= totalPages;
  }

  getTotalPages(limit: number, size: number): number {
    return Math.ceil(Math.max(size, 1) / Math.max(limit, 1));
  }

  selectPage(page: number, event) {
    this.cancelEvent(event);
    if (this.isValidPageNumber(page, this.totalPages)) {
		this.currentPage = page;
		this.getPages(this.limit, this.size);
      this.pageChange.emit(page);
    }
  }

  cancelEvent(event) {
    event.preventDefault();
  }
}