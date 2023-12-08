export interface Order {
	id: number;
	date: Date;
	customer: string;
	address1: string;
	city: string;
	postcode: string;
	country: string;
	amount: number;
	status: string;
	deleted: string;
	last_modified: Date;
}

