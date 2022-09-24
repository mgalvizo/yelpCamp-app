export const setRatingCategory = () => {
    const starInput = Array.from(document.querySelectorAll('fieldset input'));
    const ratingCategory = document.querySelector('input[type=hidden]');

    starInput.forEach(starInput => {
        starInput.addEventListener('click', e => {
            const { category } = starInput.dataset;
            console.log(category);
            ratingCategory.value = category;
        });
    });
};
