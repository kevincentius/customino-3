"use strict";
exports.__esModule = true;
exports.PixiApplication = exports.resources = void 0;
var sample_display_1 = require("app/pixi/display/sample-display");
var pixi_js_1 = require("pixi.js");
var PixiApplication = /** @class */ (function () {
    function PixiApplication(canvas) {
        var _this = this;
        this.canvas = canvas;
        this.loaded = false;
        this.app = new pixi_js_1.Application({
            view: this.canvas,
            resizeTo: window
        });
        var loader = pixi_js_1.Loader.shared;
        loader
            .add('sample', 'assets/img/sample.png')
            .load(function (loader, res) {
            console.log('PIXI loader is finished!');
            exports.resources = res;
            _this.loaded = true;
            _this.app.stage.addChild(new sample_display_1.SampleDisplay());
        });
    }
    return PixiApplication;
}());
exports.PixiApplication = PixiApplication;
