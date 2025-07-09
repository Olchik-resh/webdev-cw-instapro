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
   <li class="post">
               <div class="post-header" data-user-id="${post.user.id}">
                 <img src="${
                   post.user.imageUrl
                 }" class="post-header__user-image" alt="User avatar">
                 <p class="post-header__user-name">${escapeHTML(
                   post.user.name
                 )}</p>
               </div>
               <div class="post-image-container">
                 <img class="post-image" src="${post.imageUrl}" alt="Post image">
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
                 <span class="user-name">${escapeHTML(post.user.name)}</span>
                 ${escapeHTML(post.description)}
               </p>
               <p class="post-date">${createdAt}</p>
               ${
                 user && post.user.id === user._id
                   ? '<button class="delete-button" data-post-id="' +
                     post.id +
                     '">Удалить</button>'
                   : ""
               }
             </li>`;
         })
         .join("");
       const appHtml = `
         <div class="page-container">
           <div class="header-container"></div>
           <ul class="posts">${postsHtml}</ul>
         </div>`;

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
