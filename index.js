const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, delay } = require('@whiskeysockets/baileys');
const pino = require('pino');
const { Boom } = require('@hapi/boom');

async function startSouvikBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');
    
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        logger: pino({ level: 'silent' }),
        // 🌐 হোয়াটসঅ্যাপের সিকিউরিটি বাইপাস করার জন্য ব্রাউজার সেটিং পরিবর্তন করা হলো
        browser: ["Mac OS", "Chrome", "124.0.0.0"]
    });

    // 🔑 লিঙ্ক কোড রিকোয়েস্ট করার আগে একটু বেশি সময় হোল্ড করার লজিক
    if (!sock.authState.creds.registered) {
        let phoneNumber = "918918860814";
        await delay(8000); // হোয়াটসঅ্যাপ সার্ভারের সাথে কানেক্ট হওয়ার জন্য ৮ সেকেন্ড ওয়েট করবে
        try {
            let code = await sock.requestPairingCode(phoneNumber);
            code = code?.match(/.{1,4}/g)?.join('-') || code;
            console.log('\n=========================================');
            console.log(`👑 তোমার WHATSAPP LINK CODE: ${code} 👑`);
            console.log('=========================================\n');
        } catch (error) {
            console.log('কোড জেনারেট করতে সমস্যা হচ্ছে, আবার ট্রাই করা হচ্ছে...', error.message);
        }
    }

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error instanceof Boom) ? lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut : true;
            if (shouldReconnect) startSouvikBot();
        } else if (connection === 'open') {
            console.log('👑 SOUVIK Bot Is Online & Protected! 👑');
        }
    });

    sock.ev.on('group-participants.update', async (anu) => {
        try {
            const participants = anu.participants;
            for (let num of participants) {
                if (anu.action === 'add') {
                    let welcomeText = `@${num.split('@')[0]} \n*𝐖ᴇʟᴄᴏᴍे 𝐓ᴏ 𝐎ᴜʀ 𝐅ᴀᴍɪʟʏ ~//🌻🕊️💋*\n─── ❖ ── ✦ ── ❖ ───\n👑 𒆜 𝐑𝐎𝐘𝐀𝐋 𝐕𝐈𝐁𝐄 𝐅𝐀𝐌𝐈𝐋𝐘 𒆜 👑\n─── ❖ ── ✦ ── ❖ ───\n\n*🐰-!<‘ আমাদের ফ্যামিলিতে 🍒😽🌈-!!*\n\n*✍─❛ অনেক অনেক ভালোবাসা রইলো এবং এক বুক উষ্ণ অভ্যর্থনা তোমায় আমাদের ফ্যামিলিতে -♡ 😭❤️!!*\n\n*👑 ❐ এখানে নিয়ম একটাই—সবাইকে সম্মান দাও, আর আড্ডায় মেতে সবার পাশে থাকো! ✨🕊️*\n\n*💖🦋 .❐ লিফট নিও না প্লিজ! গ্রুপটাকে মিউট করে আর্কাইভ করে রেখে দাও তাও সাথে থাকো 😭❤️!!*\n\n*💖🦋 .❐ তুমি চলে যাবে বাকিরা দেখবে ব্যাপারটা এমন না, তুমি থাকবে আর বাকিরা দেখবে রাজত্বটা ঠিক এমন 🙈🦚💖!!*\n\n╭━─━─━─≪ ⚜️ ≫─━─━─━╮\n*🕊️.❐ 𝐆𝐑𝐎𝐔𝐏 𝐂𝐑𝐄𝐀𝐓𝐎𝐑 .❐ 🌙🦋❤️‍🔥!!*\n*🦋-!<‘ ⎯͢⎯⃝𝀈᪳𝆺𝅥 𝐙𝐎𝐔𝐕𝐈𝐊 ۵♡༏༏ || <3 🌙❤️‍🔥⚜️ -!!*\n╰━─━─━─≪ ⚜️ ≫─━─━─━╯\n\n_Powered by SOUVIK_`;
                    await sock.sendMessage(anu.id, { text: welcomeText, mentions: [num] });
                }
            }
        } catch (err) { console.log(err); }
    });

    sock.ev.on('messages.upsert', async (chatUpdate) => {
        try {
            const msg = chatUpdate.messages[0];
            if (!msg.message || msg.key.fromMe) return;
            const from = msg.key.remoteJid;
            const text = msg.message.conversation || msg.message.extendedTextMessage?.text || '';

            if (text.toLowerCase() === '.menu') {
                let botPhotoUrl = "https://files.catbox.moe/fergtv.jpg"; 
                let menuText = `╭━━━━❮ 𝙰𝙸 ❯━⊷\n┃◇ .ai\n┃◇ .chatai\n┃◇ .chatgpt\n┃◇ .clearai\n┃◇ .gemini\n┃◇ .gpt\n┃◇ .gpt𝟒\n┃◇ .gpt𝟒o\n┃◇ .immuai\n┃◇ .openai\n╰━━━━━━━━━━━━━━━━━⊷\n\n> *ᴘᴏᴡᴇʀᴇ增 ʙʏ SOUVIK*`;
                await sock.sendMessage(from, { image: { url: botPhotoUrl }, caption: menuText }, { quoted: msg });
            }
        } catch (err) { console.log(err); }
    });
}

startSouvikBot();
