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
   

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
    user,
    goToPage,
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
