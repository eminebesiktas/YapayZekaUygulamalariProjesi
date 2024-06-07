// Dosya seçildiğinde işlem yapacak fonksiyon
function fileUploaded2() {
    var fileInput2 = document.getElementById("fileInput2");
    var analyzeButton2 = document.getElementById("analyzeBtn2");

    // Dosya seçilip seçilmediğini kontrol et
    if (fileInput2.files.length > 0) {
        console.log("Dosya secildi");
        analyzeButton2.style.marginLeft = "32px";
        // Dosya seçildiyse cilt analizi butonunu göster
        analyzeButton2.style.display = "block";
    } else {
        // Dosya seçilmediyse cilt analizi butonunu gizle
        analyzeButton2.style.display = "none";
    }
}

const fileInput2 = document.getElementById("fileInput2");
const imagePreview2 = document.getElementById("imagePreview2");
const selectedImage2 = document.getElementById("selectedImage2");

// Seçilen dosyanın görüntülenmesi için fonksiyon
function previewImage2(event) {
    // Seçilen dosyayı al
    const file = event.target.files[0];

    // Dosya seçildiğini kontrol et
    if (file) {
        // FileReader nesnesi oluştur
        const reader = new FileReader();

        // FileReader onload olayını ayarla
        reader.onload = function () {
            // Seçilen görüntü öğesinin kaynağını seçilen dosyanın veri URL'sine ayarla
            selectedImage2.src = reader.result;
        };

        // Seçilen dosyayı veri URL olarak oku
        reader.readAsDataURL(file);

        // Görüntü önizleme alanını göster
        imagePreview2.style.display = "block";
    } else {
        // Dosya seçilmediyse görüntü önizleme alanını gizle
        imagePreview2.style.display = "none";
    }
}

// Dosya girişi değişikliği olayı için olay dinleyici ekle
fileInput2.addEventListener("change", previewImage2);

// Kamera erişimini sağlar
navigator.mediaDevices
    .getUserMedia({ video: true })
    .then(function (stream) {
        var videoElement2 = document.getElementById("videoElement2");
        videoElement2.srcObject = stream;
    })
    .catch(function (error) {
        console.error("Kamera erişimi hatası: ", error);
    });

