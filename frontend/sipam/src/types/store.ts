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

export interface CIDRState {
    cidrs: CIDRDict;
    root: Set<string>
    search: CIDRDict;
}
