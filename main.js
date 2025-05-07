class Banner {
  // ... (Keep all properties as they are) ...
  bannerContainer;
  settingsMenu;
  settingsContent;
  settingsButton;
  settingsAccordions;
  rejectButtons; // Note: This was querySelector before, might need querySelectorAll if multiple
  acceptButtons;
  settingsCloseButton;
  closeButton;
  pendingCookies;
  confirmButton;
  csvData;
  cookieCrumb;
  categorizedCookies = {};
  acceptedCategories = [];

  constructor(data) {
    this.initialize();
    setTimeout(() => {
      // --- Query Selectors ---
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
      // **** CHANGE: Use querySelectorAll for rejectButtons for consistency ****
      //      If you truly only have one, querySelector is fine, but querySelectorAll
      //      works for one or more and requires iterating in createEventListeners.
      //      Let's assume there *could* be more than one reject button like accept.
      this.rejectButtons = document.querySelectorAll(
        // Changed to querySelectorAll
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
      this.cookieCrumb = document.querySelector(
        "[data-item='js-cookie-container']"
      );
      this.closeButton = document.querySelector(
        // Moved selector here for consistency
        "[data-item='js-close-button']"
      );
      // --- End Query Selectors ---

      this.csvData = data;
      this.pendingCookies = document.cookie.split(";");
      this.categorizeCookies(data);
      this.initializeAccordions();
      this.createEventListeners(); // Call after elements are selected

      // --- **** CHANGE: Revised initial state logic **** ---
      const consentState = this.checkCookie(); // Gets "", "yes", or "no"

      if (consentState === "yes") {
        // User previously accepted
        console.log("Consent state: yes - Hiding banner, showing crumb.");
        this.hideElement(this.bannerContainer);
        this.showElement(this.cookieCrumb);
        // Optional: Ensure cookies match prefs if needed on load
        // this.applyPreferences(); // You might need a function like this
      } else if (consentState === "no") {
        // User previously rejected
        console.log("Consent state: no - Hiding banner and crumb.");
        this.hideElement(this.bannerContainer);
        this.hideElement(this.cookieCrumb);
        // Ensure non-essential cookies are removed on load if user previously rejected
        this.blockNonEssentialCookies();
      } else {
        // No decision recorded (consentState is "" or null/undefined)
        console.log("Consent state: none - Showing banner.");
        this.hideElement(this.cookieCrumb); // Ensure crumb is hidden
        // Block non-essential cookies before showing the banner for the first time
        this.blockNonEssentialCookies();
        this.showElement(this.bannerContainer);
      }
      // --- **** END: Revised initial state logic **** ---
    }, 100); // Consider reducing delay or using DOMContentLoaded listener before initialization
  }

  // ... (initialize method remains the same) ...
  initialize() {
    const containerNode = document.createElement("div");
    const settingsNode = document.createElement("div");
    const cookieNode = document.createElement("div");

    // --- Read existing preference cookies to set initial toggle states ---
    // Strictly is always true/checked/disabled
    const isPerformance =
      this.getCookie("Performance") === "true" ? "checked" : "";
    const isMarketing = this.getCookie("Marketing") === "true" ? "checked" : "";
    const isFunctional =
      this.getCookie("Functional") === "true" ? "checked" : "";
    const isAnalytical =
      this.getCookie("Analytics") === "true" ? "checked" : "";
    // ---------------------------------------------------------------------

    containerNode.classList.add("ofc-banner-container");
    // Don't add 'visible' here, control visibility in constructor logic
    // containerNode.classList.add("visible");
    containerNode.setAttribute("data-item", "js-banner-container");
    containerNode.style.width = "calc(100% - 17px)";

    cookieNode.classList.add("ofc-cookie-container");
    cookieNode.setAttribute("data-item", "js-cookie-container");

    settingsNode.classList.add("ofc-settings-container");
    settingsNode.setAttribute("data-item", "js-settings-container");

    const cookieCrumb = `
          <div class='ofc-crumb-container'>
            <div class='ofc-crumb-image-wrapper'>
            <img src="https://raw.githubusercontent.com/JoshOpenform/cookieCDN/main/images/cookie_icon.svg" alt="Cookie Settings">
            </div>
          </div>`;

    const banner = `
          <div class='ofc-message-container'>
              <p>By clicking "Accept All Cookies", you agree to the storing of cookies on your device to enhance site navigation, analyse site usage, and assist in our marketing efforts.</p>
          </div>
          <div class='cookie-button-container'>
              <button data-item='js-settings-button' type='button' class='cookie-button'>Cookie Settings</button>
              <button data-item='js-reject-button' type='button' class='cookie-button'>Strictly Necessary</button> <!-- Banner Reject -->
              <button data-item='js-accept-button' data-all='1' type='button' class='cookie-button'>Accept All</button>
          </div>
          <div class='ofc-close-container'>
              <button class='cookie-button ofc-close' data-item='js-close-button' aria-label="Close Banner"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16"> <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/> </svg></button>
          </div>
          `;

    const settings = `
        <div data-item='js-settings-content' class='ofc-settings-content'>
        <img src="https://raw.githubusercontent.com/JoshOpenform/cookieCDN/main/images/cookieJar.jpg" class="cookieJar-logo" alt="Cookie Jar Logo"/>
          <div class='ofc-settings-content-header'>
            <p>Privacy Preference Centre</p>
            <button class='ofc-close ofc-popclose' data-item='js-settings-close-button' aria-label="Close Settings"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16"> <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/> </svg></button>
          </div>
          <div>
              <p class="ofc-privacytext">When you visit any website, it may store or retrieve information on your browser, mostly in the form of cookies. This information might be about you, your preferences or your device and is mostly used to make the site work as you expect it to. The information does not usually directly identify you, but it can give you a more personalised web experience. Because we respect your right to privacy, you can choose not to allow some types of cookies. Click on the different category headings to find out more and change our default settings. However, blocking some types of cookies may impact your experience of the site and the services we are able to offer.</p>
              <button class='ofc-popbutton' data-item='js-accept-button' data-all='3'>Allow All</button>
          </div>
          <div class='ofc-settings'>
              <div class='ofc-accordion'>
                <div class="ofc-accordion-head" data-item="js-settings-accordion-head">
                    <p>Strictly Necessary Cookies</p>
                    <label class="ofc-toggle-switch ofc-toggle-disabled" data-item="js-toggle-sNC">
                     <!-- **** CHANGE: Added checked and disabled **** -->
                    <input type="checkbox" checked disabled>
                    <span class="ofc-toggle-slider"></span>
                  </label>
                </div>
                <div class='ofc-accordion-body' style='display:none;'>
                    <p>These are essential cookies that are necessary for a website to function properly.
                    They enable basic functions such as page navigation, access to secure areas, and ensuring that the website operates correctly.
                    Strictly necessary cookies are typically set in response to user actions, such as logging in or filling out forms.
                    They do not require user consent as they are crucial for the website's operation.</p>
                    <p><strong>These cookies are always active.</strong></p> <!-- Optional: Add text indication -->
                </div>
              </div>
              <div class='ofc-accordion'>
                <div class="ofc-accordion-head" data-item="js-settings-accordion-head">
                    <p>Performance Cookies</p>
                    <label class="ofc-toggle-switch" data-item="js-toggle-pC">
                     <!-- Use state from preference cookies -->
                    <input type="checkbox" ${isPerformance}>
                    <span class="ofc-toggle-slider"></span>
                  </label>
                </div>
                <div class='ofc-accordion-body' style='display:none;'>
                  <p>Performance cookies collect anonymous information about how visitors use a website.
                  They are used to improve website performance and provide a better user experience.
                  These cookies gather data about the pages visited, the time spent on the website, and any error messages encountered.
                  The information collected is aggregated and anonymised, and it helps website owners understand and analyse website traffic patterns.</p>
                </div>
              </div>
              <div class='ofc-accordion'>
                <div class="ofc-accordion-head" data-item="js-settings-accordion-head">
                    <p>Marketing Cookies</p>
                    <label class="ofc-toggle-switch" data-item="js-toggle-mC">
                     <!-- Use state from preference cookies -->
                    <input type="checkbox" ${isMarketing}>
                    <span class="ofc-toggle-slider"></span>
                  </label>
                </div>
                <div class='ofc-accordion-body' style='display:none;'>
                  <p>Marketing cookies are used to track users across websites and build a profile of their interests.
                  These cookies are often set by advertising networks or third-party advertisers.
                  They are used to deliver targeted advertisements and measure the effectiveness of marketing campaigns.
                  Marketing cookies may collect data such as browsing habits, visited websites, and interaction with ads.
                  Consent from the user is usually required for the use of marketing cookies.</p>
                </div>
              </div>
              <div class='ofc-accordion'>
                <div class="ofc-accordion-head" data-item="js-settings-accordion-head">
                    <p>Functional Cookies</p>
                    <label class="ofc-toggle-switch" data-item="js-toggle-fC">
                     <!-- Use state from preference cookies -->
                    <input type="checkbox" ${isFunctional}>
                    <span class="ofc-toggle-slider"></span>
                  </label>
                </div>
                <div class='ofc-accordion-body' style='display:none;'>
                  <p>Functional cookies enable enhanced functionality and customisation on a website.
                  They remember user preferences, such as language settings and personalised preferences, to provide a more personalised experience.
                  These cookies may also be used to remember changes made by the user, such as font size or layout preferences.
                  Functional cookies do not track or store personal information and are usually set in response to user actions.</p>
                </div>
              </div>
              <div class='ofc-accordion'>
                <div class="ofc-accordion-head" data-item="js-settings-accordion-head">
                    <p>Analytic Cookies</p>
                    <label class="ofc-toggle-switch" data-item="js-toggle-aC">
                     <!-- Use state from preference cookies -->
                    <input type="checkbox" ${isAnalytical}>
                    <span class="ofc-toggle-slider"></span>
                  </label>
                </div>
                <div class='ofc-accordion-body' style='display:none;'>
                  <p>Analytic cookies are similar to performance cookies as they collect information about how users interact with a website. However,
                  unlike performance cookies, analytic cookies provide more detailed and comprehensive data.
                  They track and analyse user behaviour, such as click patterns, mouse movements, and scroll depth,
                  to gain insights into user engagement and website performance.
                  Analytic cookies help website owners make data-driven decisions to optimize their websites.</p>
                </div>
              </div>
          </div>
          <div>
          <button class='ofc-popbutton settings-reject-all' data-item='js-reject-button'>Strictly Necessary</button> <!-- Settings Reject -->
          <button class='ofc-popbutton' data-item='js-confirm-button' data-all='0'>Confirm My Choices</button>
          </div>
          </div>`;
    containerNode.innerHTML = banner;
    settingsNode.innerHTML = settings;
    cookieNode.innerHTML = cookieCrumb;

    document.body.appendChild(containerNode);
    document.body.appendChild(settingsNode);
    document.body.appendChild(cookieNode);
  }

  // ... (showElement, hideElement, categorizeCookies methods remain the same) ...
  showElement(element) {
    if (element) element.classList.add("visible");
  }

  hideElement(element) {
    if (element) element.classList.remove("visible");
  }

  categorizeCookies(data) {
    let categorized = {};
    const currentCookies = document.cookie.split(";"); // Use current cookies for categorization

    currentCookies.forEach((cookie) => {
      const cookieParts = cookie.split("=");
      const cookieName = cookieParts[0] ? cookieParts[0].trim() : null;

      if (!cookieName) return; // Skip if cookie name is empty

      const cookieEntry = data ? data[cookieName] : null; // Handle case where data might be null/undefined
      let category = "Other"; // Default category

      if (cookieEntry && cookieEntry["Category"]) {
        // Ensure category name doesn't have leading/trailing spaces
        const rawCategory = cookieEntry["Category"].trim();
        // Handle potential variations if needed, e.g., map "Strictly Necessary" to "Strictly"
        if (rawCategory === "Strictly Necessary") {
          category = "Strictly";
        } else {
          category = rawCategory;
        }
      }

      // Ensure category exists in the object
      if (!categorized[category]) {
        categorized[category] = [];
      }

      // Store the full cookie string (name=value)
      categorized[category].push(cookie.trim());
    });
    this.categorizedCookies = categorized; // Update the instance property
    // console.log("Categorized Cookies:", this.categorizedCookies); // For debugging
  }

  createEventListeners() {
    if (this.settingsButton) {
      this.settingsButton.addEventListener("click", () => {
        this.showElement(this.settingsMenu);
        this.updateToggleStatesFromPrefs(); // Ensure toggles reflect saved state when opening
      });
    }
    if (this.settingsCloseButton) {
      this.settingsCloseButton.addEventListener("click", () => {
        this.hideElement(this.settingsMenu);
      });
    }
    if (this.closeButton) {
      // Simple close implies rejection for this session only, no persistent cookie set
      this.closeButton.addEventListener("click", () => {
        this.hideElement(this.bannerContainer);
        // Maybe set a session cookie here if needed? For now, just hides.
      });
    }

    if (this.acceptButtons) {
      this.acceptButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
          const dataIndex = e.target.getAttribute("data-all");
          this.handleConsent(dataIndex); // dataIndex 1 = banner accept, 3 = settings allow all
        });
      });
    }

    // **** CHANGE: Iterate over rejectButtons NodeList ****
    if (this.rejectButtons) {
      this.rejectButtons.forEach((button) => {
        // Add iteration
        button.addEventListener("click", () => {
          this.handleRejection();
        });
      });
    }

    if (this.confirmButton) {
      this.confirmButton.addEventListener("click", () => {
        this.updatePreference(); // This handles saving custom choices
        this.hideElement(this.settingsMenu);
        this.showElement(this.cookieCrumb); // Show crumb after confirming
      });
    }

    if (this.cookieCrumb) {
      this.cookieCrumb.addEventListener("click", () => {
        this.showElement(this.settingsMenu);
        this.updateToggleStatesFromPrefs(); // Ensure toggles reflect saved state when opening
      });
    }
  }

  // ... (initializeAccordions, blockNonEssentialCookies, getCookie, setCookie methods remain the same) ...
  initializeAccordions() {
    if (!this.settingsAccordions) return;
    this.settingsAccordions.forEach(function (head) {
      // Check if the event listener is already attached (simple check)
      if (head.dataset.accordionInitialized) return;

      head.addEventListener("click", function () {
        let accordionBody = head.nextElementSibling;
        if (
          accordionBody &&
          accordionBody.classList.contains("ofc-accordion-body")
        ) {
          accordionBody.style.display =
            accordionBody.style.display === "none" ? "block" : "none";
        }
      });
      head.dataset.accordionInitialized = "true"; // Mark as initialized
    });
  }

  // Renamed from blockCookies to be more specific
  blockNonEssentialCookies() {
    const currentCookies = document.cookie.split(";");
    // Ensure categorization is done based on current cookies BEFORE blocking
    // It's important categorizeCookies maps "Strictly Necessary" etc. correctly to "Strictly"
    this.categorizeCookies(this.csvData);

    for (let i = 0; i < currentCookies.length; i++) {
      const cookie = currentCookies[i];
      const cookieName = cookie.split("=")[0]
        ? cookie.split("=")[0].trim()
        : null;

      if (!cookieName) continue; // Skip if no name

      // Check if the cookie is 'Strictly' necessary based on categorization
      // Ensure the key "Strictly" matches how categorizeCookies stores it
      const isStrictly = this.categorizedCookies["Strictly"]?.some(
        (strictCookie) => strictCookie.startsWith(cookieName + "=")
      );

      // Also preserve the consent cookie itself and preference cookies
      const isConsentCookie = cookieName === "ofcPer";
      const isPrefCookie = [
        "Strictly",
        "Performance",
        "Analytics",
        "Marketing",
        "Functional",
      ].includes(cookieName);

      if (!isStrictly && !isConsentCookie && !isPrefCookie) {
        // console.log(`Blocking non-essential cookie: ${cookieName}`);
        this.setCookie(cookieName, "", -1); // Delete cookie
      }
    }
    // Re-read pending cookies after blocking
    this.pendingCookies = document.cookie
      .split(";")
      .filter((c) => c.trim() !== "");
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
    return ""; // Return empty string if not found
  }

  setCookie(name, value, days) {
    let expires = "";
    if (days) {
      let date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    // Ensure SameSite attribute is set for security and browser compatibility
    // Use 'Lax' as a reasonable default. 'Strict' can break navigation. 'None' requires Secure.
    // Check if connection is secure before setting SameSite=None
    let sameSite = "; SameSite=Lax";
    // Simple check for localhost for testing purposes
    const isLocalhost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";

    if (window.location.protocol === "https:" || isLocalhost) {
      // Allow Secure on HTTPS or localhost
      if (days > 0) {
        // Only set Secure attribute on HTTPS/localhost and for non-deletion
        // If you need cross-site cookies (e.g., embedded content), use None+Secure.
        // For most standard website cookies, Lax is safer.
        // expires += "; Secure"; // Uncomment if Secure is strictly needed for Lax/Strict too
        // sameSite = "; SameSite=None; Secure"; // Use None only if Secure is possible AND required
      }
    }

    // Set the cookie with path, expires, and SameSite
    document.cookie =
      name + "=" + (value || "") + expires + "; path=/" + sameSite;
    // console.log(`Setting cookie: ${name}=${value}; expires=${expires}; path=/; ${sameSite}`); // Debugging
  }

  // ... (handleConsent method remains the same) ...
  handleConsent(dataIndex = 0) {
    // Consent implies 'yes'
    this.setCookie("ofcPer", "yes", 365); // Store consent for a year

    // Set individual preference cookies based on action
    // dataIndex 1 (banner accept) or 3 (settings allow all) means accept all
    const acceptAll = dataIndex === "1" || dataIndex === "3";
    this.setPrefCookie("all", acceptAll, true); // Use list=true to set all prefs

    // Restore ALL cookies that were potentially blocked before consent
    // This simplistic approach assumes 'pendingCookies' held the initially blocked ones.
    // A more robust way might involve re-categorizing and setting based on accepted categories.
    // For now, let's assume 'accept all' means restoring everything found initially.
    if (acceptAll) {
      // Re-categorize based on original data to potentially find all cookies
      this.categorizeCookies(this.csvData); // Ensure full categorization list is available
      for (const category in this.categorizedCookies) {
        // Skip re-setting the preference cookies themselves here
        if (
          [
            "Strictly",
            "Performance",
            "Analytics",
            "Marketing",
            "Functional",
          ].includes(category)
        ) {
          // Check if the category corresponds to a preference cookie name, maybe skip?
          // This depends on whether your categorizeCookies includes the pref cookies themselves
        }

        if (this.categorizedCookies.hasOwnProperty(category)) {
          this.categorizedCookies[category].forEach((cookieString) => {
            // Simple re-setting. Might need refinement based on actual cookie structure.
            const [name, value] = cookieString.split(/=(.*)/); // Split only on first '='
            // Avoid re-setting the main consent cookie or pref cookies here if they were in the list
            if (
              name &&
              name !== "ofcPer" &&
              ![
                "Strictly",
                "Performance",
                "Analytics",
                "Marketing",
                "Functional",
              ].includes(name)
            ) {
              this.setCookie(name, value || "", 365); // Set accepted cookies for a year
            }
          });
        }
      }
    }
    // If NOT acceptAll (which shouldn't happen via this specific handler, but for completeness):
    // Only Strictly Necessary would have been kept by blockNonEssentialCookies,
    // and setPrefCookie would have only set Strictly=true.

    if (dataIndex === "3") {
      // If "Allow All" was clicked within settings
      this.checkAllToggles(); // Visually check all toggles
    }

    this.hideElement(this.bannerContainer);
    this.hideElement(this.settingsMenu);
    this.showElement(this.cookieCrumb);
  }

  // ... (handleRejection method remains the same - it already sets ofcPer=no) ...
  handleRejection() {
    // Block non-essential cookies first
    this.blockNonEssentialCookies();

    // Set the main consent cookie to 'no'
    this.setCookie("ofcPer", "no", 365); // Remember rejection for a year

    // **** CHANGE: Set preference cookies: Strictly=true, others=false ****
    this.setPrefCookie("all", false, true); // Use list=true, agreed=false

    // Update visual toggles to reflect rejection (Strictly remains checked/disabled)
    this.updateToggleStatesFromPrefs();

    // Hide banner and settings, ensure crumb is hidden
    this.hideElement(this.bannerContainer);
    this.hideElement(this.settingsMenu);
    this.hideElement(this.cookieCrumb); // Don't show crumb on rejection
  }

  // **** CHANGE: checkCookie now returns the actual value ****
  checkCookie() {
    let consent = this.getCookie("ofcPer"); // Returns "", "yes", or "no"
    // console.log("checkCookie found ofcPer:", consent); // Debugging
    return consent; // Return the actual value or ""
  }

  // ... (checkAllToggles, setPrefCookie, updatePreference, blockNonEssentialCookiesBasedOnPrefs, updateToggleStatesFromPrefs methods remain the same) ...
  checkAllToggles() {
    const checklist = document.querySelectorAll(
      ".ofc-toggle-switch input[type='checkbox']"
    );
    checklist.forEach((item) => {
      if (!item.disabled) {
        // Only check non-disabled toggles
        item.checked = true;
      }
    });
  }

  setPrefCookie(cookieName, agreed, list = false) {
    const agreedStr = String(agreed); // Convert boolean to 'true'/'false' string

    if (!list) {
      // Setting a single preference cookie (used by updatePreference)
      if (cookieName === "Strictly") {
        this.setCookie("Strictly", "true", 365); // Always true, store for a year
      } else {
        this.setCookie(cookieName, agreedStr, 365); // Set based on 'agreed', store for a year
      }
      return;
    }

    // Setting multiple preference cookies (list is true, used by handleConsent/handleRejection)
    this.setCookie("Strictly", "true", 365); // Strictly is always true
    this.setCookie("Performance", agreedStr, 365);
    this.setCookie("Analytics", agreedStr, 365);
    this.setCookie("Marketing", agreedStr, 365);
    this.setCookie("Functional", agreedStr, 365);
  }

  updatePreference() {
    // Block cookies for categories that are NOT checked anymore
    this.blockNonEssentialCookiesBasedOnPrefs(true); // Pass true to signal it's from update

    // Set the main consent cookie to 'yes' since a choice was confirmed
    this.setCookie("ofcPer", "yes", 365);

    // Get references to the toggles (Strictly toggle is present but disabled)
    let pCToggle = document.querySelector("[data-item='js-toggle-pC'] input");
    let aCToggle = document.querySelector("[data-item='js-toggle-aC'] input");
    let mCToggle = document.querySelector("[data-item='js-toggle-mC'] input");
    let fCToggle = document.querySelector("[data-item='js-toggle-fC'] input");

    // Set individual preference cookies based on current toggle state
    this.setPrefCookie("Strictly", true); // Force Strictly to true
    this.setPrefCookie("Performance", pCToggle ? pCToggle.checked : false);
    this.setPrefCookie("Analytics", aCToggle ? aCToggle.checked : false);
    this.setPrefCookie("Marketing", mCToggle ? mCToggle.checked : false);
    this.setPrefCookie("Functional", fCToggle ? fCToggle.checked : false);

    // Add/Keep cookies for the categories that are now accepted (Strictly + checked ones)
    // We re-apply them to ensure they are present if they were somehow removed,
    // and potentially to refresh their expiry? (Though setCookie uses 365 days anyway)
    let acceptedCookieList = [];
    this.categorizeCookies(this.csvData); // Re-categorize to get full list based on CSV

    if (this.categorizedCookies["Strictly"]) {
      acceptedCookieList.push(...this.categorizedCookies["Strictly"]);
    }
    if (pCToggle?.checked && this.categorizedCookies["Performance"]) {
      acceptedCookieList.push(...this.categorizedCookies["Performance"]);
    }
    if (aCToggle?.checked && this.categorizedCookies["Analytics"]) {
      acceptedCookieList.push(...this.categorizedCookies["Analytics"]);
    }
    if (mCToggle?.checked && this.categorizedCookies["Marketing"]) {
      acceptedCookieList.push(...this.categorizedCookies["Marketing"]);
    }
    if (fCToggle?.checked && this.categorizedCookies["Functional"]) {
      acceptedCookieList.push(...this.categorizedCookies["Functional"]);
    }
    // Handle 'Other' category - link it to 'Functional' consent for example
    if (fCToggle?.checked && this.categorizedCookies["Other"]) {
      acceptedCookieList.push(...this.categorizedCookies["Other"]);
    }

    // Re-set the approved cookies (ensures they exist with the correct expiry)
    acceptedCookieList.forEach((cookieString) => {
      const [name, value] = cookieString.split(/=(.*)/); // Split only on first '='
      // Avoid re-setting consent/pref cookies here
      if (
        name &&
        name !== "ofcPer" &&
        ![
          "Strictly",
          "Performance",
          "Analytics",
          "Marketing",
          "Functional",
        ].includes(name)
      ) {
        this.setCookie(name, value || "", 365);
      }
    });

    // Hide UI elements
    this.hideElement(this.settingsMenu);
    this.hideElement(this.bannerContainer); // Ensure banner is hidden too
    this.showElement(this.cookieCrumb); // Show the crumb indicating consent is managed
  }

  // Helper to block cookies based on current preferences
  // Pass fromUpdate = true when called from updatePreference to read current toggle state
  // Otherwise (on load after rejection), it reads saved cookie prefs.
  blockNonEssentialCookiesBasedOnPrefs(fromUpdate = false) {
    const currentCookies = document.cookie.split(";");
    this.categorizeCookies(this.csvData); // Ensure categorization is up-to-date

    let prefs;
    if (fromUpdate) {
      // Read current state of toggles if called during update/confirm
      let pCToggle = document.querySelector("[data-item='js-toggle-pC'] input");
      let aCToggle = document.querySelector("[data-item='js-toggle-aC'] input");
      let mCToggle = document.querySelector("[data-item='js-toggle-mC'] input");
      let fCToggle = document.querySelector("[data-item='js-toggle-fC'] input");
      prefs = {
        Strictly: true,
        Performance: pCToggle ? pCToggle.checked : false,
        Analytics: aCToggle ? aCToggle.checked : false,
        Marketing: mCToggle ? mCToggle.checked : false,
        Functional: fCToggle ? fCToggle.checked : false,
        Other: fCToggle ? fCToggle.checked : false, // Example: Link 'Other' to 'Functional' consent
      };
    } else {
      // Read saved preference cookies if called on load (e.g., after rejection)
      prefs = {
        Strictly: true, // Always true
        Performance: this.getCookie("Performance") === "true",
        Analytics: this.getCookie("Analytics") === "true",
        Marketing: this.getCookie("Marketing") === "true",
        Functional: this.getCookie("Functional") === "true",
        Other: this.getCookie("Functional") === "true", // Example: Link 'Other' to 'Functional' consent
      };
    }

    currentCookies.forEach((cookie) => {
      const cookieName = cookie.split("=")[0]
        ? cookie.split("=")[0].trim()
        : null;
      // Skip empty names, the consent cookie, and the preference cookies themselves
      if (
        !cookieName ||
        cookieName === "ofcPer" ||
        [
          "Strictly",
          "Performance",
          "Analytics",
          "Marketing",
          "Functional",
        ].includes(cookieName)
      ) {
        return;
      }

      // Find the category of the current cookie
      let cookieCategory = null;
      for (const category in this.categorizedCookies) {
        if (
          this.categorizedCookies[category]?.some((c) =>
            c.startsWith(cookieName + "=")
          )
        ) {
          cookieCategory = category;
          break;
        }
      }
      cookieCategory = cookieCategory || "Other"; // Default if not found in specific lists

      // If the preference for this category is explicitly false, delete the cookie
      if (prefs.hasOwnProperty(cookieCategory) && !prefs[cookieCategory]) {
        // console.log(
        //   `Blocking cookie ${cookieName} based on preference for category ${cookieCategory}`
        // );
        this.setCookie(cookieName, "", -1);
      }
    });
    // Re-read pending cookies after blocking
    this.pendingCookies = document.cookie
      .split(";")
      .filter((c) => c.trim() !== "");
  }

  updateToggleStatesFromPrefs() {
    const setToggle = (dataItem, prefCookieName) => {
      const toggleInput = document.querySelector(
        `[data-item='${dataItem}'] input[type='checkbox']`
      );
      if (toggleInput && !toggleInput.disabled) {
        // Check if exists and not disabled
        toggleInput.checked = this.getCookie(prefCookieName) === "true";
      }
      // Ensure Strictly Necessary is always visually checked (it's already disabled)
      const strictToggleInput = document.querySelector(
        "[data-item='js-toggle-sNC'] input[type='checkbox']"
      );
      if (strictToggleInput) strictToggleInput.checked = true;
    };

    setToggle("js-toggle-pC", "Performance");
    setToggle("js-toggle-aC", "Analytics");
    setToggle("js-toggle-mC", "Marketing");
    setToggle("js-toggle-fC", "Functional");
  }
} // End of Banner Class

