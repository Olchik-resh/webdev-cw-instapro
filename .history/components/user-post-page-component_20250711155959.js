import { renderHeaderComponent } from "./header-component.js";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import { getToken } from "../index.js";
// import { renderPosts } from "./posts-page-component.js";

export function renderUserPostsPageComponent({
  appEl,
  userId,
  posts,
  user,
  goToPage,
  likePost,
  dislikePost,
}) {
  const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <div class="posts-user-header">
      <img src="${
        posts[0]?.user.imageUrl
      }" class="post-header__user-image" alt="User avatar">
        <p class="posts-user-header__user-name">${sanitizeHtml(
          posts[0]?.user.login || ""
        )}</p>
      </div>
      <ul class="posts">
        ${posts
          .map(
            (post) => `
              <li class="post">
                <div class="post-image-container">
                  <img class="post-image" src="${post.imageUrl}">
                </div>
                <div class="post-likes">
              <button data-post-id="${post.id}" class="like-button ${
              post.isLiked ? "liked" : ""
            }">
                <img src="./assets/images/like-${
                  post.isLiked ? "active" : "not-active"
                }.svg">
              </button>
              <p class="post-likes-text">
                Нравится: <strong>${post.likes.length}</strong>
              </p>
            </div>
                <p class="post-text">
                  <span class="user-name">${sanitizeHtml(
                    post.user.login
                  )}</span>
                  ${sanitizeHtml(post.description)}
                </p>
                <p class="post-date">
                  ${formatDistanceToNow(new Date(post.createdAt), {
                    locale: ru,
                  })} назад
                </p>
              </li>
            `
          )
          .join("")}
      </ul>
    </div>
  `;

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
    user,
    goToPage,
  });

  // for (let likeBtn of document.querySelectorAll(".like-button")) {
  //   likeBtn.addEventListener("click", () => {
  //     if (!user) {
  //       showNotification("Авторизуйтесь для лайков");
  //       return;
  //     }
  //     const postId = likeBtn.dataset.postId;
  //     const isLiked = likeBtn.dataset.isLiked === "true";
  //     const action = isLiked ? dislikePost : likePost;
  //     action({ postId, token: user.token })
  //       .then((response) => {
  //         const post = posts.find((p) => p.id === postId);
  //         post.isLiked = response.post.isLiked;
  //         post.likes = response.post.likes;

  //         // Обновление визуального состояния кнопки
  //         if (post.isLiked) {
  //           likeBtn.classList.add("liked"); // Добавляем класс "liked" для стилизации кнопки
  //           likeBtn.dataset.isLiked = "true"; // Обновляем атрибут data-is-liked
  //         } else {
  //           likeBtn.classList.remove("liked"); // Удаляем класс "liked"
  //           likeBtn.dataset.isLiked = "false"; // Обновляем атрибут data-is-liked
  //         }

  //         renderUserPostsPageComponent({
  //           appEl,
  //           userId,
  //           posts,
  //           user,
  //           goToPage,
  //           likePost,
  //           dislikePost,
  //         });
  //       })
  //       .catch((error) => {
  //         console.error(error);
  //         showNotification("Ошибка при изменении лайка");
  //       });
  //   });
  // }

  for (const likeBtn of document.querySelectorAll(".like-button")) {
    likeBtn.addEventListener("click", () => {
      const postId = likeBtn.dataset.postId;
      const post = posts.find((p) => p.id === postId);
      const token = getToken();
      const action = post.isLiked ? dislikePost : likePost;

      if (!token) {
        showNotification("Пожалуйста, войдите в приложение");
        goToPage(POSTS_PAGE);
        return;
      }

      action({ token, postId })
        .then(({ post: updatedPost }) => {
          const index = posts.findIndex((p) => p.id === postId);
          posts[index] = updatedPost;
        })
        .catch((error) => {
          console.error("Error liking post:", error);
          showNotification(`Ошибка лайка: ${error.message}`);
        });
        
    });
  }
}

function sanitizeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function showNotification(message) {
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = message;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
}
