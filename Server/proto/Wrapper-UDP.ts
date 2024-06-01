// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v1.176.1
//   protoc               v4.23.3
// source: Wrapper-UDP.proto

/* eslint-disable */
import * as _m0 from "protobufjs/minimal";

export const protobufPackage = "Wrapper.UDP";

export interface UdpWrapper {
  payloadType: UdpWrapper_MessageType;
  payload: Uint8Array;
}

export enum UdpWrapper_MessageType {
  GameStateRequest = 0,
  GameStateResponse = 1,
  ActionRequest = 2,
  ActionResponse = 3,
  UNRECOGNIZED = -1,
}

export function udpWrapper_MessageTypeFromJSON(object: any): UdpWrapper_MessageType {
  switch (object) {
    case 0:
    case "GameStateRequest":
      return UdpWrapper_MessageType.GameStateRequest;
    case 1:
    case "GameStateResponse":
      return UdpWrapper_MessageType.GameStateResponse;
    case 2:
    case "ActionRequest":
      return UdpWrapper_MessageType.ActionRequest;
    case 3:
    case "ActionResponse":
      return UdpWrapper_MessageType.ActionResponse;
    case -1:
    case "UNRECOGNIZED":
    default:
      return UdpWrapper_MessageType.UNRECOGNIZED;
  }
}

export function udpWrapper_MessageTypeToJSON(object: UdpWrapper_MessageType): string {
  switch (object) {
    case UdpWrapper_MessageType.GameStateRequest:
      return "GameStateRequest";
    case UdpWrapper_MessageType.GameStateResponse:
      return "GameStateResponse";
    case UdpWrapper_MessageType.ActionRequest:
      return "ActionRequest";
    case UdpWrapper_MessageType.ActionResponse:
      return "ActionResponse";
    case UdpWrapper_MessageType.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

function createBaseUdpWrapper(): UdpWrapper {
  return { payloadType: 0, payload: new Uint8Array(0) };
}

export const UdpWrapper = {
  encode(message: UdpWrapper, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.payloadType !== 0) {
      writer.uint32(8).int32(message.payloadType);
    }
    if (message.payload.length !== 0) {
      writer.uint32(18).bytes(message.payload);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UdpWrapper {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUdpWrapper();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.payloadType = reader.int32() as any;
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

  fromJSON(object: any): UdpWrapper {
    return {
      payloadType: isSet(object.payloadType) ? udpWrapper_MessageTypeFromJSON(object.payloadType) : 0,
      payload: isSet(object.payload) ? bytesFromBase64(object.payload) : new Uint8Array(0),
    };
  },

  toJSON(message: UdpWrapper): unknown {
    const obj: any = {};
    if (message.payloadType !== 0) {
      obj.payloadType = udpWrapper_MessageTypeToJSON(message.payloadType);
    }
    if (message.payload.length !== 0) {
      obj.payload = base64FromBytes(message.payload);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<UdpWrapper>, I>>(base?: I): UdpWrapper {
    return UdpWrapper.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<UdpWrapper>, I>>(object: I): UdpWrapper {
    const message = createBaseUdpWrapper();
    message.payloadType = object.payloadType ?? 0;
    message.payload = object.payload ?? new Uint8Array(0);
    return message;
  },
};

function bytesFromBase64(b64: string): Uint8Array {
  if ((globalThis as any).Buffer) {
    return Uint8Array.from(globalThis.Buffer.from(b64, "base64"));
  } else {
    const bin = globalThis.atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
      arr[i] = bin.charCodeAt(i);
    }
    return arr;
  }
}

function base64FromBytes(arr: Uint8Array): string {
  if ((globalThis as any).Buffer) {
    return globalThis.Buffer.from(arr).toString("base64");
  } else {
    const bin: string[] = [];
    arr.forEach((byte) => {
      bin.push(globalThis.String.fromCharCode(byte));
    });
    return globalThis.btoa(bin.join(""));
  }
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
