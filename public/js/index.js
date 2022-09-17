'use strict';
import { formValidation } from './formValidation';

// Fetch all the forms we want to apply custom Bootstrap validation styles to
const forms = document.querySelectorAll('.needs-validation');

if (forms) {
    formValidation(forms);
}
