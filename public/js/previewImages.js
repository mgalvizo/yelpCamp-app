export const previewUploadedImages = fileInput => {
    fileInput.addEventListener('change', e => {
        const urls = [];
        const files = e.target.files;

        Array.from(files).forEach(file => {
            urls.push(URL.createObjectURL(file));
        });

        const imagesContainer = document.querySelector(
            '.images-container-index'
        );

        if (imagesContainer) {
            imagesContainer.innerHTML = '';
            urls.forEach(url => {
                const cardMarkup = `<div class="col-sm-6 col-md-3 gx-4"><div class="card"><img src="${url}" alt="preview Image"></div></div>`;
                imagesContainer.insertAdjacentHTML('afterbegin', cardMarkup);
            });
        }
    });
};
