"use strict";
// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v1.176.1
//   protoc               v4.23.3
// source: ClientRequest-UDP.proto
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionRequest = exports.GameStateRequest = exports.protobufPackage = void 0;
/* eslint-disable */
const _m0 = require("protobufjs/minimal");
exports.protobufPackage = "ClientRequest.UDP";
function createBaseGameStateRequest() {
    return { matchId: new Uint8Array(0) };
}
exports.GameStateRequest = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.matchId.length !== 0) {
            writer.uint32(10).bytes(message.matchId);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseGameStateRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.matchId = reader.bytes();
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
        return { matchId: isSet(object.matchId) ? bytesFromBase64(object.matchId) : new Uint8Array(0) };
    },
    toJSON(message) {
        const obj = {};
        if (message.matchId.length !== 0) {
            obj.matchId = base64FromBytes(message.matchId);
        }
        return obj;
    },
    create(base) {
        return exports.GameStateRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseGameStateRequest();
        message.matchId = (_a = object.matchId) !== null && _a !== void 0 ? _a : new Uint8Array(0);
        return message;
    },
};
function createBaseActionRequest() {
    return { sessionId: new Uint8Array(0), matchId: new Uint8Array(0), targetX: 0, targetY: 0 };
}
exports.ActionRequest = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.sessionId.length !== 0) {
            writer.uint32(10).bytes(message.sessionId);
        }
        if (message.matchId.length !== 0) {
            writer.uint32(18).bytes(message.matchId);
        }
        if (message.targetX !== 0) {
            writer.uint32(24).int32(message.targetX);
        }
        if (message.targetY !== 0) {
            writer.uint32(32).int32(message.targetY);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseActionRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.sessionId = reader.bytes();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.matchId = reader.bytes();
                    continue;
                case 3:
                    if (tag !== 24) {
                        break;
                    }
                    message.targetX = reader.int32();
                    continue;
                case 4:
                    if (tag !== 32) {
                        break;
                    }
                    message.targetY = reader.int32();
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
            sessionId: isSet(object.sessionId) ? bytesFromBase64(object.sessionId) : new Uint8Array(0),
            matchId: isSet(object.matchId) ? bytesFromBase64(object.matchId) : new Uint8Array(0),
            targetX: isSet(object.targetX) ? globalThis.Number(object.targetX) : 0,
            targetY: isSet(object.targetY) ? globalThis.Number(object.targetY) : 0,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.sessionId.length !== 0) {
            obj.sessionId = base64FromBytes(message.sessionId);
        }
        if (message.matchId.length !== 0) {
            obj.matchId = base64FromBytes(message.matchId);
        }
        if (message.targetX !== 0) {
            obj.targetX = Math.round(message.targetX);
        }
        if (message.targetY !== 0) {
            obj.targetY = Math.round(message.targetY);
        }
        return obj;
    },
    create(base) {
        return exports.ActionRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d;
        const message = createBaseActionRequest();
        message.sessionId = (_a = object.sessionId) !== null && _a !== void 0 ? _a : new Uint8Array(0);
        message.matchId = (_b = object.matchId) !== null && _b !== void 0 ? _b : new Uint8Array(0);
        message.targetX = (_c = object.targetX) !== null && _c !== void 0 ? _c : 0;
        message.targetY = (_d = object.targetY) !== null && _d !== void 0 ? _d : 0;
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