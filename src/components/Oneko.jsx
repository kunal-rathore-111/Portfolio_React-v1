import { useEffect } from 'react';

export default function Oneko() {
    useEffect(() => {
        // Dynamically load the script
        const script = document.createElement('script');
        script.src = '/oneko.js'; // Script should be in public folder
        script.async = true;
        document.body.appendChild(script);

        // Cleanup: remove script when component unmounts
        return () => {
            document.body.removeChild(script);
            // Also remove the neko element
            const nekoEl = document.getElementById('oneko');
            if (nekoEl) {
                nekoEl.remove();
            }
        };
    }, []);

    return null; // This component doesn't render anything
};
