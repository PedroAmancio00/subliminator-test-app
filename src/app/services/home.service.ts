import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
	providedIn: 'root'
})
export class HomeService {
	constructor(private http: HttpClient) {}

	getOrders(page: number) {
		let params = new HttpParams().set('page', page + 1);
		return this.http.get(`${environment.apiUrl}/api/orders`, { params });
	}

	cancelOrder(id: number) {
		return this.http.delete(`${environment.apiUrl}/api/orders/${id}`);
	}

	importOrders() {
		return this.http.post(`${environment.apiUrl}/api/orders/import`, {});
	}

	searchOrders(filterName: string, filter: string, page: number) {
		switch (filterName) {
			case 'name':
				return this.nameFilter(filter, page);
			case 'status':
				return this.statusFilter(filter, page);
			default:
				return this.getOrders(page);
		}
	}

	nameFilter(name: string, page: number) {
		let params = new HttpParams().set('page', page + 1).set('name', name);
		return this.http.get(`${environment.apiUrl}/api/orders/name`, { params });
	}

	statusFilter(status: string, page: number) {
		let params = new HttpParams().set('page', page + 1).set('status', status);
		return this.http.get(`${environment.apiUrl}/api/orders/status`, { params });
	}
}

