export const GlobalSearchContextName = 'GlobalSearchDetails';

export interface IGlobalSearchDetails {
    searchTypes: ISearchType[];
}

export interface ISearchType {
    name: string;
    displayName: string;
    placeholder: string;
    entitlement: string;
    api: string;
    workspace: string;
    default?: boolean;
    maxLength?: number;
    recentSearches: IRecentSearch[];
    noRecentSearchesMessage: string;
}

export interface IRecentSearch {
    query: string;
    displayName: string;
}
