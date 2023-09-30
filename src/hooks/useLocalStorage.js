import { useEffect, useState } from 'react';

export function useLocalStorage(key) {
    const [value, setValue] = useState(() => {
        try {
            const saved = localStorage.getItem(key);
            if (saved !== null) {
                return JSON.parse(saved);
            }
            return null;
        } catch {
            return null;
        }
    });

    useEffect(() => {
        const rawValue = JSON.stringify(value);
        localStorage.setItem(key, rawValue);
    }, [key, value]);

    return [value, setValue];
}
