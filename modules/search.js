import { books, authors, BOOKS_PER_PAGE } from "../data.js";
import { createAndAddBooksToUI, updateShowMoreButton } from "./utilities.js";

const bookObject = books.map((book) => ({
  id: book.id,
  title: book.title,
  author: book.author,
  image: book.image,
  genre: book.genres,
  description: book.description,
  published: book.published,
}));

let page = 1;
let matches = bookObject;

/**
 * This function hadles the search functionality of the page based on author,Genre, and search input.
 * @param {Event} event - when the form is submited.
 */
export function handleSearch(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const filters = Object.fromEntries(formData);
  const result = [];

  for (const book of bookObject) {
    let genreMatch = filters.genre === "any";

    for (const singleGenre of book.genre) {
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

  updateShowMoreButton();
  window.scrollTo({ top: 0, behavior: "smooth" });
  document.querySelector("[data-search-overlay]").open = false;
}

document.querySelector("[data-search-form]").addEventListener("submit", handleSearch);
