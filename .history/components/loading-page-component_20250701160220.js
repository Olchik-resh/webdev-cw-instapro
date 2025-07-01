export function renderLoadingPageComponent({ appEl }) {
  const html = `
    <div class="page-container">
      <div class="loader"></div>
    </div>`;
  appEl.innerHTML = html;
}
