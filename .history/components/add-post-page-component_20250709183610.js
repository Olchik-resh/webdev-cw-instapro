import { renderHeaderComponent } from "./header-component.js";
import { renderUploadImageComponent } from "./upload-image-component.js";
import { goToPage, user } from "../index.js";

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  const render = () => {
    const appHtml = `
      <div class="page-container">
        <div class="header-container"></div>
        <div class="form form--add-post">
          <h3 class="form-title">Добавить пост</h3>
          <div class="form-inputs">
            <div class="upload-image-container"></div>
             <div class="form-field">
              <textarea id="description-input" class="textarea" placeholder="Введите описание поста"></textarea>
            </div>
            <div class="form-error"></div>
            <button class="button" id="add-button">Добавить</button>
          </div>
        </div>
      </div>`;

    appEl.innerHTML = appHtml;

    renderHeaderComponent({
      element: document.querySelector(".header-container"),
      user,
      goToPage,
    });

    const uploadImageContainer = appEl.querySelector(".upload-image-container");
    let imageUrl = "";

    renderUploadImageComponent({
      element: uploadImageContainer,
      onImageUrlChange: (newImageUrl) => {
        imageUrl = newImageUrl;
      },
    });

    const addButton = document.getElementById("add-button");
    const errorEl = document.querySelector(".form-error");

    const setError = (message) => {
      errorEl.textContent = message;
    };

  //   addButton.addEventListener("click", () => {
  //     const description = document
  //       .getElementById("description-input")
  //       .value.trim();
  //     setError("");
  //     if (!description) {
  //       setError("Введите описание поста");
  //       return;
  //     }
  //     if (!imageUrl) {
  //       setError("Выберите изображение");
  //       return;
  //     }
  //     addButton.disabled = true;
  //     onAddPostClick({ description, imageUrl }).finally(() => {
  //       addButton.disabled = false;
  //     });
  //   });
  // };

  addButton.addEventListener("click", async () => {
  const description = document
    .getElementById("description-input")
    .value.trim();
  setError("");
  if (!description) {
    setError("Введите описание поста");
    return;
  }
  if (!imageUrl) {
    setError("Выберите изображение");
    return;
  }
  addButton.disabled = true;
  try {
    await onAddPostClick({ description, imageUrl });
  } catch (error) {
    // Обработка ошибки
  } finally {
    addButton.disabled = false;
  }
});
ъ

  render();

