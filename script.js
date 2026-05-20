document.addEventListener('DOMContentLoaded', () => {

    // ================= 1. ESKİ SİMÜLATÖR MOTORU (Aynen Korundu) =================
    const simToggle = document.getElementById('simToggle');
    const extWindow = document.getElementById('extWindow');
    const simTaranan = document.getElementById('simTaranan');
    const simGuvenli = document.getElementById('simGuvenli');
    const simKirli = document.getElementById('simKirli');
    const simSkor = document.getElementById('simSkor');

    let interval = null;
    let taranan = 0; let guvenli = 0; let kirli = 0;

    simToggle.addEventListener('change', () => {
        if(simToggle.checked) {
            extWindow.classList.add('active');
            interval = setInterval(() => {
                taranan += Math.floor(Math.random() * 3) + 1;
                if(Math.random() > 0.15) {
                    guvenli += taranan - (guvenli + kirli);
                } else {
                    kirli += taranan - (guvenli + kirli);
                }
                simTaranan.innerText = taranan;
                simGuvenli.innerText = guvenli;
                simKirli.innerText = kirli;
                simSkor.innerText = "%" + Math.round((guvenli / taranan) * 100);
            }, 1200);
        } else {
            extWindow.classList.remove('active');
            clearInterval(interval);
            taranan = 0; guvenli = 0; kirli = 0;
            simTaranan.innerText = 0; simGuvenli.innerText = 0; simKirli.innerText = 0;
            simSkor.innerText = "%100";
        }
    });

    // ================= 2. MODAL AÇMA / KAPAMA SİSTEMİ =================
    // Elementleri Seçelim
    const modalPrivacy = document.getElementById('modalPrivacy');
    const modalCookies = document.getElementById('modalCookies');
    const modalDownload = document.getElementById('modalDownload');
    const modalPayment = document.getElementById('modalPayment');

    // Tetikleyicileri Seçelim
    const btnPrivacy = document.getElementById('btnPrivacy');
    const btnCookies = document.getElementById('btnCookies');
    const downloadTriggers = document.querySelectorAll('.open-download-trigger');
    const paymentTriggers = document.querySelectorAll('.open-payment-trigger');

    // Kapatma Butonları
    const closePrivacy = document.getElementById('closePrivacy');
    const closeCookies = document.getElementById('closeCookies');
    const closeDownload = document.getElementById('closeDownload');
    const closePayment = document.getElementById('closePayment');

    // Gizlilik ve Çerez Modalları
    if(btnPrivacy) btnPrivacy.onclick = () => modalPrivacy.classList.add('open');
    if(closePrivacy) closePrivacy.onclick = () => modalPrivacy.classList.remove('open');
    if(btnCookies) btnCookies.onclick = () => modalCookies.classList.add('open');
    if(closeCookies) closeCookies.onclick = () => modalCookies.classList.remove('open');

    // İndirme Modalı Tetikleyicisi (Free Planı)
    downloadTriggers.forEach(btn => {
        btn.addEventListener('click', () => {
            modalDownload.classList.add('open');
        });
    });
    if(closeDownload) closeDownload.onclick = () => modalDownload.classList.remove('open');

    // Ödeme Modalı Tetikleyicisi (Premium Planlar)
    paymentTriggers.forEach(btn => {
        btn.addEventListener('click', () => {
            const planName = btn.getAttribute('data-plan');
            const planPrice = btn.getAttribute('data-price');
            
            document.getElementById('summaryPlanName').innerText = planName;
            document.getElementById('summaryPlanPrice').innerText = planPrice;
            
            modalPayment.classList.add('open');
        });
    });
    if(closePayment) closePayment.onclick = () => modalPayment.classList.remove('open');

    // Ortak Dış Alan Tıklanınca Kapanma Mantığı
    window.onclick = (e) => {
        if (e.target == modalPrivacy) modalPrivacy.classList.remove('open');
        if (e.target == modalCookies) modalCookies.classList.remove('open');
        if (e.target == modalDownload) modalDownload.classList.remove('open');
        if (e.target == modalPayment) modalPayment.classList.remove('open');
    }

    // ================= 3. ÖDEME VE KART MASKELEME MANTIĞI =================
    const cardNumberInput = document.getElementById('cardNumber');
    const cardExpiryInput = document.getElementById('cardExpiry');

    // Kart numarasını 4 karakterde bir boşluk bırakacak şekilde maskeleme
    if(cardNumberInput) {
        cardNumberInput.addEventListener('input', (e) => {
            let val = e.target.value.replace(/\D/g, '');
            let newVal = '';
            for(let i = 0; i < val.length; i++) {
                if(i > 0 && i % 4 === 0) newVal += ' ';
                newVal += val[i];
            }
            e.target.value = newVal;
        });
    }

    // Son kullanma tarihine otomatik "/" ekleme (AA/YY)
    if(cardExpiryInput) {
        cardExpiryInput.addEventListener('input', (e) => {
            let val = e.target.value.replace(/\D/g, '');
            if(val.length >= 2) {
                e.target.value = val.substring(0, 2) + '/' + val.substring(2, 4);
            } else {
                e.target.value = val;
            }
        });
    }

    // Ödeme Formu Gönderildiğinde Lisans Simülasyonu
    const creditCardForm = document.getElementById('credit-card-form');
    if(creditCardForm) {
        creditCardForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const selectedPlan = document.getElementById('summaryPlanName').innerText;
            
            alert(`🎉 Ödeme Başarılı!\n\nPure WARM Pro [${selectedPlan}] Planı Lisans Anahtarınız:\nWARM-PREMIUM-777X-999\n\nBu anahtarı indirdiğiniz eklentinin panelinden aktif edebilirsiniz!`);
            
            modalPayment.classList.remove('open');
            creditCardForm.reset();
        });
    }
});
