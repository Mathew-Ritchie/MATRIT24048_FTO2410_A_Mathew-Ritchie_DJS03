/**
 * ApplyPreferredTheme is a function to check users preffered theme and adds it.
 */
export function applyPreferredTheme() {
  if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    document.querySelector("[data-settings-theme]").value = "night";
    document.documentElement.style.setProperty("--color-dark", "255, 255, 255");
    document.documentElement.style.setProperty("--color-light", "10, 10, 20");
  } else {
    document.querySelector("[data-settings-theme]").value = "day";
    document.documentElement.style.setProperty("--color-dark", "10, 10, 20");
    document.documentElement.style.setProperty("--color-light", "255, 255, 255");
  }
}

/**
 * This function handles the manual theme selection
 * @param {Event} event - form submission event
 */
export function manualThemeSelector(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const { theme } = Object.fromEntries(formData);

  if (theme === "night") {
    document.documentElement.style.setProperty("--color-dark", "255, 255, 255");
    document.documentElement.style.setProperty("--color-light", "10, 10, 20");
  } else {
    document.documentElement.style.setProperty("--color-dark", "10, 10, 20");
    document.documentElement.style.setProperty("--color-light", "255, 255, 255");
  }
  document.querySelector("[data-settings-overlay]").open = false;
}

document.querySelector("[data-settings-form]").addEventListener("submit", manualThemeSelector);

document.addEventListener("DOMContentLoaded", applyPreferredTheme);

document.querySelector("[data-header-settings]").addEventListener("click", () => {
  document.querySelector("[data-settings-overlay]").open = true;
});

document.querySelector("[data-settings-cancel]").addEventListener("click", () => {
  document.querySelector("[data-settings-overlay]").open = false;
});
