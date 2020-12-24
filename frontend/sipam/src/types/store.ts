import { CIDR, Pool } from '@/types/api';

export interface RootState {
    version: string;
}

export interface CIDRDict {
    [id: string] : CIDR
}

export interface PoolDict {
    [id: string] : Pool
}

export interface SearchState {
    query: string;
    search: Object;
}

export interface BasicToken {
    access: string| undefined;
    refresh: string | undefined;
    [key: string]: any;
}
export interface AuthState {
    token: BasicToken;
    username: String;
    loggedIn: boolean;
}

export interface CIDRGet extends CIDR {
    id : string | ''
}
export interface CIDRState {
    cidrs: CIDRDict;
    root: Set<string>
    search: CIDRDict;
}

export interface PoolsDict {
    [id: string]: Pool
}

export interface PoolState {
    pools: PoolDict
}
