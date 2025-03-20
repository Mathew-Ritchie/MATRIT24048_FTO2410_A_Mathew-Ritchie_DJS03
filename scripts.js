import { books, authors, genres, BOOKS_PER_PAGE } from "./data.js";
import { applyPreferredTheme, manualThemeSelector } from "./modules/theme.js";
import { handleSearch } from "./modules/search.js";
import {
  createAndAddBooksToUI,
  CreateListAuthorGenre,
  updateShowMoreButton,
} from "./modules/utilities.js";
import { bookPreviewClick } from "./modules/book-preview.js";

// creating a new book data array to work from rather than the raw data in data.js
export const bookObject = books.map((book) => ({
  id: book.id,
  title: book.title,
  author: book.author,
  image: book.image,
  genre: book.genres,
  description: book.description,
  published: book.published,
}));

// creating a new author data array to work from rather than the raw data in data.js
export const authorObject = Object.entries(authors).map(([id, authorName]) => ({
  id,
  authorName,
}));

// creating a new genre data array to work from rather than the raw data in data.js
export const genreObject = Object.entries(genres).map(([id, genreName]) => ({
  id,
  genreName,
}));

let page = 1;
let matches = bookObject;

//initial UI setup
function initiate() {
  createAndAddBooksToUI(
    matches.slice(0, BOOKS_PER_PAGE),
    document.querySelector("[data-list-items]"),
    authors
  );
  updateShowMoreButton(matches.length, page, BOOKS_PER_PAGE);

  //Populate dropdown menus for genre and authors
  CreateListAuthorGenre(genreObject, document.querySelector("[data-search-genres]"), "All Genres");
  CreateListAuthorGenre(
    authorObject,
    document.querySelector("[data-search-authors]"),
    "all Authors"
  );

  ////////////////////event listeners/////////////////////////////////////////////////////
  document.querySelector("[data-search-cancel]").addEventListener("click", () => {
    document.querySelector("[data-search-overlay]").open = false;
  });

  document.querySelector("[data-header-search]").addEventListener("click", () => {
    document.querySelector("[data-search-overlay]").open = true;
    document.querySelector("[data-search-title]").focus();
  });

  document.querySelector("[data-list-close]").addEventListener("click", () => {
    document.querySelector("[data-list-active]").open = false;
  });

  document.querySelector("[data-list-button]").addEventListener("click", () => {
    handleShowMore();
  });

  document.querySelector("[data-settings-form]").addEventListener("submit", manualThemeSelector);

  document.addEventListener("DOMContentLoaded", () => {
    applyPreferredTheme();
  });

  document.querySelector("[data-list-items]").addEventListener("click", bookPreviewClick);

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
    updateShowMoreButton(matches.length, page, BOOKS_PER_PAGE);
  }
}

initiate();
