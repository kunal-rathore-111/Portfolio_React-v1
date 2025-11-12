export default function Vite({ color = "currentColor" }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 128 128"
            fill="none"
            className="size-6"
        >
            <defs>
                <linearGradient id="a" x1="6" x2="235" y1="33" y2="344" gradientTransform="translate(1.34 1.894) scale(.07142)" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#41d1ff" />
                    <stop offset="1" stopColor="#bd34fe" />
                </linearGradient>
                <linearGradient id="b" x1="194.651" x2="236.076" y1="8.818" y2="292.989" gradientTransform="translate(1.34 1.894) scale(.07142)" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#ffea83" />
                    <stop offset=".083" stopColor="#ffdd35" />
                    <stop offset="1" stopColor="#ffa800" />
                </linearGradient>
            </defs>
            <path fill="url(#a)" d="M124.766 19.52L67.324 122.238c-1.187 2.121-4.234 2.133-5.437.022L3.305 19.532c-1.313-2.302.652-5.087 3.261-4.622L64.07 25.187a3.09 3.09 0 001.713 0l56.62-10.261c2.598-.47 4.561 2.287 3.362 4.594z" />
            <path fill="url(#b)" d="M91.46 1.43L48.954 9.758a1.56 1.56 0 00-1.04.827L33.583 40.409a1.55 1.55 0 002.61 1.71l11.672-11.958a3.13 3.13 0 015.082 2.465l-2.757 28.567a1.55 1.55 0 002.784.943l51.905-80.725c1.078-1.677-.876-3.696-2.419-2.981z" />
        </svg>
    );
}