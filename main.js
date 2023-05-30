class Banner {
  bannerContainer;
  settingsMenu;
  settingsContent;
  settingsButton;
  settingsAccordions;
  rejectButtons;
  acceptButtons;
  settingsCloseButton;
  closeButton;
  pendingCookies;
  confirmButton;
  csvData;

  sNC;
  pC;
  fC;
  mC
  aC;

  categorizedCookies;
  acceptedCategories;

  constructor(data) {
    this.sNC = false;
    this.pC = false;
    this.tC = false;
    this.fC = false;
    this.mC = false;
    this.aC = false;

    this.csvData = data;
    this.blockCookies();
    this.categorizeCookies(data);
    this.initialize();
    this.bannerContainer = document.querySelector(
      "[data-item='js-banner-container']"
    );
    this.settingsMenu = document.querySelector(
      "[data-item='js-settings-container']"
    );
    this.settingsContent = document.querySelector(
      "[data-item='js-settings-content']"
    );
    this.settingsButton = document.querySelector(
      "[data-item='js-settings-button']"
    );
    this.rejectButtons = document.querySelectorAll(
      "[data-item='js-reject-button']"
    );
    this.acceptButtons = document.querySelectorAll(
      "[data-item='js-accept-button']"
    );
    this.settingsCloseButton = document.querySelector(
      "[data-item='js-settings-close-button']"
    );
    this.settingsAccordions = document.querySelectorAll(
      "[data-item='js-settings-accordion-head']"
    );
    this.confirmButton = document.querySelector(
      "[data-item='js-confirm-button']"
    );
    this.initializeAccordions();
    this.closeButton = document.querySelector("[data-item='js-close-button']");
    this.createEventListeners();
    this.hideElement(this.bannerContainer);
    this.checkCookie();
  }

  initialize() {
    const containerNode = document.createElement("div");
    const settingsNode = document.createElement("div");

    containerNode.classList.add("ofc-banner-container");
    containerNode.classList.add("visible");
    containerNode.setAttribute("data-item", "js-banner-container");

    settingsNode.classList.add("ofc-settings-container");
    settingsNode.setAttribute("data-item", "js-settings-container");

    const banner = `
    <div class='ofc-message-container'>
        <p>By clicking "Accept All Cookies", you agree to the storing of cookies on your device to enhance site navigation, analyze site usage, and assist in our marketing efforts.</p>
    </div>
    <div class='ofc-button-container'>
        <button data-item='js-settings-button' type='button' class='ofc-button'>Cookie Settings</button>
        <button data-item='js-reject-button' type='button' class='ofc-button'>Reject All</button>
        <button data-item='js-accept-button' type='button' class='ofc-button'>Accept All</button>
    </div>
    <div class='ofc-close-container'>
        <button class='ofc-button ofc-close' data-item='js-close-button'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16"> <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/> </svg></button>
    </div>
    `;

    const settings = `
  <div data-item='js-settings-content' class='ofc-settings-content'>
  <img src="images/cookieJar.jpg" class="cookieJar-logo" />
    <div class='ofc-settings-content-header'>
      <p>Privacy Preference Center</p>
      <button class='ofc-close ofc-popclose' data-item='js-settings-close-button'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16"> <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/> </svg></button>
    </div>
    <div>
        <p class="ofc-privacytext">When you visit any website, it may store or retrieve information on your browser, mostly in the form of cookies. This information might be about you, your preferences or your device and is mostly used to make the site work as you expect it to. The information does not usually directly identify you, but it can give you a more personalized web experience. Because we respect your right to privacy, you can choose not to allow some types of cookies. Click on the different category headings to find out more and change our default settings. However, blocking some types of cookies may impact your experience of the site and the services we are able to offer.</p>
        <button class='ofc-popbutton' data-item='js-accept-button'>Allow All</button>
    </div>
    <div class='ofc-settings'>
        <div class='ofc-accordion'>
          <div class="ofc-accordion-head" data-item="js-settings-accordion-head">
              <p>Strictly Necessary Cookies</p>
              <label class="ofc-toggle-switch" data-item="js-toggle-sNC">
              <input type="checkbox">
              <span class="ofc-toggle-slider"></span>
            </label>
          </div>            
          <div class='ofc-accordion-body' style='display:none;'>
              <p>Explainer about above cookies</p>
          </div>
        </div>
        <div class='ofc-accordion'>
          <div class="ofc-accordion-head" data-item="js-settings-accordion-head">
              <p>Performance Cookies</p>
              <label class="ofc-toggle-switch" data-item="js-toggle-pC">
              <input type="checkbox">
              <span class="ofc-toggle-slider"></span>
            </label>
          </div>       
          <div class='ofc-accordion-body' style='display:none;'><p>Explainer about above cookies</p></div>
        </div>
        <div class='ofc-accordion'>
          <div class="ofc-accordion-head" data-item="js-settings-accordion-head">
              <p>Marketing Cookies</p>
              <label class="ofc-toggle-switch" data-item="js-toggle-mC">
              <input type="checkbox">
              <span class="ofc-toggle-slider"></span>
            </label>
          </div>       
          <div class='ofc-accordion-body' style='display:none;'><p>Explainer about above cookies</p></div>
        </div>
        <div class='ofc-accordion'>
          <div class="ofc-accordion-head" data-item="js-settings-accordion-head">
              <p>Functional Cookies</p>
              <label class="ofc-toggle-switch" data-item="js-toggle-fC">
              <input type="checkbox">
              <span class="ofc-toggle-slider"></span>
            </label>
          </div>       
          <div class='ofc-accordion-body' style='display:none;'><p>Explainer about above cookies</p></div>
        </div>
        <div class='ofc-accordion'>
          <div class="ofc-accordion-head" data-item="js-settings-accordion-head">
              <p>Analytic Cookies</p>
              <label class="ofc-toggle-switch" data-item="js-toggle-aC">
              <input type="checkbox">
              <span class="ofc-toggle-slider"></span>
            </label>
          </div>       
          <div class='ofc-accordion-body' style='display:none;'><p>Explainer about above cookies</p></div>
        </div>
    </div>
    <div>
    <button class='ofc-popbutton' data-item='js-reject-button'>Reject All</button>
    <button class='ofc-popbutton' data-item='js-confirm-button'>Confirm My Choices</button>
    </div>
    </div>`;
    containerNode.innerHTML = banner;
    settingsNode.innerHTML = settings;
    document.body.appendChild(containerNode);
    document.body.appendChild(settingsNode);
  }

  showElement(element) {
    element.classList.add("visible");
  }

  hideElement(element) {
    element.classList.remove("visible");
  }

  categorizeCookies(data) {
    let categorizedCookies = {};
    try {
      this.pendingCookies.forEach((cookie) => {
        let cookieName = cookie.split("=")[0].trim();

        let cookieEntry = data.find(
          (entry) =>
            entry["Cookie / Data Key name"] &&
            entry["Cookie / Data Key name"].trim() === cookieName
        );

        if (cookieEntry) {
          let category = cookieEntry["Category"];

          // If the category doesn't exist yet, create it
          if (!categorizedCookies[category]) {
            categorizedCookies[category] = [];
           // this.acceptedCategories.push(category);
          }

          categorizedCookies[category].push(cookie);
        } else {
          // If "Other" category doesn't exist yet, create it
          if (!categorizedCookies["Other"]) {
            categorizedCookies["Other"] = [];
          }

          categorizedCookies["Other"].push(cookie);
        }
      });
      this.categorizeCookies = categorizedCookies;
    console.log(this.categorizeCookies);
    } catch (e) {}
    
  }

  createEventListeners() {
    this.settingsButton.addEventListener("click", () => {
      this.showElement(this.settingsMenu);
    });
    this.settingsCloseButton.addEventListener("click", () => {
      this.hideElement(this.settingsMenu);
    });
    this.closeButton.addEventListener("click", () => {
      this.hideElement(this.bannerContainer);
    });
    for (let i = 0; i < this.acceptButtons.length; i++) {
      this.acceptButtons[i].addEventListener("click", () => {
        this.handleConsent();
      });
    }
    for (let i = 0; i < this.rejectButtons.length; i++) {
      this.rejectButtons[i].addEventListener("click", () => {
        this.handleRejection();
      });
    }
    this.confirmButton.addEventListener("click", () => {
      this.updatePreference();
      this.hideElement(this.bannerContainer);
      this.hideElement(this.settingsMenu);
    });
  }

  initializeAccordions() {
    this.settingsAccordions.forEach(function (head) {
      head.addEventListener("click", function () {
        let accordionBody = head.nextElementSibling;
        accordionBody.style.display =
          accordionBody.style.display === "none" ? "block" : "none";
      });
    });
  }

  blockCookies() {
        this.setCookie("_ga", "test", 7);
    this.setCookie("_ga_", "test", 7);
    this.setCookie("_gid", "test", 7);
    this.setCookie("_gat", "test", 7);
    this.setCookie("_dc_gtm_", "test", 7);
    this.setCookie("demdex", "test", 7);
    this.setCookie("dextp", "test", 7);
    this.setCookie("dst", "test", 7);
    this.setCookie("MSPAuth", "test", 7);
    this.setCookie("PPAuth", "test", 7);
    this.setCookie("MSNRPSAuth", "test", 7);
    this.pendingCookies = document.cookie.split(";");
    try {
      for (let i = 0; i < this.pendingCookies.length; i++) {
        let cookieName = this.pendingCookies[i].split("=")[0]; // get name of cookie
        document.cookie =
          cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      }
    } catch (e) {}
  }

  getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  setCookie(name, value, days) {
    let expires = "";

    if (days) {
      let date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }

    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  }

  handleConsent() {
    for (let i = 0; i < this.pendingCookies.length; i++) {
      document.cookie = this.pendingCookies[i];
    }
    this.pendingCookies = [];
    this.setCookie("ofcPer", "yes", 7);
    this.hideElement(this.bannerContainer);
    this.hideElement(this.settingsMenu);
  }

  handleRejection() {
    this.setCookie("ofcPer", "no", 7);
    this.pendingCookies = [];
    this.hideElement(this.bannerContainer);
    this.hideElement(this.settingsMenu);
  }

  checkCookie() {
    let consent = this.getCookie("ofcPer");
    if (consent === "") {
      this.showElement(this.bannerContainer);
    }
  }

  updatePreference() {
    this.blockCookies();
    let approvedCookies = [];
    let cookieList = [];
    let sNCToggle = document.querySelector("[data-item='js-toggle-sNC'] input");
    let pCToggle = document.querySelector("[data-item='js-toggle-pC'] input");
    let aCToggle = document.querySelector("[data-item='js-toggle-aC'] input");
    let mCToggle = document.querySelector("[data-item='js-toggle-mC'] input");
    let fCToggle = document.querySelector("[data-item='js-toggle-fC'] input");

    sNCToggle.checked ? approvedCookies.push("Strictly") : "";
    pCToggle.checked ? approvedCookies.push("Performance") : "";
    aCToggle.checked ? approvedCookies.push("Analytics") : "";
    mCToggle.checked ? approvedCookies.push("Marketing") : "";
    fCToggle.checked ? approvedCookies.push("Functional") : "";

    if (sNCToggle.checked && this.categorizeCookies["Strictly"]) {
      cookieList.push(...this.categorizeCookies["Strictly"]);
    }
    if (pCToggle.checked && this.categorizeCookies["Performance"]) {
      cookieList.push(...this.categorizeCookies["Performance"]);
    }
    if (aCToggle.checked && this.categorizeCookies["Analytics"]) {
      cookieList.push(...this.categorizeCookies["Analytics"]);
    }
    if (mCToggle.checked && this.categorizeCookies["Marketing"]) {
      cookieList.push(...this.categorizeCookies["Marketing"]);
    }
    if (fCToggle.checked && this.categorizeCookies["Functional"]) {
      cookieList.push(...this.categorizeCookies["Functional"]);
    }
  
    // Add the approved cookies to document.cookie
    cookieList.forEach(cookie => {
      document.cookie = cookie;
    });
  }
}

