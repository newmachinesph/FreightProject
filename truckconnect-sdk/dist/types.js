"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/types.ts
var types_exports = {};
__export(types_exports, {
  PH_MAJOR_PORTS: () => PH_MAJOR_PORTS
});
module.exports = __toCommonJS(types_exports);
var PH_MAJOR_PORTS = [
  { name: "Manila International Container Terminal", city: "Manila", lat: 14.5939, lng: 120.9593 },
  { name: "Batangas Port", city: "Batangas", lat: 13.7565, lng: 121.0583 },
  { name: "Cebu International Port", city: "Cebu", lat: 10.2989, lng: 123.8908 },
  { name: "Cagayan de Oro Port", city: "Cagayan de Oro", lat: 8.4809, lng: 124.6383 },
  { name: "Davao Sasa Port", city: "Davao", lat: 7.0833, lng: 125.6333 },
  { name: "General Santos Port", city: "General Santos", lat: 6.0878, lng: 125.1672 },
  { name: "Subic Bay Freeport", city: "Subic", lat: 14.7944, lng: 120.2828 },
  { name: "Iloilo Port", city: "Iloilo", lat: 10.6918, lng: 122.5644 }
];
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PH_MAJOR_PORTS
});
