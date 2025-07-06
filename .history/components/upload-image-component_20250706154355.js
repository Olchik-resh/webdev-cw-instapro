import { uploadImage } from "../api.js";
import { showNotification } from "../index.js";
export function renderUploadImageComponent({ element, onImageUrlChange }) {
  let previewUrl = "";
  const render = () => {
    element.innerHTML = `
      <div class="upload-image-container">
        <label class="file-upload-label secondary-button">
          <input type="file" class="file-upload-input" accept="image/*" />
          Выберите фото
        </label>
        ${
          previewUrl
            ? `<img src="${previewUrl}" class="file-upload-image" />`
            : ""
        }
      </div>
    `;
    const input = element.querySelector(".file-upload-input");
    input.addEventListener("change", () => {
      const file = input.files[0];
      if (file) {
        input.disabled = true;
        const reader = new FileReader();
        reader.onload = (e) => {
          previewUrl = e.target.result;
          render();
        };
        reader.readAsDataURL(file);
        uploadImage({ file })
          .then(({ fileUrl }) => {
            onImageUrlChange(fileUrl);
            previewUrl = fileUrl;
            render();
          })
          .catch((error) => {
            console.error("Error uploading image:", error);
            showNotification(`Ошибка загрузки изображения: ${error.message}`);
            onImageUrlChange(previewUrl);
            input.disabled = false;
          });
      }
    });
  };
  render();
}
