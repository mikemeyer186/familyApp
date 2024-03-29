import { useEffect, useState } from 'react';

export function useSessionStorage(key) {
    const [value, setValue] = useState(() => {
        try {
            const saved = sessionStorage.getItem(key);
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
        sessionStorage.setItem(key, rawValue);
    }, [key, value]);

    return [value, setValue];
}
