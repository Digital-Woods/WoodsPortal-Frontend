const ErrorMessage = (props) => {
    return (
        <svg
            className="w-5 h-5 text-red-600"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-11h2v5h-2zm0 6h2v2h-2z"
                fill="currentColor"
            />
        </svg>
    )
}