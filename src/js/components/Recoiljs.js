const Recoiljs = () => {
  const { yourName, setYourName } = useName();
  const onChange = (event) => {
    setYourName(event.target.value);
  };

  return (
    <div className="text-dark dark:text-light">
      <input type="text" value={yourName} onChange={onChange} className="border-2 border-blue-500 px-2 rounded"/>
      <br />
      Echo: {yourName}
    </div>
  );
};


