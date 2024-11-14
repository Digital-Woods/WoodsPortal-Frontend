  // document.addEventListener("DOMContentLoaded", () => {
  //   const videoData = [
  //     {
  //       title: "Juice WRLD - Hate Me (without ellie goulding)",
  //       channel: "digitalwoods",
  //       videoUrl: "https://www.youtube.com/embed/osF8nAH1Sz4?si=UcHheuZL1psUaA1_",
  //       thumbnail: "https://i.ytimg.com/vi/_OiBoTRY8FI/maxresdefault.jpg",
  //     },
  //       {
  //       title: "Juice WRLD - Hate Me (without ellie goulding)",
  //       channel: "digitalwoods",
  //       videoUrl: "https://www.youtube.com/embed/osF8nAH1Sz4?si=UcHheuZL1psUaA1_",
  //       thumbnail: "https://i.ytimg.com/vi/_OiBoTRY8FI/maxresdefault.jpg",
  //     },
     
  //   ];

  //   // Set the iframe source to the first video by default
  //   const iframe = document.getElementById("display-frame");
  //   iframe.src = videoData[0].videoUrl;

  //   const vListContainer = document.getElementById("vli-videos");

  //   videoData.forEach((video, index) => {
  //     const videoCard = document.createElement("div");
  //     videoCard.className =
  //       "video-card flex items-center mb-4 bg-[#fff] cursor-pointer border border-gray-300 rounded-lg p-2 hover:bg-gray-100";

  //     // Add active class to the first video card
  //     if (index === 0) {
  //       videoCard.classList.add("bg-gray-100");
  //     }

  //     videoCard.onclick = () => {
  //       // Update iframe source
  //       iframe.src = video.videoUrl;

  //       // Remove active class from all video cards
  //       const videoCards = document.querySelectorAll(".video-card");
  //       videoCards.forEach((card) => card.classList.remove("bg-gray-100"));

  //       // Add active class to the clicked video card
  //       videoCard.classList.add("bg-gray-100");
  //     };

  //     videoCard.innerHTML = `
  //     <img src="${video.thumbnail}" alt="${video.title}" class="w-20 h-20 object-cover rounded-lg mr-2">
  //     <div class="flex-1">
  //       <h3 class="font-bold">${video.title}</h3>
  //       <p class="text-gray-600">${video.channel}</p>
  //     </div>
  //   `;

  //     vListContainer.appendChild(videoCard);
  //   });
  // });