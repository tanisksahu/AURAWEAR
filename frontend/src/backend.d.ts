import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Outfit {
    items: Array<bigint>;
}
export interface WardrobeItem {
    color: string;
    productId?: bigint;
    customName?: string;
    category: string;
}
export interface TrendItem {
    trendTags: Array<string>;
    productId: bigint;
    trendScore: bigint;
    dateAdded: bigint;
}
export interface StyleProfile {
    bodyMeasurements: BodyMeasurements;
    savedOutfits: Array<Outfit>;
    userId: Principal;
    trendAlerts: Array<string>;
    stylePreferences: Array<string>;
}
export interface Product {
    id: bigint;
    name: string;
    tags: Array<string>;
    description: string;
    sizes: Array<string>;
    stock: bigint;
    imageUrl: string;
    category: string;
    colors: Array<string>;
    price: bigint;
    isTrending: boolean;
}
export interface BodyMeasurements {
    weight: bigint;
    height: bigint;
    hips: bigint;
    chest: bigint;
    waist: bigint;
}
export interface backendInterface {
    addProduct(product: Product): Promise<void>;
    addTrendItem(trend: TrendItem): Promise<void>;
    addWardrobeItem(userId: Principal, item: WardrobeItem): Promise<void>;
    createOrUpdateStyleProfile(profile: StyleProfile): Promise<void>;
    getAllProducts(): Promise<Array<Product>>;
    getPersonalizedTrends(userId: Principal): Promise<Array<TrendItem>>;
    getProductById(id: bigint): Promise<Product>;
    getProductsByCategory(category: string): Promise<Array<Product>>;
    getStyleProfile(userId: Principal): Promise<StyleProfile>;
    getTrendingItems(): Promise<Array<TrendItem>>;
    getWardrobe(userId: Principal): Promise<Array<WardrobeItem>>;
    getWardrobeSuggestions(userId: Principal): Promise<Array<Product>>;
    removeSavedOutfit(userId: Principal, index: bigint): Promise<void>;
    removeWardrobeItem(userId: Principal, index: bigint): Promise<void>;
    saveOutfit(userId: Principal, outfit: Outfit): Promise<void>;
    searchProducts(queryString: string): Promise<Array<Product>>;
    seedProducts(): Promise<void>;
    seedTrendItems(): Promise<void>;
}