function readCSVFile(fileUrl) {
  return fetch(fileUrl)
    .then((response) => response.text())
    .then((csvData) => parseCSV(csvData));
}

function parseCSV(csvData) {
  // Split the CSV data into rows
  var rows = csvData.split("\n");

  // Stitch rows above and below an empty row (including random empty rows)
  var stitchedRows = [];
  for (var i = 0; i < rows.length; i++) {
    if (rows[i].trim() !== "") {
      stitchedRows.push(rows[i].trim());
    } else if (i > 0 && i < rows.length - 1) {
      // Check if the empty row is not the first or last row
      var mergedRow = stitchedRows.pop() + rows[i + 1].trim();
      stitchedRows.push(mergedRow);
      i++; // Skip the next row as it has been merged
    }
  }

  // Remove empty rows
  stitchedRows = stitchedRows.filter((row) => row.trim() !== "");

  // Extract headers from the first row
  var headers = stitchedRows[0].split(",");

  // Parse the remaining rows
  var parsedData = stitchedRows.slice(1).map((row) => {
    var rowData = row.split(",");
    var entry = {};
    headers.forEach((header, index) => {
      entry[header] = rowData[index];
    });
    return entry;
  });

  return parsedData;
}

readCSVFile(
  "https://raw.githubusercontent.com/jkwakman/Open-Cookie-Database/master/open-cookie-database.csv"
)
  .then((data) => {
    const banner = new Banner(data);
  })
  .catch((error) => {
    console.error(error);
  });
