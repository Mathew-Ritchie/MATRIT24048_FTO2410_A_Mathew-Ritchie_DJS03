import { books, authors, genres, BOOKS_PER_PAGE } from "./data.js";

const bookObject = books.map((book) => ({
  id: book.id,
  title: book.title,
  author: book.author,
  image: book.image,
  genre: book.genres,
  description: book.description,
  published: book.published,
}));

const AuthorObject = Object.entries(authors).map(([id, authorName]) => ({
  id,
  authorName,
}));

const genreObjects = Object.entries(genres).map(([id, genreName]) => ({
  id,
  genreName,
}));

let page = 1;
let matches = books;

/**
 * creates and appends the book previews to the target DOM element on the UI
 * @param {Array{author,id,image,title}} booksToShow
 * @param {HTMLElement} targetElement
 * @param {object} authorsArr
 */
function createAndAddBooksToUI(booksToShow, targetElement, authorsArr) {
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

createAndAddBooksToUI(
  matches.slice(0, BOOKS_PER_PAGE),
  document.querySelector("[data-list-items]"),
  authors
);
updateShowMoreButton();

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * Function to add author names and genres to the drop down select menus.
 * @param {object} data - In this case this selects either the authors or genres object imported from data.js
 * @param {HTMLElement} targetElement - The html element that is the drop down menu for the genre or author choice.
 * @param {'string'} allOptions - option for all of the genres or authors.
 */
function CreateListAuthorGenre(data, targetElement, allOptions) {
  const propertyHtml = document.createDocumentFragment();
  const firstOptionElement = document.createElement("option");
  firstOptionElement.value = "any";
  firstOptionElement.innerText = allOptions;
  propertyHtml.appendChild(firstOptionElement);

  for (const [id, name] of Object.entries(data)) {
    const element = document.createElement("option");
    element.value = id;
    element.innerText = name;
    propertyHtml.appendChild(element);
  }
  targetElement.appendChild(propertyHtml);
}

CreateListAuthorGenre(genres, document.querySelector("[data-search-genres]"), "All Genres");

CreateListAuthorGenre(authors, document.querySelector("[data-search-authors]"), "all Authors");

////////theme function//////////////////////////////////

/**
 * ApplyPreferredTheme is a function to check users preffered theme and adds it.
 */
function applyPreferredTheme() {
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
function manualThemeSelector(event) {
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

document.addEventListener("DOMContentLoaded", () => {
  applyPreferredTheme();
});

document.querySelector("[data-settings-form]").addEventListener("submit", manualThemeSelector);

//////////////////// SHOW MORE BOOKS FUNCTION///////////////////////////////
/**
 * updates the actual show more button text.
 */
function updateShowMoreButton() {
  document.querySelector("[data-list-button]").innerText = `Show more (${
    books.length - BOOKS_PER_PAGE
  })`;
  document.querySelector("[data-list-button]").disabled =
    matches.length - page * BOOKS_PER_PAGE <= 0;

  document.querySelector("[data-list-button]").innerHTML = `
    <span>Show more</span>
    <span class="list__remaining"> (${
      matches.length - page * BOOKS_PER_PAGE > 0 ? matches.length - page * BOOKS_PER_PAGE : 0
    })</span>
`;
}

////////////////////event listeners/////////////////////////////////////////////////////
document.querySelector("[data-search-cancel]").addEventListener("click", () => {
  document.querySelector("[data-search-overlay]").open = false;
});

document.querySelector("[data-settings-cancel]").addEventListener("click", () => {
  document.querySelector("[data-settings-overlay]").open = false;
});

document.querySelector("[data-header-search]").addEventListener("click", () => {
  document.querySelector("[data-search-overlay]").open = true;
  document.querySelector("[data-search-title]").focus();
});

document.querySelector("[data-header-settings]").addEventListener("click", () => {
  document.querySelector("[data-settings-overlay]").open = true;
});

document.querySelector("[data-list-close]").addEventListener("click", () => {
  document.querySelector("[data-list-active]").open = false;
});

/////////////////// search function////////////////////

document.querySelector("[data-search-form]").addEventListener("submit", (event) => {
  handleSearch(event);
});

/**
 * This function hadles the search functionality of the page based on author,Genre, and search input.
 * @param {Event} event - when the form is submited.
 */
function handleSearch(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const filters = Object.fromEntries(formData);
  const result = [];

  for (const book of books) {
    let genreMatch = filters.genre === "any";

    for (const singleGenre of book.genres) {
      if (genreMatch) break;
      if (singleGenre === filters.genre) {
        genreMatch = true;
      }
    }

    if (
      (filters.title.trim() === "" ||
        book.title.toLowerCase().includes(filters.title.toLowerCase())) &&
      (filters.author === "any" || book.author === filters.author) &&
      genreMatch
    ) {
      result.push(book);
    }
  }

  page = 1;
  matches = result;

  if (result.length < 1) {
    document.querySelector("[data-list-message]").classList.add("list__message_show");
  } else {
    document.querySelector("[data-list-message]").classList.remove("list__message_show");
  }

  document.querySelector("[data-list-items]").innerHTML = "";
  createAndAddBooksToUI(
    result.slice(0, BOOKS_PER_PAGE),
    document.querySelector("[data-list-items]"),
    authors
  );
  //
  document.querySelector("[data-list-button]").disabled =
    matches.length - page * BOOKS_PER_PAGE < 1;

  //   document.querySelector("[data-list-button]").innerHTML = `
  //         <span>Show more</span>
  //         <span class="list__remaining"> (${
  //           matches.length - page * BOOKS_PER_PAGE > 0 ? matches.length - page * BOOKS_PER_PAGE : 0
  //         })</span>
  //     `;

  updateShowMoreButton();
  window.scrollTo({ top: 0, behavior: "smooth" });
  document.querySelector("[data-search-overlay]").open = false;
}

////////Show more button//////////////////////////
document.querySelector("[data-list-button]").addEventListener("click", () => {
  handleShowMore();
});

/**
 * Function handles the event of displaying more books.
 */
function handleShowMore() {
  createAndAddBooksToUI(
    matches.slice(page * BOOKS_PER_PAGE, (page + 1) * BOOKS_PER_PAGE),
    document.querySelector("[data-list-items]"),
    authors
  );
  page += 1;
  updateShowMoreButton();
}

document.querySelector("[data-list-items]").addEventListener("click", (event) => {
  bookPreviewClick(event);
});

/**
 * Function handles the click event on the individual book items to display their preview.
 * @param {Event} event
 */
function bookPreviewClick(event) {
  const pathArray = Array.from(event.path || event.composedPath());
  let active = null;

  for (const node of pathArray) {
    if (active) break;

    if (node?.dataset?.preview) {
      let result = null;

      for (const singleBook of books) {
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
    document.querySelector("[data-list-subtitle]").innerText = `${
      authors[active.author]
    } (${new Date(active.published).getFullYear()})`;
    document.querySelector("[data-list-description]").innerText = active.description;
  }
}
