const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { OpenAI } = require('openai');
const axios = require('axios'); 
const Jimp = require('jimp'); 
const fs = require('fs');
const path = require('path');
const express = require('express');

// =====================================================================
// SERVER ANTI-TIDUR (BUAT UPTIMEROBOT)
// =====================================================================
const app = express();
app.get('/', (req, res) => res.send('Nadiaa V2.52 Utility Mode is ONLINE! 😎🔥'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🌐 Server Anti-Tidur jalan di port ${PORT}`));

// =====================================================================
// FITUR SMART CLEANER
// =====================================================================
const cachePath = path.join(__dirname, '.wwebjs_cache');
if (fs.existsSync(cachePath)) {
    try {
        fs.rmSync(cachePath, { recursive: true, force: true });
        console.log('🧹 [SYSTEM] Cache sampah berhasil disapu bersih!');
    } catch (err) {}
}

// =====================================================================
// KONFIGURASI SENSITIF (VIA ENVIRONMENT VARIABLES)
// =====================================================================
const BOS_NUMBER = process.env.BOS_NUMBER; // Masukkan nomor HP lu di Secrets

// --- FITUR ROTASI API KEY (Ambil dari Environment) ---
const listApiKey = [
    { type: 'gemini', key: process.env.GEMINI_KEY_1 }, 
    { type: 'gemini', key: process.env.GEMINI_KEY_2 },
    { type: 'gemini', key: process.env.GEMINI_KEY_3 },
    { type: 'gemini', key: process.env.GEMINI_KEY_4 },
    { type: 'gemini', key: process.env.GEMINI_KEY_5 },
    { type: 'openai', key: process.env.OPENAI_KEY_1 },
    { type: 'openai', key: process.env.OPENAI_KEY_2 },
    { type: 'openai', key: process.env.OPENAI_KEY_3 }
];

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        executablePath: '/data/data/com.termux/files/usr/bin/chromium-browser',
        args: [
            '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas', '--no-first-run', '--no-zygote',
            '--single-process', '--disable-gpu'
        ]
    }
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('\n🤖 SCAN QR CODE DULU CUYY!');
});

client.on('ready', () => {
    console.log('✅ HORE! Bot Nadiaa V2.52 (Secure Utility) SIAP!');
});

client.on('message_create', async msg => {
    if (msg.isStatus || msg.from === 'status@broadcast') return;
    if (msg.from.includes('newsletter') || msg.to.includes('newsletter')) return;

    const chat = await msg.getChat();
    const lawanBicara = msg.fromMe ? msg.to : msg.from;
    const textAsli = msg.body || "";
    const textLower = textAsli.toLowerCase();

    // HAK AKSES KHUSUS BOS OZI (FITUR DEWA) - SEKARANG PAKE BOS_NUMBER
    const isBosOzi = msg.fromMe || msg.from.includes(BOS_NUMBER) || (msg.author && msg.author.includes(BOS_NUMBER));

    if (textLower === '.menu') {
        if (!isBosOzi) return; 
        const teksMenu = `╭━━━〔 *NADIAA V2.52 UTILITY* 〕━━━
┃ 👑 *Akses:* Eksklusif Bos Ozi
╰━━━━━━━━━━━━━━━━━━━━

🤖 *A.I ASSISTANT*
├ *.ai [pertanyaan]* ➪ Tanya AI murni (coding, ide, dll)
└ *.baca* ➪ (Reply Foto) Ekstrak teks dari gambar (OCR)

🎨 *STUDIO STIKER*
├ *.s* ➪ (Reply Foto) Stiker transparan
├ *.t [teks]* ➪ (Reply Foto) Stiker meme
├ *.st [teks]* ➪ Stiker teks burik
└ *.tofoto* ➪ (Reply Stiker) Jadi foto mentah

🕵️‍♂️ *TOOLS HACKER*
├ *.vt [link]* ➪ Download TikTok (Silent)
└ *.h [pesan]* ➪ Ghost Tag 1 grup (Bikin HP getar tanpa nama)

_Sistem bersih. Data sensitif tersembunyi._ 😎`;
        await client.sendMessage(lawanBicara, teksMenu);
        return;
    }

    // --- ALAT BARU: JARVIS AI MURNI (.ai) ---
    if (textLower.startsWith('.ai ')) {
        if (!isBosOzi) return;
        const pertanyaan = textAsli.substring(4).trim();
        if (!pertanyaan) return;

        let berhasil = false;
        let totalPercobaan = 0;
        
        while (!berhasil && totalPercobaan < listApiKey.length) {
            try {
                const currentAPI = listApiKey[totalPercobaan];
                if (!currentAPI.key) { totalPercobaan++; continue; } // Lewati kalau key kosong

                let balasan = "";
                const systemPrompt = "Kamu adalah asisten AI yang cerdas. Jawab pertanyaan dengan singkat, padat, jelas, dan akurat. Dilarang keras mengeluarkan tag <think> atau proses berpikir.";

                if (currentAPI.type === 'gemini') {
                    const genAI = new GoogleGenerativeAI(currentAPI.key);
                    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash', systemInstruction: systemPrompt });
                    const result = await model.generateContent(pertanyaan);
                    balasan = result.response.text().trim();
                } else if (currentAPI.type === 'openai') {
                    const openai = new OpenAI({ apiKey: currentAPI.key });
                    const completion = await openai.chat.completions.create({ 
                        model: "gpt-3.5-turbo", 
                        messages: [
                            { role: "system", content: systemPrompt },
                            { role: "user", content: pertanyaan }
                        ] 
                    });
                    balasan = completion.choices[0].message.content.trim();
                }

                balasan = balasan.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
                await msg.reply(`🤖 *Nadiaa AI:*\n\n${balasan}`);
                berhasil = true;
            } catch (error) {
                totalPercobaan++;
            }
        }
        if (!berhasil) await msg.reply("⚠️ Waduh bos, semua API lagi gangguan nih.");
        return;
    }

    // --- ALAT 1: KEMBALIKAN STIKER JADI FOTO ---
    if (textLower === '.tofoto' || textLower === '.toimg') {
        if (!isBosOzi) return;
        const targetMsg = msg.hasQuotedMsg ? await msg.getQuotedMessage() : null;
        if (targetMsg && targetMsg.hasMedia) {
            try {
                const media = await targetMsg.downloadMedia();
                if (media && media.mimetype.includes('image')) {
                    await client.sendMessage(lawanBicara, media);
                }
            } catch (error) {}
        }
        return;
    }

    // --- ALAT 2: GHOST TAG / INVISIBLE MENTION (.h) ---
    if (textLower.startsWith('.h ')) {
        if (!isBosOzi) return;
        if (!chat.isGroup) return;
        const pesanHantu = textAsli.substring(3).trim(); 
        if (!pesanHantu) return;
        try {
            let mentionsArray = [];
            for (let participant of chat.participants) {
                const contactGroup = await client.getContactById(participant.id._serialized);
                mentionsArray.push(contactGroup);
            }
            await client.sendMessage(lawanBicara, pesanHantu, { mentions: mentionsArray });
        } catch (error) {}
        return;
    }

    // --- ALAT 3: MATA ELANG / OCR Teks (.baca) ---
    if (textLower === '.baca') {
        if (!isBosOzi) return;
        const targetMsg = msg.hasQuotedMsg ? await msg.getQuotedMessage() : msg;
        if (targetMsg.hasMedia) {
            try {
                const media = await targetMsg.downloadMedia();
                if (media && media.mimetype.includes('image')) {
                    let resultText = "";
                    for (let api of listApiKey) {
                        if (api.type === 'gemini' && api.key) {
                            try {
                                const genAI = new GoogleGenerativeAI(api.key);
                                const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
                                const prompt = "Ekstrak dan salin semua teks yang ada di dalam gambar ini. Jangan tambahkan kata-kata penjelasan, murni salin teksnya saja persis seperti di gambar.";
                                const imageParts = { inlineData: { data: media.data, mimeType: media.mimetype } };
                                const result = await model.generateContent([prompt, imageParts]);
                                resultText = result.response.text().trim();
                                break; 
                            } catch (e) { continue; }
                        }
                    }
                    if (resultText) await msg.reply(`*HASIL SCAN TEKS:*\n\n${resultText}`);
                }
            } catch (error) {}
        }
        return;
    }

    // --- ALAT 4: DOWNLOADER TIKTOK (.vt) ---
    if (textLower.startsWith('.vt')) {
        if (!isBosOzi) return; 
        const urlMatch = textAsli.match(/https?:\/\/[^\s]+/);
        if (urlMatch) {
            const link = urlMatch[0];
            if (link.includes('tiktok.com')) {
                try {
                    const res = await axios.post('https://www.tikwm.com/api/', { url: link });
                    const videoUrl = res.data.data.play;
                    const originalCaption = res.data.data.title || ""; 
                    if (videoUrl) {
                        const media = await MessageMedia.fromUrl(videoUrl, { unsafeMime: true });
                        await client.sendMessage(lawanBicara, media, { caption: originalCaption });
                    }
                } catch (error) {}
            }
        }
        return; 
    }

    // --- ALAT 5: MEME STICKER MAKER (.t) ---
    if (textLower.startsWith('.t ')) {
        if (!isBosOzi) return;
        const targetMsg = msg.hasQuotedMsg ? await msg.getQuotedMessage() : msg;
        if (targetMsg.hasMedia) {
            const memeText = textAsli.substring(3).trim().toUpperCase(); 
            if (!memeText) return; 
            try {
                const media = await targetMsg.downloadMedia();
                const imageBuffer = Buffer.from(media.data, 'base64');
                const image = await Jimp.read(imageBuffer);
                if (image.bitmap.width > 512 || image.bitmap.height > 512) image.scaleToFit(512, 512);
                let totalLuminance = 0;
                const pixelCount = image.bitmap.width * image.bitmap.height;
                image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
                    totalLuminance += (0.299 * this.bitmap.data[idx+0] + 0.587 * this.bitmap.data[idx+1] + 0.114 * this.bitmap.data[idx+2]) / 255;
                });
                let font = (totalLuminance / pixelCount) > 0.5 ? await Jimp.loadFont(Jimp.FONT_SANS_64_BLACK) : await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE); 
                image.print(font, 10, 10, { text: memeText, alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER, alignmentY: Jimp.VERTICAL_ALIGN_BOTTOM }, image.bitmap.width - 20, image.bitmap.height - 20);
                const finalBuffer = await image.getBufferAsync(Jimp.MIME_JPEG);
                const finalMedia = new MessageMedia('image/jpeg', finalBuffer.toString('base64'), 'meme.jpg');
                await client.sendMessage(lawanBicara, finalMedia, { sendMediaAsSticker: true });
            } catch (error) {}
        }
        return;
    }

    // --- ALAT 6: TEXT TO STICKER MANUAL ENTER (.st) ---
    if (textLower.startsWith('.st ')) {
        if (!isBosOzi) return;
        const teksStiker = textAsli.substring(4).trim().toLowerCase(); 
        if (!teksStiker) return; 
        try {
            const font = await Jimp.loadFont(Jimp.FONT_SANS_64_BLACK);
            let tempCanvas = new Jimp(2048, 2048, 0xFFFFFFFF); 
            tempCanvas.print(font, 20, 20, teksStiker);
            tempCanvas.autocrop();
            const finalCanvas = new Jimp(512, 512, 0xFFFFFFFF);
            tempCanvas.scaleToFit(480, 480);
            finalCanvas.composite(tempCanvas, 16, 16);
            finalCanvas.resize(150, 150).resize(512, 512); 
            finalCanvas.quality(12); 
            const finalBuffer = await finalCanvas.getBufferAsync(Jimp.MIME_JPEG);
            const finalMedia = new MessageMedia('image/jpeg', finalBuffer.toString('base64'), 'meme.jpg');
            await client.sendMessage(lawanBicara, finalMedia, { sendMediaAsSticker: true });
        } catch (error) {}
        return;
    }

    // --- ALAT 7: STICKER MAKER BIASA (.s) ---
    if (textLower === '.s') {
        if (!isBosOzi) return; 
        const targetMsg = msg.hasQuotedMsg ? await msg.getQuotedMessage() : msg;
        if (targetMsg.hasMedia) {
            try {
                const media = await targetMsg.downloadMedia();
                await client.sendMessage(lawanBicara, media, { sendMediaAsSticker: true });
            } catch (err) {}
        }
        return;
    }
});

client.initialize();