// Fotoğraf çekme işlemi
var captureButton2 = document.getElementById("captureButton2");
captureButton2.addEventListener("click", function () {
    var videoElement2 = document.getElementById("videoElement2");
    var canvasElement2 = document.getElementById("canvasElement2");
    var context = canvasElement2.getContext("2d");

    // Video karesini canvas'a kopyala
    context.drawImage(
        videoElement2,
        0,
        0,
        canvasElement2.width,
        canvasElement2.height
    );

    // Canvas'tan veri al ve Base64 formatında fotoğrafı al
    var imageDataURL = canvasElement2.toDataURL("image/png");
    //  var jsonData = JSON.stringify({ "file": imageDataURL });
    //  console.log("Canvas element: " + canvasElement2);
    //  // Burada alınan Base64 formatındaki fotoğrafı işleyebilir veya sunucuya gönderebilirsiniz.
    //  console.log("Image data url: " + imageDataURL);

    var formData = new FormData();
    var blob = dataURItoBlob(imageDataURL);
    // Blob nesnesini FormData'ya ekleyin
    formData.append("file", blob, "photo.png");
    formData.append("model", "dry_normal_oily");
    //formData.append('file', imageDataURL);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/predict", true);

    xhr.upload.onprogress = function (e) {
        if (e.lengthComputable) {
            var percentComplete = (e.loaded / e.total) * 100;
            document.getElementById("status2_dryNormalOily").innerHTML =
                percentComplete + "% yüklendi.";
        }
    };

    xhr.onload = function () {
        if (xhr.status === 200) {
            var result;
            var modalBody2;
            if (xhr.response === "dry") {
                result = "Kuru Cilt Tipi";
                modalBody2 =
                    "Elbette! Kuru cilt tipi için uygun bir cilt bakım rutini oluşturmak için dikkat edilmesi gereken birkaç önemli nokta bulunur. İlk olarak, nazik temizleyiciler tercih edilmelidir. Kuru ciltler için agresif temizleyiciler cildi kurutabilir, bu yüzden losyon veya süt formundaki nazik temizleyiciler daha uygun olabilir. Nemlendirici önemli bir adımdır. Kuru ciltler, yoğun nemlendirici kremler veya losyonlarla düzenli olarak nemlendirilmelidir. İçerisinde gliserin, hyaluronik asit gibi nemlendirici bileşenler bulunan ürünler tercih edilmelidir. Ayrıca, nemlendirici özellikleri yanında cilt bariyerini güçlendiren yağ bazlı kremler de kuru ciltler için faydalı olabilir.Nemlendirici serumlar da kuru ciltler için etkili olabilir. Hyaluronik asit gibi nemlendirici bileşenler içeren serumlar, cilde derinlemesine nüfuz ederek ekstra nem sağlayabilir. Güneş koruyucu kullanmak da kuru ciltler için önemlidir. Hassas olan bu cilt tipi, güneşe karşı daha savunmasız olabilir. Bu nedenle, geniş spektrumlu bir güneş koruyucu kullanmak cildi UV ışınlarından koruyarak kurumasını önleyebilir. Haftada bir veya iki kez cilde uygulanan besleyici maskeler, kuru cildin nemlenmesine ve canlanmasına yardımcı olabilir. Bal, avokado veya yoğurt gibi besleyici içeriklere sahip maskeler, cildi besler ve nemlendirir. Son olarak, doğal yağlar da kuru ciltler için faydalı olabilir. Jojoba yağı, argan yağı, hindistancevizi yağı gibi doğal yağlar cildi besler ve nemlendirir. Bu yağları doğrudan cilde veya nemlendirici kremlerle birlikte kullanabilirsiniz. Tüm bu ürünleri kullanmadan önce, yeni bir ürünün cildinizde herhangi bir olumsuz reaksiyona neden olup olmadığını görmek için bir yama testi yapmak önemlidir. Bu adımları takip ederek, kuru cilt tipinize uygun bir cilt bakım rutini oluşturabilirsiniz.";
            } 
            
            else if (xhr.response === "normal") {
                result = "Normal Cilt Tipi";
                modalBody2 =
                    "Normal cilt tipine sahip olanlar için uygun bir cilt bakım rutini oluşturmak oldukça önemlidir. Normal cilt tipi, genellikle yağlı veya kuru cilt tiplerine kıyasla daha az sorun yaşar, ancak yine de cildin sağlığını korumak ve dengesini sürdürmek için belirli adımlar atılmalıdır. İlk olarak, hafif ve nazik temizleyiciler kullanılmalıdır. Bu temizleyiciler, cildi nazikçe temizlerken kurutmaz ve dengeler. Ardından, hafif nemlendiriciler tercih edilmelidir. Normal ciltler genellikle doğal olarak nemlidir, bu yüzden ağır nemlendiricilere ihtiyaç duymazlar. Hafif, su bazlı nemlendiriciler cildi nemlendirir ve dengede tutar. Güneş koruyucu kullanmak da önemlidir, çünkü normal cilt tipine sahip kişiler bile güneşin zararlı etkilerinden korunmalıdır. Geniş spektrumlu bir güneş koruyucu kullanmak cildi güneşin zararlı etkilerinden korur ve erken yaşlanmayı önler. Antioksidanlar da normal ciltler için faydalı olabilir. C vitamini, E vitamini ve yeşil çay özleri gibi antioksidan içeren ürünler cildin genel sağlığını destekler. Haftada bir veya iki kez hafif exfoliyantlar kullanmak, cildin pürüzsüz ve parlak kalmasına yardımcı olabilir. Ayrıca, haftada bir veya iki kez nem maskeleri uygulamak da cildi ekstra nemlendirebilir ve canlandırabilir. Son olarak, dengeli beslenme ve yeterli su tüketimi de normal cilt tipinin sağlığını korumak için önemlidir. Bol miktarda su içmek ve antioksidan açısından zengin gıdalar tüketmek cildin görünümünü iyileştirebilir. Bu adımları takip ederek, cildinizin sağlığını koruyabilir ve parlak bir görünüm elde edebilirsiniz.";
            } 
            
            else if (xhr.response === "oily") {
                result = "Yağlı Cilt Tipi";
                modalBody2 =
                    "Yağlı cilt tipi için uygun bir cilt bakım rutini oluşturmak önemlidir. İlk adım, hafif ve köpürmeyen temizleyiciler kullanmaktır. Bu tip temizleyiciler, fazla yağı nazikçe temizler ve gözenekleri tıkamadan cildi temizler. Ardından, nemlendirici kullanmak önemlidir. Yağlı ciltler genellikle fazla yağa rağmen nem ihtiyacı duyabilir, bu nedenle hafif, yağsız ve su bazlı nemlendiriciler tercih edilmelidir. Salisilik asit içeren ürünler, gözenekleri temizler, yağı kontrol altına alır ve sivilce oluşumunu önleyebilir. Haftada bir veya iki kez hafif exfoliyantlar kullanmak da önerilir; bu, ölü deri hücrelerini ve birikmiş yağı temizleyerek cildin daha pürüzsüz olmasını sağlar. Güneş koruyucu kullanmak da önemlidir; yağsız, hafif ve matlaştırıcı özelliklere sahip güneş koruyucular, cildi korurken aynı zamanda yağlanmayı önleyebilir. Makyaj ürünleri seçerken su bazlı ve matlaştırıcı özelliklere sahip ürünler tercih edilmelidir. Tüm bu ürünleri kullanmadan önce bir yama testi yapmak önemlidir, böylece cildinizin nasıl tepki verdiğini gözlemleyebilirsiniz. Bu adımları takip ederek, yağlı cilt tipinize uygun bir cilt bakım rutini oluşturabilirsiniz.";
            }

            else if (xhr.response === 'Birden fazla yüz tespit edildi. Lütfen sadece bir yüz içeren bir fotoğraf yükleyin.') {
                result = "-";
                modalBody2 =
                "Birden fazla yüz tespit edildi. Lütfen tek fotoğrafta tek yüz olacak şekilde yükleme yapınız.";
            }

            else if (xhr.response === 'Bu fotoğraf bir insan yüzü içermiyor.') {
                result = "-";
                modalBody2 =
                "Bu fotoğraf bir insan yüzü içermiyor. Lütfen insan yüzü içeren bir fotoğraf yükleyin.";
            }

            document.getElementById("predictionResult2_dryNormalOily").innerHTML = result;
            document.getElementById("modalBody2_dryNormalOily").innerHTML = modalBody2;
        } 
        
        else 
        {
            document.getElementById("status2_dryNormalOily").innerHTML = "Dosya yüklenirken bir hata oluştu.";
        }
    };

    xhr.onerror = function () {
        // Sunucudan dönen hata mesajını alın
        var errorMessage =
            xhr.responseText || "Dosya yüklenirken bir hata oluştu.";
        // Hata mesajını gösterin
        document.getElementById("status2_dryNormalOily").innerHTML = errorMessage;
    };

    xhr.send(formData);
});

