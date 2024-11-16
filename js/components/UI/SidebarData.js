
const SidebarData = () => {
  
  const members = [
    { name: 'Johnson Smith', email: 'jsmith.live@gmail.com', imageUrl: 'https://via.placeholder.com/40' },
    { name: 'Jason Wayne', email: 'red.wayne@gmail.com', imageUrl: 'https://via.placeholder.com/40' },
    { name: 'Chester Bennington', email: 'lp.bennington@gmail.com', imageUrl: 'https://via.placeholder.com/40' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-4 w-80">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Members <span className="text-blue-500">23</span></h2>
        <Button variant='outline' size='sm'>+ Invite</Button>
      </div>
      <ul className="space-y-4">
        {members.map((member, index) => (
          <li key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src={member.imageUrl} alt={member.name} className="w-10 h-10 rounded-full" />
              <div>
                <p className="text-sm font-medium">{member.name}</p>
                <p className="text-sm text-gray-500">{member.email}</p>
              </div>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex items-center justify-between space-x-2">
        <div className="flex -space-x-2 overflow-hidden">
          <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://via.placeholder.com/32" alt="" />
          <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://via.placeholder.com/32" alt="" />
          <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://via.placeholder.com/32" alt="" />
        </div>
        <span className="text-sm text-gray-500">13 more</span>
        <Button variant='outline' size='sm'>View More</Button>
      </div>
    </div>
  );
};
