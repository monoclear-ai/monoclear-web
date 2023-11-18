//@ts-nocheck

type RowObj = {
	name: [string, boolean];
	progress: string;
	accuracy: number;
	date: string; 
};

const tableDataCheck: RowObj[] = [
	{
		name: [ 'History', true ],
		quantity: 1024,
		accuracy: '74.3%',
		date: '13 Mar 2021',
	},
	{
		name: [ 'Science', true ],
		quantity: 858,
		accuracy: '61.5%',
		date: '24 Jan 2021',
	},
	{
		name: [ 'Math', true ],
		quantity: 258,
		accuracy: '56.2%',
		date: '24 Oct 2022',
	},
	{
		name: [ 'Art', true ],
		quantity: 258,
		accuracy: '45.2%',
		date: '24 Oct 2022',
	}
];

export default tableDataCheck;
