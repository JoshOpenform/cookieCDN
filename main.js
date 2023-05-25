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

  constructor() {
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
              <button class='ofc-button ofc-close' data-item='js-close-button'>X</button>
          </div>
          `;

    const settings = `
        <div data-item='js-settings-content' class='ofc-settings-content'>
          <div class='ofc-settings-content-header'>
            <p>Privacy Preference Center</p>
            <button class='ofc-button ofc-close' data-item='js-settings-close-button'>X</button>
          </div>
          <div>
              <p>When you visit any website, it may store or retrieve information on your browser, mostly in the form of cookies. This information might be about you, your preferences or your device and is mostly used to make the site work as you expect it to. The information does not usually directly identify you, but it can give you a more personalized web experience. Because we respect your right to privacy, you can choose not to allow some types of cookies. Click on the different category headings to find out more and change our default settings. However, blocking some types of cookies may impact your experience of the site and the services we are able to offer.</p>
              <button class='ofc-button' data-item='js-accept-button'>Allow All</button>
          </div>
          <div class='ofc-settings'>
              <div class='ofc-accordion'>
                <div class="ofc-accordion-head" data-item="js-settings-accordion-head">
                    <p>Strictly Necessary Cookies</p>
                    <label class="ofc-toggle-switch">
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
                    <label class="ofc-toggle-switch">
                    <input type="checkbox">
                    <span class="ofc-toggle-slider"></span>
                  </label>
                </div>       
                <div class='ofc-accordion-body' style='display:none;'><p>Explainer about above cookies</p></div>
              </div>
              <div class='ofc-accordion'>
                <div class="ofc-accordion-head" data-item="js-settings-accordion-head">
                    <p>Marketing Cookies</p>
                    <label class="ofc-toggle-switch">
                    <input type="checkbox">
                    <span class="ofc-toggle-slider"></span>
                  </label>
                </div>       
                <div class='ofc-accordion-body' style='display:none;'><p>Explainer about above cookies</p></div>
              </div>
          </div>
          <div>
          <button class='ofc-button' data-item='js-reject-button'>Reject All</button>
          <button class='ofc-button' data-item='js-confirm-button'>Confirm My Choices</button>
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

    this.pendingCookies.forEach((cookie) => {
      let cookieName = cookie.split("=")[0].trim();

      let cookieEntry = data.find(
        (entry) => entry["Cookie / Data Key name"].trim() === cookieName
      );

      if (cookieEntry) {
        let category = cookieEntry["Category"];

        // If the category doesn't exist yet, create it
        if (!categorizedCookies[category]) {
          categorizedCookies[category] = [];
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

    return categorizedCookies;
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
    this.setCookie("_ga","test",7);
    this.setCookie("_ga_","test",7);
    this.setCookie("_gid","test",7);
    this.setCookie("_gat","test",7);
    this.setCookie("_dc_gtm_","test",7);
    this.setCookie("demdex","test",7);
    this.setCookie("dextp","test",7);
    this.setCookie("dst","test",7);
    this.setCookie("MSPAuth","test",7);
    this.setCookie("PPAuth","test",7);
    this.setCookie("MSNRPSAuth","test",7);
    this.pendingCookies = document.cookie.split(";");
    document.cookie = "";
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
    const banner = new Banner();
    banner.blockCookies();
    let categorizedCookies = banner.categorizeCookies(data);
    console.log(categorizedCookies);
  })
  .catch((error) => {
    console.error(error);
  });
