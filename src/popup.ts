import "./style.css";

const scanButton = document.querySelector<HTMLButtonElement>("#scan-button")!;
const status = document.querySelector<HTMLParagraphElement>("#status")!;
const language = document.querySelector<HTMLSelectElement>("#target-language")!;

chrome.storage.local.get({ targetLanguage: "tr" }, (data) => {
  language.value = data.targetLanguage;
});

language.addEventListener("change", () => {
  chrome.storage.local.set({ targetLanguage: language.value });
});

scanButton.addEventListener("click", async () => {
  status.textContent = "Sayfa taranıyor...";
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab.id) {
    status.textContent = "Aktif sekme bulunamadı.";
    return;
  }

  chrome.tabs.sendMessage(tab.id, {
    type: "MT_SCAN_PAGE",
    targetLanguage: language.value
  }, (response) => {
    if (chrome.runtime.lastError) {
      status.textContent = "Bu sayfaya erişilemedi. Sayfayı yenileyip tekrar dene.";
      return;
    }
    status.textContent = response?.message ?? "Tarama başlatıldı.";
  });
});