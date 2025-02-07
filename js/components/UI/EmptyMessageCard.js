const EmptyMessageCard = ({ name = 'item', type = 'row', className = 'p-6' }) => {
    const [RandomComponent, setRandomComponent] = useState(<EmptyDeal width="150" height="130"  key="deal" />,);

    useEffect(() => {
        const components = [
            <EmptyDeal className="dark:text-white w-[150px]" key="deal" />,
            <EmptyIcon key="icon" className="dark:text-white w-[150px]" />,
            <EmptyThree className="dark:text-white w-[150px]" key='three' />
        ];
        setRandomComponent(components[Math.floor(Math.random() * components.length)]);
    }, []);

    return (
        <div className={`mt-4 w-fit max-w-[600px] mx-auto min-h-48 flex ${type === 'row' ? 'max-sm:flex-col' : 'flex-col'} items-center justify-center h-auto text-center md:gap-8 gap-4 dark:bg-dark-300 rounded-md ${className} `}>
            {/* Illustration */}
            <div className="md:min-w-[150px] flex items-center justify-center">
                {RandomComponent}
            </div>
            <div className="flex flex-col gap-2">
                {/* Title */}
                <h2 className={`md:text-xl ${type === 'row' ? 'text-start max-sm:text-center' : 'text-center'} text-lg font-semibold dark:text-white capitalize`}>
                    {name} not found
                </h2>

                {/* Message */}
                <p className={`md:text-xs ${type === 'row' ? 'text-start max-sm:text-center' : 'text-center'} text-xs dark:text-white font-thin`}>
                    It looks like you haven’t created any {name.toLowerCase()} yet. Please create one to proceed. <br /> If you need assistance with setting up or understanding {name.toLowerCase()}, refer to our documentation or contact support.
                </p>
            </div>
        </div>
    );
};