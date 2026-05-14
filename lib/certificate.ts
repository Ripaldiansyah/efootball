import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium-min";

export interface CertificateData {
  teamName: string;
  tournamentName: string;
  achievement: string;
  date?: string;
}

function getCertificateHTML(data: CertificateData): string {
  const date =
    data.date ??
    new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Lato:wght@300;400;700&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    width: 1123px;
    height: 794px;
    background: linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 40%, #0d1b2a 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Lato', sans-serif;
    overflow: hidden;
  }

  .certificate {
    width: 1050px;
    height: 730px;
    position: relative;

    border: 3px solid transparent;

    background:
      linear-gradient(135deg, #1a1a2e, #16213e) padding-box,
      linear-gradient(135deg, #f4c20d, #ff6b35, #7b2d8b, #1e90ff) border-box;

    border-radius: 20px;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    padding: 40px;
    overflow: hidden;
  }

  .bg-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.15;
  }

  .orb1 {
    width: 400px;
    height: 400px;
    background: #f4c20d;
    top: -100px;
    right: -100px;
  }

  .orb2 {
    width: 300px;
    height: 300px;
    background: #7b2d8b;
    bottom: -80px;
    left: -80px;
  }

  .orb3 {
    width: 250px;
    height: 250px;
    background: #1e90ff;
    bottom: 50px;
    right: 100px;
  }

  .corner {
    position: absolute;
    width: 60px;
    height: 60px;
  }

  .corner-tl {
    top: 20px;
    left: 20px;
    border-top: 3px solid #f4c20d;
    border-left: 3px solid #f4c20d;
  }

  .corner-tr {
    top: 20px;
    right: 20px;
    border-top: 3px solid #f4c20d;
    border-right: 3px solid #f4c20d;
  }

  .corner-bl {
    bottom: 20px;
    left: 20px;
    border-bottom: 3px solid #f4c20d;
    border-left: 3px solid #f4c20d;
  }

  .corner-br {
    bottom: 20px;
    right: 20px;
    border-bottom: 3px solid #f4c20d;
    border-right: 3px solid #f4c20d;
  }

  .badge {
    background: linear-gradient(135deg, #f4c20d, #ff6b35);
    border-radius: 50px;
    padding: 6px 24px;
    margin-bottom: 16px;

    font-size: 12px;
    font-weight: 700;
    letter-spacing: 4px;

    color: #0a0a1a;
    text-transform: uppercase;
  }

  .trophy {
    font-size: 64px;
    margin-bottom: 12px;
  }

  .cert-title {
    font-family: 'Cinzel', serif;
    font-size: 14px;
    letter-spacing: 6px;
    color: #a0a0c0;
    text-transform: uppercase;
    margin-bottom: 8px;
  }

  .cert-subtitle {
    font-family: 'Cinzel', serif;
    font-size: 48px;
    font-weight: 900;

    color: #ffffff;
    text-align: center;
    letter-spacing: 2px;
    line-height: 1.1;

    margin-bottom: 4px;

    background: linear-gradient(135deg, #ffffff, #e0d0ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .cert-of {
    font-family: 'Cinzel', serif;
    font-size: 16px;
    color: #8080a0;
    letter-spacing: 4px;
    margin-bottom: 28px;
  }

  .divider {
    width: 300px;
    height: 1px;

    background: linear-gradient(
      90deg,
      transparent,
      #f4c20d,
      transparent
    );

    margin: 16px auto;
  }

  .presented-to {
    font-size: 13px;
    letter-spacing: 3px;
    color: #8080a0;
    text-transform: uppercase;
    margin-bottom: 10px;
  }

  .team-name {
    font-family: 'Cinzel', serif;
    font-size: 42px;
    font-weight: 700;

    background: linear-gradient(135deg, #f4c20d, #ff6b35);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;

    text-align: center;
    margin-bottom: 6px;
  }

  .achievement-text {
    font-size: 18px;
    color: #c0c0e0;
    letter-spacing: 2px;
    margin-bottom: 24px;
    text-align: center;
  }

  .tournament-name {
    font-family: 'Cinzel', serif;
    font-size: 16px;
    color: #9090b0;
    letter-spacing: 2px;
    text-align: center;
    margin-bottom: 28px;
  }

  .footer-line {
    display: flex;
    align-items: center;
    gap: 20px;
    width: 100%;
    justify-content: center;
  }

  .seal {
    width: 60px;
    height: 60px;

    border: 2px solid #f4c20d;
    border-radius: 50%;

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 24px;
  }

  .footer-date {
    color: #707090;
    font-size: 12px;
    letter-spacing: 2px;
  }

  .stars {
    color: #f4c20d;
    font-size: 18px;
    letter-spacing: 6px;
    margin-bottom: 8px;
  }
</style>
</head>

<body>
<div class="certificate">

  <div class="bg-orb orb1"></div>
  <div class="bg-orb orb2"></div>
  <div class="bg-orb orb3"></div>

  <div class="corner corner-tl"></div>
  <div class="corner corner-tr"></div>
  <div class="corner corner-bl"></div>
  <div class="corner corner-br"></div>

  <div class="badge">eFootball Tournament</div>

  <div class="trophy">🏆</div>

  <div class="cert-title">Certificate</div>

  <div class="cert-subtitle">
    OF ACHIEVEMENT
  </div>

  <div class="divider"></div>

  <div class="presented-to">
    This certifies that
  </div>

  <div class="team-name">
    ${data.teamName}
  </div>

  <div class="achievement-text">
    ${data.achievement}
  </div>

  <div class="stars">★ ★ ★</div>

  <div class="tournament-name">
    ${data.tournamentName}
  </div>

  <div class="divider"></div>

  <div class="footer-line">
    <div class="seal">⚽</div>

    <div class="footer-date">
      ${date}
    </div>

    <div class="seal">🎮</div>
  </div>
</div>
</body>
</html>
`;
}

const CHROMIUM_URL =
  "https://github.com/Sparticuz/chromium/releases/download/v123.0.1/chromium-v123.0.1-pack.tar";

export async function generateCertificatePDF(
  data: CertificateData
): Promise<Buffer> {
  const isProduction = process.env.VERCEL === "1";

  let executablePath: string | undefined;
  let args: string[] = ["--no-sandbox", "--disable-setuid-sandbox"];

  if (isProduction) {
    // Dynamic import agar tidak di-bundle Next.js
    const chromium = await import("@sparticuz/chromium-min");
    executablePath = await chromium.default.executablePath(CHROMIUM_URL);
    args = chromium.default.args;
  }

  const browser = await puppeteer.launch({
    headless: true,
    args,
    executablePath,
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1123, height: 794, deviceScaleFactor: 2 });
    await page.setContent(getCertificateHTML(data), { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      width: "1123px",
      height: "794px",
      printBackground: true,
      preferCSSPageSize: true,
    });

    return Buffer.from(pdfBuffer);
  } finally {
    await browser.close();
  }
}
