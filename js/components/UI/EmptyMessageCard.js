const EmptyMessageCard = ({name='item'}) => {
    return (
        <div className="flex flex-col items-center justify-center h-auto text-center space-y-4 dark:bg-dark-300 bg-white p-6 rounded-md">
            {/* Illustration */}
            <div className="md:w-20 w-16 md:h-20 h-16 bg-gray-200 dark:bg-dark-200 rounded-full flex items-center justify-center">
                <EmptyIcon className="md:w-12 w-8 md:h-12 h-8 dark:text-white text-primary" />
            </div>

            {/* Title */}
            <h2 className="md:text-xl text-lg font-semibold dark:text-white text-primary">
                No {name.toLowerCase()} available
            </h2>

            {/* Message */}
            <p className="md:text-sm text-xs text-primary dark:text-white">
                It looks like you haven’t created any {name.toLowerCase()} yet.
            </p>
        </div>
    );
};