// Base64 formatındaki veriyi Blob nesnesine dönüştüren yardımcı işlev
function dataURItoBlob(dataURI) {
    var byteString = atob(dataURI.split(",")[1]);
    var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    var blob = new Blob([ab], { type: mimeString });
    return blob;
}
function uploadFile2() {
    var fileInput2 = document.getElementById("fileInput2");
    var file = fileInput2.files[0];
    var formData = new FormData();
    formData.append("file", file);
    formData.append("model", "dry_normal_oily");

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/predict", true);

    xhr.upload.onprogress = function (e) {
        if (e.lengthComputable) {
            var percentComplete = (e.loaded / e.total) * 100;
            document.getElementById("status_dryNormalOily").innerHTML =
                percentComplete + "% yüklendi.";
        }
    };

    xhr.onload = function () {
        if (xhr.status === 200) {
            //document.getElementById('status').innerHTML = 'Dosya başarıyla yüklendi.';
            //console.log(xhr);
            var result;
            var modalBody2;
            if (xhr.response === "dry") {
                result = "Kuru Cilt Tipi";
                modalBody2 =
                    "Elbette! Kuru cilt tipi için uygun bir cilt bakım rutini oluşturmak için dikkat edilmesi gereken birkaç önemli nokta bulunur. İlk olarak, nazik temizleyiciler tercih edilmelidir. Kuru ciltler için agresif temizleyiciler cildi kurutabilir, bu yüzden losyon veya süt formundaki nazik temizleyiciler daha uygun olabilir. Nemlendirici önemli bir adımdır. Kuru ciltler, yoğun nemlendirici kremler veya losyonlarla düzenli olarak nemlendirilmelidir. İçerisinde gliserin, hyaluronik asit gibi nemlendirici bileşenler bulunan ürünler tercih edilmelidir. Ayrıca, nemlendirici özellikleri yanında cilt bariyerini güçlendiren yağ bazlı kremler de kuru ciltler için faydalı olabilir.Nemlendirici serumlar da kuru ciltler için etkili olabilir. Hyaluronik asit gibi nemlendirici bileşenler içeren serumlar, cilde derinlemesine nüfuz ederek ekstra nem sağlayabilir. Güneş koruyucu kullanmak da kuru ciltler için önemlidir. Hassas olan bu cilt tipi, güneşe karşı daha savunmasız olabilir. Bu nedenle, geniş spektrumlu bir güneş koruyucu kullanmak cildi UV ışınlarından koruyarak kurumasını önleyebilir. Haftada bir veya iki kez cilde uygulanan besleyici maskeler, kuru cildin nemlenmesine ve canlanmasına yardımcı olabilir. Bal, avokado veya yoğurt gibi besleyici içeriklere sahip maskeler, cildi besler ve nemlendirir. Son olarak, doğal yağlar da kuru ciltler için faydalı olabilir. Jojoba yağı, argan yağı, hindistancevizi yağı gibi doğal yağlar cildi besler ve nemlendirir. Bu yağları doğrudan cilde veya nemlendirici kremlerle birlikte kullanabilirsiniz. Tüm bu ürünleri kullanmadan önce, yeni bir ürünün cildinizde herhangi bir olumsuz reaksiyona neden olup olmadığını görmek için bir yama testi yapmak önemlidir. Bu adımları takip ederek, kuru cilt tipinize uygun bir cilt bakım rutini oluşturabilirsiniz.";
            } 
            
            else if (xhr.response === "normal") {
                result = "Normal Cilt Tipi";
                modalBody2 =
                    "Normal cilt tipine sahip olanlar için uygun bir cilt bakım rutini oluşturmak oldukça önemlidir. Normal cilt tipi, genellikle yağlı veya kuru cilt tiplerine kıyasla daha az sorun yaşar, ancak yine de cildin sağlığını korumak ve dengesini sürdürmek için belirli adımlar atılmalıdır. İlk olarak, hafif ve nazik temizleyiciler kullanılmalıdır. Bu temizleyiciler, cildi nazikçe temizlerken kurutmaz ve dengeler. Ardından, hafif nemlendiriciler tercih edilmelidir. Normal ciltler genellikle doğal olarak nemlidir, bu yüzden ağır nemlendiricilere ihtiyaç duymazlar. Hafif, su bazlı nemlendiriciler cildi nemlendirir ve dengede tutar. Güneş koruyucu kullanmak da önemlidir, çünkü normal cilt tipine sahip kişiler bile güneşin zararlı etkilerinden korunmalıdır. Geniş spektrumlu bir güneş koruyucu kullanmak cildi güneşin zararlı etkilerinden korur ve erken yaşlanmayı önler. Antioksidanlar da normal ciltler için faydalı olabilir. C vitamini, E vitamini ve yeşil çay özleri gibi antioksidan içeren ürünler cildin genel sağlığını destekler. Haftada bir veya iki kez hafif exfoliyantlar kullanmak, cildin pürüzsüz ve parlak kalmasına yardımcı olabilir. Ayrıca, haftada bir veya iki kez nem maskeleri uygulamak da cildi ekstra nemlendirebilir ve canlandırabilir. Son olarak, dengeli beslenme ve yeterli su tüketimi de normal cilt tipinin sağlığını korumak için önemlidir. Bol miktarda su içmek ve antioksidan açısından zengin gıdalar tüketmek cildin görünümünü iyileştirebilir. Bu adımları takip ederek, cildinizin sağlığını koruyabilir ve parlak bir görünüm elde edebilirsiniz.";
            } 
            
            else if (xhr.response === "oily") {
                result = "Yağlı Cilt Tipi";
                modalBody2 =
                    "Yağlı cilt tipi için uygun bir cilt bakım rutini oluşturmak önemlidir. İlk adım, hafif ve köpürmeyen temizleyiciler kullanmaktır. Bu tip temizleyiciler, fazla yağı nazikçe temizler ve gözenekleri tıkamadan cildi temizler. Ardından, nemlendirici kullanmak önemlidir. Yağlı ciltler genellikle fazla yağa rağmen nem ihtiyacı duyabilir, bu nedenle hafif, yağsız ve su bazlı nemlendiriciler tercih edilmelidir. Salisilik asit içeren ürünler, gözenekleri temizler, yağı kontrol altına alır ve sivilce oluşumunu önleyebilir. Haftada bir veya iki kez hafif exfoliyantlar kullanmak da önerilir; bu, ölü deri hücrelerini ve birikmiş yağı temizleyerek cildin daha pürüzsüz olmasını sağlar. Güneş koruyucu kullanmak da önemlidir; yağsız, hafif ve matlaştırıcı özelliklere sahip güneş koruyucular, cildi korurken aynı zamanda yağlanmayı önleyebilir. Makyaj ürünleri seçerken su bazlı ve matlaştırıcı özelliklere sahip ürünler tercih edilmelidir. Tüm bu ürünleri kullanmadan önce bir yama testi yapmak önemlidir, böylece cildinizin nasıl tepki verdiğini gözlemleyebilirsiniz. Bu adımları takip ederek, yağlı cilt tipinize uygun bir cilt bakım rutini oluşturabilirsiniz.";
            }

            else if (xhr.response === 'Birden fazla yüz tespit edildi. Lütfen sadece bir yüz içeren bir fotoğraf yükleyin.') {
                result = "-";
                modalBody2 =
                "Birden fazla yüz tespit edildi. Lütfen tek fotoğrafta tek yüz olacak şekilde yükleme yapınız.";
            }

            else if (xhr.response === 'Bu fotoğraf bir insan yüzü içermiyor.') {
                result = "-";
                modalBody2 =
                "Bu fotoğraf bir insan yüzü içermiyor. Lütfen insan yüzü içeren bir fotoğraf yükleyin.";
            }

            document.getElementById("predictionResult_dryNormalOily").innerHTML = result;
            document.getElementById("modalBody_dryNormalOily").innerHTML = modalBody2;
        } 
        
        else 
        {
            document.getElementById("status_dryNormalOily").innerHTML = "Dosya yüklenirken bir hata oluştu.";
        }
    };

    xhr.onerror = function () {
        // Sunucudan dönen hata mesajını alın
        var errorMessage =
            xhr.responseText || "Dosya yüklenirken bir hata oluştu.";
        // Hata mesajını gösterin
        document.getElementById("status2_dryNormalOily").innerHTML = errorMessage;
    };

    xhr.send(formData);
    fileInput2.files.clear();
}

