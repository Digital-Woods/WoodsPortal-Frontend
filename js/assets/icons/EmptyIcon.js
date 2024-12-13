const EmptyIcon = (props) => {
    return (
        <svg
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
            height="1em"
            width="1em"
            {...props}
        >
            <path stroke="none" d="M0 0h24v24H0z" />
            <path d="M19 8H5M5 12h7M12 16H5M16 14l4 4M20 14l-4 4" />
        </svg>
    )
}
