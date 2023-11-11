import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

function UserPovider({ children }) {
    const [activeUser, setActiveUser] = useState({});

    return <UserContext.Provider value={{ activeUser: activeUser, setActiveUser }}>{children}</UserContext.Provider>;
}

function useUser() {
    const context = useContext(UserContext);

    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }

    return context;
}

export { UserPovider, useUser };
