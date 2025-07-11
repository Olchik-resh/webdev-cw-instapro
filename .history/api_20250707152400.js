const personalKey = "prodol";
const baseHost = "https://wedev-api.sky.pro";
const postsHost = `${baseHost}/api/v1/${personalKey}/instapro`;
function checkResponse(response) {
  if (!response.ok) {
    return response.text().then((text) => {
      throw new Error(`Ошибка сервера: ${response.status} ${text}`);
    });
  }
  return response.json();
}
export async function getPosts({ token }) {
  try {
    const headers =
      token && token !== "Bearer undefined" ? { Authorization: token } : {};
    const response = await fetch(postsHost, { method: "GET", headers });
    const data = await checkResponse(response);
    if (response.status === 401) throw new Error("Нет авторизации");
    return data.posts;
  } catch (error) {
    throw new Error(`Failed to fetch posts: ${error.message}`);
  }
}
export async function getUserPosts({ token, userId }) {
  try {
    const headers =
      token && token !== "Bearer undefined" ? { Authorization: token } : {};
    const response = await fetch(`${postsHost}/user-posts/${userId}`, {
      method: "GET",
      headers,
    });
    const data = await checkResponse(response);
    if (response.status === 401) throw new Error("Нет авторизации");
    return data.posts;
  } catch (error) {
    throw new Error(`Failed to fetch user posts: ${error.message}`);
  }
}
export async function addPost({ token, description, imageUrl }) {
  try {
    if (!description || !imageUrl)
      throw new Error("Описание или URL изображения не переданы");
    const response = await fetch(postsHost, {
      method: "POST",
      headers: { Authorization: token },
      body: JSON.stringify({ description, imageUrl }),
    });
    const data = await checkResponse(response);
    if (response.status === 400)
      throw new Error(data.error || "Некорректные данные поста");
    if (response.status === 401) throw new Error("Нет авторизации");
    return data;
  } catch (error) {
    throw new Error(`Failed to add post: ${error.message}`);
  }
}
export async function likePost({ token, postId }) {
  try {
    const response = await fetch(`${postsHost}/${postId}/like`, {
      method: "POST",
      headers: { Authorization: token },
    });
    const data = await checkResponse(response);
    if (response.status === 401) throw new Error("Нет авторизации");
    return data;
  } catch (error) {
    throw new Error(`Failed to like post: ${error.message}`);
  }
}
export async function dislikePost({ token, postId }) {
  try {
    const response = await fetch(`${postsHost}/${postId}/dislike`, {
      method: "POST",
      headers: { Authorization: token },
    });
    const data = await checkResponse(response);
    if (response.status === 401) throw new Error("Нет авторизации");
    return data;
  } catch (error) {
    throw new Error(`Failed to dislike post: ${error.message}`);
  }
}

export async function registerUser({ login, password, name, imageUrl }) {
  const body = { login, password, name };
  if (imageUrl) body.imageUrl = imageUrl;
  console.log("Register request body:", body); 
  const response = await fetch(`${baseHost}/api/user`, {
    method: "POST",
    body: JSON.stringify(body),
  });

  if (response.status === 400) {
    const data = await response.json();
    throw new Error(data.error || "Некорректные данные регистрации");
  }
  return response.json();
}

export async function loginUser({ login, password }) {
  const response = await fetch(`${baseHost}/api/user/login`, {
    method: "POST",
    body: JSON.stringify({ login, password }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Неверный логин или пароль");
  }
  return response.json();
}

export async function uploadImage({ file }) {
  try {
    const data = new FormData();
    data.append("file", file);
    const response = await fetch(`${baseHost}/api/upload/image`, {
      method: "POST",
      body: data,
    });
    const result = await checkResponse(response);
    if (response.status === 400)
      throw new Error(result.error || "Некорректный файл изображения");
    if (response.status !== 200) throw new Error("Ошибка загрузки изображения");
    return result;
  } catch (error) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }
}
export async function verifyToken({ token }) {
  try {
    const headers = { Authorization: token };
    const response = await fetch(postsHost, { method: "GET", headers });
    return response.status === 200;
  } catch (error) {
    console.error("verifyToken error:", error);
    return false;
  }
}
export async function deletePost({ token, postId }) {
  try {
    const response = await fetch(`${postsHost}/${postId}`, {
      method: "DELETE",
      headers: { Authorization: token },
    });
    if (!response.ok) throw new Error(`Ошибка удаления: ${response.status}`);
    return response.json();
  } catch (error) {
    throw new Error(`Failed to delete post: ${error.message}`);
  }
}
