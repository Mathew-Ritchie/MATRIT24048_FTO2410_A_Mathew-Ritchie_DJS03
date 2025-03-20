import { bookObject, authorObject } from "../scripts.js";

/**
 * Function handles the click event on the individual book items to display their preview.
 * @param {Event} event
 */
export function bookPreviewClick(event) {
  const pathArray = Array.from(event.path || event.composedPath());
  let active = null;

  for (const node of pathArray) {
    if (active) break;

    if (node?.dataset?.preview) {
      let result = null;

      for (const singleBook of bookObject) {
        if (result) break;
        if (singleBook.id === node?.dataset?.preview) result = singleBook;
      }

      active = result;
    }
  }

  if (active) {
    document.querySelector("[data-list-active]").open = true;
    document.querySelector("[data-list-blur]").src = active.image;
    document.querySelector("[data-list-image]").src = active.image;
    document.querySelector("[data-list-title]").innerText = active.title;
    let authorName = authorObject.find((author) => author.id === active.author).authorName;
    document.querySelector("[data-list-subtitle]").innerText = `${authorName} (${new Date(
      active.published
    ).getFullYear()})`;
    document.querySelector("[data-list-description]").innerText = active.description;
  }
}
