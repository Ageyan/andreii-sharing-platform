import { useEffect } from "react";
import type { RefObject } from "react";

export const useOutsideClick = <T extends HTMLElement>(
    ref: RefObject<T | null>, 
    callback: () => void
) => {
    useEffect(() => {
        const handleClick = (event: MouseEvent | TouchEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                callback();
            }
        };

        document.addEventListener('mousedown', handleClick);
        document.addEventListener('touchstart', handleClick);

        return () => {
            document.removeEventListener('mousedown', handleClick);
            document.removeEventListener('touchstart', handleClick);
        }
    }, [ref, callback])
};