'use strict';
import { formValidation } from './formValidation';
import { setRatingCategory } from './starFeature';
import { previewUploadedImages } from './previewImages';
import { displayCampgroundMap, displayClusterMap } from './mapBox';

// Fetch all the forms we want to apply custom Bootstrap validation styles to
const forms = document.querySelectorAll('.needs-validation');

// Fieldset from the review form stars feature
const starabilityForm = document.querySelector('.starability');

const fileInput = document.querySelector('.file-input-index');

const campgroundMapContainer = document.querySelector('#campgroundMap');

const clusterMapContainer = document.querySelector('#clusterMap');

if (forms) {
    formValidation(forms);
}

if (starabilityForm) {
    setRatingCategory(starabilityForm);
}

if (fileInput) {
    previewUploadedImages(fileInput);
}

if (campgroundMapContainer) {
    const campground = JSON.parse(campgroundMapContainer.dataset.campground);
    displayCampgroundMap(campground);
}

if (clusterMapContainer) {
    const campgrounds = JSON.parse(clusterMapContainer.dataset.campgrounds);
    displayClusterMap(campgrounds);
}
