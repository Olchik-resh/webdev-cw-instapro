import { goToPage, logout, user } from "../index.js";
import { ADD_POSTS_PAGE, AUTH_PAGE, POSTS_PAGE } from "../routes.js";

export function renderHeaderComponent({ element, user, goToPage }) {
  const html = `
    <div class="page-header">
      <h1 class="logo" data-go-to="${
        user ? POSTS_PAGE : AUTH_PAGE
      }">Instapro</h1>
      ${
        user
          ? `
        <button class="header-button add-post-sign" data-go-to="${ADD_POSTS_PAGE}"></button>
        <button class="header-button logout-button">Выйти</button>
      `
          : `
        <button class="header-button" data-go-to="${AUTH_PAGE}">Войти</button>
      `
      }
      </div>`;
  element.innerHTML = html;

  element.querySelector(".logo").addEventListener("click", () => {
    goToPage(POSTS_PAG);
  });

  element.querySelectorAll("[data-go-to]").forEach((el) => {
    el.addEventListener("click", () => goToPage(el.dataset.goTo));
  });

  const logoutButton = element.querySelector(".logout-button");
  if (logoutButton) {
    logoutButton.addEventListener("click", logout);
  }
}
