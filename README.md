# Manga Translator

Chrome Extension (Manifest V3) başlangıç projesi. Manga ve webtoon sayfalarındaki İngilizce metinleri OCR ile algılar ve çeviriyi görselin altında gösterir.

## Özellikler
- Açık sekmedeki büyük manga/webtoon görsellerini tarama
- `data-src`, `data-lazy-src`, `data-original` gibi lazy-load görsel alanlarını deneme
- Tesseract.js ile İngilizce OCR
- MyMemory API ile Türkçe veya İngilizce çeviri
- Bir sayfadaki görselleri sırayla işleme
- Orijinal OCR metnini açılır alanda gösterme
- Tesseract worker ve WASM dosyalarını uzantı paketine kopyalama

## Kurulum
1. Node.js 20 veya üzerini kur.
2. Depoyu bilgisayarına indir.
3. Proje klasöründe `npm install` çalıştır.
4. `npm run typecheck` ve `npm run build` çalıştır.
5. Chrome'da `chrome://extensions` adresini aç.
6. Geliştirici modunu etkinleştir.
7. **Paketlenmemiş öğe yükle** seçeneğiyle `dist` klasörünü seç.
8. Manga sayfasını yenile ve eklenti simgesinden taramayı başlat.

## Şu anki durum ve sınırlar
Bu, ilk kaynak kodu iskeletidir. GitHub üzerinde gerçek Chrome derlemesi veya Asura Scans uçtan uca testi henüz çalıştırılmadı; bu nedenle "tamamen çalışıyor" olarak kabul edilmemelidir.

- Görseli sayfanın altına yerleştirilen bir çeviri paneli vardır; görselin içindeki eski yazı henüz silinmez.
- Metin balonu algılama, arka planı onarma ve Türkçe metni balonun içine yeniden yerleştirme henüz yoktur.
- Bazı CDN'ler canvas erişimini CORS ile engelleyebilir. Asura Scans için gerçek test ve gerekirse uzantı background fetch katmanı gereklidir.
- Çok uzun dikey webtoon görselleri henüz parçalara ayrılmıyor.
- OCR şu an İngilizce dil modeliyle başlar.
- Çeviri servisi ücretsiz MyMemory uç noktasını kullanır; kalite ve istek sınırları değişebilir.

## Öncelikli geliştirme sırası
1. `npm install`, TypeScript kontrolü ve üretim derlemesini çalıştırıp hataları düzeltmek.
2. Asura Scans üzerinde görsel yükleme/CORS/lazy-load testleri yapmak.
3. Çok uzun webtoon görsellerini güvenli parçalara bölmek.
4. Metin balonu tespiti ve eski metin alanını temizleme.
5. Türkçe metni balona sığdırma, yazı tipi ve satır kırma.
6. Tarama önbelleği, ilerleme göstergesi ve iptal düğmesi.
