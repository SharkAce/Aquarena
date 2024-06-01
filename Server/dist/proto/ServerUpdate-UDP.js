"use strict";
// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v1.176.1
//   protoc               v4.23.3
// source: ServerUpdate-UDP.proto
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameSnapshot_Coin = exports.GameSnapshot_Player = exports.GameSnapshot = exports.protobufPackage = void 0;
/* eslint-disable */
const _m0 = require("protobufjs/minimal");
exports.protobufPackage = "ServerUpdate.UDP";
function createBaseGameSnapshot() {
    return { players: [], coins: [] };
}
exports.GameSnapshot = {
    encode(message, writer = _m0.Writer.create()) {
        for (const v of message.players) {
            exports.GameSnapshot_Player.encode(v, writer.uint32(10).fork()).ldelim();
        }
        for (const v of message.coins) {
            exports.GameSnapshot_Coin.encode(v, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseGameSnapshot();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.players.push(exports.GameSnapshot_Player.decode(reader, reader.uint32()));
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.coins.push(exports.GameSnapshot_Coin.decode(reader, reader.uint32()));
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
            players: globalThis.Array.isArray(object === null || object === void 0 ? void 0 : object.players)
                ? object.players.map((e) => exports.GameSnapshot_Player.fromJSON(e))
                : [],
            coins: globalThis.Array.isArray(object === null || object === void 0 ? void 0 : object.coins) ? object.coins.map((e) => exports.GameSnapshot_Coin.fromJSON(e)) : [],
        };
    },
    toJSON(message) {
        var _a, _b;
        const obj = {};
        if ((_a = message.players) === null || _a === void 0 ? void 0 : _a.length) {
            obj.players = message.players.map((e) => exports.GameSnapshot_Player.toJSON(e));
        }
        if ((_b = message.coins) === null || _b === void 0 ? void 0 : _b.length) {
            obj.coins = message.coins.map((e) => exports.GameSnapshot_Coin.toJSON(e));
        }
        return obj;
    },
    create(base) {
        return exports.GameSnapshot.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseGameSnapshot();
        message.players = ((_a = object.players) === null || _a === void 0 ? void 0 : _a.map((e) => exports.GameSnapshot_Player.fromPartial(e))) || [];
        message.coins = ((_b = object.coins) === null || _b === void 0 ? void 0 : _b.map((e) => exports.GameSnapshot_Coin.fromPartial(e))) || [];
        return message;
    },
};
function createBaseGameSnapshot_Player() {
    return { username: "", positionX: 0, positionY: 0, action: "" };
}
exports.GameSnapshot_Player = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.username !== "") {
            writer.uint32(10).string(message.username);
        }
        if (message.positionX !== 0) {
            writer.uint32(16).int32(message.positionX);
        }
        if (message.positionY !== 0) {
            writer.uint32(24).int32(message.positionY);
        }
        if (message.action !== "") {
            writer.uint32(34).string(message.action);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseGameSnapshot_Player();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.username = reader.string();
                    continue;
                case 2:
                    if (tag !== 16) {
                        break;
                    }
                    message.positionX = reader.int32();
                    continue;
                case 3:
                    if (tag !== 24) {
                        break;
                    }
                    message.positionY = reader.int32();
                    continue;
                case 4:
                    if (tag !== 34) {
                        break;
                    }
                    message.action = reader.string();
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
            username: isSet(object.username) ? globalThis.String(object.username) : "",
            positionX: isSet(object.positionX) ? globalThis.Number(object.positionX) : 0,
            positionY: isSet(object.positionY) ? globalThis.Number(object.positionY) : 0,
            action: isSet(object.action) ? globalThis.String(object.action) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.username !== "") {
            obj.username = message.username;
        }
        if (message.positionX !== 0) {
            obj.positionX = Math.round(message.positionX);
        }
        if (message.positionY !== 0) {
            obj.positionY = Math.round(message.positionY);
        }
        if (message.action !== "") {
            obj.action = message.action;
        }
        return obj;
    },
    create(base) {
        return exports.GameSnapshot_Player.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d;
        const message = createBaseGameSnapshot_Player();
        message.username = (_a = object.username) !== null && _a !== void 0 ? _a : "";
        message.positionX = (_b = object.positionX) !== null && _b !== void 0 ? _b : 0;
        message.positionY = (_c = object.positionY) !== null && _c !== void 0 ? _c : 0;
        message.action = (_d = object.action) !== null && _d !== void 0 ? _d : "";
        return message;
    },
};
function createBaseGameSnapshot_Coin() {
    return { positionX: 0, positionY: 0 };
}
exports.GameSnapshot_Coin = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.positionX !== 0) {
            writer.uint32(8).int32(message.positionX);
        }
        if (message.positionY !== 0) {
            writer.uint32(16).int32(message.positionY);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseGameSnapshot_Coin();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 8) {
                        break;
                    }
                    message.positionX = reader.int32();
                    continue;
                case 2:
                    if (tag !== 16) {
                        break;
                    }
                    message.positionY = reader.int32();
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
            positionX: isSet(object.positionX) ? globalThis.Number(object.positionX) : 0,
            positionY: isSet(object.positionY) ? globalThis.Number(object.positionY) : 0,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.positionX !== 0) {
            obj.positionX = Math.round(message.positionX);
        }
        if (message.positionY !== 0) {
            obj.positionY = Math.round(message.positionY);
        }
        return obj;
    },
    create(base) {
        return exports.GameSnapshot_Coin.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseGameSnapshot_Coin();
        message.positionX = (_a = object.positionX) !== null && _a !== void 0 ? _a : 0;
        message.positionY = (_b = object.positionY) !== null && _b !== void 0 ? _b : 0;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}