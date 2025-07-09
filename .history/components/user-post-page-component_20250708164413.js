import { renderHeaderComponent } from "./header-component.js";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

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
        <img src="${posts[0]?.user.imageUrl || ""}" class="posts-user-header__user-image">
        <p class="posts-user-header__user-name">${sanitizeHtml(posts[0]?.user.name || "")}</p>
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
                  <button data-post-id="${post.id}" data-is-liked="${post.isLiked}" class="like-button">
                    <img src="./assets/images/${
                      post.isLiked ? "like-active.svg" : "like-not-active.svg"
                    }">
                  </button>
                  <p class="post-likes-text">
                    Нравится: <strong>${post.likes.length}</strong>
                  </p>
                </div>
                <p class="post-text">
                  <span class="user-name">${sanitizeHtml(post.user.name)}</span>
                  ${sanitizeHtml(post.description)}
                </p>
                <p class="post-date">
                  ${formatDistanceToNow(new Date(post.createdAt), { locale: ru })} назад
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
  });

  for (let likeBtn of document.querySelectorAll(".like-button")) {
    likeBtn.addEventListener("click", () => {
      if (!user) {
        showNotification("Авторизуйтесь для лайков");
        return;
      }
      const postId = likeBtn.dataset.postId;
      const isLiked = likeBtn.dataset.isLiked === "true";
      const action = isLiked ? dislikePost : likePost;
      action({ postId, token: user.token })
        .then((response) => {
          const post = posts.find((p) => p.id === postId);
          post.isLiked = response.post.isLiked;
          post.likes = response.post.likes;
          renderUserPostsPageComponent({
            appEl,
            userId,
            posts,
            user,
            goToPage,
            likePost,
            dislikePost,
          });
        })
        .catch((error) => {
          console.error(error);
          showNotification("Ошибка при изменении лайка");
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