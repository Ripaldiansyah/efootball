import puppeteer from "puppeteer-core";

export interface CertificateData {
  teamName: string;
  tournamentName: string;
  achievement: string;
  date?: string;
}
function getBackgroundByAchievement(achievement: string): string {
  const backgrounds: Record<string, string> = {
    "Champion": "https://static.republika.co.id/uploads/member/images/news/large_FIF_Ae_World_Cup_2025_c243438c7f_1753310405.jpg",
    "Runner Up": "https://akcdn.detik.net.id/community/media/visual/2025/12/28/arsenal-1766863987489_169.jpeg?w=900&q=190",
    "3rd Place": "https://ik.imagekit.io/tvlk/blog/2025/03/shutterstock_2422694417-2.jpg?tr=q-70,c-at_max,w-1000,h-600",
    "Participant": "https://images.unsplash.com/photo-1542751371-adc38448a05e",
    "Noob Player": "https://plus.unsplash.com/premium_photo-1664299631876-f143dc691c4d?q=80&w=1297&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  };

  return backgrounds[achievement] ?? backgrounds["Participant"];
}
export function getCertificateHTML(data: CertificateData): string {
  const bgImage = getBackgroundByAchievement(data.achievement);
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
<meta charset="UTF-8" />
<title>eFootball Certificate</title>

<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    width: 1123px;
    height: 794px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Arial', sans-serif;
    background: #000;
  }

  .certificate {
    width: 1050px;
    height: 730px;
    position: relative;
    overflow: hidden;
    border-radius: 20px;

    background:
      linear-gradient(135deg, rgba(10,10,30,0.85), rgba(30,10,60,0.85)),
       url("${bgImage}") center/cover no-repeat;

    border: 3px solid rgba(255, 215, 0, 0.6);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    color: white;
    text-align: center;
    padding: 40px;
  }

  .glow {
    position: absolute;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(255,215,0,0.25), transparent 70%);
    top: -100px;
    right: -100px;
    filter: blur(30px);
  }

  .glow2 {
    position: absolute;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(0,150,255,0.25), transparent 70%);
    bottom: -80px;
    left: -80px;
    filter: blur(30px);
  }

  .badge {
    font-size: 14px;
    letter-spacing: 4px;
    color: #ffd700;
    margin-bottom: 10px;
  }

  .trophy {
    font-size: 60px;
    margin-bottom: 10px;
  }

  .title {
    font-size: 40px;
    font-weight: bold;
    letter-spacing: 2px;
    background: linear-gradient(90deg, #ffd700, #ff6b35);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 10px;
  }

  .subtitle {
    font-size: 16px;
    color: #ccc;
    margin-bottom: 30px;
  }

  .name {
    font-size: 48px;
    font-weight: bold;
    color: #fff;
    margin-bottom: 10px;
  }

  .desc {
    font-size: 18px;
    color: #ddd;
    margin-bottom: 20px;
  }

  .tournament {
    font-size: 16px;
    letter-spacing: 2px;
    color: #aaa;
    margin-bottom: 40px;
  }

  .footer {
    display: flex;
    justify-content: space-between;
    width: 80%;
    font-size: 14px;
    color: #bbb;
  }

  .line {
    width: 200px;
    height: 2px;
    background: linear-gradient(90deg, transparent, gold, transparent);
    margin: 20px 0;
  }
</style>
</head>

<body>

<div class="certificate">

  <div class="glow"></div>
  <div class="glow2"></div>

  <div class="badge">EFOOTBALL TOURNAMENT</div>
  <div class="trophy">🏆</div>

  <div class="title">CERTIFICATE</div>
  <div class="subtitle">OF ACHIEVEMENT</div>

  <div class="line"></div>

  <div class="desc">This is proudly presented to</div>

  <div class="name">${data.teamName}</div>

  <div class="desc">For outstanding performance as</div>

  <div class="name" style="font-size:28px;">
    ${data.achievement}
  </div>

  <div class="tournament">
    ${data.tournamentName}
  </div>

  <div class="footer">
    <div>${date}</div>
    
  </div>

</div>

</body>
</html>

`;
}

export async function generateCertificatePDF(
  data: CertificateData
): Promise<Buffer> {
  const isProduction = process.env.VERCEL === "1";

  const browser = isProduction
    ? await puppeteer.connect({
        browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.BLESS_TOKEN}`,
      })
    : await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1123, height: 794, deviceScaleFactor: 2 });
    await page.setContent(getCertificateHTML(data), {
      waitUntil: "domcontentloaded",
    });

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
