const ActivityFeed = () => {
  const activities = [
    {
      date: 'December 15, 2021',
      day: 'Wednesday',
      entries: [
        { time: '3:14pm', text: 'Johnson Smith completed the task', task: 'App Testing', color: 'bg-green-100 text-green-700' },
        { time: '1:54pm', text: 'Johnson Smith added a new task', task: 'App Testing', color: 'bg-blue-100 text-blue-700' },
      ],
    },
    {
      date: 'December 14, 2021',
      day: 'Tuesday',
      entries: [
        { time: '4:09pm', text: 'Johnson Smith has changed Responsiveness end date to', task: 'December 18, 2024', color: 'bg-yellow-100 text-yellow-700' },
        { time: '1:54pm', text: 'Johnson Smith added a new task', task: 'Server Testing', color: 'bg-blue-100 text-blue-700' },
      ],
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-4 w-full max-w-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Activity</h2>
        <button className="text-sm text-blue-500 hover:underline">View More</button>
      </div>
      {activities.map((activity, index) => (
        <div key={index} className="mb-4">
          <h3 className="text-sm font-semibold text-gray-500">
            {activity.date} <span className="font-normal">{activity.day}</span>
          </h3>
          <ul className="mt-2 space-y-2">
            {activity.entries.map((entry, idx) => (
              <li key={idx} className={`p-3 rounded-lg ${entry.color}`}>
                <p className="text-xs text-gray-500">{entry.time}</p>
                <p className="text-sm font-medium">
                  <span className="text-black">{entry.text}</span> <span className="font-semibold">{entry.task}</span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