// --- Global Functions (remain the same) ---
function readCSVFile(fileUrl) {
  return fetch(fileUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `HTTP error! status: ${response.status} while fetching ${fileUrl}`
        );
      }
      return response.text();
    })
    .then((csvData) => parseCSV(csvData))
    .catch((error) => {
      console.error("Error fetching or parsing CSV:", error);
      return {}; // Return empty object on error to avoid breaking the Banner constructor
    });
}

function parseCSV(csvData) {
  let parsedData = {};
  if (!csvData) return parsedData; // Handle empty/null CSV data

  // Split rows, handle potential '\r\n' and '\n' line endings
  let rows = csvData.trim().split(/\r?\n/);
  if (rows.length < 2) return parsedData; // No data rows

  // Extract headers, trim whitespace, handle potential BOM
  let headers = rows
    .shift()
    .split(";")
    .map((h) => h.trim().replace(/^\uFEFF/, "")); // Remove BOM if present
  const nameHeader = "Cookie / Data Key name"; // Exact header name for the key

  // Find the index of the key header
  const keyIndex = headers.indexOf(nameHeader);
  if (keyIndex === -1) {
    console.error(`CSV Parse Error: Header "${nameHeader}" not found.`);
    return parsedData; // Cannot proceed without the key column
  }

  rows.forEach((row) => {
    if (!row.trim()) return; // Skip empty rows
    let rowData = row.split(";");
    let cookieObj = {};
    let keyName = null;

    headers.forEach((header, index) => {
      const value = rowData[index] ? rowData[index].trim() : ""; // Handle missing data points
      cookieObj[header] = value;
      if (index === keyIndex) {
        keyName = value; // Get the cookie name from the correct column
      }
    });

    // Use cookie name as key for parsedData, only if a valid key was found
    if (keyName) {
      parsedData[keyName] = cookieObj;
    } else {
      // console.warn("CSV Parse Warning: Row skipped, missing key name:", row);
    }
  });

  return parsedData;
}

// --- Initialization (remains the same) ---
document.addEventListener("DOMContentLoaded", () => {
  readCSVFile(
    "https://raw.githubusercontent.com/JoshOpenform/cookieCDN/main/open-cookie-database.csv"
  )
    .then((data) => {
      if (Object.keys(data).length > 0) {
        // Only initialize if data was loaded
        window.ofcBanner = new Banner(data); // Assign to window for potential debugging access
      } else {
        console.error(
          "Cookie banner initialization failed: No data loaded from CSV."
        );
      }
    })
    .catch((error) => {
      // Error handling is now primarily inside readCSVFile, but catch potential promise rejections here too
      console.error("Error initializing cookie banner:", error);
    });
});
