function fileUploaded() {
    var fileInput = document.getElementById("fileInput");
    var successMessage = document.getElementById("successMessage");
    var imageContainer = document.getElementById("imageContainer");
    var imagePreview = document.getElementById("imagePreview");
    var file = fileInput.files[0];
    
    var fileName = file.name;
    successMessage.innerText = "Dosya '" + fileName + "' başarıyla yüklendi.";
    successMessage.style.paddingTop = "1.5rem";
    successMessage.style.display = "block";

    if (file.type.match('image.*')) {
        var reader = new FileReader();
        reader.onload = function(event) {
            imagePreview.src = event.target.result;
            imageContainer.style.display = "block";
        };
        reader.readAsDataURL(file);
    } else {
        imageContainer.style.display = "none";
    }
}
