/* ============================================
   Shahmat Digital Business Card — Script
   ============================================ */

// ---- Register Service Worker ----
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}

// ---- vCard Download ----
function saveContact() {
  const vcard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'N:Petrovai;Robert;;;',
    'FN:Robert Petrovai',
    'ORG:Shahmat Analytics Ltd',
    'TITLE:Founder & CEO',
    'TEL;TYPE=CELL:+447760956961',
    'EMAIL;TYPE=INTERNET:robert@shahmat.io',
    'URL:https://shahmat.io',
    'NOTE:Play Smart. Analyze Smarter',
    'END:VCARD'
  ].join('\r\n');

  const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'Robert_Petrovai_Shahmat.vcf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  showToast('Contact saved!');
}

// ---- QR Code Generation ----
let qrGenerated = false;

function generateQR() {
  if (qrGenerated) return;
  const container = document.getElementById('qrCode');
  const cardUrl = window.location.href;

  // Use the embedded QR library
  if (typeof QRCode !== 'undefined') {
    new QRCode(container, {
      text: cardUrl,
      width: 200,
      height: 200,
      colorDark: '#0a1a1f',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.M
    });
    qrGenerated = true;
  }
}

// ---- Share / QR Overlay ----
function toggleQR() {
  const overlay = document.getElementById('qrOverlay');
  const isHidden = overlay.classList.contains('hidden');

  if (isHidden) {
    generateQR();
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  } else {
    overlay.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

// ---- Copy Link ----
function copyLink() {
  const url = window.location.href;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(() => {
      showToast('Link copied!');
    }).catch(() => {
      fallbackCopy(url);
    });
  } else {
    fallbackCopy(url);
  }
}

function fallbackCopy(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
  showToast('Link copied!');
}

// ---- Native Share ----
async function nativeShare() {
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Robert Petrovai | Shahmat Analytics',
        text: 'Check out my digital business card — Play Smart. Analyze Smarter',
        url: window.location.href
      });
    } catch (e) {
      // User cancelled or share failed — that's fine
    }
  }
}

// ---- Toast Notification ----
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}

// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
  // Save Contact button
  document.getElementById('saveContact').addEventListener('click', saveContact);

  // Share button — open QR overlay
  document.getElementById('shareCard').addEventListener('click', toggleQR);

  // Close QR overlay
  document.getElementById('closeQr').addEventListener('click', toggleQR);

  // Close QR on overlay background click
  document.getElementById('qrOverlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) toggleQR();
  });

  // Copy Link button
  document.getElementById('copyLink').addEventListener('click', copyLink);

  // Native Share button (only show if supported)
  const nativeShareBtn = document.getElementById('nativeShareBtn');
  if (navigator.share) {
    nativeShareBtn.style.display = 'flex';
    nativeShareBtn.addEventListener('click', nativeShare);
  } else {
    nativeShareBtn.style.display = 'none';
  }
});
