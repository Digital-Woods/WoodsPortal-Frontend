const gridDataState = Recoil.atom({
  key: "gridDataState",
  default: [],
});

function useTable() {
  const [data, setData] = Recoil.useRecoilState(gridDataState);

  // const dataCLoseDate = (type, row) => {
  //   if (type === "deals") {
  //     return row?.closedate ? formatDate(row?.closedate) : "";
  //   }
  //   return row?.closed_date ? formatDate(row.closed_date) : "";
  // };

  const setGridData = async (type, deals) => {
    if (type === "reset") return setData([]);
    if (type === "directly") return setData(deals);
    
    let finalData = deals.map((deal) => {
      const cards = deal?.data?.results?.rows?.map((row) => ({
        // dealName: type === "deals" ? row?.dealname : row?.subject,
        // hsObjectId: row?.hs_object_id,
        id: row?.hs_object_id,
        // title: type === "deals" ? row?.dealname : row?.subject,
        // closedate: dataCLoseDate(type, row),
        // amount: type === "deals" ? row?.amount : "",
        ...row,
        hubspotObjectTypeId: type === "deals" ? "0-3" : "0-5",
      })) || [];
      
      return {
        id: deal.id,
        name: deal.label,
        count: deal?.data?.total,
        ...deal,
        cards: cards,
      };
    });

    setData(finalData);
  };

  return {
    gridData: data,
    setGridData,
  };
}

// const gridDataState = Recoil.atom({
//   key: "gridDataState",
//   default: [],
// });

// function useTable() {
//   const [data, setData] = Recoil.useRecoilState(gridDataState);

//   const dataCLoseDate = (type, row) => {
//     if (type === "deals") {
//       return row?.closedate ? formatDate(row?.closedate) : "";
//     }
//     return row?.closed_date ? formatDate(row.closed_date) : "";
//   };

//   const setGridData = async (type, deals) => {
//     if (type === "reset") return setData([]);
//     if (type === "directly") return setData(deals);
//     let finalData = await deals.map((deal) => {
//       const cards = deal?.data?.results?.rows
//         ? [
//             ...deal?.data?.results?.rows?.map((row) => ({
//               dealName: type === "deals" ? row?.dealname : row?.subject,
//               hsObjectId: row?.hs_object_id,
//               id: row?.hs_object_id,
//               title: type === "deals" ? row?.dealname : row?.subject,
//               closedate: dataCLoseDate(type, row),
//               amount: type === "deals" ? row?.amount : "",
//               hubspotObjectTypeId: type === "deals" ? "0-3" : "0-5",
//             })),
//           ]
//         : [];
//       const mapData = {
//         id: deal.id,
//         name: deal.label,
//         count: deal?.data?.total,
//         ...deal,
//         cards: cards,
//       };
//       return mapData;
//     });
//     console.log("finalData", finalData);

//     setData((prevData) => {
//       if (prevData.length) {
//         return prevData.map((stage) => {
//           const matchingDeals = finalData.find((deal) => deal.id === stage.id);
//           console.log("stage", stage);
//           console.log("matchingDeals", matchingDeals);

//           if (matchingDeals) {
//             return {
//               ...matchingDeals,
//               cards: [...stage.cards, ...matchingDeals.cards],
//             };
//           } else {
//             // console.log('noo', {
//             //   ...stage,
//             //   cards: [],
//             // })
//             return {
//               ...stage,
//               cards: [],
//             };
//           }
//         });
//       } else {
//         return finalData;
//       }
//     });
//   };

//   return {
//     gridData: data,
//     setGridData,
//   };
// }
