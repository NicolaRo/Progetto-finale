import { useState, useCallback } from "react";

export function useToast() {
    const [toast, setToast] = useState(null);

    const notify = useCallback((message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    }, []);
    const dismiss = useCallback(() => setToast(null), []);
   
    return {toast, notify, dismiss};
}