const API_URL = "https://api.freepik.com/v1/ai/text-to-image";

const apiKeyInput = document.getElementById("apiKey");
const referenceImageInput = document.getElementById("referenceImage");
const referencePreview = document.getElementById("referencePreview");
const aspectRatioInput = document.getElementById("aspectRatio");
const modelInput = document.getElementById("model");
const numImagesInput = document.getElementById("numImages");
const strengthInput = document.getElementById("strength");
const strengthValue = document.getElementById("strengthValue");
const promptInput = document.getElementById("prompt");
const generateBtn = document.getElementById("generateBtn");
const statusEl = document.getElementById("status");
const resultsEl = document.getElementById("results");
const modal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");

let imageReferenceDataUri = "";

strengthInput.addEventListener("input", () => {
  strengthValue.textContent = Number(strengthInput.value).toFixed(2);
});

referenceImageInput.addEventListener("change", async () => {
  const file = referenceImageInput.files?.[0];
  if (!file) {
    referencePreview.innerHTML = "";
    referencePreview.classList.add("hidden");
    imageReferenceDataUri = "";
    return;
  }

  imageReferenceDataUri = await fileToDataUri(file);
  referencePreview.innerHTML = `<img src="${imageReferenceDataUri}" alt="Vista previa de la referencia" />`;
  referencePreview.classList.remove("hidden");
});

generateBtn.addEventListener("click", async () => {
  resultsEl.innerHTML = "";

  const apiKey = apiKeyInput.value.trim();
  const prompt = promptInput.value.trim();

  if (!apiKey) {
    setStatus("Introduce tu API Key de Freepik.", true);
    return;
  }

  if (!imageReferenceDataUri) {
    setStatus("Sube primero una imagen de referencia.", true);
    return;
  }

  if (!prompt) {
    setStatus("Añade un prompt con el contexto creativo.", true);
    return;
  }

  const payload = {
    prompt,
    model: modelInput.value,
    aspect_ratio: aspectRatioInput.value,
    num_images: Number(numImagesInput.value),
    image_reference: imageReferenceDataUri,
    image_reference_strength: Number(strengthInput.value),
  };

  setLoading(true);
  setStatus("Generando imágenes con Freepik...", false);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || data?.error || "Error desconocido");
    }

    const images = extractImages(data);
    if (!images.length) {
      throw new Error(
        "La API respondió correctamente, pero no se encontraron imágenes en la respuesta."
      );
    }

    renderResults(images);
    setStatus(`Listo: ${images.length} imagen(es) generada(s).`, false);
  } catch (error) {
    setStatus(`No se pudo generar: ${error.message}`, true);
  } finally {
    setLoading(false);
  }
});

function extractImages(data) {
  if (Array.isArray(data?.data)) {
    return data.data
      .map((item) => item?.url || item?.image || item?.image_url)
      .filter(Boolean);
  }

  if (Array.isArray(data?.images)) {
    return data.images
      .map((item) => item?.url || item?.image || item?.image_url || item)
      .filter(Boolean);
  }

  return [];
}

function renderResults(images) {
  resultsEl.innerHTML = "";

  for (const [index, imageUrl] of images.entries()) {
    const card = document.createElement("article");
    card.className = "result-item";

    const img = document.createElement("img");
    img.src = imageUrl;
    img.alt = `Resultado ${index + 1}`;

    const actions = document.createElement("div");
    actions.className = "result-actions";

    const viewBtn = document.createElement("button");
    viewBtn.type = "button";
    viewBtn.textContent = "Ver";
    viewBtn.addEventListener("click", () => openInModal(imageUrl));

    const downloadLink = document.createElement("a");
    downloadLink.href = imageUrl;
    downloadLink.download = `freepik-result-${index + 1}.png`;
    downloadLink.target = "_blank";
    downloadLink.rel = "noopener noreferrer";
    downloadLink.textContent = "Descargar";

    actions.append(viewBtn, downloadLink);
    card.append(img, actions);
    resultsEl.appendChild(card);
  }
}

function openInModal(url) {
  modalImage.src = url;
  modal.showModal();
}

function setStatus(message, isError) {
  statusEl.textContent = message;
  statusEl.style.color = isError ? "#c1121f" : "#334155";
}

function setLoading(isLoading) {
  generateBtn.disabled = isLoading;
  generateBtn.textContent = isLoading ? "Generando..." : "Generar imágenes";
}

function fileToDataUri(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
