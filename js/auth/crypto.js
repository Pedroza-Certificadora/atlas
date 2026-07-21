/* Atlas AASS v1.0 - utilitarios criptograficos simulados */
(function (window) {
  "use strict";

  window.AtlasAuth = window.AtlasAuth || {};

  function toHex(buffer) {
    return Array.from(new Uint8Array(buffer))
      .map(function (byte) { return byte.toString(16).padStart(2, "0"); })
      .join("");
  }

  async function sha256(value) {
    if (!window.crypto || !window.crypto.subtle) {
      throw new Error("Este navegador nao oferece suporte ao mecanismo seguro necessario.");
    }

    var bytes = new TextEncoder().encode(String(value));
    var digest = await window.crypto.subtle.digest("SHA-256", bytes);
    return toHex(digest);
  }

  function randomId() {
    if (window.crypto && window.crypto.getRandomValues) {
      var bytes = new Uint8Array(16);
      window.crypto.getRandomValues(bytes);
      return Array.from(bytes).map(function (byte) {
        return byte.toString(16).padStart(2, "0");
      }).join("");
    }

    return Date.now().toString(36) + Math.random().toString(36).slice(2);
  }

  window.AtlasAuth.crypto = Object.freeze({
    sha256: sha256,
    randomId: randomId
  });
})(window);
