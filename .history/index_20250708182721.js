import {
  getPosts,
  getUserPosts,
  addPost,
  likePost,
  dislikePost,
  deletePost,
  verifyToken,
} from "./api.js";
import { renderAddPostPageComponent } from "./components/add-post-page-component.js";
import { renderAuthPageComponent } from "./components/auth-page-component.js";
import { renderPostsPageComponent } from "./components/posts-page-component.js";
import { renderLoadingPageComponent } from "./components/loading-page-component.js";
import { renderUserPostsPageComponent } from "./components/user-post-page-component.js";
import {
  ADD_POSTS_PAGE,
  AUTH_PAGE,
  LOADING_PAGE,
  POSTS_PAGE,
  USER_POSTS_PAGE,
} from "./routes.js";
import {
  getUserFromLocalStorage,
  removeUserFromLocalStorage,
  saveUserToLocalStorage,
} from "./helpers.js";
export let user = getUserFromLocalStorage();
export let page = null;
export let posts = [];
export const getToken = () =>
  user && user.token ? `Bearer ${user.token}` : undefined;
export const setUser = (newUser) => {
  user = newUser;
  saveUserToLocalStorage(user);
  if (user) goToPage(POSTS_PAGE);
  else goToPage(AUTH_PAGE);
};
export const logout = () => {
  user = null;
  removeUserFromLocalStorage();
  goToPage(POSTS_PAGE);
};

export const showNotification = (message) => {
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = message;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
};
export const goToPage = (newPage, data = {}) => {
  if (
    [
      POSTS_PAGE,
      AUTH_PAGE,
      ADD_POSTS_PAGE,
      USER_POSTS_PAGE,
      LOADING_PAGE,
    ].includes(newPage)
  ) {
    if (newPage === ADD_POSTS_PAGE) {
      page = user ? ADD_POSTS_PAGE : AUTH_PAGE;
      renderApp();
      return;
    } else if (newPage === USER_POSTS_PAGE) {
      page = USER_POSTS_PAGE;
      renderApp();
      return;
    }
    if (newPage === POSTS_PAGE) {
      page = LOADING_PAGE;
      renderApp();
      const token = getToken();
      getPosts({ token })
        .then((newPosts) => {
          page = POSTS_PAGE;
          posts = newPosts;
          renderApp();
        })
        .catch((error) => {
          console.error("Error fetching posts:", error);
          showNotification(`Ошибка загрузки постов: ${error.message}`);
          page = POSTS_PAGE;
          renderApp();
        });
      return;
    }

    if (newPage === USER_POSTS_PAGE) {
      page = LOADING_PAGE;
      renderApp();
      const token = getToken();
      if (token) {
        verifyToken({ token })
          .then((isValid) => {
            if (!isValid) {
              console.warn("Invalid token, logging out");
              logout();
              return;
            }
            if (!data.userId) {
              console.error("userId is undefined");
              return; // или обработка ошибки
            }
            getUserPosts({ token, userId: data.userId })
              .then((newPosts) => {
                page = USER_POSTS_PAGE;
                posts = newPosts;
                renderApp(data);
              })
              .catch((error) => {
                console.error("Error fetching user posts:", error);
                showNotification(
                  `Ошибка загрузки постов пользователя: ${error.message}`
                );
                page = AUTH_PAGE;
                renderApp();
              });
          })
          .catch((error) => {
            console.error("Error verifying token:", error);
            showNotification(`Ошибка проверки токена: ${error.message}`);
            page = AUTH_PAGE;
            renderApp();
          });
      } else {
        console.error("Token is undefined");
      }
    }
  }
};

// function getUserIdFromUrl() {
//   const urlParams = new URLSearchParams(window.location.search);
//   const userId = urlParams.get("userId");
//   console.log("URL parameter userId:", userId); // Отладочное сообщение
//   return userId;
// }

// const data = {
//   userId: getUserIdFromUrl(),
// };

const renderApp = (data = {}) => {
  const appEl = document.getElementById("app");
  appEl.innerHTML = "";
  if (page === LOADING_PAGE) {
    return renderLoadingPageComponent({ appEl });
  }
  if (page === AUTH_PAGE) {
    return renderAuthPageComponent({ appEl, setUser, user, goToPage });
  }
  if (page === ADD_POSTS_PAGE) {
    return renderAddPostPageComponent({
      appEl,
      onAddPostClick: ({ description, imageUrl }) => {
        addPost({ token: getToken(), description, imageUrl })
          .then(() => getPosts({ token: getToken() }))
          .then((newPosts) => {
            posts = newPosts;
            goToPage(POSTS_PAGE);
            showNotification("Пост успешно добавлен!");
          })
          .catch((error) => {
            console.error("Error adding post:", error);
            showNotification(`Ошибка при добавлении поста: ${error.message}`);
          });
      },
    });
  }
  if (page === POSTS_PAGE) {
    return renderPostsPageComponent({
      appEl,
      posts,
      user,
      goToPage,
      likePost,
      dislikePost,
      deletePost,
    });
  } else if (page === USER_POSTS_PAGE) {
    console.log("userId:", data.userId);
    const userPosts = posts.filter((post) => post.user.id === data.userId);
    console.log("Filtered posts:", userPosts);
    return renderUserPostsPageComponent({
      appEl,
      // posts 
      user,
      goToPage,
      likePost,
      dislikePost,
      deletePost,
      userId: data.userId,
    });
  }
  appEl.innerHTML = `<div class="page-container">Ошибка: неизвестная страница</div>`;
};

goToPage(POSTS_PAGE);
