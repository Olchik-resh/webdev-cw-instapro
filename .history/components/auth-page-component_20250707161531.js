import { renderHeaderComponent } from "./header-component.js";
import { loginUser, registerUser, uploadImage } from "../api.js";
import { showNotification } from "../index.js";
export function renderAuthPageComponent({ appEl, setUser, user, goToPage }) {
  let isLoginMode = true;
  let imageUrl = "";
  const renderForm = () => {
    const appHtml = `
      <div class="page-container">
        <div class="header-container"></div>
        <div class="form ${isLoginMode ? "form--login" : "form--register"}">
          <h3 class="form-title">${
            isLoginMode ? "Вход в Instapro" : "Регистрация в Instapro"
          }</h3>
          <div class="form-inputs">
            ${
              !isLoginMode
                ? `
              <div class="form-field">
                  <label class="form-label">
                    <input type="file" class="input button--file" accept="image/*">
                    Выберите фото
                  </label>
                <label class="label">Введите имя</label>
                <input type="text" id="name-input" class="input" placeholder="" />
              </div>
            `
                : ""
            }
            <div class="form-field">
              <label class="label">Введите логин</label>
              <input type="text" id="login-input" class="input" placeholder="" />
            </div>
            <div class="form-field">
              <label class="label">Введите пароль</label>
              <input type="password" id="password-input" class="input" placeholder="" />
            </div>
            <div class="form-error"></div>
            <button class="button" id="${
              isLoginMode ? "login-button" : "register-button"
            }">
              ${isLoginMode ? "Войти" : "Зарегистрироваться"}
            </button>
          </div>
          <div class="form-buttons">
            <button class="button button--link" id="toggle-button">
              ${isLoginMode ? "Зарегистрироваться" : "Войти"}
            </button>
          </div>
        </div>
      </div>`;

      const input = element.querySelector(".button--file");
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
    appEl.innerHTML = appHtml;
    renderHeaderComponent({
      element: document.querySelector(".header-container"),
      user,
      goToPage,
    });
    const loginInput = document.getElementById("login-input");
    const passwordInput = document.getElementById("password-input");
    const nameInput = document.getElementById("name-input");
    const imageInput = document.getElementById("image-input");
    const loginButton = document.getElementById("login-button");
    const registerButton = document.getElementById("register-button");
    const toggleButton = document.getElementById("toggle-button");
    const errorEl = document.querySelector(".form-error");
    const setError = (message) => {
      errorEl.textContent = message;
    };
    toggleButton.addEventListener("click", () => {
      isLoginMode = !isLoginMode;
      imageUrl = "";
      setError("");
      renderForm();
    });
    if (loginButton) {
      loginButton.addEventListener("click", () => {
        setError("");
        const login = loginInput.value.trim();
        const password = passwordInput.value.trim();
        if (!login) return setError("Введите логин");
        if (!password) return setError("Введите пароль");
        loginButton.disabled = true;
        loginUser({ login, password })
          .then((userData) => {
            if (!userData.user?.token) throw new Error("Токен не получен");
            setUser(userData.user);
          })
          .catch((error) => {
            setError(error.message);
            showNotification(`Ошибка входа: ${error.message}`);
          })
          .finally(() => {
            loginButton.disabled = false;
          });
      });
    }
    if (registerButton) {
      registerButton.addEventListener("click", () => {
        setError("");
        const login = loginInput.value.trim();
        const password = passwordInput.value.trim();
        const name = nameInput.value.trim();
        if (!login) return setError("Введите логин");
        if (!password) return setError("Введите пароль");
        if (!name) return setError("Введите имя");
        registerButton.disabled = true;
        registerUser({ login, password, name, imageUrl })
          .then((userData) => {
            if (!userData.user?.token) throw new Error("Токен не получен");
            setUser(userData.user);
            showNotification("Регистрация успешна!");
          })
          .catch((error) => {
            setError(error.message);
            showNotification(`Ошибка регистрации: ${error.message}`);
          })
          .finally(() => {
            registerButton.disabled = false;
          });
      });
    }
    if (imageInput) {
      imageInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
          imageInput.disabled = true;
          setError("Загрузка изображения...");
          uploadImage({ file })
            .then((data) => {
              imageUrl = data.fileUrl;
              setError("");
              showNotification("Изображение загружено");
            })
            .catch((error) => {
              setError(error.message);
              showNotification(`Ошибка загрузки изображения: ${error.message}`);
            })
            .finally(() => {
              imageInput.disabled = false;
            });
        }
      });
    }
  };
  renderForm();
}
