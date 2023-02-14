// <--! DEBUG !-->
import { Product } from '../lib/API';

export const products: Product[] = [
	{
		id: 0,
		kind: "available",
		name: "lorem",
		price: 307,
		ingredients: "lorem\nlorem",
		max_num: 5,
		image: new Uint8Array([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]),
	},
	{
		id: 1,
		kind: "available",
		name: "ipsum",
		price: 598,
		ingredients: "ipsum\nipsum",
		max_num: 5,
		image: new Uint8Array([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])
	},
	{
		id: 2,
		kind: "available",
		name: "dolor",
		price: 559,
		ingredients: "dolor\ndolor",
		max_num: 5,
		image: new Uint8Array([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])
	},
	{
		id: 3,
		kind: "orderable",
		name: "sit",
		price: 262,
		ingredients: "sit\nsit",
		max_num: 5,
		image: new Uint8Array([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])
	},
	{
		id: 4,
		kind: "orderable",
		name: "amet",
		price: 541,
		ingredients: "amet\namet",
		max_num: 5,
		image: new Uint8Array([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])
	},
	{
		id: 5,
		kind: "orderable",
		name: "consectetur",
		price: 240,
		ingredients: "consectetur\nconsectetur",
		max_num: 5,
		image: new Uint8Array([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])
	},
	{
		id: 6,
		kind: "beverage",
		name: "adipisci",
		price: 539,
		ingredients: "adipisci\nadipisci",
		max_num: 5,
		image: new Uint8Array([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])
	},
	{
		id: 7,
		kind: "beverage",
		name: "elit",
		price: 252,
		ingredients: "elit\nelit",
		max_num: 5,
		image: new Uint8Array([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])
	}
];
