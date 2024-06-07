// Dosya seçildiğinde işlem yapacak fonksiyon
function fileUploaded() {
    var fileInput = document.getElementById("fileInput");
    var analyzeButton = document.getElementById("analyzeBtn");

    // Dosya seçilip seçilmediğini kontrol et
    if (fileInput.files.length > 0) {
        console.log("Dosya secildi");
        analyzeButton.style.marginLeft = "32px";
        // Dosya seçildiyse cilt analizi butonunu göster
        analyzeButton.style.display = "block";
    } else {
        // Dosya seçilmediyse cilt analizi butonunu gizle
        analyzeButton.style.display = "none";
    }
}

const fileInput = document.getElementById("fileInput");
const imagePreview = document.getElementById("imagePreview");
const selectedImage = document.getElementById("selectedImage");

// Seçilen dosyanın görüntülenmesi için fonksiyon
function previewImage(event) {
    // Seçilen dosyayı al
    const file = event.target.files[0];

    // Dosya seçildiğini kontrol et
    if (file) {
        // FileReader nesnesi oluştur
        const reader = new FileReader();

        // FileReader onload olayını ayarla
        reader.onload = function () {
            // Seçilen görüntü öğesinin kaynağını seçilen dosyanın veri URL'sine ayarla
            selectedImage.src = reader.result;
        };

        // Seçilen dosyayı veri URL olarak oku
        reader.readAsDataURL(file);

        // Görüntü önizleme alanını göster
        imagePreview.style.display = "block";
    } else {
        // Dosya seçilmediyse görüntü önizleme alanını gizle
        imagePreview.style.display = "none";
    }
}

// Dosya girişi değişikliği olayı için olay dinleyici ekle
fileInput.addEventListener("change", previewImage);

// Kamera erişimini sağlar
navigator.mediaDevices
    .getUserMedia({ video: true })
    .then(function (stream) {
        var videoElement = document.getElementById("videoElement");
        videoElement.srcObject = stream;
    })
    .catch(function (error) {
        console.error("Kamera erişimi hatası: ", error);
    });

