'use strict';
import { formValidation } from './formValidation';
import { setRatingCategory } from './starFeature';
import { previewUploadedImages } from './previewImages';
import { displayMap } from './mapBox';

// Fetch all the forms we want to apply custom Bootstrap validation styles to
const forms = document.querySelectorAll('.needs-validation');

// Fieldset from the review form stars feature
const starabilityForm = document.querySelector('.starability');

const fileInput = document.querySelector('.file-input-index');

const mapContainer = document.querySelector('#map');

if (forms) {
    formValidation(forms);
}

if (starabilityForm) {
    setRatingCategory(starabilityForm);
}

if (fileInput) {
    previewUploadedImages(fileInput);
}

if (mapContainer) {
    const campground = JSON.parse(mapContainer.dataset.campground);
    displayMap(campground);
}
