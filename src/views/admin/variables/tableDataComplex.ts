type RowObj = {
	name: string;
	status: string;
	date: string;
	progress: number;
};

const tableDataComplex: RowObj[] = [
	{
		name: 'Weekly Update',
		progress: 90,
		status: 'Error',
		date: '13 Mar 2021'
	},
	{
		name: 'Marketplace',
		progress: 50.5,
		status: 'Approved',
		date: '24 Oct 2022'
	}
];
export default tableDataComplex;
