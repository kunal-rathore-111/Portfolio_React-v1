const Gemini = () => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            className="w-full h-full"
        >
            <defs>
                <linearGradient id="geminiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#F9BB06', stopOpacity: 1 }} /> {/* Yellow */}
                    <stop offset="35%" style={{ stopColor: '#E84D3D', stopOpacity: 1 }} /> {/* Red */}
                    <stop offset="65%" style={{ stopColor: '#4285F4', stopOpacity: 1 }} /> {/* Blue */}
                    <stop offset="100%" style={{ stopColor: '#34A853', stopOpacity: 1 }} /> {/* Green */}
                </linearGradient>
            </defs>
            <path
                fill="url(#geminiGradient)"
                d="M12 2C12 7.5 16.5 12 22 12C16.5 12 12 16.5 12 22C12 16.5 7.5 12 2 12C7.5 12 12 7.5 12 2Z"
            />
        </svg>
    );
};

export default Gemini;