"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cause = void 0;
/**
 * return type for functions that can return error
 */
class Cause {
    static isCause(val) {
        if (typeof val === "object" && val !== null)
            if ("ok" in val)
                if ("message" in val)
                    return typeof val.ok === "boolean" && typeof val.message === "string";
        return false;
    }
    constructor(ok = true, message = "") {
        this.ok = ok;
        this.message = message;
    }
}
exports.Cause = Cause;
