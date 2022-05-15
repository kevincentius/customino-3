"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.SampleDisplay = void 0;
var application_1 = require("app/pixi/application");
var pixi_js_1 = require("pixi.js");
var SampleDisplay = /** @class */ (function (_super) {
    __extends(SampleDisplay, _super);
    function SampleDisplay() {
        var _this = _super.call(this) || this;
        // create new sprite from loaded resource
        var resource = application_1.resources['sample'];
        var sprite = new pixi_js_1.Sprite(resource.texture);
        // set in a different position
        sprite.position.set(200, 300);
        // add the sprite to the stage
        _this.addChild(sprite);
        return _this;
    }
    return SampleDisplay;
}(pixi_js_1.Container));
exports.SampleDisplay = SampleDisplay;
