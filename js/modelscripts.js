const BRAND_PHONE_NUMBER = "+919995594848"
const BRAND_EMAIL = "tamglobetrading@gmail.com"


let input = document.querySelector("#cust-mob-number");
let iti = intlTelInput(input, {
    initialCountry: 'in',
    utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.1/build/js/utils.js",
});

// functions
function getProductDetails(productId) {
    let product = $(`#${productId}`)

    let productCategory = $('#product-enquiry-modal').data('modal-product-category')

    let image = product.find('[data-product-image]').prop('src')
    let name = product.find('[data-product-name]').text()
    let size = product.find('[data-product-size]').text()
    let shape = product.find('[data-product-shape]').text()
    let color = product.find('[data-product-color]').text()

    return {
        "prodCategory" : productCategory,
        "image" : image,
        "name" : name,
        "size" : size,
        "shape" : shape,
        "color" : color
    }
}

function emailValidation() {
    let email = $("#cust-email").val();
    let emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (emailRegex.test(email) && email.length > 0) {
        // valid
        $('#cust-email').removeClass('is-invalid');
        $('#cust-email').addClass('is-valid');
        return true

    } else {
        // invalid
        $('#cust-email').removeClass('is-valid');
        $('#cust-email').addClass('is-invalid');
        return false
    }
}

function phoneValidation(){
    if (iti.isValidNumber()) {
        // valid
        $('#cust-mob-number').removeClass('is-invalid');
        $('#cust-mob-number').addClass('is-valid');
        $('#cust-mob-number-error').addClass('d-none');
        return true
    } else {
        // invalid
        $('#cust-mob-number').removeClass('is-valid');
        $('#cust-mob-number-error').removeClass('d-none');
        $('#cust-mob-number').addClass('is-invalid');
        return false
    }
}

function quantityValidation(){
    let quantity = $('#product-quantity').val()

    if (quantity > 0) {
        // valid
        $('#product-quantity').removeClass('is-invalid');
        $('#product-quantity').addClass('is-valid');
        return true

    } else {
        // invalid
        $('#product-quantity').removeClass('is-valid');
        $('#product-quantity').addClass('is-invalid');
        return false
    }
}

function resetModalForm(){
    // $('#query-form')[0].reset()
    $('#product-quantity').val(1);
}

(function ($) {
    "use strict";

    $('.query-btn').on('click', function() {
        let productId = $(this).data('product-id');
        let productImage = getProductDetails(productId).image
        let productName = getProductDetails(productId).name
        
        $('#product-enquiry-modal').data('modal-product-id', productId)

        $('#modal-image').attr('src', productImage);
        $('#modal-image').attr('alt', productName);
        $('#modal-product-name').html(productName)
    });

    $('.query-send-btn').on('click', function() {
        let sendType = $(this).data('send-type');

        quantityValidation()
        emailValidation()
        phoneValidation()

        if (quantityValidation() && emailValidation() && phoneValidation()) {
            let productId = $('#product-enquiry-modal').data('modal-product-id')

            let quantity = $('#product-quantity').val()
            let mobile = iti.getNumber(intlTelInputUtils.numberFormat.E164);
            let email = $('#cust-email').val()
            
            let prodcategory = getProductDetails(productId).prodCategory
            let imageLink = getProductDetails(productId).image
            let prodname = getProductDetails(productId).name
            let shape = getProductDetails(productId).shape
            let size = getProductDetails(productId).size
            let color = getProductDetails(productId).color

            let message = `${imageLink}\n\n` +
                  `Product: ${prodname}\n` +
                  `Product Category: ${prodcategory}\n` +
                  `Shape: ${shape}\n` +
                  `Size: ${size}\n` +
                  `Colour: ${color}\n\n` +
                  `Quantity: ${quantity}\n` +
                  `Email: ${email}`;
            
            if (sendType == "email"){
                message = message + "\n" + `Phone: ${mobile}`
            }
            
            var encodedSubject = encodeURIComponent("Product Enquiry from TeamGLobe site");
            let encodedMessage = encodeURIComponent(message);

            let whatsappURL = `https://wa.me/${BRAND_PHONE_NUMBER}?text=${encodedMessage}`
            let mailtoURL = `mailto:${BRAND_EMAIL}?subject=${encodedSubject}&body=${encodedMessage}`;

            if (sendType == "whatsapp"){
                window.open(whatsappURL, '_blank');
            }

            if (sendType == "email"){
                window.location.href = mailtoURL;
            }

            $('#product-enquiry-modal').modal('hide');
        }

    });

    $('#product-enquiry-modal').on('hidden.bs.modal', function () {
        resetModalForm()
    });

    // validation
    $('#product-quantity').on('input', function() {
        quantityValidation()
    });

    $('#cust-email').on('input', function() {
        emailValidation()
    });

    $('#cust-mob-number').on('input', function() {
        phoneValidation()
    });
    
})(jQuery);