// Fotoğraf çekme işlemi
var captureButton = document.getElementById("captureButton");
captureButton.addEventListener("click", function () {
    var videoElement = document.getElementById("videoElement");
    var canvasElement = document.getElementById("canvasElement");
    var context = canvasElement.getContext("2d");

    // Video karesini canvas'a kopyala
    context.drawImage(
        videoElement,
        0,
        0,
        canvasElement.width,
        canvasElement.height
    );

    // Canvas'tan veri al ve Base64 formatında fotoğrafı al
    var imageDataURL = canvasElement.toDataURL("image/png");
    //  var jsonData = JSON.stringify({ "file": imageDataURL });
    //  console.log("Canvas element: " + canvasElement);
    //  // Burada alınan Base64 formatındaki fotoğrafı işleyebilir veya sunucuya gönderebilirsiniz.
    //  console.log("Image data url: " + imageDataURL);

    var formData = new FormData();
    var blob = dataURItoBlob(imageDataURL);
    // Blob nesnesini FormData'ya ekleyin
    formData.append("file", blob, "photo.png");
    formData.append("model", "acne_redness_bags");
    //formData.append('file', imageDataURL);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/predict", true);

    xhr.upload.onprogress = function (e) {
        if (e.lengthComputable) {
            var percentComplete = (e.loaded / e.total) * 100;
            document.getElementById("status2").innerHTML =
                percentComplete + "% yüklendi.";
        }
    };

    xhr.onload = function () {
        if (xhr.status === 200) {
            var result;
            var modalBody;
            if (xhr.response === "redness") {
                result = "Kızarık Cilt Tipi";
                modalBody =
                    "Kızarık cilt tipine sahip kişiler, cilt bakımında dikkatli ve özenli olmalıdır. Cildi temizlerken nazik temizleyiciler kullanmak önemlidir; özellikle SLS içermeyen ve düşük pH'lı ürünler tercih edilmelidir. Nemlendirici seçiminde hipoalerjenik ürünler kullanılmalı, parfüm ve alkol içermemelerine özen gösterilmelidir. Seramid ve hyaluronik asit içeren nemlendiriciler, cilt bariyerini güçlendirerek nemi hapseder. Aloe vera ve papatya ekstresi gibi yatıştırıcı içerikler de kızarıklığı hafifletmeye yardımcı olur. Güneş koruma için mineral bazlı güneş koruyucular tercih edilmelidir; çinko oksit veya titanyum dioksit içeren fiziksel güneş koruyucular, kimyasal olanlara göre daha az tahriş edicidir. Tedavi edici ürünlerde niacinamide, azelaik asit ve yeşil çay ekstresi gibi içerikler kızarıklığı ve tahrişi azaltabilir. Cildi ılık suyla yıkamak, aşırı sıcak veya soğuk sudan kaçınmak, yüzü nazikçe kurulamak ve fiziksel peeling yerine nazik kimyasal peeling tercih etmek de önemlidir. Centella asiatica (Cica), allantoin ve panthenol gibi içerikler ise cildi iyileştirir, yatıştırır ve nemlendirir.";
            } 
            
            else if (xhr.response === "acne") {
                result = "Akneli Cilt Tipi";
                modalBody =
                    "Akneye meyilli ciltler için uygun bir cilt bakım rutini oluşturmak, aknelerin kontrol altına alınmasına ve cildin genel sağlığının iyileştirilmesine yardımcı olabilir. Cildi temizlerken sabun içermeyen, nazik, su bazlı ve jel formundaki temizleyiciler tercih edilmelidir. Salisilik asit veya benzoil peroksit içeren temizleyiciler, gözenekleri temizleyerek akne oluşumunu azaltabilir. Tonik kullanımı da önemlidir; alkol içermeyen tonikler, salisilik asit, çay ağacı yağı veya niacinamide gibi içeriklerle fazla yağı dengeleyip gözeneklerin temizlenmesine yardımcı olur. Nemlendirici seçiminde, yağsız, su bazlı ve non-komedojenik ürünler kullanılmalıdır. Hyaluronik asit içeren nemlendiriciler, cildi nemlendirirken gözenekleri tıkamaz. Güneş koruyucu kullanmak da cildi UV ışınlarının zararlarından korur; yağsız ve non-komedojenik güneş koruyucular, SPF 30 veya üzeri koruma sağlayan ürünler tercih edilmelidir. Tedavi edici ürünler arasında salisilik asit, benzoil peroksit ve retinoidler bulunur. Salisilik asit gözenekleri temizler, benzoil peroksit antibakteriyel özelliğiyle akneye neden olan bakterileri öldürür ve retinoidler cilt hücresi yenilenmesini hızlandırarak gözeneklerin tıkanmasını önler. Ayrıca, çay ağacı yağı antibakteriyel özellikleriyle akne oluşumunu azaltırken, niacinamide anti-inflamatuar özellikleriyle kızarıklığı azaltır. Cildi nazikçe temizlemek, fazla ovalamaktan kaçınmak ve haftada bir veya iki kez yapılan kimyasal peelingler (AHA/BHA) cildin ölü hücrelerden arınmasına yardımcı olabilir. Yastık kılıflarını sık sık değiştirmek ve yüzü elle temas ettirmemek de akne oluşumunu azaltmada etkilidir. Bu önerileri dikkate alarak bir cilt bakım rutini oluşturmak, akneye meyilli ciltlerin bakımında etkili olabilir. Yeni ürünleri kullanmadan önce küçük bir bölgede deneme yapmak ve gerektiğinde dermatologdan profesyonel tavsiye almak önemlidir.";
            } 
            
            else if (xhr.response === "bags") {
                result = "Göz Torbalı Cilt Tipi";
                modalBody =
                    "Göz torbalarının azaltılması için çeşitli yöntemler mevcuttur. Öncelikle, yeterli uyku almak ve dinlenmek göz torbalarının azalmasına yardımcı olabilir. Geceleri 7-9 saat arası uyumak, cildin yenilenmesi ve dinlenmesi için önemlidir. Ayrıca, nemlendirici kullanımı da göz çevresindeki cildin elastikiyetini artırarak göz torbalarının görünümünü azaltabilir. Hyaluronik asit içeren göz kremleri veya jelleri, cildi nemlendirme açısından etkili olabilir. Soğuk kompres veya buz torbası uygulamak, göz çevresindeki şişlikleri ve torbaları geçici olarak azaltabilir. Buz torbasını bir beze sararak göz çevresine hafifçe bastırmak, bu etkiyi artırabilir. Beslenme ve hidrasyon da göz torbalarını azaltmada önemli bir rol oynar. Dengeli beslenme ve yeterli su tüketimi, cildin genel sağlığını destekler ve göz çevresindeki şişlikleri azaltabilir. UV ışınlarından korunma da göz torbalarını azaltmada önemlidir. Güneşin zararlı UV ışınlarına maruz kalmamak için güneş gözlüğü ve şapka gibi koruyucu önlemler almak önemlidir. Ayrıca, doğal yatıştırıcılar da göz torbalarını azaltmaya yardımcı olabilir. Aloe vera jeli veya yeşil çay poşetleri gibi doğal maddelerin soğutularak ve gözlerin üzerine uygulanması, göz çevresindeki şişlikleri azaltabilir. Son olarak, göz kremi veya jellerini hafifçe parmak uçlarıyla masaj yaparak uygulamak, dolaşımı artırabilir ve göz torbalarının azalmasına yardımcı olabilir. Göz torbaları sürekli bir sorun haline geldiğinde veya ani bir değişiklik gösterdiğinde, bir doktora veya dermatoloğa danışmak önemlidir.";
            }

            else if (xhr.response === 'Birden fazla yüz tespit edildi. Lütfen sadece bir yüz içeren bir fotoğraf yükleyin.') {
                result = "-";
                modalBody =
                "Birden fazla yüz tespit edildi. Lütfen tek fotoğrafta tek yüz olacak şekilde yükleme yapınız.";
            }

            else if (xhr.response === 'Bu fotoğraf bir insan yüzü içermiyor.') {
                result = "-";
                modalBody =
                "Bu fotoğraf bir insan yüzü içermiyor. Lütfen insan yüzü içeren bir fotoğraf yükleyin.";
            }

            document.getElementById("predictionResult2").innerHTML = result;
            document.getElementById("modalBody2").innerHTML = modalBody;
        } 
        
        else 
        {
            document.getElementById("status2").innerHTML = "Dosya yüklenirken bir hata oluştu.";
        }
    };

    xhr.onerror = function () {
        // Sunucudan dönen hata mesajını alın
        var errorMessage =
            xhr.responseText || "Dosya yüklenirken bir hata oluştu.";
        // Hata mesajını gösterin
        document.getElementById("status2").innerHTML = errorMessage;
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

function uploadFile() {
    var fileInput = document.getElementById("fileInput");
    var file = fileInput.files[0];
    var formData = new FormData();
    formData.append("file", file);
    formData.append("model", "acne_redness_bags");

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/predict", true);

    xhr.upload.onprogress = function (e) {
        if (e.lengthComputable) {
            var percentComplete = (e.loaded / e.total) * 100;
            document.getElementById("status").innerHTML =
                percentComplete + "% yüklendi.";
        }
    };

    xhr.onload = function () {
        if (xhr.status === 200) {
            var result;
            var modalBody;
            if (xhr.response === "redness") {
                result = "Kızarık Cilt Tipi";
                modalBody =
                    "Kızarık cilt tipine sahip kişiler, cilt bakımında dikkatli ve özenli olmalıdır. Cildi temizlerken nazik temizleyiciler kullanmak önemlidir; özellikle SLS içermeyen ve düşük pH'lı ürünler tercih edilmelidir. Nemlendirici seçiminde hipoalerjenik ürünler kullanılmalı, parfüm ve alkol içermemelerine özen gösterilmelidir. Seramid ve hyaluronik asit içeren nemlendiriciler, cilt bariyerini güçlendirerek nemi hapseder. Aloe vera ve papatya ekstresi gibi yatıştırıcı içerikler de kızarıklığı hafifletmeye yardımcı olur. Güneş koruma için mineral bazlı güneş koruyucular tercih edilmelidir; çinko oksit veya titanyum dioksit içeren fiziksel güneş koruyucular, kimyasal olanlara göre daha az tahriş edicidir. Tedavi edici ürünlerde niacinamide, azelaik asit ve yeşil çay ekstresi gibi içerikler kızarıklığı ve tahrişi azaltabilir. Cildi ılık suyla yıkamak, aşırı sıcak veya soğuk sudan kaçınmak, yüzü nazikçe kurulamak ve fiziksel peeling yerine nazik kimyasal peeling tercih etmek de önemlidir. Centella asiatica (Cica), allantoin ve panthenol gibi içerikler ise cildi iyileştirir, yatıştırır ve nemlendirir.";
            } 
            
            else if (xhr.response === "acne") {
                result = "Akneli Cilt Tipi";
                modalBody =
                    "Akneye meyilli ciltler için uygun bir cilt bakım rutini oluşturmak, aknelerin kontrol altına alınmasına ve cildin genel sağlığının iyileştirilmesine yardımcı olabilir. Cildi temizlerken sabun içermeyen, nazik, su bazlı ve jel formundaki temizleyiciler tercih edilmelidir. Salisilik asit veya benzoil peroksit içeren temizleyiciler, gözenekleri temizleyerek akne oluşumunu azaltabilir. Tonik kullanımı da önemlidir; alkol içermeyen tonikler, salisilik asit, çay ağacı yağı veya niacinamide gibi içeriklerle fazla yağı dengeleyip gözeneklerin temizlenmesine yardımcı olur. Nemlendirici seçiminde, yağsız, su bazlı ve non-komedojenik ürünler kullanılmalıdır. Hyaluronik asit içeren nemlendiriciler, cildi nemlendirirken gözenekleri tıkamaz. Güneş koruyucu kullanmak da cildi UV ışınlarının zararlarından korur; yağsız ve non-komedojenik güneş koruyucular, SPF 30 veya üzeri koruma sağlayan ürünler tercih edilmelidir. Tedavi edici ürünler arasında salisilik asit, benzoil peroksit ve retinoidler bulunur. Salisilik asit gözenekleri temizler, benzoil peroksit antibakteriyel özelliğiyle akneye neden olan bakterileri öldürür ve retinoidler cilt hücresi yenilenmesini hızlandırarak gözeneklerin tıkanmasını önler. Ayrıca, çay ağacı yağı antibakteriyel özellikleriyle akne oluşumunu azaltırken, niacinamide anti-inflamatuar özellikleriyle kızarıklığı azaltır. Cildi nazikçe temizlemek, fazla ovalamaktan kaçınmak ve haftada bir veya iki kez yapılan kimyasal peelingler (AHA/BHA) cildin ölü hücrelerden arınmasına yardımcı olabilir. Yastık kılıflarını sık sık değiştirmek ve yüzü elle temas ettirmemek de akne oluşumunu azaltmada etkilidir. Bu önerileri dikkate alarak bir cilt bakım rutini oluşturmak, akneye meyilli ciltlerin bakımında etkili olabilir. Yeni ürünleri kullanmadan önce küçük bir bölgede deneme yapmak ve gerektiğinde dermatologdan profesyonel tavsiye almak önemlidir.";
            }

            else if (xhr.response === "bags") {
                result = "Göz Torbalı Cilt Tipi";
                modalBody =
                    "Göz torbalarının azaltılması için çeşitli yöntemler mevcuttur. Öncelikle, yeterli uyku almak ve dinlenmek göz torbalarının azalmasına yardımcı olabilir. Geceleri 7-9 saat arası uyumak, cildin yenilenmesi ve dinlenmesi için önemlidir. Ayrıca, nemlendirici kullanımı da göz çevresindeki cildin elastikiyetini artırarak göz torbalarının görünümünü azaltabilir. Hyaluronik asit içeren göz kremleri veya jelleri, cildi nemlendirme açısından etkili olabilir. Soğuk kompres veya buz torbası uygulamak, göz çevresindeki şişlikleri ve torbaları geçici olarak azaltabilir. Buz torbasını bir beze sararak göz çevresine hafifçe bastırmak, bu etkiyi artırabilir. Beslenme ve hidrasyon da göz torbalarını azaltmada önemli bir rol oynar. Dengeli beslenme ve yeterli su tüketimi, cildin genel sağlığını destekler ve göz çevresindeki şişlikleri azaltabilir. UV ışınlarından korunma da göz torbalarını azaltmada önemlidir. Güneşin zararlı UV ışınlarına maruz kalmamak için güneş gözlüğü ve şapka gibi koruyucu önlemler almak önemlidir. Ayrıca, doğal yatıştırıcılar da göz torbalarını azaltmaya yardımcı olabilir. Aloe vera jeli veya yeşil çay poşetleri gibi doğal maddelerin soğutularak ve gözlerin üzerine uygulanması, göz çevresindeki şişlikleri azaltabilir. Son olarak, göz kremi veya jellerini hafifçe parmak uçlarıyla masaj yaparak uygulamak, dolaşımı artırabilir ve göz torbalarının azalmasına yardımcı olabilir. Göz torbaları sürekli bir sorun haline geldiğinde veya ani bir değişiklik gösterdiğinde, bir doktora veya dermatoloğa danışmak önemlidir.";
            }

            else if (xhr.response === 'Birden fazla yüz tespit edildi. Lütfen sadece bir yüz içeren bir fotoğraf yükleyin.') {
                result = "-";
                modalBody =
                "Birden fazla yüz tespit edildi. Lütfen tek fotoğrafta tek yüz olacak şekilde yükleme yapınız.";
            }

            else if (xhr.response === 'Bu fotoğraf bir insan yüzü içermiyor.') {
                result = "-";
                modalBody =
                "Bu fotoğraf bir insan yüzü içermiyor. Lütfen insan yüzü içeren bir fotoğraf yükleyin.";
            }

            document.getElementById("predictionResult").innerHTML = result;
            document.getElementById("modalBody").innerHTML = modalBody;
        } 
        
        else
        {
            document.getElementById("status").innerHTML = "Dosya yüklenirken bir hata oluştu.";
        }
    };

    xhr.onerror = function () {
        // Sunucudan dönen hata mesajını alın
        var errorMessage =
            xhr.responseText || "Dosya yüklenirken bir hata oluştu.";
        // Hata mesajını gösterin
        document.getElementById("status2").innerHTML = errorMessage;
    };

    xhr.send(formData);
    fileInput.files.clear();
}

function showFileUploadSection() {
    document.getElementById("fileUploadSection").style.display = "block";
    document
        .getElementById("container")
        .removeChild(document.querySelector("button.custom-button"));
}

function showSelectedFile() {
    var fileInput = document.getElementById("fileInput");
    var selectedFileDiv = document.getElementById("selectedFile");
    var fileNameDiv = document.getElementById("fileName");
    var file = fileInput.files[0];

    var fileName = file.name;
    fileNameDiv.innerText = "Dosya Adı: " + fileName;

    if (file.type.match("image.*")) {
        var reader = new FileReader();
        reader.onload = function (event) {
            var previewImage = selectedFileDiv.querySelector("img");
            previewImage.src = event.target.result;
            selectedFileDiv.style.display = "block";
            document.getElementById("analyzeButton").style.display = "block";
        };
        reader.readAsDataURL(file);
    } else {
        selectedFileDiv.style.display = "none";
        document.getElementById("analyzeButton").style.display = "none";
    }
}

function showCameraSection() {
    document.getElementById("cameraSection").style.display = "block";
    document
        .getElementById("container")
        .removeChild(document.querySelector("button.custom-button"));

    var video = document.getElementById("videoElement");

    navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(function (stream) {
            video.srcObject = stream;
            video.play();
        })
        .catch(function (err) {
            console.error("Kamera erişim hatası: ", err);
        });
}

function captureSnapshot() {
    var video = document.getElementById("videoElement");
    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    var dataUrl = canvas.toDataURL("image/jpeg");

    var previewImage = document.getElementById("previewImage");
    previewImage.src = dataUrl;
    document.getElementById("imageContainer").style.display = "block";

    video.srcObject.getTracks().forEach(function (track) {
        track.stop();
    });
}
