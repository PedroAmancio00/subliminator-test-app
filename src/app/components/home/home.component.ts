import { Component, OnInit, ViewChild } from '@angular/core';
import { HomeService } from '../../services/home.service';
import { Order } from '../../interfaces/order';
import { TableModule } from 'primeng/table';
import { Paginator, PaginatorModule } from 'primeng/paginator';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
	standalone: true,
	imports: [TableModule, PaginatorModule, CommonModule, ButtonModule, InputTextModule],
	providers: [HomeService]
})
export class HomeComponent implements OnInit {
	constructor(private homeService: HomeService, private toastr: ToastrService) {}

	@ViewChild('paginator', { static: false }) paginator!: Paginator;
	dataSource: Order[] = [];
	totalRecords: number = 0;
	loading: boolean = true;
	nameFilter: string = '';
	statusFilter: string = '';
	page: number = 0;
	filterName: string = '';
	filter: string = '';

	ngOnInit(): void {
		//Clear filters
		this.page = 0;
		this.filterName = '';
		this.filter = '';
		//Serch orders
		this.searchOrders();
	}

	searchOrders() {
		//Search orders
		this.homeService.searchOrders(this.filterName, this.filter, this.page).subscribe((data: any) => {
			//Set orders
			this.dataSource = data?.result;
			this.totalRecords = data?.total;
			this.loading = false;
		});
	}

	onPageChange(page: any) {
		//Set page
		this.page = page;
		this.loading = true;
		//Search orders
		this.searchOrders();
	}

	setNameFilter() {
		//Set loading
		this.loading = true;
		this.page = 0;
		//If filter is empty, clear filters
		if (!this.nameFilter) {
			this.filterName = '';
			this.filter = '';
			this.statusFilter = '';
			this.searchOrders();
			//If filter is not empty, set filter
		} else {
			this.filter = this.nameFilter;
			this.filterName = 'name';
			this.statusFilter = '';
			this.searchOrders();
		}
		//Set page to first
		this.paginator.changePageToFirst(new Event(''));
	}

	setStatusFilter() {
		//Set loading
		this.loading = true;
		this.page = 0;
		//If filter is empty, clear filters
		if (!this.statusFilter) {
			this.filterName = '';
			this.filter = '';
			this.nameFilter = '';
			this.searchOrders();
			//If filter is not empty, set filter
		} else {
			this.filter = this.statusFilter;
			this.filterName = 'status';
			this.nameFilter = '';
			this.searchOrders();
		}
		//Set page to first
		this.paginator.changePageToFirst(new Event(''));
	}

	cancelOrder(id: number) {
		this.loading = true;
		//Cancel order
		this.homeService.cancelOrder(id).subscribe(() => {
			this.searchOrders();
		});
	}

	loadOrders() {
		this.loading = true;
		//Import orders
		this.homeService
			.importOrders()
			.pipe(
				catchError((error) => {
					this.loading = false;
					this.toastr.error(error.error, 'Error');
					return throwError(() => error);
				})
			)
			.subscribe((data: any) => {
				this.onPageChange(0);
				this.toastr.success(data, 'Success');
			});
	}
}

