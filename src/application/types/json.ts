export type JsonObject<T> = { [K in keyof T]: T[K] extends Json<T> ? T[K] : never };

export type Json<T> = boolean | number | string | null | JsonObject<T> | Array<Json<T>>;
