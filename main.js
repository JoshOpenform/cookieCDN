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

  localCookies;
  cookieCategories;
  categorizedCookies;

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
              <button data-item='js-settings-button' type='button' class='ofc-button' style='display: none;'>Cookie Settings</button>
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
                </div>            
                <div class='ofc-accordion-body' style='display:none;'>
                    <p>Explainer about above cookies</p>
                </div>
              </div>
              <div class='ofc-accordion'>
                <div class="ofc-accordion-head" data-item="js-settings-accordion-head">
                    <p>Performance Cookies</p>
                </div>       
                <div class='ofc-accordion-body' style='display:none;'><p>Explainer about above cookies</p></div>
              </div>
              <div class='ofc-accordion'>
                <div class="ofc-accordion-head" data-item="js-settings-accordion-head">
                    <p>Marketing Cookies</p>
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
    this.rejectButton.addEventListener("click", () => {
      this.handleRejection();
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
    this.categorizedCookies = this.categorizeSiteCookies(
      this.pendingCookies,
      this.cookieCategories
    );
    document.cookie = "";
    Object.defineProperty(document, "cookie", {
      get: function () {},
      set: function () {},
    });
  }

  categorizeData(dataArray) {
    // Create an object to hold arrays for each category
    let categorizedArrays = {};

    // Iterate through the dataArray
    for (let item of dataArray) {
      // If this category doesn't exist yet, create an empty array for it
      if (!categorizedArrays[item.Category]) {
        categorizedArrays[item.Category] = [];
      }
      // Push the item into its category's array
      categorizedArrays[item.Category].push(item);
    }

    // Return the object containing the categorized arrays
    return categorizedArrays;
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

  setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  handleConsent() {
    this.setCookie("consent", "true", 7);
    for (let i = 0; i < this.pendingCookies.length; i++) {
      document.cookie = this.pendingCookies[i];
    }
    this.pendingCookies = [];
    this.hideElement(this.bannerContainer);
  }

  handleRejection() {
    this.setCookie("consent", "false", 7);
    this.pendingCookies = [];
    this.hideElement(this.bannerContainer);
  }

  checkCookie() {
    let consent = this.getCookie("consent");
    if (consent === "") {
      this.showElement(this.bannerContainer);
    }
  }

  categorizeSiteCookies(siteCookies, categorizedArrays) {
    // This object will hold the categorized site cookies
    let categorizedSiteCookies = {};

    // Iterate through the site cookies
    for (let cookie of siteCookies) {
      // Check if the cookie's 'Data Key name' exists in each category
      for (let category in categorizedArrays) {
        // Find the matching cookie in this category
        let matchingCookie = categorizedArrays[category].find(
          (item) =>
            item["Cookie / Data Key name"] === cookie["Cookie / Data Key name"]
        );

        // If a matching cookie was found, add this cookie to the categorized site cookies
        if (matchingCookie) {
          // If this category doesn't exist yet in the categorized site cookies, create it
          if (!categorizedSiteCookies[category]) {
            categorizedSiteCookies[category] = [];
          }

          // Add the cookie to its category
          categorizedSiteCookies[category].push(cookie);

          // No need to check the other categories
          break;
        }
      }
    }

    return categorizedSiteCookies;
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
    banner.cookieCategories = banner.categorizeData(data);
  document.cookie = "test=hello";
  })
  .catch((error) => {
    console.error(error);
  });
