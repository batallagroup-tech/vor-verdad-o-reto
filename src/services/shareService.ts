import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';

/**
 * Generates an ultra-high quality promotional card (1080x1080 HD)
 * and shares it directly to WhatsApp, Instagram, Telegram, etc. using native Android Share Sheet.
 */
export async function generatePromoCardBase64(): Promise<string> {
  const canvas = document.createElement('canvas');
  const width = 1080;
  const height = 1080;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('Canvas 2D context not available');

  // 1. Dark Neon Background
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#0a0a0f');
  bgGrad.addColorStop(0.4, '#150818');
  bgGrad.addColorStop(1, '#050508');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Ambient Radial Glows
  const pinkGlow = ctx.createRadialGradient(260, 280, 20, 260, 280, 500);
  pinkGlow.addColorStop(0, 'rgba(236, 72, 153, 0.35)');
  pinkGlow.addColorStop(1, 'rgba(236, 72, 153, 0)');
  ctx.fillStyle = pinkGlow;
  ctx.fillRect(0, 0, width, height);

  const purpleGlow = ctx.createRadialGradient(820, 750, 20, 820, 750, 500);
  purpleGlow.addColorStop(0, 'rgba(168, 85, 247, 0.3)');
  purpleGlow.addColorStop(1, 'rgba(168, 85, 247, 0)');
  ctx.fillStyle = purpleGlow;
  ctx.fillRect(0, 0, width, height);

  // 3. Elegant Outer Frame
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 3;
  ctx.strokeRect(40, 40, width - 80, height - 80);

  // 4. Header Badge
  ctx.fillStyle = 'rgba(236, 72, 153, 0.15)';
  ctx.strokeStyle = 'rgba(236, 72, 153, 0.4)';
  ctx.lineWidth = 2;
  const topPillW = 440;
  const topPillH = 44;
  ctx.beginPath();
  ctx.roundRect((width - topPillW) / 2, 90, topPillW, topPillH, 22);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#f472b6';
  ctx.font = 'bold 20px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🔥 EL JUEGO DE FIESTA Y PAREJAS #1', width / 2, 119);

  // 5. Giant Glowing Logo: V O R
  ctx.font = '900 170px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  
  // 'V'
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
  ctx.shadowBlur = 30;
  ctx.fillText('V', width / 2 - 150, 285);

  // 'O' (Neon Pink)
  ctx.fillStyle = '#ec4899';
  ctx.shadowColor = 'rgba(236, 72, 153, 0.9)';
  ctx.shadowBlur = 60;
  ctx.fillText('O', width / 2, 285);

  // 'R'
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
  ctx.shadowBlur = 30;
  ctx.fillText('R', width / 2 + 150, 285);

  // Reset shadow
  ctx.shadowBlur = 0;

  // Title: VERDAD O RETO
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 46px system-ui, -apple-system, sans-serif';
  ctx.fillText('VERDAD O RETO', width / 2, 360);

  // Subtitle
  ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
  ctx.font = '600 24px system-ui, -apple-system, sans-serif';
  ctx.fillText('¡El juego definitivo para romper el hielo y subir la temperatura!', width / 2, 405);

  // 6. Highlight Feature Cards
  const features = [
    { icon: '🎭', title: '13 Modos de Juego', desc: 'Familia • Parejas • Amigos • Fiestas • +18 Extremo' },
    { icon: '🔞', title: '+3,600 Retos y Verdades', desc: 'Preguntas atrevidas, directas y sin censura' },
    { icon: '⚡', title: '100% Offline', desc: 'Juega en cualquier lugar sin necesidad de internet' },
    { icon: '🌶️', title: 'Intensidad Progresiva', desc: 'El juego se calienta solo conforme avanza la noche' }
  ];

  let startY = 460;
  features.forEach((feat, idx) => {
    const y = startY + idx * 102;
    const cardW = 760;
    const cardH = 82;
    const cardX = (width - cardW) / 2;

    // Card background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(cardX, y, cardW, cardH, 20);
    ctx.fill();
    ctx.stroke();

    // Icon circle
    ctx.fillStyle = 'rgba(236, 72, 153, 0.15)';
    ctx.beginPath();
    ctx.arc(cardX + 48, y + 41, 28, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = '28px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(feat.icon, cardX + 48, y + 50);

    // Titles
    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 24px system-ui, -apple-system, sans-serif';
    ctx.fillText(feat.title, cardX + 96, y + 36);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 19px system-ui, -apple-system, sans-serif';
    ctx.fillText(feat.desc, cardX + 96, y + 63);
  });

  // 7. Google Play Download Banner (Bottom Pill)
  const badgeY = 910;
  const badgeW = 620;
  const badgeH = 80;
  const badgeX = (width - badgeW) / 2;

  // Gradient button
  const btnGrad = ctx.createLinearGradient(badgeX, badgeY, badgeX + badgeW, badgeY + badgeH);
  btnGrad.addColorStop(0, '#ec4899');
  btnGrad.addColorStop(1, '#db2777');
  ctx.fillStyle = btnGrad;
  ctx.shadowColor = 'rgba(236, 72, 153, 0.5)';
  ctx.shadowBlur = 35;
  ctx.beginPath();
  ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 40);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Button text
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 26px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('▶ DISPONIBLE EN GOOGLE PLAY', width / 2, badgeY + 49);

  // Watermark
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.font = 'bold 15px system-ui, -apple-system, sans-serif';
  ctx.fillText('Desarrollado por Batalla Group • VOR', width / 2, 1025);

  const dataUrl = canvas.toDataURL('image/png');
  return dataUrl.replace(/^data:image\/png;base64,/, '');
}

/**
 * Executes direct native Android Share with image file attached
 */
export async function shareAppWithImage(): Promise<void> {
  const shareText = '¡Descarga Verdad o Reto (VOR) y juega las mejores partidas con tus amigos o en pareja! 🔥🍻\n\nDescárgala gratis en Google Play:\nhttps://play.google.com/store/apps/details?id=com.batallagroup.vor';

  try {
    const base64Data = await generatePromoCardBase64();

    // Write image to Cache directory
    const savedFile = await Filesystem.writeFile({
      path: 'vor_promocion.png',
      data: base64Data,
      directory: Directory.Cache
    });

    // Native Android Share Sheet with file
    await Share.share({
      title: 'VOR - Verdad o Reto',
      text: shareText,
      url: 'https://play.google.com/store/apps/details?id=com.batallagroup.vor',
      files: [savedFile.uri],
      dialogTitle: 'Compartir VOR con amigos'
    });
    return;
  } catch (error) {
    console.warn('Native file share error:', error);
  }

  // Fallback if files array is not handled by device:
  try {
    await Share.share({
      title: 'VOR - Verdad o Reto',
      text: shareText,
      url: 'https://play.google.com/store/apps/details?id=com.batallagroup.vor',
      dialogTitle: 'Compartir VOR con amigos'
    });
    return;
  } catch (_) {}

  // Final fallback: Web Share API
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'VOR - Verdad o Reto',
        text: shareText,
        url: 'https://play.google.com/store/apps/details?id=com.batallagroup.vor'
      });
    } catch (_) {}
  }
}
