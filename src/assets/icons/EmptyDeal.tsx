export const EmptyDeal = ({width="150px", height="150px", ...props}: any) => {
    return (
        <svg {...props} width={width} height={height} viewBox="0 0 190 97" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M122.783 63H41.2264C37.7616 63 34.9528 60.1794 34.9528 56.7C34.9528 53.2206 37.7616 50.4 41.2264 50.4H6.27358C2.80878 50.4 0 47.5794 0 44.1C0 40.6206 2.80878 37.8 6.27358 37.8H42.1226C45.5874 37.8 48.3962 34.9794 48.3962 31.5C48.3962 28.0206 45.5874 25.2 42.1226 25.2H19.717C16.2522 25.2 13.4434 22.3794 13.4434 18.9C13.4434 15.4206 16.2522 12.6 19.717 12.6H55.566C52.1012 12.6 49.2925 9.77939 49.2925 6.3C49.2925 2.82061 52.1012 0 55.566 0L106.651 0C110.116 0 112.925 2.82061 112.925 6.3C112.925 9.77939 110.116 12.6 106.651 12.6H164.009C167.474 12.6 170.283 15.4206 170.283 18.9C170.283 22.3794 167.474 25.2 164.009 25.2H183.726C187.191 25.2 190 28.0206 190 31.5C190 34.9794 187.191 37.8 183.726 37.8H166.698C163.233 37.8 160.425 40.6206 160.425 44.1C160.425 47.5794 163.233 50.4 166.698 50.4H172.075C175.54 50.4 178.349 53.2206 178.349 56.7C178.349 60.1794 175.54 63 172.075 63H125.472C125.01 63 124.56 62.95 124.127 62.855C123.694 62.95 123.244 63 122.783 63Z" fill="url(#paint0_radial_6748_3935)" />
            <g filter="url(#filter0_d_6748_3935)">
                <rect x="131" y="5" width="21" height="19" rx="5" fill="white" />
                <rect x="137.455" y="11.6221" width="1.46656" height="9.53263" transform="rotate(-45 137.455 11.6221)" fill="#AE1D00" />
                <rect x="144.418" y="10.4409" width="1.46656" height="9.53263" transform="rotate(45 144.418 10.4409)" fill="#AE1D00" />
                <path d="M131 25.2338V18.5L136 24L132.514 26.0913C131.848 26.4912 131 26.0111 131 25.2338Z" fill="white" />
            </g>
            <path d="M137.5 37.5V40.9513C137.5 42.5524 136.733 44.0567 135.438 44.9974L65.8139 95.5461C64.9599 96.1661 63.9317 96.5 62.8763 96.5H62C59.2386 96.5 57 94.2614 57 91.5V29C57 26.2386 59.2386 24 62 24H84.705C87.4664 24 89.705 26.2386 89.705 29V29.5C89.705 31.1569 91.0481 32.5 92.705 32.5H132.5C135.261 32.5 137.5 34.7386 137.5 37.5Z" fill="url(#paint1_linear_6748_3935)" />
            <path d="M133.228 96.5H63.6896C60.3494 96.5 57.9484 93.2877 58.8942 90.0842L71.4418 47.5842C72.0693 45.4588 74.021 44 76.2372 44H145.371C148.693 44 151.092 47.1795 150.179 50.3736L138.036 92.8736C137.423 95.0201 135.461 96.5 133.228 96.5Z" fill="url(#paint2_linear_6748_3935)" />
            <defs>
                <filter id="filter0_d_6748_3935" x="129" y="5" width="23" height="25.2354" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dx="-2" dy="4" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0.988235 0 0 0 0 0.466667 0 0 0 0 0.337255 0 0 0 0.25 0" />
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_6748_3935" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_6748_3935" result="shape" />
                </filter>
                <radialGradient id="paint0_radial_6748_3935" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(43.3696 48.2087) rotate(-11.2805) scale(107.822 35.8345)">
                    <stop stop-color="#FC7756" />
                    <stop offset="1" stop-color="#FFCE78" />
                </radialGradient>
                <linearGradient id="paint1_linear_6748_3935" x1="97.25" y1="24" x2="97.25" y2="96.5" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#98D9E4" />
                    <stop offset="1" stop-color="#0091AE" />
                </linearGradient>
                <linearGradient id="paint2_linear_6748_3935" x1="104.5" y1="44" x2="104.5" y2="96.5" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#E5F5F8" />
                    <stop offset="1" stop-color="#98D9E4" />
                </linearGradient>
            </defs>
        </svg>
    )
}
