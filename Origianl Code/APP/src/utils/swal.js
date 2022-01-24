
import Swal from 'sweetalert2';

export const swalRemoveLike = (title, btnConfirmText, btnCancelText, callback) => {
    Swal.fire({
        title: title,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: btnConfirmText,
        cancelButtonText: btnCancelText
    }).then(result => {
        if (result.value) {
            callback();
        }
    });
}

export const swalComment = (title, btnConfirmText, btnCancelText, callback) => {
    Swal.fire({
        title: title,
        html: `<input id="txt-comment" type="text" class="swal2-input" />`,
        showConfirmButton: true,
        confirmButtonText: btnConfirmText,
        showCancelButton: true,
        cancelButtonText: btnCancelText
    }).then(result => {
        if (result.value) {
            let c = document.getElementById('txt-comment').value;
            callback(c);
        }
    });
}

export const swalDeleteForm = (title, text, btnConfirmText, btnCancelText,callback) => {
    Swal.fire({
        title: title,
        text: text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: btnConfirmText,
        cancelButtonText: btnCancelText
    }).then(result => {
        if (result.value) {
            callback();
        }
    });
}

export const swalConfirm = (title, btnConfirmText, btnCancelText, callback) => {
    Swal.fire({
        title: title,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: btnConfirmText,
        cancelButtonText: btnCancelText
    }).then(result => {
        if (result.value) {
            callback();
        }
    });
}

export const swalError = message => {
    Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: message,
        showConfirmButton: true
    });
}

export const swalSuccess = message => {
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: message,
        showConfirmButton: false,
        timer: 800
    });
}

export const swalInfo = message => {
    Swal.fire({
        position: 'top-end',
        icon: 'info',
        title: message,
        showConfirmButton: true
    });
}

export const swalShare = (title, btnConfirmText, btnCancelText, url) => {
    Swal.fire({
        title: title,
        html: `<input id="txt-share-url" type="text" class="swal2-input" readonly value="${url}" />`,
        position: 'top-end',
        showConfirmButton: true,
        confirmButtonText: btnConfirmText,
        showCancelButton: true,
        cancelButtonText: btnCancelText
    }).then(result => {
        if (result.value) {
            document.getElementById('txt-share-url').select();
            document.execCommand("copy");
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Copied!',
                showConfirmButton: false,
                timer: 800
            });
        }
    });
}

export const swalLoading = (title, text) => {
    Swal.fire({
        title: title,
        text: text,
        timerProgressBar: true,
        showConfirmButton: false,
        showCancelButton: false,
        allowEscapeKey: false,
        allowOutsideClick: false,
        onBeforeOpen: () => {
            Swal.showLoading();
        }
    });
}

export const swalUploading = () => {
    Swal.fire({
        title: 'Uploading files...',
        text: "Please wait. This may take a while depending on upload size.",
        timerProgressBar: true,
        showConfirmButton: false,
        showCancelButton: false,
        allowEscapeKey: false,
        allowOutsideClick: false,
        onBeforeOpen: () => {
            Swal.showLoading();
        }
    });
}
//  (i18n.t('are_you_sure'), i18n.t('You_wont_be_able_to_revert_this'), i18n.t('delete'), i18n.t('cancel'), ()