function showFileUploadSection() {
    document.getElementById("fileUploadSection").style.display = "block";
    document
        .getElementById("container")
        .removeChild(document.querySelector("button.custom-button"));
}

function showSelectedFile() {
    var fileInput2 = document.getElementById("fileInput2");
    var selectedFileDiv = document.getElementById("selectedFile");
    var fileNameDiv = document.getElementById("fileName");
    var file = fileInput2.files[0];

    var fileName = file.name;
    fileNameDiv.innerText = "Dosya Adı: " + fileName;

    if (file.type.match("image.*")) {
        var reader = new FileReader();
        reader.onload = function (event) {
            var previewImage2 = selectedFileDiv.querySelector("img");
            previewImage2.src = event.target.result;
            selectedFileDiv.style.display = "block";
            document.getElementById("analyzeButton2").style.display = "block";
        };
        reader.readAsDataURL(file);
    } else {
        selectedFileDiv.style.display = "none";
        document.getElementById("analyzeButton2").style.display = "none";
    }
}

// function showCameraSection() {
//     document.getElementById("cameraSection").style.display = "block";
//     document
//         .getElementById("container")
//         .removeChild(document.querySelector("button.custom-button"));

//     var video = document.getElementById("videoElement2");

//     navigator.mediaDevices
//         .getUserMedia({ video: true })
//         .then(function (stream) {
//             video.srcObject = stream;
//             video.play();
//         })
//         .catch(function (err) {
//             console.error("Kamera erişim hatası: ", err);
//         });
// }

function captureSnapshot() {
    var video = document.getElementById("videoElement2");
    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    var dataUrl = canvas.toDataURL("image/jpeg");

    var previewImage2 = document.getElementById("previewImage2");
    previewImage2.src = dataUrl;
    document.getElementById("imageContainer2").style.display = "block";

    video.srcObject.getTracks().forEach(function (track) {
        track.stop();
    });
}

