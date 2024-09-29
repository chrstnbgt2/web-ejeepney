window.onload = function () {
  const sidebar = document.querySelector(".sidebar");
  const closeBtn = document.querySelector("#btn");
  const searchBtn = document.querySelector(".bx-search");

  closeBtn.addEventListener("click", function () {
    sidebar.classList.toggle("open");
    menuBtnChange();
  });

  searchBtn.addEventListener("click", function () {
    sidebar.classList.toggle("open");
    menuBtnChange();
  });

  function menuBtnChange() {
    if (sidebar.classList.contains("open")) {
      closeBtn.classList.replace("bx-menu", "bx-menu-alt-right");
    } else {
      closeBtn.classList.replace("bx-menu-alt-right", "bx-menu");
    }
  }
};
const ctx = document.getElementById("myChart").getContext("2d");
const myChart = new Chart(ctx, {
  type: "bar", // Set the default type to bar
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        type: "line", // Define the line dataset
        data: [2.5, 4.5, 3.5, 6.5, 7.5, 8.5], // Slightly adjust data points to avoid touching bars
        borderColor: "#374e54",
        backgroundColor: "rgba(0, 0, 0, 0)",
        borderWidth: 2,
        tension: 0.4, 
        pointRadius: 5,
      },
      {
        data: [3, 5, 3, 7, 6, 9],
        backgroundColor: "#374e54",
        borderWidth: 1,
        barPercentage: 0.5, 
        categoryPercentage: 0.6,
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: false, 
      },
    },
  },
});

