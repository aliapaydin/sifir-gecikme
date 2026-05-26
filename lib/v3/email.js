import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = 'Sıfır Gecikme <noreply@sifirgecikme.com>';

function baseLayout(content) {
  return `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Sıfır Gecikme</title>
</head>
<body style="margin:0;padding:0;background:#0d1421;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0d1421;padding:40px 16px;">
<tr><td align="center">
<table width="100%" style="max-width:560px;">

  <!-- Logo header -->
  <tr><td style="padding-bottom:24px;text-align:center;">
    <a href="https://www.sifirgecikme.com/v3" style="text-decoration:none;font-size:22px;font-weight:800;background:linear-gradient(135deg,#6366f1,#8b5cf6,#14b8a6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;color:#6366f1;">◈ Sıfır Gecikme v3</a>
  </td></tr>

  <!-- Main card -->
  <tr><td style="background:#111827;border:1px solid #1e293b;border-radius:20px;overflow:hidden;">
    ${content}
  </td></tr>

  <!-- Footer -->
  <tr><td style="padding-top:24px;text-align:center;font-size:12px;color:#334155;line-height:1.6;">
    Türkçe veri bilimi platformu · Tüm içerikler ücretsiz<br/>
    <a href="https://www.sifirgecikme.com/v3" style="color:#4f46e5;text-decoration:none;">sifirgecikme.com</a>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

function ctaButton(href, text, gradient = 'linear-gradient(135deg,#6366f1,#8b5cf6)') {
  return `<table cellpadding="0" cellspacing="0" style="margin:24px auto 0;">
<tr><td style="border-radius:12px;background:${gradient};">
  <a href="${href}" style="display:block;padding:14px 32px;font-size:15px;font-weight:700;color:#fff;text-decoration:none;letter-spacing:0.01em;">${text}</a>
</td></tr>
</table>`;
}

function sectionCard(icon, title, desc, link, linkText) {
  return `<table width="100%" cellpadding="0" cellspacing="0" style="background:#1a2332;border:1px solid #1e293b;border-radius:12px;margin-bottom:10px;">
<tr>
  <td style="padding:14px 16px;width:40px;vertical-align:top;font-size:20px;line-height:1;">${icon}</td>
  <td style="padding:14px 12px 14px 0;vertical-align:top;">
    <div style="font-size:13px;font-weight:700;color:#f1f5f9;margin-bottom:3px;">${title}</div>
    <div style="font-size:12px;color:#64748b;line-height:1.5;">${desc}</div>
    <a href="${link}" style="display:inline-block;margin-top:6px;font-size:11px;font-weight:600;color:#818cf8;text-decoration:none;">${linkText} →</a>
  </td>
</tr>
</table>`;
}

export async function sendVerificationEmail({ to, name, token, origin }) {
  const verifyUrl = `${origin}/v3/dogrula?token=${token}`;

  const content = `
    <!-- Gradient bar -->
    <tr><td style="height:4px;background:linear-gradient(90deg,#6366f1,#8b5cf6,#14b8a6);"></td></tr>

    <!-- Hero -->
    <tr><td style="padding:36px 36px 0;text-align:center;">
      <div style="font-size:40px;margin-bottom:16px;">🎉</div>
      <h1 style="margin:0 0 12px;font-size:24px;font-weight:800;color:#f1f5f9;line-height:1.2;">Hoş geldin, ${name}!</h1>
      <p style="margin:0;font-size:15px;color:#64748b;line-height:1.6;">
        Sıfır Gecikme v3'e kayıt olduğun için teşekkürler.<br/>Hesabını aktifleştirmek için e-postanı doğrula.
      </p>
      ${ctaButton(verifyUrl, '✉ E-postamı Doğrula')}
      <p style="margin:16px 0 0;font-size:12px;color:#334155;">Bu link 24 saat geçerlidir.</p>
    </td></tr>

    <!-- Divider -->
    <tr><td style="padding:28px 36px 20px;"><div style="height:1px;background:#1e293b;"></div></td></tr>

    <!-- What's waiting -->
    <tr><td style="padding:0 36px 8px;">
      <p style="margin:0 0 16px;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#475569;">Seni neler bekliyor</p>
      ${sectionCard('🐍', 'Python Playground', 'Tarayıcıda gerçek Python — Pyodide ile kurulum yok, anında çalıştır.', `${origin}/v3/python`, 'Playground\'a git')}
      ${sectionCard('📚', 'Öğrenme Modülü', '20 ders, 315 XP · Python, NumPy, Pandas, İstatistik — Türkçe ve ücretsiz.', `${origin}/v3/ogren`, 'Öğrenmeye başla')}
      ${sectionCard('🗄️', 'SQL Playground', '3 farklı veritabanı, şema gezgini — tarayıcıda SQLite, kurulum yok.', `${origin}/v3/sql`, 'SQL\'i dene')}
      ${sectionCard('🤖', 'Kalori AI', 'Fotoğrafından kalori tahmini — Gemini Vision ile anlık analiz.', `${origin}/v3/kalori`, 'Dene')}
      ${sectionCard('🖥️', 'Tech Center', 'Sanal bilgisayar mağazası simülasyonu — müşteri, stok, kredi sistemi.', `${origin}/v3/tech-center`, 'Oyna')}
    </td></tr>

    <!-- İlerleme takibi -->
    <tr><td style="padding:0 36px 36px;">
      <div style="height:1px;background:#1e293b;margin-bottom:20px;"></div>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td width="33%" style="text-align:center;padding:0 8px;">
            <div style="font-size:20px;font-weight:800;color:#818cf8;">20</div>
            <div style="font-size:11px;color:#475569;margin-top:2px;">İnteraktif Ders</div>
          </td>
          <td width="33%" style="text-align:center;padding:0 8px;border-left:1px solid #1e293b;border-right:1px solid #1e293b;">
            <div style="font-size:20px;font-weight:800;color:#2dd4bf;">25+</div>
            <div style="font-size:11px;color:#475569;margin-top:2px;">İçerik & Demo</div>
          </td>
          <td width="33%" style="text-align:center;padding:0 8px;">
            <div style="font-size:20px;font-weight:800;color:#fbbf24;">12</div>
            <div style="font-size:11px;color:#475569;margin-top:2px;">Araç & Modül</div>
          </td>
        </tr>
      </table>
    </td></tr>
  `;

  return resend.emails.send({
    from: FROM,
    to,
    subject: '✉ E-postanı doğrula — Sıfır Gecikme v3',
    html: baseLayout(content),
  });
}

export async function sendPasswordResetEmail({ to, name, token, origin }) {
  const resetUrl = `${origin}/v3/sifre-sifirla?token=${token}`;

  const content = `
    <!-- Gradient bar -->
    <tr><td style="height:4px;background:linear-gradient(90deg,#6366f1,#8b5cf6,#14b8a6);"></td></tr>

    <!-- Hero -->
    <tr><td style="padding:40px 36px 0;text-align:center;">
      <div style="font-size:40px;margin-bottom:16px;">🔑</div>
      <h1 style="margin:0 0 12px;font-size:22px;font-weight:800;color:#f1f5f9;">Şifre Sıfırlama</h1>
      <p style="margin:0;font-size:15px;color:#64748b;line-height:1.6;">
        Merhaba ${name},<br/>Şifreni sıfırlamak için aşağıdaki butona tıkla.
      </p>
      ${ctaButton(resetUrl, '🔑 Yeni Şifre Belirle', 'linear-gradient(135deg,#6366f1,#8b5cf6)')}
    </td></tr>

    <!-- Uyarı -->
    <tr><td style="padding:28px 36px 40px;">
      <div style="height:1px;background:#1e293b;margin-bottom:20px;"></div>
      <div style="background:#1a2332;border:1px solid #1e293b;border-radius:10px;padding:14px 16px;">
        <p style="margin:0 0 6px;font-size:12px;font-weight:700;color:#475569;text-transform:uppercase;letter-spacing:0.05em;">Güvenlik notu</p>
        <p style="margin:0;font-size:13px;color:#475569;line-height:1.6;">
          • Bu link <strong style="color:#64748b;">1 saat</strong> geçerlidir.<br/>
          • Eğer şifre sıfırlama talebinde bulunmadıysan bu e-postayı yoksay.<br/>
          • Hesabın güvende kalacaktır.
        </p>
      </div>
      <p style="margin:16px 0 0;font-size:11px;color:#334155;text-align:center;">
        Butona tıklanamıyorsa bu linki kopyala:<br/>
        <a href="${resetUrl}" style="color:#4f46e5;word-break:break-all;font-size:11px;">${resetUrl}</a>
      </p>
    </td></tr>
  `;

  return resend.emails.send({
    from: FROM,
    to,
    subject: '🔑 Şifre sıfırlama — Sıfır Gecikme v3',
    html: baseLayout(content),
  });
}
