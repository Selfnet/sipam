import { Api, CIDR, Pool, Token } from '@/types/api.ts';
import { SIPAMConfiguration } from '@/config.ts';

export interface RootState {
    version: string;
    config: SIPAMConfiguration;
    api: Api;
}

export interface CIDRDict {
    [id: string] : CIDR
}

export interface PoolDict {
    [id: string] : Pool
}

export interface TokenDict {
    [id: string]: Token
}
export interface SearchState {
    query: string;
    search: object;
}

export interface BasicToken {
    access: string| undefined;
    refresh: string | undefined;
    [key: string]: unknown;
}
export interface AuthState {
    token: BasicToken;
    username: string;
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

export interface PoolState {
    pools: PoolDict
}

export interface TokenState {
    tokens: TokenDict
}
