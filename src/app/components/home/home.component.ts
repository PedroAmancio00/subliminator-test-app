import { Component, OnInit, ViewChild } from '@angular/core';
import { HomeService } from '../../services/home.service';
import { Order } from '../../interfaces/order';
import { TableModule } from 'primeng/table';
import { Paginator, PaginatorModule } from 'primeng/paginator';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
	standalone: true,
	imports: [CommonModule, TableModule, PaginatorModule, ButtonModule, InputTextModule],
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

	async ngOnInit() {
		//Clear filters
		this.page = 0;
		this.filterName = '';
		this.filter = '';
		//Serch orders
		await this.searchOrders();
	}

	async searchOrders() {
		try {
			const data: any = await lastValueFrom(this.homeService.searchOrders(this.filterName, this.filter, this.page));
			this.dataSource = data?.result;
			this.totalRecords = data?.total;
			this.loading = false;
		} catch (error: any) {
			//Treating error message.
			if (String(error.error) === 'TypeError: NetworkError when attempting to fetch resource.') {
				this.dataSource = [];
				this.totalRecords = 0;
				this.toastr.error('Error connecting to database', 'Error', {
					timeOut: 3000,
					progressBar: true,
					closeButton: true
				});
			}
			this.loading = false;
		}
	}

	async onPageChange(page: any) {
		//Set page
		this.page = page;
		this.loading = true;
		//Search orders
		await this.searchOrders();
	}

	async setNameFilter() {
		//Set loading
		this.loading = true;
		this.page = 0;
		//If filter is empty, clear filters
		if (!this.nameFilter) {
			this.filterName = '';
			this.filter = '';
			this.statusFilter = '';
			await this.searchOrders();
			//If filter is not empty, set filter
		} else {
			this.filter = this.nameFilter;
			this.filterName = 'name';
			this.statusFilter = '';
			await this.searchOrders();
		}
		//Set page to first
		this.paginator.changePageToFirst(new Event(''));
	}

	async setStatusFilter() {
		//Set loading
		this.loading = true;
		this.page = 0;
		//If filter is empty, clear filters
		if (!this.statusFilter) {
			this.filterName = '';
			this.filter = '';
			this.nameFilter = '';
			await this.searchOrders();
			//If filter is not empty, set filter
		} else {
			this.filter = this.statusFilter;
			this.filterName = 'status';
			this.nameFilter = '';
			await this.searchOrders();
		}
		//Set page to first
		this.paginator.changePageToFirst(new Event(''));
	}

	async cancelOrder(id: number) {
		this.loading = true;
		//Cancel order
		await lastValueFrom(this.homeService.cancelOrder(id));
		await this.searchOrders();
	}

	async loadOrders() {
		this.loading = true;
		//Import orders
		try {
			const data: any = await lastValueFrom(this.homeService.importOrders());
			await this.onPageChange(0);
			this.toastr.success(data, 'Success', { timeOut: 3000, progressBar: true, closeButton: true });
		} catch (error: any) {
			this.loading = false;
			this.toastr.error(error.error, 'Error', {
				timeOut: 3000,
				progressBar: true,
				closeButton: true
			});
		}
	}
}

