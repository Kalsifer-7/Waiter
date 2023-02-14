import { sha256 } from 'sha.js'
import { Profile } from './useGoogleProfile'
import { fromByteArray, toByteArray } from 'base64-js'

interface AuthToken {
    sub: string
    exp: string // Date in RFC3339
    idempotency: string
}

export interface API {
    getMenu(): Promise<Product[] | Error>
    addMenuItem(prod: Omit<Product, 'id'>): Promise<Product | Error>
    removeMenuItem(prodId: number): Promise<Product | Error>
    getOrders(): Promise<Order[] | Error>
    getAllOrders(): Promise<Order[] | Error>
    addOrder(
        first_term: boolean,
        order: [number, number][]
    ): Promise<Order | Error>
    setOrderAsDone(orderId: number): Promise<Order | Error>
}

export type ProductKind = 'available' | 'orderable' | 'beverage'

export interface Product {
    readonly id: number
    kind: ProductKind
    name: string
    price: number
    max_num: number
    ingredients: string | null
    image: ArrayBuffer
}

type RawProduct = Omit<Product, 'image'> & { image: string }

export interface Order {
    readonly id: number
    readonly owner: string
    readonly owner_name: string
    readonly first_term: boolean
    //(product id, quantity)
    readonly cart: [number, number][]
}

export interface Error {
    reason: string
    message: string
}

export function isError(error: any): error is Error {
    return (
        error !== undefined &&
        typeof error.reason === 'string' &&
        typeof error.message === 'string'
    )
}

let client: API | null = null

export async function useAPI(params: Profile): Promise<API> {
    if (client === null) {
        //const auth_module = await import('./auth/pkg')
        //client = new RealAPI(params, auth_module.build_jwt)
        client = new MockupAPI()
    }
    return client
}

class RealAPI implements API {
    private endpoint: string
    private google_profile: Profile
    private build_jwt: (obj: any) => string

    constructor(profile: Profile, build_jwt: (obj: any) => string) {
        this.endpoint =
            process.env.NEXT_PUBLIC_API_ENDPOINT?.replace(
                '{host}',
                window.location.host
            ) ?? 'http://localhost:8080'
        this.google_profile = profile
        this.build_jwt = build_jwt
    }

    private getAuthHeader(payload: any): { Authorization: string } {
        const later = new Date()
        later.setHours(later.getHours() + 1)
        const partial_auth_token = {
            sub: this.google_profile.profileId,
            exp: later.toISOString(),
        }
        const auth_token: AuthToken = {
            ...partial_auth_token,
            idempotency: new sha256()
                .update(
                    JSON.stringify({
                        sub: this.google_profile.profileId,
                        exp: later.getTime(),
                        token: this.google_profile.accessToken,
                        payload,
                    })
                )
                .digest('hex'),
        }
        return {
            Authorization: `Bearer ${this.build_jwt(auth_token)}`,
        }
    }

    async getMenu(): Promise<Product[] | Error> {
        const auth_token = this.getAuthHeader(null)
        const response = await this.fetch(`menu`, {
            method: 'GET',
            headers: auth_token,
        })

        const payload: RawProduct[] | Error = await response.json()
        return this.map_result(payload, (rawProducts: RawProduct[]) => {
            const products: Product[] = []
            rawProducts.forEach(
                (rawProduct) =>
                    (products[rawProduct.id] = this.rawToProduct(rawProduct))
            )
            return products
        })
    }

    //arrow function to fix this scope
    addMenuItem = async (
        prod: Omit<Product, 'id'>
    ): Promise<Product | Error> => {
        const auth_token = this.getAuthHeader(prod)
        const response = await this.fetch(`menu`, {
            method: 'PUT',
            headers: {
                ...auth_token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...prod,
                image: fromByteArray(new Uint8Array(prod.image)),
            }),
        })

