import { authors } from "../data.js";

/**
 * creates and appends the book previews to the target DOM element on the UI
 * @param {Array{author,id,image,title}} booksToShow
 * @param {HTMLElement} targetElement
 * @param {object} authorsArr
 */
export function createAndAddBooksToUI(booksToShow, targetElement, authorsArr) {
  const starting = document.createDocumentFragment();
  for (const { author, id, image, title } of booksToShow) {
    const element = document.createElement("button");
    element.classList = "preview";
    element.setAttribute("data-preview", id);

    element.innerHTML = `
              <img
                  class="preview__image"
                  src="${image}"
              />
              
              <div class="preview__info">
                  <h3 class="preview__title">${title}</h3>
                  <div class="preview__author">${authorsArr[author]}</div>
              </div>
          `;
    starting.appendChild(element);
  }
  targetElement.appendChild(starting);
}

/**
 * Function to add author names and genres to the drop down select menus.
 * @param {object} data - In this case this selects either the authors or genres object imported from data.js
 * @param {HTMLElement} targetElement - The html element that is the drop down menu for the genre or author choice.
 * @param {'string'} allOptions - option for all of the genres or authors.
 */
export function CreateListAuthorGenre(data, targetElement, allOptions) {
  const propertyHtml = document.createDocumentFragment();
  const firstOptionElement = document.createElement("option");
  firstOptionElement.value = "any";
  firstOptionElement.innerText = allOptions;
  propertyHtml.appendChild(firstOptionElement);

  for (const item of data) {
    const element = document.createElement("option");
    element.value = item.id;
    element.innerText = item.authorName || item.genreName;
    propertyHtml.appendChild(element);
  }
  targetElement.appendChild(propertyHtml);
}

/**
 * updates the actual show more button text number.
 *
 * @param {number} booksPerPage - number of items to display per page
 * @param {number} matchesLength - total number that match filtered
 * @param {number} page - current page
 */
export function updateShowMoreButton(matchesLength, page, booksPerPage) {
  document.querySelector("[data-list-button]").disabled = matchesLength - page * booksPerPage <= 0;

  document.querySelector("[data-list-button]").innerHTML = `
      <span>Show more</span>
      <span class="list__remaining"> (${
        matchesLength - page * booksPerPage > 0 ? matchesLength - page * booksPerPage : 0
      })</span>
  `;
}
