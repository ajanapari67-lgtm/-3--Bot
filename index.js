const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason
} = require("@whiskeysockets/baileys");

const pino = require("pino");
const { Boom } = require("@hapi/boom");

async function startSouvikBot() {
    const { state, saveCreds } = await useMultiFileAuthState("./auth_info");

    const sock = makeWASocket({
        auth: state,
        logger: pino({ level: "silent" }),
        browser: ["Ubuntu", "Chrome", "20.0.04"]
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect } = update;

        console.log("Connection Status:", connection);

        if (connection === "open") {
            console.log("👑 SOUVIK Bot Is Online 👑");

            if (!state.creds.registered) {
                try {
                    const code = await sock.requestPairingCode("918918860814");
                    console.log(`🔑 Pairing Code: ${code}`);
                } catch (err) {
                    console.log("Pairing Error:", err.message);
                }
            }
        }

        if (connection === "close") {
            const shouldReconnect =
                lastDisconnect?.error instanceof Boom
                    ? lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut
                    : true;

            console.log("Connection Closed");

            if (shouldReconnect) {
                startSouvikBot();
            }
        }
    });

    sock.ev.on("messages.upsert", async ({ messages }) => {
        const msg = messages[0];

        if (!msg.message || msg.key.fromMe) return;

        const from = msg.key.remoteJid;
        const text =
            msg.message.conversation ||
            msg.message.extendedTextMessage?.text ||
            "";

        if (text.toLowerCase() === ".menu") {
            await sock.sendMessage(from, {
                text: "👑 ROYAL VIBE FAMILY BOT ONLINE 👑"
            });
        }
    });
}

startSouvikBot();
