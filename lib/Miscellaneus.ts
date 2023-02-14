import { Error, isError, Product } from "./API";

export interface Ingredient {
    name: String
}

export function createIngredient(name: String): Ingredient {
    return { name }
}

export function totalItems(cart: [number, number][]): number{
    return cart.reduce((total: number, product: [number, number]) => {
        return total + product[1];
    }, 0);
}

export function totalPrice(cart: [number, number][], menu: Product[]): number{
    return cart.reduce((total: number, product: [number, number]) => {
        return total + menu[product[0]].price * product[1];
    }, 0);    
}