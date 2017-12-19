import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';

import { OperatorsService } from '../../service/operators.service';
import { Operators } from '../../model/operators';

import { IPagedResults } from '../../common/interface/paged.results'

import {Router, ActivatedRoute} from '@angular/router';

@Component({
  templateUrl: './operators.component.html',
  styleUrls: ['./operators.component.css']
})
export class OperatorsComponent implements OnInit {

  public list: Operators[];
  public totalRecords: number = 0;
  public pageSize: number = 15;
  public page: number = 0;
  
  public loading: boolean = false;
  public failed: boolean = false;

  constructor(
    private service: OperatorsService, private _router: Router, private _route: ActivatedRoute
  ) { }

  ngOnInit() {
    let observable = this._route.queryParams
      .map(params => params['page'])
	  .map(pageNr => (pageNr == undefined ? 1 : pageNr))
      .map(pageNr => pageNr - 1);
    observable.subscribe(page => this.page = page);
    observable.share().subscribe(page => this.listAll(page, this.pageSize));
  }
  
  listAll(page: number = this.page, pageSize: number = this.pageSize): void {
    this.loading = true;
    this.failed = false;
	this.service.list(page, pageSize)
	.subscribe((response: IPagedResults<Operators[]>) => {
                this.totalRecords = response.totalRecords;
                this.list = response.results;
				this.loading = false;
            }, () => {
      this.loading = false;
      this.failed = true;
    });
  }
  
  onPageChange(page) {
    this.page = page;
	this._router.navigate(['/operators'], { queryParams: { page: this.page } });
  }
}
