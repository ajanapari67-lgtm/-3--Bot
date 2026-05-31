const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');
const { Boom } = require('@hapi/boom');
const qrcode = require('qrcode-terminal');

async function startSouvikBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');
    
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        logger: pino({ level: 'silent' }),
        browser: ["SOUVIK Bot", "Chrome", "1.0.0"]
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;
        if (qr) {
            console.log('--- 📸 নিচের QR Code টি স্ক্যান করো ---');
            qrcode.generate(qr, { small: true });
        }
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error instanceof Boom) ? lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut : true;
            console.log('কানেকশন কেটে গেছে, আবার চেষ্টা করা হচ্ছে...', shouldReconnect);
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
                    let welcomeText = `@${num.split('@')[0]} \n*𝐖ᴇʟᴄᴏᴍᴇ 𝐓ᴏ 𝐎ᴜʀ 𝐅ᴀᴍɪʟʏ ~//🌻🕊️💋*\n─── ❖ ── ✦ ── ❖ ───\n👑 𒆜 𝐑𝐎𝐘𝐀𝐋 𝐕𝐈𝐁𝐄 𝐅𝐀𝐌𝐈𝐋𝐘 𒆜 👑\n─── ❖ ── ✦ ── ❖ ───\n\n*🐰-!<‘ আমাদের ফ্যামিলিতে 🍒😽🌈-!!*\n\n*✍─❛ অনেক অনেক ভালোবাসা রইলো এবং এক বুক উষ্ণ অভ্যর্থনা তোমায় আমাদের ফ্যামিলিতে -♡ 😭❤️!!*\n\n*👑 ❐ এখানে নিয়ম একটাই—সবাইকে সম্মান দাও, আর আড্ডায় মেতে সবার পাশে থাকো! ✨🕊️*\n\n*💖🦋 .❐ লিফট নিও না প্লিজ! গ্রুপটাকে মিউট করে আর্কাইভ করে রেখে দাও তাও সাথে থাকো 😭❤️!!*\n\n*💖🦋 .❐ তুমি চলে যাবে বাকিরা দেখবে ব্যাপারটা এমন না, তুমি থাকবে আর বাকিরা দেখবে রাজত্বটা ঠিক এমন 🙈🦚💖!!*\n\n╭━─━─━─≪ ⚜️ ≫─━─━─━╮\n*🕊️.❐ 𝐆𝐑𝐎𝐔𝐏 𝐂𝐑𝐄𝐀𝐓𝐎𝐑 .❐ 🌙🦋❤️‍🔥!!*\n*🦋-!<‘ ⎯͢⎯⃝𝀈᪳𝆺𝅥 𝐙𝐎𝐔𝐕𝐈𝐊 ۵♡༏༏ || <3 🌙❤️‍🔥⚜️ -!!*\n╰━─━─━─≪ ⚜️ ≫─━─━─━╯\n\n_Powered by SOUVIK_`;
                    
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
                
                // 📸 তোমার ক্যাটবক্সের ছবির ডিরেক্ট লিঙ্ক এখানে সেট করা হলো
                let botPhotoUrl = "https://files.catbox.moe/fergtv.jpg"; 

                let menuText = `╭━━━━❮ 𝙰𝙸 ❯━⊷
┃◇ .ai
┃◇ .chatai
┃◇ .chatgpt
┃◇ .clearai
┃◇ .gemini
┃◇ .gpt
┃◇ .gpt𝟒
┃◇ .gpt𝟒o
┃◇ .immuai
┃◇ .openai
╰━━━━━━━━━━━━━━━━━⊷

╭━━━━❮ 𝙲𝙾𝙽𝚅𝙴𝚁𝚃𝙴𝚁 ❯━⊷
┃◇ .sticker
┃◇ .toaudio
┃◇ .toimg
┃◇ .toptt
┃◇ .tovideo
╰━━━━━━━━━━━━━━━━━⊷

╭━━━━❮ 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳𝙴𝚁 ❯━⊷
┃◇ .apk
┃◇ .fb
┃◇ .gdrive
┃◇ .gitclone
┃◇ .ig
┃◇ .mediafire
┃◇ .pastebin
┃◇ .play
┃◇ .sendaudio
┃◇ .sendvideo
┃◇ .snack
┃◇ .spotify
┃◇ .tiktok
┃◇ .twitter
┃◇ .video
╰━━━━━━━━━━━━━━━━━⊷

╭━━━━❮ 𝙵𝚄𝙽 ❯━⊷
┃◇ .catvideos
╰━━━━━━━━━━━━━━━━━⊷

╭━━━━❮ 𝙶𝙰𝙼𝙴 ❯━⊷
┃◇ .dice
┃◇ .diceai
┃◇ .diceend
┃◇ .dicejoin
┃◇ .games
┃◇ .roll
┃◇ .tictactoe
┃◇ .tttai
┃◇ .tttboard
┃◇ .tttend
┃◇ .tttjoin
┃◇ .w
┃◇ .wcg
┃◇ .wcgai
┃◇ .wcgbegin
┃◇ .wcgend
┃◇ .wcgjoin
┃◇ .wcgscores
╰━━━━━━━━━━━━━━━━━⊷

╭━━━━❮ 𝙶𝙴𝙽𝙴𝚁𝙰𝙻 ❯━⊷
┃◇ .chjid
┃◇ .list
┃◇ .menu
┃◇ .menus
┃◇ .met
┃◇ .pair
┃◇ .ping
┃◇ .repo
┃◇ .uptime
╰━━━━━━━━━━━━━━━━━⊷

╭━━━━❮ 𝙶𝚁𝙾𝚄𝙿 ❯━⊷
┃◇ .accept
┃◇ .acceptall
┃◇ .add
┃◇ .antibadwarn
┃◇ .antidemote
┃◇ .antigroupmention
┃◇ .antilinkwarn
┃◇ .antipromote
┃◇ .badwords
┃◇ .del
┃◇ .demote
┃◇ .disapp
┃◇ .everyone
┃◇ .gcdesc
┃◇ .gcpp
┃◇ .getgcpp
┃◇ .getlid
┃◇ .goodbyemessage
┃◇ .groupname
┃◇ .groupsettings
┃◇ .hidetag
┃◇ .kick
┃◇ .killgc
┃◇ .left
┃◇ .link
┃◇ .listrequests
┃◇ .mute
┃◇ .newgroup
┃◇ .online
┃◇ .promote
┃◇ .reject
┃◇ .rejectall
┃◇ .resetgroup
┃◇ .resetlink
┃◇ .setantibad
┃◇ .setantigcmentionwarnlimit
┃◇ .setantilink
┃◇ .setgoodbye
┃◇ .setgroupevents
┃◇ .setwelcome
┃◇ .tagadmins
┃◇ .tagall
┃◇ .togroupstatus
┃◇ .unmute
┃◇ .vcf
┃◇ .welcomemessage
╰━━━━━━━━━━━━━━━━━⊷

╭━━━━❮ 𝙻𝙾resource ❯━⊷
┃◇ .advancedglow
┃◇ .americanflag
┃◇ .blackpinklogo
┃◇ .blackpinkstyle
┃◇ .cartoonstyle
┃◇ .deletingtext
┃◇ .effectclouds
┃◇ .galaxy
┃◇ .galaxystyle
┃◇ .glitchtext
┃◇ .glossysilver
┃◇ .glowingtext
┃◇ .gradienttext
┃◇ .lighteffect
┃◇ .logo𝟏𝟗𝟏𝟕
┃◇ .logolist
┃◇ .logomaker
┃◇ .luxurygold
┃◇ .makingneon
┃◇ .neonglitch
┃◇ .nigerianflag
┃◇ .papercut
┃◇ .pixelglitch
┃◇ .sandsummer
┃◇ .summerbeach
┃◇ .texteffect
┃◇ .typographytext
┃◇ .underwater
┃◇ .writetext
╰━━━━━━━━━━━━━━━━━⊷

╭━━━━❮ 𝙽𝙾𝚃𝙴𝚂 ❯━⊷
┃◇ .addnote
┃◇ .delallnotes
┃◇ .delnote
┃◇ .getnote
┃◇ .getnotes
┃◇ .notes
┃◇ .updatenote
╰━━━━━━━━━━━━━━━━━⊷

╭━━━━❮ 𝙾𝚆𝙽𝙴𝚁 ❯━⊷
┃◇ .adminclearnotes
┃◇ .admindelnote
┃◇ .adminupdatenote
┃◇ .allnotes
┃◇ .block
┃◇ .blocklist
┃◇ .cachedmeta
┃◇ .cmd
┃◇ .delsudo
┃◇ .forward
┃◇ .fullpp
┃◇ .getpp
┃◇ .getsetting
┃◇ .getsudo
┃◇ .jid
┃◇ .join
┃◇ .mygroups
┃◇ .owner
┃◇ .pp
┃◇ .report
┃◇ .resetallsettings
┃◇ .resetdb
┃◇ .resetsetting
┃◇ .resetsudo
┃◇ .return
┃◇ .save
┃◇ .setanticall
┃◇ .setantidelete
┃◇ .setantiedit
┃◇ .setautobio
┃◇ .setautoblock
┃◇ .setautolikestatus
┃◇ .setautoreact
┃◇ .setautoread
┃◇ .setautoreadstatus
┃◇ .setautoreply
┃◇ .setautoreplystatus
┃◇ .setbotname
┃◇ .setbotpic
┃◇ .setbotrepo
┃◇ .setcaption
┃◇ .setchatbot
┃◇ .setchatbotmode
┃◇ .setdmpresence
┃◇ .setfooter
┃◇ .setgcjid
┃◇ .setgcpresence
┃◇ .setmode
┃◇ .setnewsletterjid
┃◇ .setnewsletterurl
┃◇ .setownername
┃◇ .setownernumber
┃◇ .setpackauthor
┃◇ .setpackname
┃◇ .setpmpermit
┃◇ .setprefix
┃◇ .setsetting
┃◇ .setstartmsg
┃◇ .setstatusemojis
┃◇ .setstatusreplytext
┃◇ .setsudo
┃◇ .settimezone
┃◇ .settings
┃◇ .setytlink
┃◇ .tostatus
┃◇ .unblock
┃◇ .update
┃◇ .vv
┃◇ .vv𝟐
┃◇ .whois
╰━━━━━━━━━━━━━━━━━⊷

╭━━━━❮ 𝚁𝙴𝙻𝙸𝙶𝙸𝙾𝙽 ❯━⊷
┃◇ .bible
╰━━━━━━━━━━━━━━━━━⊷

╭━━━━❮ 𝚂𝙴𝙰𝚁𝙲𝙷 ❯━⊷
┃◇ .apkmirror
┃◇ .ggleimage
┃◇ .google
┃◇ .happymod
┃◇ .lyrics
┃◇ .npm
┃◇ .shazam
┃◇ .spotifysearch
┃◇ .stickersearch
┃◇ .unsplash
┃◇ .wallpapers
┃◇ .wattpad
┃◇ .weather
┃◇ .yts
╰━━━━━━━━━━━━━━━━━⊷

╭━━━━❮ 𝚂𝙿𝙾𝚁𝚃𝚂 ❯━⊷
┃◇ .gamehistory
┃◇ .livescore
┃◇ .sportnews
┃◇ .standings
┃◇ .surebet
┃◇ .topscorers
┃◇ .upcomingmatches
╰━━━━━━━━━━━━━━━━━⊷

╭━━━━❮ 延𝙴𝙼𝙿𝙼𝙰𝙸𝙻 ❯━⊷
┃◇ .delmail
┃◇ .readmail
┃◇ .tempinbox
┃◇ .tempmail
┃◇ .tempmailhelp
╰━━━━━━━━━━━━━━━━━⊷

╭━━━━❮ 𝙱𝙾𝙾𝙻𝚂 ❯━⊷
┃◇ .adfoc
┃◇ .cleanuri
┃◇ .createpdf
┃◇ .createqr
┃◇ .dbase
┃◇ .debinary
┃◇ .define
┃◇ .domaincheck
┃◇ .ebase
┃◇ .ebinary
┃◇ .emojimix
┃◇ .fancy
┃◇ .fetch
┃◇ .photoeditor
┃◇ .readqr
┃◇ .rebrandly
┃◇ .remini
┃◇ .rename
┃◇ .shortener
┃◇ .sspc
┃◇ .ssphone
┃◇ .sstab
┃◇ .ssur
┃◇ .ssweb
┃◇ .tinyurl
┃◇ .ttp
┃◇ .vgd
┃◇ .vurl
┃◇ .web𝟐zip
╰━━━━━━━━━━━━━━━━━⊷

╭━━━━❮ 𝚄𝙿𝙻𝙾𝙰𝙳𝙴𝚁 ❯━⊷
┃◇ .catbox
┃◇ .githubcdn
┃◇ .imgbb
┃◇ .immucdn
┃◇ .pixhost
╰━━━━━━━━━━━━━━━━━⊷

╭━━━━❮ 𝚄𝚃𝙸𝙻𝙸𝚃𝚈 ❯━⊷
┃◇ .onwa
╰━━━━━━━━━━━━━━━━━⊷

> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ SOUVIK*`;

                await sock.sendMessage(from, { image: { url: botPhotoUrl }, caption: menuText }, { quoted: msg });
            }
        } catch (err) { console.log(err); }
    });
}

startSouvikBot();
                  
