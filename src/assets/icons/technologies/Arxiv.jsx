const Arxiv = () => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            className="w-full h-full"
        >
            {/* Backslash - White */}
            <path
                d="M6 4L18 20"
                stroke="#FFFFFF"
                strokeWidth="3"
                strokeLinecap="round"
            />
            {/* Forward slash - Red */}
            <path
                d="M18 4L6 20"
                stroke="#B31B1B"
                strokeWidth="3"
                strokeLinecap="round"
            />
        </svg>
    );
};

export default Arxiv;