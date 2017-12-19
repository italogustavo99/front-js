import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';

import { ReportsService } from '../../service/reports.service';
import { ProcessingReportItem } from '../../model/ProcessingReportItem';

import { IPagedResults } from '../../common/interface/paged.results'

import {Router, ActivatedRoute} from '@angular/router';

@Component({
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  public list: ProcessingReportItem[];
  public totalRecords: number = 0;
  public pageSize: number = 15;
  public page: number = 0;
  
  public loading: boolean = false;
  public failed: boolean = false;

  constructor(
    private service: ReportsService, private _router: Router, private _route: ActivatedRoute
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
	.subscribe((response: IPagedResults<ProcessingReportItem[]>) => {
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
	this._router.navigate(['/reports'], { queryParams: { page: this.page } });
  }
}