        const payload: RawProduct | Error = await response.json()
        return this.map_result(payload, this.rawToProduct)
    }

    async removeMenuItem(prodId: number): Promise<Product | Error> {
        const auth_token = this.getAuthHeader(prodId)
        const response = await this.fetch(`menu/${prodId}`, {
            method: 'DELETE',
            headers: auth_token,
        })

        const payload: RawProduct | Error = await response.json()
        return this.map_result(payload, this.rawToProduct)
    }

    async getOrders(): Promise<Order[] | Error> {
        const auth_token = this.getAuthHeader(null)
        const response = await this.fetch(`order`, {
            method: 'GET',
            headers: auth_token,
        })

        return response.json()
    }

    async getAllOrders(): Promise<Order[] | Error> {
        const auth_token = this.getAuthHeader(null)
        const response = await this.fetch(`order/all`, {
            method: 'GET',
            headers: auth_token,
        })

        return response.json()
    }

    async addOrder(
        first_term: boolean,
        order: [number, number][]
    ): Promise<Order | Error> {
        const body = {
            owner_name: this.google_profile.profileName,
            first_term,
            cart: order,
        }
        const auth_token = this.getAuthHeader(body)
        const response = await this.fetch(`order`, {
            method: 'PUT',
            headers: {
                ...auth_token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        })

        return response.json()
    }

    async setOrderAsDone(orderId: number): Promise<Order | Error> {
        const auth_token = this.getAuthHeader(orderId)
        const response = await this.fetch(`order/${orderId}`, {
            method: 'DELETE',
            headers: auth_token,
        })

        return response.json()
    }

    private rawToProduct = (product: RawProduct): Product => {
        return {
            ...product,
            image: toByteArray(product.image),
        }
    }

    private map_result<T, R>(
        value: T | Error,
        func: (value: T) => R
    ): R | Error {
        if (isError(value)) {
            return value
        } else {
            return func(value)
        }
    }

    private fetch(input: string, init: RequestInit): Promise<Response> {
        return window.fetch(`${this.endpoint}/${input}`, init)
    }
}

class MockupAPI implements API {
    private menu: Product[] = [
        {
            id: 0,
            kind: 'available',
            name: 'lorem',
            price: 307,
            ingredients: 'lorem\nlorem',
            max_num: 5,
            image: new Uint8Array([
                0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
            ]),
        },
        {
            id: 1,
            kind: 'available',
            name: 'ipsum',
            price: 598,
            ingredients: 'ipsum\nipsum',
            max_num: 5,
            image: new Uint8Array([
                0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
            ]),
        },
        {
            id: 2,
            kind: 'available',
            name: 'dolor',
            price: 559,
            ingredients: 'dolor\ndolor',
            max_num: 5,
            image: new Uint8Array([
                0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
            ]),
        },
        {
            id: 3,
            kind: 'orderable',
            name: 'sit',
            price: 262,
            ingredients: 'sit\nsit',
            max_num: 5,
            image: new Uint8Array([
                0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
            ]),
        },
        {
            id: 4,
            kind: 'orderable',
            name: 'amet',
            price: 541,
            ingredients: 'amet\namet',
            max_num: 5,
            image: new Uint8Array([
                0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
            ]),
        },
        {
            id: 5,
            kind: 'orderable',
            name: 'consectetur',
            price: 240,
            ingredients: 'consectetur\nconsectetur',
            max_num: 5,
            image: new Uint8Array([
                0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
            ]),
        },
        {
            id: 6,
            kind: 'beverage',
            name: 'adipisci',
            price: 539,
            ingredients: 'adipisci\nadipisci',
            max_num: 5,
            image: new Uint8Array([
                0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
            ]),
        },
        {
            id: 7,
            kind: 'beverage',
            name: 'elit',
            price: 252,
            ingredients: 'elit\nelit',
            max_num: 5,
            image: new Uint8Array([
                0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
            ]),
        },
    ]
    private orders: Order[] = [
        {
            id: 0,
            owner: '1234567',
            owner_name: 'mario',
            first_term: true,
            cart: [
                [6, 8],
                [2, 3],
            ],
        },
        {
            id: 1,
            owner: '2231253',
            owner_name: 'lucia',
            first_term: false,
            cart: [
                [3, 9],
                [2, 5],
                [1, 6],
            ],
        },
    ]

    async getMenu(): Promise<Product[]> {
        return this.menu
    }

    //arrow function to fix this scope
    addMenuItem = async (prod: Omit<Product, 'id'>): Promise<Product> => {
        //The new length is returned
        const len = this.menu.push({
            ...prod,
            id:
                this.menu.length > 0
                    ? this.menu[this.menu.length - 1].id + 1
                    : 0,
        })
        //Length - 1 = last index
        return this.menu[len - 1]
    }

    async removeMenuItem(prodId: number): Promise<Product> {
        const idx = this.menu.findIndex((el) => el.id === prodId)
        const orderToDelete = this.menu[idx]
        this.menu = this.menu.splice(idx, 1)
        return orderToDelete
    }

    async getOrders(): Promise<Order[]> {
        return this.orders
    }

    getAllOrders(): Promise<Order[] | Error> {
        return this.getOrders()
    }

    async addOrder(
        first_term: boolean,
        order: [number, number][]
    ): Promise<Order> {
        const len = this.orders.push({
            id:
                this.orders.length > 0
                    ? this.orders[this.orders.length - 1].id + 1
                    : 0,
            owner: '',
            owner_name: '',
            first_term,
            cart: order,
        })
        return this.orders[len - 1]
    }

    async setOrderAsDone(orderId: number): Promise<Order | Error> {
        const idx = this.orders.findIndex((el) => el.id === orderId)
        const orderToDelete = this.orders[idx]
        this.orders.splice(idx, 1)
        return orderToDelete
    }
}
