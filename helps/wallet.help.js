const walletAgentCode = process.env.AGENT_CODE;
const walletPublicKey = process.env.TIMEBIT_OTC_PUBLIC_KEY
const walletPrivateKey = process.env.PRIVATE_KEY

const urlApi = process.env.URL_API;
const axios = require("axios")
const crypto = require("crypto");

async function getPaymentEndPoint(dataSend) {
    const headers = createSignature(dataSend);
    try {
        const response = await axios.post(
            urlApi + "/agent/create-order",
            dataSend,
            {headers}
        );
        console.log("response.data", response.data)
        return response.data;
    } catch (error) {
        console.log("error", error)
        return false;
    }
}


function createSignature(body, query = null, params = null) {
    const time = Date.now();
    const agent_code = walletAgentCode;
    let dataSend = {...body, time, agent_code};

    if (query && typeof query == "object") {
        dataSend = {
            ...dataSend,
            ...query,
        };
    }

    if (params && typeof params == "object") {
        dataSend = {
            ...dataSend,
            ...params,
        };
    }

    const stringDataDecode = sortObjectToParam(dataSend);
    const tokenS = createTokenRSA256(stringDataDecode, this.privateKey);
    return {
        signature: tokenS,
        time: time,
        "agent-code": agent_code,
    };
}

function sortObjectToParam(data) {
    let sorts = Object.keys(data).sort();
    let result = "";
    for (let item of sorts) {
        result += `${item}=${data[item]}&`;
    }
    return result;
}


function createTokenRSA256(data, privateKey = null) {
    if (!privateKey) privateKey = walletPrivateKey;
    const sign = crypto.createSign("SHA256");
    sign.write(data);
    sign.end();
    return sign.sign(privateKey, "base64");
}

function verifyTokenRSA256(data, signature, publicKey = null) {
    if (!publicKey) publicKey = walletPublicKey;
    const verifier = crypto.createVerify("SHA256");
    verifier.update(data);
    return verifier.verify(publicKey, signature, "base64");
}

module.exports = {createTokenRSA256, createSignature, createTokenRSA256, verifyTokenRSA256, getPaymentEndPoint}
