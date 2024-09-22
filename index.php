<!DOCTYPE html>
<html lang="en">
  <head>
    <title>E-Jeepney</title>
    <!-- Link Styles -->
    <link rel="stylesheet" href="./css/style.css" />
    <link
      href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
      rel="stylesheet"
    />
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  </head>
  <body>
    <div class="sidebar">
      <div class="logo_details" style="margin-top: 20px">
        <img src="./img/logo.png" alt="" class="jeepney-logo" />
        <div class="logo_name">E-JeepPay</div>
        <i class="bx bx-menu" id="btn"></i>
      </div>
      <ul class="nav-list" style="margin-top: 40px">
        <li>
          <a href="./index.html">
            <i class="bx bx-grid-alt"></i>
            <span class="link_name">Dashboard</span>
          </a>
          <span class="tooltip">Dashboard</span>
        </li>
        <li>
          <a href="./jeepneys.html">
            <i class="bx bx-car"></i>
            <span class="link_name">Jeepneys</span>
          </a>
          <span class="tooltip">Jeepneys</span>
        </li>
        <li>
          <a href="./drivers.html" style="height: 34px;">
            <img
              src="./img/driver.png"
              style="width: 21px; height: 21px; margin-left: 14.5px"
            />
            <span class="link_name">Driver</span>
          </a>
          <span class="tooltip">Driver</span>
        </li>
        <li>
          <a href="./user.html">
            <i class="bx bx-user"></i>
            <span class="link_name">User</span>
          </a>
          <span class="tooltip">User</span>
        </li>
        <li>
          <a href="./fare.html">
            <i class="bx bx-dollar"></i>
            <span class="link_name">Fare</span>
          </a>
          <span class="tooltip">Fare</span>
        </li>
        <li>
          <a href="./setting.html" id="settings-link">
            <i class="bx bx-cog"></i>
            <span class="link_name">Settings</span>
          </a>
          <span class="tooltip">Settings</span>
        </li>
      </ul>
    </div>
    <section class="home-section">
      <section class="layout">
        <div class="header">
          <div class="container">
            <input type="text" class="search-input" />
            <div class="topbar-user">
              <h5
                style="
                  margin-top: 0.9%;
                  font-size: 18px;
                  color: white;
                  font-family: Rubik, system-ui;
                "
              >
                Welcome Username!
              </h5>
            </div>
            <div class="top-icons">
              <button style="width: 40px; height: 40px; margin-right: 10px">
                <a href="./login.php">
                  <img
                    src="./img/account.png"
                    style="height: 100%; width: 100%"
                  />
                </a>
              </button>
              <button style="width: 40px; height: 40px">
                <img src="./img/bell.png" style="height: 100%; width: 100%" />
              </button>
            </div>
          </div>
        </div>
        <div class="body">
          <section class="main">
            <div class="main-content">
              <div class="graph">
                <h5
                  style="
                    padding-left: 25px;
                    font-size: 15px;
                    font-family: Rubik, system-ui;
                    font-weight: bold;
                  "
                >
                  Daily Passengers
                </h5>
                <canvas
                  id="myChart"
                  width="700vw"
                  height="190"
                  style="padding-left: 25px"
                ></canvas>
              </div>

              <div class="added">
                <h5
                  style="
                    margin-top: 10px;
                    font-family: Rubik, system-ui;
                    font-size: 15px;
                  "
                >
                  Recently Added
                </h5>
                <div class="item1"></div>
                <div class="item2"></div>
                <div class="item3"></div>
                <div class="item4"></div>
              </div>
            </div>
            <div class="info-data">
              <div class="data-container">
                <div class="jeep">
                  <div class="column-data">
                    <div class="semi-container">
                      <h3
                        style="
                          font-family: Rubik, system-ui;
                          font-size: 28px;
                          color: #f4f4f4;
                          margin-left: 5px;
                        "
                      >
                        Jeepneys
                      </h3>
                      <img
                        src="./img/jeepney.png"
                        style="width: 65px; height: 65px"
                      />
                    </div>
                    <h3
                      style="
                        font-family: Rubik, system-ui;
                        font-size: 33px;
                        color: #f4f4f4;
                        padding-left: 148px;
                        text-decoration: underline;
                      "
                    >
                      43
                    </h3>
                  </div>
                </div>
                <div class="driver">
                  <div class="column-data">
                    <div class="semi-container" style="gap: 38px">
                      <h3
                        style="
                          font-family: Rubik, system-ui;
                          font-size: 28px;
                          color: #f4f4f4;
                          margin-left: 5px;
                        "
                      >
                        Drivers
                      </h3>
                      <img
                        src="./img/driver.png"
                        style="width: 65px; height: 55px"
                      />
                    </div>
                    <h3
                      style="
                        font-family: Rubik, system-ui;
                        font-size: 33px;
                        color: #f4f4f4;
                        padding-left: 142px;
                        text-decoration: underline;
                        padding-top: 10px;
                      "
                    >
                      29
                    </h3>
                  </div>
                </div>
                <div class="conduc">
                  <div class="column-data" style="margin-top: 10px">
                    <div class="semi-container">
                      <h3
                        style="
                          font-family: Rubik, system-ui;
                          font-size: 28px;
                          color: #f4f4f4;
                          margin-left: 5px;
                        "
                      >
                        Conductors
                      </h3>
                      <img
                        src="./img/conductor.png"
                        style="width: 60px; height: 48px"
                      />
                    </div>
                    <h3
                      style="
                        font-family: Rubik, system-ui;
                        font-size: 33px;
                        color: #f4f4f4;
                        padding-left: 180px;
                        text-decoration: underline;
                        padding-top: 7px;
                      "
                    >
                      11
                    </h3>
                  </div>
                </div>
                <div class="users">
                  <div class="column-data" style="margin-top: 10px">
                    <div class="semi-container" style="gap: 63px">
                      <h3
                        style="
                          font-family: Rubik, system-ui;
                          font-size: 28px;
                          color: #f4f4f4;
                          margin-left: 5px;
                        "
                      >
                        Users
                      </h3>
                      <img
                        src="./img/user.png"
                        style="width: 40px; height: 40px"
                      />
                    </div>
                    <h3
                      style="
                        font-family: Rubik, system-ui;
                        font-size: 33px;
                        color: #f4f4f4;
                        padding-left: 150px;
                        text-decoration: underline;
                        padding-top: 13px;
                      "
                    >
                      67
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </section>
    <!-- Scripts -->
    <script src="./script.js"></script>
  </body>
</html>
