class Banner {
  bannerContainer;
  settingsMenu;
  settingsContent;
  settingsButton;
  settingsAccordions;
  rejectButton;
  acceptButton;
  settingsCloseButton;
  closeButton;
  pendingCookies;

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
    this.rejectButton = document.querySelector(
      "[data-item='js-reject-button']"
    );
    this.acceptButton = document.querySelector(
      "[data-item='js-accept-button']"
    );
    this.settingsCloseButton = document.querySelector(
      "[data-item='js-settings-close-button']"
    );
    this.settingsAccordions = document.querySelectorAll(
      "[data-item='js-settings-accordion-head']"
    );
    this.initializeAccordions();
    this.closeButton = document.querySelector("[data-item='js-close-button']");
    this.blockCookies();
    this.createEventListeners();
    this.hideElement(this.bannerContainer);
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
              <p>This is the Message container</p>
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
              <button class='ofc-button'>Allow All</button>
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
    this.acceptButton.addEventListener("click", () => {
      this.handleConsent();
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
    this.pendingCookies = document.cookie.split(";");
    document.cookie = "";
    Object.defineProperty(document, "cookie", {
      get: function () {},
      set: function () {},
    });
  }

  setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  handleConsent() {
    this.setCookie("consent", "true", 7);
    for (var i = 0; i < this.pendingCookies.length; i++) {
      document.cookie = this.pendingCookies[i];
    }
    this.pendingCookies = [];
  }

  checkCookie() {
    let consent = getCookie("consent");
    if (consent != "") {
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
    console.log(data);

    const banner = new Banner();
  })
  .catch((error) => {
    console.error(error);
  });
