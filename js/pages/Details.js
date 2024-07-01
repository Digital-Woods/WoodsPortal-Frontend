const { useState } = React;

const faqs = [
  {
    id: 1,
    header: "What is Lorem Ipsum?",
    text: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.`,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="black"
      >
        <path d="M80-560v-320h320v320H80Zm80-80h160v-160H160v160ZM80-80v-320h320v320H80Zm80-80h160v-160H160v160Zm400-400v-320h320v320H560Zm80-80h160v-160H640v160ZM560-80v-320h320v320H560Zm80-80h160v-160H640v160ZM320-640Zm0 320Zm320-320Zm0 320Z" />
      </svg>
    ),
  },
  {
    id: 2,
    header: "Where does it come from?",
    text: `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.`,
  },
  {
    id: 3,
    header: "Why do we use it?",
    text: `Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature,`,
  },
  {
    id: 4,
    header: "Where can I get some?",
    text: `There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.`,
  },
  {
    id: 5,
    header: "Where can I get some?",
    text: `There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.`,
  },
  {
    id: 6,
    header: "Where can I get some?",
    text: `There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.`,
  },
];

const Details = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const [active, setActive] = useState(null);

  const handleToggle = (index) => {
    if (active === index) {
      setActive(null);
    } else {
      setActive(index);
    }
  };

  const handleTabClick = (value) => {
    setActiveTab(value);
  };

  return (
    <div className="grid grid-cols-6 gap-4">
      <div className="col-span-4">
        <div className="border bg-gray-100 rounded-lg w-fit py-2 px-4 border-flatGray">
          <Tabs defaultValue="overview" className="rounded-md">
            <TabsList className="">
              <TabsTrigger
                value="overview"
                isActive={activeTab === "overview"}
                onClick={() => handleTabClick("overview")}
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="history"
                isActive={activeTab === "history"}
                onClick={() => handleTabClick("history")}
              >
                History
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview"></TabsContent>
            <TabsContent value="history"></TabsContent>
          </Tabs>
        </div>

        <div className="flex justify-between py-4 px-2 border border-2 rounded-md my-10">
          <div className="flex items-center gap-x-3">
            <div className="h-16 w-16 bg-green-200 rounded-full"></div>
            <div>
              <h1 className="text-4xl font-semibold">Goodwill Co.</h1>
              <p className="text-xs  text-secondary">Tokyo</p>
            </div>
          </div>
          <div className="flex items-center gap-x-2">
            <div className="p-2 bg-gray-100 h-10 w-10 rounded-full font-normal flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#000000"
              >
                <path d="M224.62-160q-27.62 0-46.12-18.5Q160-197 160-224.62v-510.76q0-27.62 18.5-46.12Q197-800 224.62-800h335.46l-40 40H224.62q-9.24 0-16.93 7.69-7.69 7.69-7.69 16.93v510.76q0 9.24 7.69 16.93 7.69 7.69 16.93 7.69h510.76q9.24 0 16.93-7.69 7.69-7.69 7.69-16.93v-299.53l40-40v339.53q0 27.62-18.5 46.12Q763-160 735.38-160H224.62ZM480-480Zm-80 80v-104.62l357.77-357.76q6.61-6.62 13.92-9.16t15.39-2.54q7.54 0 14.73 2.54t13.04 8.39L859.31-820q6.38 6.62 9.69 14.58 3.31 7.96 3.31 16.04 0 8.07-2.43 15.26-2.42 7.2-9.03 13.81L500.77-400H400Zm432.54-388.62-44.46-46.76 44.46 46.76ZM440-440h43.69l266.62-266.62-21.85-21.84-24.38-23.39L440-487.77V-440Zm288.46-288.46-24.38-23.39 24.38 23.39 21.85 21.84-21.85-21.84Z" />
              </svg>
            </div>
            <div className="p-2 bg-gray-100 h-10 w-10 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#000000"
              >
                <path d="M184.62-200q-27.62 0-46.12-18.5Q120-237 120-264.62v-430.76q0-27.62 18.5-46.12Q157-760 184.62-760h590.76q27.62 0 46.12 18.5Q840-723 840-695.38v430.76q0 27.62-18.5 46.12Q803-200 775.38-200H184.62ZM480-475.38 160-684.62v420q0 10.77 6.92 17.7 6.93 6.92 17.7 6.92h590.76q10.77 0 17.7-6.92 6.92-6.93 6.92-17.7v-420L480-475.38Zm0-44.62 307.69-200H172.31L480-520ZM160-684.62V-720v455.38q0 10.77 6.92 17.7 6.93 6.92 17.7 6.92H160v-444.62Z" />
              </svg>
            </div>
            <div className="p-2 bg-gray-100 h-10 w-10 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#000000"
              >
                <path d="M757.23-160q-101.15 0-207.38-50.65-106.23-50.66-197.39-142.2-91.15-91.53-141.81-197.38Q160-656.08 160-757.23q0-18.33 12-30.55Q184-800 202-800h98.92q16.31 0 28.46 10.27 12.16 10.27 16.47 26.35L365.69-668q2.77 16.77-1 29.31t-13.31 20.54l-87.76 81.84q24.61 44.69 54.42 83.04 29.81 38.35 63.58 72.65 34.84 34.85 75 64.81 40.15 29.96 88.15 56.58l85.54-87.08q9.77-10.54 21.96-13.88 12.19-3.35 26.96-1.35l84.15 17.23q16.31 4 26.47 16.43Q800-315.46 800-299.38V-202q0 18-12.22 30t-30.55 12ZM244.85-573.85l76.77-70.61q3.84-3.08 5-8.46 1.15-5.39-.39-10l-17.77-84.77q-1.54-6.16-5.38-9.23-3.85-3.08-10-3.08H211q-4.62 0-7.69 3.08-3.08 3.07-3.08 7.69 1.15 41 12.85 85.61 11.69 44.62 31.77 89.77Zm338 333.39q40.53 20.08 86.42 29.69 45.88 9.62 79.96 10.31 4.62 0 7.69-3.08 3.08-3.08 3.08-7.69v-80.31q0-6.15-3.08-10-3.07-3.84-9.23-5.38l-74-15.16q-4.61-1.54-8.07-.38-3.47 1.15-7.31 5l-75.46 77Zm-338-333.39Zm338 333.39Z" />
              </svg>
            </div>
            <div className="p-2 bg-gray-100 h-10 w-10 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#000000"
              >
                <path d="M224.62-120q-27.62 0-46.12-18.5Q160-157 160-184.62v-510.76q0-27.62 18.5-46.12Q197-760 224.62-760h70.76v-89.23h43.08V-760h286.16v-89.23h40V-760h70.76q27.62 0 46.12 18.5Q800-723 800-695.38v510.76q0 27.62-18.5 46.12Q763-120 735.38-120H224.62Zm0-40h510.76q9.24 0 16.93-7.69 7.69-7.69 7.69-16.93v-350.76H200v350.76q0 9.24 7.69 16.93 7.69 7.69 16.93 7.69ZM200-575.39h560v-119.99q0-9.24-7.69-16.93-7.69-7.69-16.93-7.69H224.62q-9.24 0-16.93 7.69-7.69 7.69-7.69 16.93v119.99Zm0 0V-720-575.39Zm280 181.54q-12.38 0-21.58-9.19-9.19-9.19-9.19-21.58 0-12.38 9.19-21.57 9.2-9.19 21.58-9.19 12.38 0 21.58 9.19 9.19 9.19 9.19 21.57 0 12.39-9.19 21.58-9.2 9.19-21.58 9.19Zm-160 0q-12.38 0-21.58-9.19-9.19-9.19-9.19-21.58 0-12.38 9.19-21.57 9.2-9.19 21.58-9.19 12.38 0 21.58 9.19 9.19 9.19 9.19 21.57 0 12.39-9.19 21.58-9.2 9.19-21.58 9.19Zm320 0q-12.38 0-21.58-9.19-9.19-9.19-9.19-21.58 0-12.38 9.19-21.57 9.2-9.19 21.58-9.19 12.38 0 21.58 9.19 9.19 9.19 9.19 21.57 0 12.39-9.19 21.58-9.2 9.19-21.58 9.19ZM480-240q-12.38 0-21.58-9.19-9.19-9.19-9.19-21.58 0-12.38 9.19-21.58 9.2-9.19 21.58-9.19 12.38 0 21.58 9.19 9.19 9.2 9.19 21.58 0 12.39-9.19 21.58Q492.38-240 480-240Zm-160 0q-12.38 0-21.58-9.19-9.19-9.19-9.19-21.58 0-12.38 9.19-21.58 9.2-9.19 21.58-9.19 12.38 0 21.58 9.19 9.19 9.2 9.19 21.58 0 12.39-9.19 21.58Q332.38-240 320-240Zm320 0q-12.38 0-21.58-9.19-9.19-9.19-9.19-21.58 0-12.38 9.19-21.58 9.2-9.19 21.58-9.19 12.38 0 21.58 9.19 9.19 9.2 9.19 21.58 0 12.39-9.19 21.58Q652.38-240 640-240Z" />
              </svg>
            </div>
            <div className="p-2 bg-gray-100 h-10 w-10 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#000000"
              >
                <path d="M258.46-440q-16.5 0-28.25-11.75T218.46-480q0-16.5 11.75-28.25T258.46-520q16.5 0 28.25 11.75T298.46-480q0 16.5-11.75 28.25T258.46-440ZM480-440q-16.5 0-28.25-11.75T440-480q0-16.5 11.75-28.25T480-520q16.5 0 28.25 11.75T520-480q0 16.5-11.75 28.25T480-440Zm221.54 0q-16.5 0-28.25-11.75T661.54-480q0-16.5 11.75-28.25T701.54-520q16.5 0 28.25 11.75T741.54-480q0 16.5-11.75 28.25T701.54-440Z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-2">
        <div>
          <Accordion>
            <AccordionSummary>Accordion One</AccordionSummary>
            <AccordionDetails>Accordion</AccordionDetails>
          </Accordion>
        </div>
      </div>
    </div>
  );
};
