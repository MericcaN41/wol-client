const fs = require('fs');
const process = require('process');
const argv = require('minimist')(process.argv.slice(2));
const WS = require('websocket').w3cwebsocket;
const wol = require("wakeonlan")
const ping = require('ping');

const processInput = JSON.parse(fs.readFileSync(process.stdin.fd, 'utf-8'));
const NL_PORT = processInput.nlPort;
const NL_TOKEN = processInput.nlToken;
const NL_CTOKEN = processInput.nlConnectToken;
const NL_EXTID = processInput.nlExtensionId;

let client = new WS(`ws://localhost:${NL_PORT}?extensionId=${NL_EXTID}&connectToken=${NL_CTOKEN}`);

client.onerror = function () {
    log('Connection error!', 'ERROR');
};

client.onopen = function () {
    log('Connected');
};

client.onclose = function () {
    log('Connection closed');
    process.exit();
};

const sendToClient = (method, data) => {
    client.send(JSON.stringify({
        id: crypto.randomUUID(),
        method: method,
        accessToken: NL_TOKEN,
        data: data
    }));
}

const MAX_RETRIES = 5

const checkDevice = async (data, retries = 0, max = MAX_RETRIES) => {
    const { ip, uid } = data;
    if (retries === max) {
        log(`Device with IP: ${ip} is not reachable after ${MAX_RETRIES} retries.`, 'ERROR');
        sendToClient("app.broadcast", { event: "wakeResponse", data: { id: uid, type: "offline" } })
        return
    }
    sendToClient("app.broadcast", { event: "wakeResponse", data: { id: uid, type: "checking" } })
    const isAlive = await ping.promise.probe(ip)
    if (isAlive.alive) {
        log(`Device with IP: ${ip} is reachable.`);
        sendToClient("app.broadcast", { event: "wakeResponse", data: { id: uid, type: "online" } })
    } else {
        log(`Device with IP: ${ip} is not reachable. Retrying...`);
        setTimeout(() => {
            checkDevice(data, retries + 1, max)
        }, 5000)
    }
}

client.onmessage = function (e) {
    if (typeof e.data === 'string') {
        let message = JSON.parse(e.data);

        log(`Received message: ${message.event}`);
        switch (message.event) {
            case "wakeDevice":
                log(`Waking device with MAC: ${message.data.mac}`);
                wol(message.data.mac, { address: message.data.ip }).then(() => {
                    log(`Device with MAC: ${message.data.mac} has been woken up.`);
                    checkDevice(message.data)
                })
                break;
            case "windowClose":
                client.close()
            case "checkDevice":
                checkDevice(message.data, 0, message.data.max)
                break;
        }
    }
};

function log(message, type = 'INFO') {
    let logLine = `[${NL_EXTID}]: `;
    switch (type) {
        case 'INFO':
            logLine += type;
            logLine += ' ' + message;
            console.log(logLine);
            break;
        case 'ERROR':
            logLine += type;
            logLine += ' ' + message;
            console.error(logLine);
            break;
    }
}