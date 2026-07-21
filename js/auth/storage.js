/*
  Pedroza Certificadora
  Atlas AASS - Persistencia local com migracao nao destrutiva
  Concepcao, Design e Desenvolvimento: Marcos Henrique Pedroza
*/
(function (window) {
  "use strict";

  window.AtlasAuth = window.AtlasAuth || {};
  var config = window.AtlasAuth.config;
  var META_KEY = "atlas_aass_storage_meta";
  var CURRENT_SCHEMA = 2;

  function safeParse(raw, fallback) {
    try {
      var parsed = JSON.parse(raw);
      return parsed == null ? fallback : parsed;
    } catch (error) {
      return fallback;
    }
  }

  function readJson(key, fallback) {
    return safeParse(localStorage.getItem(key), fallback);
  }

  function writeJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
    touch();
    return value;
  }

  function touch() {
    var current = safeParse(localStorage.getItem(META_KEY), {});
    current.schema = CURRENT_SCHEMA;
    current.lastWriteAt = Date.now();
    current.appVersion = config.version;
    localStorage.setItem(META_KEY, JSON.stringify(current));
  }

  function migrateLegacyUsers() {
    var current = readJson(config.usersKey, null);
    if (Array.isArray(current) && current.length) return current;

    var legacyKeys = [
      "atlas_users",
      "atlas_auth_users",
      "atlas_aass_users_v1",
      "atlas_aass_user_store"
    ];

    for (var index = 0; index < legacyKeys.length; index += 1) {
      var legacy = readJson(legacyKeys[index], null);
      if (Array.isArray(legacy) && legacy.length) {
        writeJson(config.usersKey, legacy);
        return legacy;
      }
    }
    return null;
  }

  function initialize() {
    var meta = readJson(META_KEY, {});
    migrateLegacyUsers();
    meta.schema = CURRENT_SCHEMA;
    meta.initializedAt = meta.initializedAt || Date.now();
    meta.lastLoadedAt = Date.now();
    meta.appVersion = config.version;
    localStorage.setItem(META_KEY, JSON.stringify(meta));
  }

  function exportData() {
    var payload = {};
    for (var i = 0; i < localStorage.length; i += 1) {
      var key = localStorage.key(i);
      if (key && key.indexOf(config.storagePrefix) === 0) {
        payload[key] = localStorage.getItem(key);
      }
    }
    return {
      product: "Atlas AASS",
      version: config.version,
      exportedAt: new Date().toISOString(),
      data: payload
    };
  }

  function importData(backup) {
    if (!backup || backup.product !== "Atlas AASS" || !backup.data) {
      throw new Error("Backup local invalido.");
    }
    Object.keys(backup.data).forEach(function (key) {
      if (key.indexOf(config.storagePrefix) === 0) {
        localStorage.setItem(key, backup.data[key]);
      }
    });
    initialize();
    return true;
  }

  initialize();

  window.AtlasAuth.storage = Object.freeze({
    readJson: readJson,
    writeJson: writeJson,
    initialize: initialize,
    exportData: exportData,
    importData: importData
  });
})(window);
