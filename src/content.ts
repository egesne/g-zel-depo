import { createWorker } from "tesseract.js";

type ScanMessage = {
  type: "MT_SCAN_PAGE";
  targetLanguage?: string;
};

let active = false;

chrome.runtime.onMessage.addListener((message: ScanMessage, _sender, sendResponse) => {
  if (message.type !== "MT_SCAN_PAGE") return;
  if (active) {
    sendResponse({ message: "Tarama zaten devam ediyor." });
    return;
  }
  active = true;
  sendResponse({ message: "Görseller bulundu. OCR işlemi başlıyor..." });
  void scanImages(message.targetLanguage || "tr").finally(() => {
    active = false;
  });
  return true;
});

async function scanImages(targetLanguage: string): Promise<void> {
  const candidates = [...document.images];
  for (const image of candidates) {
    const lazySource =
      image.getAttribute("data-src") ||
      image.getAttribute("data-lazy-src") ||
      image.getAttribute("data-original") ||
      image.getAttribute("data-cfsrc");
    if (lazySource && (!image.currentSrc || image.currentSrc.startsWith("data:"))) {
      image.src = lazySource;
    }
    image.loading = "eager";
  }
  await Promise.all(candidates.map((image) => image.decode().catch(() => undefined)));
  const images = candidates.filter((img) =>
    img.complete && img.naturalWidth >= 180 && img.naturalHeight >= 180
  );

  if (!images.length) {
    showNotice("Bu sayfada çevrilebilir boyutta görsel bulunamadı.");
    return;
  }

  const worker = await createWorker("eng", 1, {
    workerPath: chrome.runtime.getURL("tesseract/worker.min.js"),
    corePath: chrome.runtime.getURL("tesseract/core/tesseract-core.wasm.js"),
    langPath: "https://tessdata.projectnaptha.com/4.0.0"
  });
  let completed = 0;

  try {
    for (const image of images) {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const context = canvas.getContext("2d");
        if (!context) continue;
        context.drawImage(image, 0, 0);

        const result = await worker.recognize(canvas);
        const sourceText = result.data.text.trim();
        if (!sourceText) continue;

        const translated = await translateText(sourceText, targetLanguage);
        addResultPanel(image, sourceText, translated);
        completed++;
      } catch (error) {
        console.warn("[Manga Translator] Görsel işlenemedi:", error);
      }
    }
  } finally {
    await worker.terminate();
  }

  showNotice(`Tarama tamamlandı. ${completed} görselde metin bulundu.`);
}

async function translateText(text: string, targetLanguage: string): Promise<string> {
  const url = new URL("https://api.mymemory.translated.net/get");
  url.searchParams.set("q", text.slice(0, 450));
  url.searchParams.set("langpair", `en|${targetLanguage}`);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Çeviri servisi: ${response.status}`);
  const data = await response.json() as { responseData?: { translatedText?: string } };
  return data.responseData?.translatedText || "Çeviri alınamadı.";
}

function addResultPanel(image: HTMLImageElement, original: string, translated: string): void {
  const existing = image.parentElement?.querySelector(":scope > .mt-result");
  existing?.remove();

  const panel = document.createElement("section");
  panel.className = "mt-result";
  panel.style.cssText = [
    "box-sizing:border-box", "margin:8px 0", "padding:12px",
    "border:1px solid #777", "border-radius:10px",
    "background:#171923", "color:#f4f4f5", "font:14px/1.5 Arial,sans-serif",
    "white-space:pre-wrap", "position:relative", "z-index:2147483000"
  ].join(";");

  const heading = document.createElement("strong");
  heading.textContent = "Türkçe çeviri";
  heading.style.display = "block";
  heading.style.marginBottom = "6px";

  const translatedText = document.createElement("div");
  translatedText.textContent = translated;

  const details = document.createElement("details");
  details.style.marginTop = "8px";
  const summary = document.createElement("summary");
  summary.textContent = "Algılanan metni göster";
  const originalText = document.createElement("div");
  originalText.textContent = original;
  originalText.style.marginTop = "6px";
  details.append(summary, originalText);

  panel.append(heading, translatedText, details);
  image.insertAdjacentElement("afterend", panel);
}

function showNotice(message: string): void {
  let notice = document.querySelector<HTMLDivElement>("#mt-notice");
  if (!notice) {
    notice = document.createElement("div");
    notice.id = "mt-notice";
    notice.style.cssText = "position:fixed;right:16px;bottom:16px;z-index:2147483647;max-width:340px;padding:12px 16px;border-radius:10px;background:#171923;color:white;font:14px Arial,sans-serif;box-shadow:0 4px 20px #0006";
    document.body.append(notice);
  }
  notice.textContent = message;
}