"use strict";
// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v1.176.1
//   protoc               v4.23.3
// source: Wrapper-TCP.proto
Object.defineProperty(exports, "__esModule", { value: true });
exports.TcpWrapper = exports.tcpWrapper_MessageTypeToJSON = exports.tcpWrapper_MessageTypeFromJSON = exports.TcpWrapper_MessageType = exports.protobufPackage = void 0;
/* eslint-disable */
const _m0 = require("protobufjs/minimal");
exports.protobufPackage = "Wrapper.TCP";
var TcpWrapper_MessageType;
(function (TcpWrapper_MessageType) {
    TcpWrapper_MessageType[TcpWrapper_MessageType["LoginRequest"] = 0] = "LoginRequest";
    TcpWrapper_MessageType[TcpWrapper_MessageType["LoginResponse"] = 1] = "LoginResponse";
    TcpWrapper_MessageType[TcpWrapper_MessageType["FindMatchRequest"] = 2] = "FindMatchRequest";
    TcpWrapper_MessageType[TcpWrapper_MessageType["FindMatchResponse"] = 3] = "FindMatchResponse";
    TcpWrapper_MessageType[TcpWrapper_MessageType["ChatMessageRequest"] = 4] = "ChatMessageRequest";
    TcpWrapper_MessageType[TcpWrapper_MessageType["ShareChatMessage"] = 5] = "ShareChatMessage";
    TcpWrapper_MessageType[TcpWrapper_MessageType["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(TcpWrapper_MessageType || (exports.TcpWrapper_MessageType = TcpWrapper_MessageType = {}));
function tcpWrapper_MessageTypeFromJSON(object) {
    switch (object) {
        case 0:
        case "LoginRequest":
            return TcpWrapper_MessageType.LoginRequest;
        case 1:
        case "LoginResponse":
            return TcpWrapper_MessageType.LoginResponse;
        case 2:
        case "FindMatchRequest":
            return TcpWrapper_MessageType.FindMatchRequest;
        case 3:
        case "FindMatchResponse":
            return TcpWrapper_MessageType.FindMatchResponse;
        case 4:
        case "ChatMessageRequest":
            return TcpWrapper_MessageType.ChatMessageRequest;
        case 5:
        case "ShareChatMessage":
            return TcpWrapper_MessageType.ShareChatMessage;
        case -1:
        case "UNRECOGNIZED":
        default:
            return TcpWrapper_MessageType.UNRECOGNIZED;
    }
}
exports.tcpWrapper_MessageTypeFromJSON = tcpWrapper_MessageTypeFromJSON;
function tcpWrapper_MessageTypeToJSON(object) {
    switch (object) {
        case TcpWrapper_MessageType.LoginRequest:
            return "LoginRequest";
        case TcpWrapper_MessageType.LoginResponse:
            return "LoginResponse";
        case TcpWrapper_MessageType.FindMatchRequest:
            return "FindMatchRequest";
        case TcpWrapper_MessageType.FindMatchResponse:
            return "FindMatchResponse";
        case TcpWrapper_MessageType.ChatMessageRequest:
            return "ChatMessageRequest";
        case TcpWrapper_MessageType.ShareChatMessage:
            return "ShareChatMessage";
        case TcpWrapper_MessageType.UNRECOGNIZED:
        default:
            return "UNRECOGNIZED";
    }
}
exports.tcpWrapper_MessageTypeToJSON = tcpWrapper_MessageTypeToJSON;
function createBaseTcpWrapper() {
    return { payloadType: 0, payload: new Uint8Array(0) };
}
exports.TcpWrapper = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.payloadType !== 0) {
            writer.uint32(8).int32(message.payloadType);
        }
        if (message.payload.length !== 0) {
            writer.uint32(18).bytes(message.payload);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseTcpWrapper();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 8) {
                        break;
                    }
                    message.payloadType = reader.int32();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.payload = reader.bytes();
                    continue;
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            payloadType: isSet(object.payloadType) ? tcpWrapper_MessageTypeFromJSON(object.payloadType) : 0,
            payload: isSet(object.payload) ? bytesFromBase64(object.payload) : new Uint8Array(0),
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.payloadType !== 0) {
            obj.payloadType = tcpWrapper_MessageTypeToJSON(message.payloadType);
        }
        if (message.payload.length !== 0) {
            obj.payload = base64FromBytes(message.payload);
        }
        return obj;
    },
    create(base) {
        return exports.TcpWrapper.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseTcpWrapper();
        message.payloadType = (_a = object.payloadType) !== null && _a !== void 0 ? _a : 0;
        message.payload = (_b = object.payload) !== null && _b !== void 0 ? _b : new Uint8Array(0);
        return message;
    },
};
function bytesFromBase64(b64) {
    if (globalThis.Buffer) {
        return Uint8Array.from(globalThis.Buffer.from(b64, "base64"));
    }
    else {
        const bin = globalThis.atob(b64);
        const arr = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; ++i) {
            arr[i] = bin.charCodeAt(i);
        }
        return arr;
    }
}
function base64FromBytes(arr) {
    if (globalThis.Buffer) {
        return globalThis.Buffer.from(arr).toString("base64");
    }
    else {
        const bin = [];
        arr.forEach((byte) => {
            bin.push(globalThis.String.fromCharCode(byte));
        });
        return globalThis.btoa(bin.join(""));
    }
}
function isSet(value) {
    return value !== null && value !== undefined;
}