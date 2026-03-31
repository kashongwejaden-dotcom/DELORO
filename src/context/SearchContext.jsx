import React, { createContext, useState, useContext } from 'react';

const SearchContext = createContext();

export const useSearch = () => useContext(SearchContext);

export const SearchProvider = ({ children }) => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const openSearch = () => setIsSearchOpen(true);
    const closeSearch = () => setIsSearchOpen(false);

    return (
        <SearchContext.Provider value={{ isSearchOpen, openSearch, closeSearch }}>
            {children}
        </SearchContext.Provider>
    );
};
