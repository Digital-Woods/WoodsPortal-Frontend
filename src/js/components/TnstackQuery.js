const TnstackQuery = () => {
  const { error, data, isLoading } = useQuery({
    queryKey: ["userData"],
    queryFn: async () =>  await Client.products.all({}, null, 1),
  });

  return (
    <div className="text-dark dark:text-light">
      {isLoading ? (
        <ul>
          {Array(20).fill(null).map((_, index) => (
            <li
              key={index}
              className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"
            ></li>
          ))}
        </ul>
      ) : (
        <div>
          <ul>
            {data.data.map((product) => (
              <li key={product.id}>{product.name}</li>
              
            ))}
          </ul>
          <div className="bg-primary text-light-DEFAULT p-4">
      <h1 className="text-secondary">Hello World</h1>
      <p className="text-flatGray">
        This is an example component using the configured Tailwind CSS colors.
      </p>
    
    </div>
    
        </div>
      )}
    </div>
  );
};
