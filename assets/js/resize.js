const upload = document.getElementById("upload");
const uploadBtn = document.getElementById("uploadBtn");
const uploadBox = document.getElementById("uploadBox");
const changeBtn = document.getElementById("changeBtn");
const dropZone = document.getElementById("dropZone");

const imageContainer = document.getElementById("imageContainer");
const previewImg = document.getElementById("previewImg");
const deleteBtn = document.getElementById("deleteBtn");

const resizeBtn = document.getElementById("resizeBtn");
const sizeSelect = document.getElementById("sizeSelect");
const errorMsg = document.getElementById("errorMsg");

const loading = document.getElementById("loading");
const result = document.getElementById("result");
const origSize = document.getElementById("origSize");
const newSize = document.getElementById("newSize");
const download = document.getElementById("download");

const dragOverlay = document.getElementById("dragOverlay");

let imageFile = null;
let dragCounter = 0;

/* Initial state */
imageContainer.style.display = "none";
uploadBox.style.display = "block";

/* Upload */
uploadBtn.onclick = () => upload.click();
changeBtn.onclick = () => upload.click();

document.addEventListener("DOMContentLoaded", () => {
  const sizeSelect = document.getElementById("sizeSelect");
  const defaultSize = document.body.getAttribute("data-default-size");

  if (sizeSelect && defaultSize) {
    sizeSelect.value = defaultSize;
  }
});

upload.onchange = () => {
  if (!upload.files[0]) return;
  handleFile(upload.files[0]);
};

function handleFile(file){
  if (!file.type.startsWith("image/")) return;

  imageFile = file;
  errorMsg.style.display = "none";

  origSize.textContent = Math.round(file.size / 1024);
  previewImg.src = URL.createObjectURL(file);

  uploadBox.style.display = "none";
  imageContainer.style.display = "flex";
}

/* Delete */
deleteBtn.onclick = () => {
  imageFile = null;
  upload.value = "";
  imageContainer.style.display = "none";
  uploadBox.style.display = "block";
  result.style.display = "none";
};

/* Resize */
resizeBtn.onclick = () => {
  if (!imageFile) {
    errorMsg.style.display = "block";
    return;
  }

  loading.style.display = "block";
  result.style.display = "none";

  const targetKB = parseInt(sizeSelect.value,10);
  const img = new Image();
  const reader = new FileReader();

  reader.onload = e => img.src = e.target.result;
  reader.readAsDataURL(imageFile);

  img.onload = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    let w = img.width;
    let h = img.height;
    let q = 0.9;

    function loop(){
      canvas.width = w;
      canvas.height = h;
      ctx.drawImage(img,0,0,w,h);

      const data = canvas.toDataURL("image/jpeg",q);
      const kb = Math.round((data.length*3)/4/1024);

      if (kb <= targetKB || q <= 0.05) {
        newSize.textContent = kb;
        download.href = data;
        loading.style.display = "none";
        result.style.display = "block";
        return;
      }

      if (w > 500) {
        w *= 0.85; h *= 0.85;
      } else {
        q -= 0.05;
      }

      setTimeout(loop,30);
    }
    loop();
  };
};

/* GLOBAL DRAG & DROP (ANYWHERE) */
document.addEventListener("dragover", e => e.preventDefault());

document.addEventListener("drop", e => {
  e.preventDefault();
  if (!e.dataTransfer || !e.dataTransfer.files.length) return;
  const file = e.dataTransfer.files[0];
  if (!file.type.startsWith("image/")) return;
  handleFile(file);
});

/* DRAG OVERLAY FIX */
document.addEventListener("dragenter", e => {
  if (!e.dataTransfer || !e.dataTransfer.types.includes("Files")) return;
  dragCounter++;
  dragOverlay.style.display = "flex";



    
});

document.addEventListener("dragleave", () => {
  dragCounter--;
  if (dragCounter <= 0) {
    dragCounter = 0;
    dragOverlay.style.display = "none";
  }
});

document.addEventListener("drop", () => {
  dragCounter = 0;
  dragOverlay.style.display = "none";
});
