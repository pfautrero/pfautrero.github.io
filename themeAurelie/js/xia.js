//   This program is free software: you can redistribute it and/or modify
//   it under the terms of the GNU General Public License as published by
//   the Free Software Foundation, either version 3 of the License, or
//   (at your option) any later version.
//   This program is distributed in the hope that it will be useful,
//   but WITHOUT ANY WARRANTY; without even the implied warranty of
//   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//   GNU General Public License for more details.
//   You should have received a copy of the GNU General Public License
//   along with this program.  If not, see <http://www.gnu.org/licenses/>
//
//
// @author : Pascal Fautrero


/*
 *
 * @param {object} params
 * @constructor create image active object
 */
function IaObject(params) {
    "use strict";
    var that = this;
    this.path = [];
    this.xiaDetail = [];
    this.minX = 10000;
    this.minY = 10000;
    this.maxX = -10000;
    this.maxY = -10000;
    this.group = 0;
    this.jsonSource = params.detail

    this.jsonSource.maxX = parseFloat(this.jsonSource.maxX)
    this.jsonSource.minX = parseFloat(this.jsonSource.minX)
    this.jsonSource.maxY = parseFloat(this.jsonSource.maxY)
    this.jsonSource.minY = parseFloat(this.jsonSource.minY)

    this.iaScene = params.iaScene

    this.layer = params.layer;
    this.background_layer = params.background_layer;
    this.imageObj = params.imageObj;
    this.idText = params.idText;
    this.myhooks = params.myhooks;
    // Create kineticElements and include them in a group

    this.group = new Kinetic.Group();
    this.layer.add(this.group);

    if (typeof(params.detail.path) !== 'undefined') {
        that.includePath(params.detail, 0, params.idText);
    }
    else if (typeof(params.detail.image) !== 'undefined') {
        var re = /sprite(.*)/i;
        if (params.detail.id.match(re)) {
            that.includeSprite(params.detail, 0, params.idText);
        }
        else {
            that.includeImage(params.detail, 0, params.idText);
        }
    }
    else if (typeof(params.detail.group) !== 'undefined') {
        for (var i in params.detail.group) {
            if (typeof(params.detail.group[i].path) !== 'undefined') {
                that.includePath(params.detail.group[i], i, params.idText);
            }
            else if (typeof(params.detail.group[i].image) !== 'undefined') {
                var re = /sprite(.*)/i;
                if (params.detail.group[i].id.match(re)) {
                    that.includeSprite(params.detail.group[i], i, params.idText);
                }
                else {
                    that.includeImage(params.detail.group[i], i, params.idText);
                }
            }
        }
        that.definePathBoxSize(params.detail, that);
    }
    else {
        console.log(params.detail);
    }

    this.scaleBox(this, params.iaScene);
    this.myhooks.afterIaObjectConstructor(params.iaScene, params.idText, params.detail, this);
}

/*
 *
 * @param {type} detail
 * @param {type} i KineticElement index
 * @returns {undefined}
 */
IaObject.prototype.includeSprite = function(detail, i, idDOMElement) {

    this.defineImageBoxSize(detail, this);
    this.xiaDetail[i] = new XiaSprite(this, detail, idDOMElement)
    this.xiaDetail[i].start()

};

/*
 *
 * @param {type} detail
 * @param {type} i KineticElement index
 * @returns {undefined}
 */
IaObject.prototype.includeImage = function(detail, i, idDOMElement) {

    this.defineImageBoxSize(detail, this);
    this.xiaDetail[i] = new XiaImage(this, detail, idDOMElement)
    this.xiaDetail[i].start()

};


/*
 *
 * @param {type} path
 * @param {type} i KineticElement index
 * @returns {undefined}
 */
IaObject.prototype.includePath = function(detail, i, idDOMElement) {

    this.definePathBoxSize(detail, this);
    this.xiaDetail[i] = new XiaPath(this, detail, idDOMElement)
    this.xiaDetail[i].start()

};

/*
 *
 * @param {type} index
 * @returns {undefined}
 */
IaObject.prototype.defineImageBoxSize = function(detail, that) {
    "use strict";
    var that = this;
    if (that.minX === -1)
        that.minX = (parseFloat(detail.x));
    if (that.maxY === 10000)
        that.maxY = parseFloat(detail.y) + parseFloat(detail.height);
    if (that.maxX === -1)
        that.maxX = (parseFloat(detail.x) + parseFloat(detail.width));
    if (that.minY === 10000)
        that.minY = (parseFloat(detail.y));

    if (parseFloat(detail.x) < that.minX) that.minX = parseFloat(detail.x);
    if (parseFloat(detail.x) + parseFloat(detail.width) > that.maxX)
        that.maxX = parseFloat(detail.x) + parseFloat(detail.width);
    if (parseFloat(detail.y) < that.minY)
        that.miny = parseFloat(detail.y);
    if (parseFloat(detail.y) + parseFloat(detail.height) > that.maxY)
        that.maxY = parseFloat(detail.y) + parseFloat(detail.height);
};


/*
 *
 * @param {type} index
 * @returns {undefined}
 */
IaObject.prototype.definePathBoxSize = function(detail, that) {
    "use strict";
    if (  (typeof(detail.minX) !== 'undefined') &&
          (typeof(detail.minY) !== 'undefined') &&
          (typeof(detail.maxX) !== 'undefined') &&
          (typeof(detail.maxY) !== 'undefined')) {
        that.minX = detail.minX;
        that.minY = detail.minY;
        that.maxX = detail.maxX;
        that.maxY = detail.maxY;
    }
    else {
        console.log('definePathBoxSize failure');
    }
};


/*
 *
 */
IaObject.prototype.scaleBox = function(that, iaScene) {

    that.minX = that.minX * iaScene.coeff;
    that.minY = that.minY * iaScene.coeff;
    that.maxX = that.maxX * iaScene.coeff;
    that.maxY = that.maxY * iaScene.coeff;

};


//   This program is free software: you can redistribute it and/or modify
//   it under the terms of the GNU General Public License as published by
//   the Free Software Foundation, either version 3 of the License, or
//   (at your option) any later version.
//   This program is distributed in the hope that it will be useful,
//   but WITHOUT ANY WARRANTY; without even the implied warranty of
//   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//   GNU General Public License for more details.
//   You should have received a copy of the GNU General Public License
//   along with this program.  If not, see <http://www.gnu.org/licenses/>
//
//
// @author : pascal.fautrero@crdp.ac-versailles.fr

/**
 *
 * @param {type} originalWidth
 * @param {type} originalHeight
 * @constructor create image active scene
 */
function IaScene(originalWidth, originalHeight) {
    "use strict";
    var that = this;
    //  canvas width
    this.width = 1000;

    // canvas height
    this.height = 800;

    // default color used to fill shapes during mouseover
    var _colorOver = {red:0, green:0, blue:0, opacity:0.7};

    // default color used to fill stroke around shapes during mouseover
    var _colorOverStroke = {red:207, green:0, blue:15, opacity:1};

    // default color used to fill shapes if defined as cache
    this.colorPersistent = {red:124, green:154, blue:174, opacity:1};

    // Image ratio on the scene
    this.ratio = 1.00;

    // padding-top in the canvas
    this.y = 0;

    // Sprites frameRate
    this.frameRate = 10

    // internal
    this.score = 0;
    this.score2 = 0;

    this.currentShape = "";

    this.currentScore = 0;
    this.currentScore2 = 0;
    this.fullScreen = "off";
    this.overColor = 'rgba(' + _colorOver.red + ',' + _colorOver.green + ',' + _colorOver.blue + ',' + _colorOver.opacity + ')';
    this.overColorStroke = 'rgba(' + _colorOverStroke.red + ',' + _colorOverStroke.green + ',' + _colorOverStroke.blue + ',' + _colorOverStroke.opacity + ')';
    this.scale = 1;
    this.zoomActive = 0;
    this.element = 0;
    this.originalWidth = originalWidth;
    this.originalHeight = originalHeight;
    this.coeff = (this.width * this.ratio) / parseFloat(originalWidth);
    this.cursorState="";
    this.noPropagation = false;
}

/*
 * Scale entire scene
 *
 */
IaScene.prototype.scaleScene = function(mainScene){
    "use strict";
    var viewportWidth = $(window).width();
    var viewportHeight = $(window).height();

    var coeff_width = (viewportWidth * mainScene.ratio) / parseFloat(mainScene.originalWidth);
    var coeff_height = (viewportHeight) / (parseFloat(mainScene.originalHeight) + $('#canvas').offset().top + $('#container').offset().top);

    var canvas_border_left = parseFloat($("#canvas").css("border-left-width").substr(0,$("#canvas").css("border-left-width").length - 2));
    var canvas_border_right = parseFloat($("#canvas").css("border-right-width").substr(0,$("#canvas").css("border-right-width").length - 2));
    var canvas_border_top = parseFloat($("#canvas").css("border-top-width").substr(0,$("#canvas").css("border-top-width").length - 2));
    var canvas_border_bottom = parseFloat($("#canvas").css("border-bottom-width").substr(0,$("#canvas").css("border-bottom-width").length - 2));

    if ((viewportWidth >= parseFloat(mainScene.originalWidth) * coeff_width) && (viewportHeight >= ((parseFloat(mainScene.originalHeight) + $('#canvas').offset().top) * coeff_width))) {
        mainScene.width = viewportWidth - canvas_border_left - canvas_border_right;
        mainScene.coeff = (mainScene.width * mainScene.ratio) / parseFloat(mainScene.originalWidth);
        mainScene.height = parseFloat(mainScene.originalHeight) * mainScene.coeff;
    }
    else if ((viewportWidth >= parseFloat(mainScene.originalWidth) * coeff_height) && (viewportHeight >= (parseFloat(mainScene.originalHeight) + $('#canvas').offset().top) * coeff_height)) {
        mainScene.height = viewportHeight - $('#container').offset().top - $('#canvas').offset().top - canvas_border_top - canvas_border_bottom - 2;
        mainScene.coeff = (mainScene.height) / parseFloat(mainScene.originalHeight);
        mainScene.width = parseFloat(mainScene.originalWidth) * mainScene.coeff;
    }

    $('#container').css({"width": (mainScene.width + canvas_border_left + canvas_border_right) + 'px'});
    $('#container').css({"height": (mainScene.height + $('#canvas').offset().top - $('#container').offset().top + canvas_border_top + canvas_border_bottom) + 'px'});
    $('#canvas').css({"height": (mainScene.height) + 'px'});
    $('#canvas').css({"width": mainScene.width + 'px'});
    $('#detect').css({"height": (mainScene.height) + 'px'});
    $('#detect').css({"top": ($('#canvas').offset().top) + 'px'});
};

IaScene.prototype.mouseover = function(kineticElement) {
    if (this.cursorState.indexOf("ZoomOut.cur") !== -1) {

    }
    else if (this.cursorState.indexOf("ZoomIn.cur") !== -1) {

    }
    else if (this.cursorState.indexOf("HandPointer.cur") === -1) {
        if ((kineticElement.getXiaParent().options.indexOf("pointer") !== -1) && (!this.tooltip_area)) {
            document.body.style.cursor = "pointer";
        }
        this.cursorState = "url(img/HandPointer.cur),auto";

        // manage tooltips if present
        var tooltip = false;
        if (kineticElement.getXiaParent().tooltip != "") {
            tooltip = true;
        }
        else if ($("#" + kineticElement.getXiaParent().idText).data("tooltip") != "") {
            var tooltip_id = $("#" + kineticElement.getXiaParent().idText).data("tooltip");
            kineticElement.getXiaParent().tooltip = kineticElement.getStage().find("#" + tooltip_id)[0];
            tooltip = true;
        }
        if (tooltip) {
            kineticElement.getXiaParent().tooltip.clearCache();
            kineticElement.getXiaParent().tooltip.fillPriority('pattern');
            if ((kineticElement.getXiaParent().tooltip.backgroundImageOwnScaleX != "undefined") &&
                    (kineticElement.getXiaParent().tooltip.backgroundImageOwnScaleY != "undefined")) {
                kineticElement.getXiaParent().tooltip.fillPatternScaleX(kineticElement.getXiaParent().tooltip.backgroundImageOwnScaleX * 1/this.scale);
                kineticElement.getXiaParent().tooltip.fillPatternScaleY(kineticElement.getXiaParent().tooltip.backgroundImageOwnScaleY * 1/this.scale);
            }
            kineticElement.getXiaParent().tooltip.fillPatternImage(kineticElement.getXiaParent().tooltip.backgroundImage);
            kineticElement.getXiaParent().tooltip.getParent().moveToTop();
            //that.group.draw();
            kineticElement.getXiaParent().tooltip.draw();
        }

        //kineticElement.getIaObject().layer.batchDraw();
        //kineticElement.draw();
    }


};

IaScene.prototype.mouseout = function(kineticElement) {

    if ((this.cursorState.indexOf("ZoomOut.cur") !== -1) ||
            (this.cursorState.indexOf("ZoomIn.cur") !== -1)){

    }
    else {

        var mouseXY = kineticElement.getStage().getPointerPosition();
        if (typeof(mouseXY) == "undefined") {
            mouseXY = {x:0,y:0};
        }
        //if ((kineticElement.getStage().getIntersection(mouseXY) != kineticElement)) {

            // manage tooltips if present
            var tooltip = false;
            if (kineticElement.getXiaParent().tooltip != "") {
                tooltip = true;
            }
            else if ($("#" + kineticElement.getXiaParent().idText).data("tooltip") != "") {
                var tooltip_id = $("#" + kineticElement.getXiaParent().idText).data("tooltip");
                kineticElement.getXiaParent().tooltip = kineticElement.getStage().find("#" + tooltip_id)[0];
                tooltip = true;
            }
            if (tooltip) {
                kineticElement.getXiaParent().tooltip.fillPriority('color');
                kineticElement.getXiaParent().tooltip.fill('rgba(0, 0, 0, 0)');
                kineticElement.getXiaParent().tooltip.getParent().moveToBottom();
                kineticElement.getXiaParent().tooltip.draw();
                kineticElement.getIaObject().layer.draw();
            }

            document.body.style.cursor = "default";
            this.cursorState = "default";

        //}
        document.body.style.cursor = "default";
    }

};

IaScene.prototype.click = function(kineticElement, mousePos) {

    if (kineticElement.getXiaParent().click == "off") return;

    /*
     * if we click in this element, manage zoom-in, zoom-out
     */
    if (kineticElement.getXiaParent().options.indexOf("direct-link") !== -1) {
        location.href = kineticElement.getXiaParent().title;
    }
    else {

        this.noPropagation = true;
        var iaobject = kineticElement.getIaObject();
        for (var i in iaobject.xiaDetail) {
            if (iaobject.xiaDetail[i].persistent == "off") {
                if (iaobject.xiaDetail[i].kineticElement instanceof Kinetic.Image) {
                    iaobject.xiaDetail[i].kineticElement.fillPriority('pattern');
                    iaobject.xiaDetail[i].kineticElement.fillPatternScaleX(iaobject.xiaDetail[i].kineticElement.backgroundImageOwnScaleX * 1/this.scale);
                    iaobject.xiaDetail[i].kineticElement.fillPatternScaleY(iaobject.xiaDetail[i].kineticElement.backgroundImageOwnScaleY * 1/this.scale);
                    iaobject.xiaDetail[i].kineticElement.fillPatternImage(iaobject.xiaDetail[i].kineticElement.backgroundImage);
                }
                else {
                    iaobject.xiaDetail[i].kineticElement.fillPriority('color');
                    iaobject.xiaDetail[i].kineticElement.fill(this.overColor);
                    iaobject.xiaDetail[i].kineticElement.scale(this.coeff);
                    iaobject.xiaDetail[i].kineticElement.stroke(this.overColorStroke);
                    iaobject.xiaDetail[i].kineticElement.strokeWidth(2);
                }

            }
            else if (iaobject.xiaDetail[i].persistent == "onPath") {
                iaobject.xiaDetail[i].kineticElement.fillPriority('color');
                iaobject.xiaDetail[i].kineticElement.fill('rgba(' + this.colorPersistent.red + ',' + this.colorPersistent.green + ',' + this.colorPersistent.blue + ',' + this.colorPersistent.opacity + ')');
            }
            else if (iaobject.xiaDetail[i].persistent == "onImage") {
                iaobject.xiaDetail[i].kineticElement.fillPriority('pattern');
                iaobject.xiaDetail[i].kineticElement.fillPatternScaleX(iaobject.xiaDetail[i].kineticElement.backgroundImageOwnScaleX * 1/this.scale);
                iaobject.xiaDetail[i].kineticElement.fillPatternScaleY(iaobject.xiaDetail[i].kineticElement.backgroundImageOwnScaleY * 1/this.scale);
                iaobject.xiaDetail[i].kineticElement.fillPatternImage(iaobject.xiaDetail[i].kineticElement.backgroundImage);
            }
            else if ((iaobject.xiaDetail[i].persistent == "persistentSprite") || (iaobject.xiaDetail[i].persistent == "hiddenSprite")) {
                iaobject.xiaDetail[i].kineticElement.animation('idle')
                iaobject.xiaDetail[i].kineticElement.frameIndex(0)
            }
            //iaobject.xiaDetail[i].kineticElement.moveToTop();
            iaobject.xiaDetail[i].kineticElement.draw();
        }

        //iaobject.group.moveToTop();
        //iaobject.layer.draw();
        this.element = iaobject;
        iaobject.myhooks.afterIaObjectFocus(this, kineticElement.getXiaParent().idText, iaobject, kineticElement);
        iaobject.layer.getStage().completeImage = "redefine";

    }

};

//   This program is free software: you can redistribute it and/or modify
//   it under the terms of the GNU General Public License as published by
//   the Free Software Foundation, either version 3 of the License, or
//   (at your option) any later version.
//   This program is distributed in the hope that it will be useful,
//   but WITHOUT ANY WARRANTY; without even the implied warranty of
//   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//   GNU General Public License for more details.
//   You should have received a copy of the GNU General Public License
//   along with this program.  If not, see <http://www.gnu.org/licenses/>
//
//
// @author : pascal.fautrero@ac-versailles.fr
// @version=xxx

/*
 * Main
 * Initialization
 *
 * 1rst layer : div "detect" - if clicked, enable canvas events
 * 2nd layer : bootstrap accordion
 * 3rd layer : div "canvas" containing images and paths
 * 4th layer : div "disablearea" - if clicked, disable events canvas
 */

function XiaLauncher(myhooks) {
    "use strict";
    var that=window;
    that.canvas = document.getElementById("canvas");

    this.backgroundLoaded = $.Deferred()

    this.backgroundLoaded.done(function(value){

      // fix bug in retina and amoled screens
      Kinetic.pixelRatio = 1;

      Kinetic.Util.addMethods(Kinetic.Path,{
          setIaObject: function(iaobject) {
              this.iaobject = iaobject;
          },
          getIaObject: function() {
              return this.iaobject;
          }
      });

      Kinetic.Util.addMethods(Kinetic.Image,{
          setIaObject: function(iaobject) {
              this.iaobject = iaobject;
          },
          getIaObject: function() {
              return this.iaobject;
          }
      });

      Kinetic.Util.addMethods(Kinetic.Sprite,{
          setIaObject: function(iaobject) {
              this.iaobject = iaobject;
          },
          getIaObject: function() {
              return this.iaobject;
          }
      });

      Kinetic.Util.addMethods(Kinetic.Path,{
          setXiaParent: function(xiaparent) {
              this.xiaparent = xiaparent;
          },
          getXiaParent: function() {
              return this.xiaparent;
          }
      });
      Kinetic.Util.addMethods(Kinetic.Image,{
          setXiaParent: function(xiaparent) {
              this.xiaparent = xiaparent;
          },
          getXiaParent: function() {
              return this.xiaparent;
          }
      });

      Kinetic.Util.addMethods(Kinetic.Sprite,{
          setXiaParent: function(xiaparent) {
              this.xiaparent = xiaparent;
          },
          getXiaParent: function() {
              return this.xiaparent;
          }
      });

      // Load background image

      that.imageObj = new Image();

      that.imageObj.onload = function() {

          var mainScene = new IaScene(scene.width,scene.height);
          mainScene.scale = 1;
          mainScene.scaleScene(mainScene);

          var stage = new Kinetic.Stage({
              container: 'canvas',
              width: mainScene.width,
              height: mainScene.height
          });
          stage.on("mouseout touchend", function(){
              var shape = Kinetic.shapes[mainScene.currentShape];
              if (typeof(shape) != "undefined") {
                  mainScene.mouseout(shape);
              }
              mainScene.currentShape = "";
          });

          stage.on("click tap", function(){
              mainScene.currentShape = "";
              if ((mainScene.currentShape == "") || (typeof(mainScene.currentShape) == "undefined")) {
                  var mousePos = this.getPointerPosition();
                  var imageDest = mainScene.completeImage.data;
                  var position1 = 0;
                  position1 = 4 * (Math.floor(mousePos.y) * Math.floor(mainScene.width) + Math.floor(mousePos.x));
                  mainScene.currentShape = "#" + Kinetic.Util._rgbToHex(imageDest[position1 + 0], imageDest[position1 + 1], imageDest[position1 + 2]);
              }

              var shape = Kinetic.shapes[mainScene.currentShape];
              if (typeof(shape) != "undefined") {
                if (typeof(shape.getXiaParent().imgData) !== "undefined") {
                    var pos = {
                        x : Math.floor((mousePos.x - shape.x()) / mainScene.coeff),
                        y : Math.floor((mousePos.y - shape.y()) / mainScene.coeff)
                    }
                    frameIndex = (typeof(shape.getXiaParent().timeLine) !== "undefined") ? shape.getXiaParent().timeLine[shape.frameIndex()] : 0
                    if (typeof(shape.getXiaParent().timeLine) !== "undefined") {
                        var index = Math.floor(pos.y * shape.getXiaParent().imgData[frameIndex].width + pos.x)
                        var imgDataArray = shape.getXiaParent().imgData[frameIndex].data;
                    }
                    else {
                        var index = Math.floor(pos.y * shape.getXiaParent().imgData.width + frameIndex * shape.getXiaParent().width + pos.x)
                        var imgDataArray = shape.getXiaParent().imgData.data;
                    }
                    if (imgDataArray[index*4+3] == 0) {
                        // sprite not touched (Alpha = 0)
                        var shapesArray = Object.keys(Kinetic.shapes)
                        for (var i = shapesArray.length - 1; i >= 1; i--) {
                            if (shapesArray[i] != mainScene.currentShape) {
                                shape = Kinetic.shapes[shapesArray[i]]
                                var pos = {
                                    x : Math.floor((mousePos.x - shape.x()) / mainScene.coeff),
                                    y : Math.floor((mousePos.y - shape.y()) / mainScene.coeff)
                                }
                                if ((mousePos.x > shape.x()) && (mousePos.x < shape.x() + shape.getXiaParent().width)) {
                                    if ((mousePos.y > shape.y()) && (mousePos.y < shape.y() + shape.getXiaParent().height)) {
                                        if (typeof(shape.getXiaParent().timeLine) !== "undefined") {
                                            var frameIndex = shape.getXiaParent().timeLine[shape.frameIndex()]
                                            var index = pos.y * shape.getXiaParent().imgData[frameIndex].width + pos.x
                                            var d = shape.getXiaParent().imgData[frameIndex].data;

                                            if (d[index*4+3] !== 0) {
                                                shape.stop()
                                                shape.hide()
                                                mainScene.click(shape, mousePos);
                                                break
                                            }
                                        }
                                        else {
                                            if (typeof(shape.getXiaParent().imgData) !== "undefined") {
                                                var index = pos.y * shape.getXiaParent().imgData.width + pos.x
                                                var d = shape.getXiaParent().imgData.data;
                                                if (d[index*4+3] != 0) {
                                                    mainScene.click(shape, mousePos);
                                                    break
                                                }
                                            }
                                            else {
                                                mainScene.click(shape, mousePos);
                                                break
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        return
                    }
                }
                if (typeof(shape.getXiaParent().timeLine) !== "undefined") {
                    shape.stop()
                    shape.hide()
                }
                mainScene.click(shape, mousePos);
              }
          });

          stage.on("mousemove touchstart", function(){
              var mousePos = this.getPointerPosition();
              var imageDest = mainScene.completeImage.data;
              var position1 = 0;
              position1 = 4 * (Math.floor(mousePos.y) * Math.floor(mainScene.width) + Math.floor(mousePos.x));
              var shape_id = Kinetic.Util._rgbToHex(imageDest[position1 + 0], imageDest[position1 + 1], imageDest[position1 + 2]);
              var shape = Kinetic.shapes["#" + shape_id];
              if (typeof(shape) != "undefined") {
                  if (shape.colorKey != mainScene.currentShape) {
                      if (mainScene.currentShape != "") {
                          var oldShape = Kinetic.shapes[mainScene.currentShape];
                          if (typeof(oldShape) != "undefined") {
                              mainScene.mouseout(oldShape);
                          }
                      }
                      mainScene.currentShape = shape.colorKey;
                      mainScene.mouseover(shape);
                  }
              }
              else {
                  var shape = Kinetic.shapes[mainScene.currentShape];
                  if (typeof(shape) != "undefined") {
                      mainScene.mouseout(shape);
                  }
                  mainScene.currentShape = "";
              }
          });
          // area containing image background
          var baseImage = new Kinetic.Image({
              x: 0,
              y: mainScene.y,
              width: scene.width,
              height: scene.height,
              scale: {x:mainScene.coeff,y:mainScene.coeff},
              image: that.imageObj
          });


          var layers = [];
          that.layers = layers;
          layers[0] = new Kinetic.FastLayer();
          layers[0].add(baseImage);
          stage.add(layers[0]);
          myhooks.beforeMainConstructor(mainScene, that.layers);
          var indice = 1;
          layers[indice] = new Kinetic.Layer();
          stage.add(layers[indice]);

          for (var i in details) {
              var iaObj = new IaObject({
                  imageObj: that.imageObj,
                  detail: details[i],
                  layer: layers[indice],
                  idText: "article-" + i,
                  baseImage: baseImage,
                  iaScene: mainScene,
                  background_layer: layers[0],
                  myhooks: myhooks
              });
          }

          var hitCanvas = layers[indice].getHitCanvas();
          mainScene.completeImage = hitCanvas.getContext().getImageData(0,0,Math.floor(hitCanvas.width),Math.floor(hitCanvas.height));


          myhooks.afterMainConstructor(mainScene, that.layers);
          $("#splash").fadeOut("slow", function(){
                  $("#loader").hide();
          });
          var viewportHeight = $(window).height();
          if (scene.description != "") {
              $("#rights").show();
              var content_offset = $("#rights").offset();
              var message_height = $("#popup_intro").css('height').substr(0,$("#popup_intro").css("height").length - 2);
              $("#popup_intro").css({'top':(viewportHeight - content_offset.top - message_height)/ 2 - 40});
              $("#popup_intro").show();
              $("#popup").hide();
              $("#popup_close_intro").on("click", function(){
                  $("#rights").hide();
              });
          }
          // FullScreen ability
          // source code from http://blogs.sitepointstatic.com/examples/tech/full-screen/index.html
          var e = document.getElementById("title");
          var div_container = document.getElementById("image-active");
          e.onclick = function() {
              if (runPrefixMethod(document, "FullScreen") || runPrefixMethod(document, "IsFullScreen")) {
                  runPrefixMethod(document, "CancelFullScreen");
              }
              else {
                  runPrefixMethod(div_container, "RequestFullScreen");
              }
              mainScene.fullScreen = mainScene.fullScreen == "on" ? "off": "on";
          };

          var pfx = ["webkit", "moz", "ms", "o", ""];
          function runPrefixMethod(obj, method) {
              var p = 0, m, t;
              while (p < pfx.length && !obj[m]) {
                  m = method;
                  if (pfx[p] === "") {
                      m = m.substr(0,1).toLowerCase() + m.substr(1);
                  }
                  m = pfx[p] + m;
                  t = typeof obj[m];
                  if (t != "undefined") {
                      pfx = [pfx[p]];
                      return (t == "function" ? obj[m]() : obj[m]);
                  }
                  p++;
              }
          }

      }
      that.imageObj.src = scene.image
    })

    if (scene.path !== "") {
      var tempCanvas = this.convertPath2Image(scene)
      scene.image = tempCanvas.toDataURL()
      this.backgroundLoaded.resolve(0)
    }
    else if (typeof(scene.group) !== "undefined") {
      this.convertGroup2Image(scene)
    }
    else {
      this.backgroundLoaded.resolve(0)
    }

}

/*
 * convert path to image if this path is used as background
 * transform scene.path to scene.image
 */
XiaLauncher.prototype.convertPath2Image = function(scene) {
  var tempCanvas = document.createElement('canvas')
  tempCanvas.setAttribute('width', scene.width)
  tempCanvas.setAttribute('height', scene.height)
  var tempContext = tempCanvas.getContext('2d')
  // Arghh...forced to remove single quotes from scene.path...
  var currentPath = new Path2D(scene.path.replace(/'/g, ""))
  tempContext.beginPath()
  tempContext.fillStyle = scene.fill
  tempContext.fill(currentPath)
  tempContext.strokeStyle = scene.stroke
  tempContext.lineWidth = scene.strokewidth
  tempContext.stroke(currentPath)
  //scene.image = tempCanvas.toDataURL()
  return tempCanvas
}
XiaLauncher.prototype.convertGroup2Image = function(scene) {
  var nbImages = 0
  var nbImagesLoaded = 0
  var tempCanvas = document.createElement('canvas')
  tempCanvas.setAttribute('width', scene.width)
  tempCanvas.setAttribute('height', scene.height)
  var tempContext = tempCanvas.getContext('2d')
  tempContext.beginPath()
  for (var i in scene['group']) {
    if (typeof(scene['group'][i].image) != "undefined") {
      nbImages++
    }
  }
  for (var i in scene['group']) {
      if (typeof(scene['group'][i].path) != "undefined") {
        // Arghh...forced to remove single quotes from scene.path...
        var currentPath = new Path2D(scene['group'][i].path.replace(/'/g, ""))
        tempContext.fillStyle = scene['group'][i].fill
        tempContext.fill(currentPath)
        tempContext.strokeStyle = scene['group'][i].stroke
        tempContext.lineWidth = scene['group'][i].strokewidth
        tempContext.stroke(currentPath)
      }
      else if (typeof(scene['group'][i].image) != "undefined") {
        var tempImage = new Image()
        tempImage.onload = (function(XiaLauncher, imageItem){
          return function(){
              tempContext.drawImage(this, 0, 0, this.width, this.height, imageItem.x, imageItem.y, this.width, this.height)
              nbImagesLoaded++
              if (nbImages == nbImagesLoaded) {
                  scene.image = tempCanvas.toDataURL()
                  XiaLauncher.backgroundLoaded.resolve(0)
              }
          }
        })(this, scene['group'][i])

        tempImage.src = scene['group'][i].image
      }
  }
  if (nbImages == 0) {
    scene.image = tempCanvas.toDataURL()
    this.backgroundLoaded.resolve(0)
  }
}
XiaLauncher.prototype.iframe = function() {
    $(".videoWrapper16_9").each(function(){
        var source = $(this).data("iframe");
        var iframe = document.createElement("iframe");
        iframe.src = source;
        $(this).append(iframe);
    });

    $(".videoWrapper4_3").each(function(){
        var source = $(this).data("iframe");
        var iframe = document.createElement("iframe");
        iframe.src = source;
        $(this).append(iframe);
    });
    $(".flickr_oembed").each(function(){
        var source = $(this).data("oembed");
        var that = $(this);
        $.ajax({
            url: "http://www.flickr.com/services/oembed/?format=json&callback=?&jsoncallback=xia&url=" + source,
            dataType: 'jsonp',
            jsonpCallback: 'xia',
            success: function (data) {
                var url = data.url;
                var newimg = document.createElement("img");
                newimg.src = url;
                that.append(newimg);
            }
        });
    });
}

if (typeof module !== 'undefined' && module.exports != null) {
     exports.XiaLauncher = XiaLauncher
}
//   This program is free software: you can redistribute it and/or modify
//   it under the terms of the GNU General Public License as published by
//   the Free Software Foundation, either version 3 of the License, or
//   (at your option) any later version.
//   This program is distributed in the hope that it will be useful,
//   but WITHOUT ANY WARRANTY; without even the implied warranty of
//   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//   GNU General Public License for more details.
//   You should have received a copy of the GNU General Public License
//   along with this program.  If not, see <http://www.gnu.org/licenses/>
//   
//   
// @author : pascal.fautrero@ac-versailles.fr


/*
 * 
 */
class XiaDetail {
  constructor(parent, detail, idText) {
    this.parent = parent
    this.detail = detail
    this.idText = idText
    this.click = "on"
    this.title = this.parent.jsonSource.title
    this.path = ""
    this.kineticElement = null
    this.persistent = ""
    this.options = ""
    this.backgroundImage = null
    this.tooltip = null
    this.zoomable = true

    if ((typeof(this.parent.jsonSource.options) !== 'undefined')) {
        this.options = this.parent.jsonSource.options
    }
    if (this.options.indexOf("disable-click") !== -1) {
        this.click = "off"
    }
    if ((typeof(this.parent.jsonSource.fill) !== 'undefined') &&
        (this.parent.jsonSource.fill === "#000000")) {
        this.zoomable = false;
    }
  }

  manageDropAreaAndTooltips() {
    // tooltip must be at the bottom
    if ($('article[data-tooltip="' + $("#" + this.idText).data("kinetic_id") + '"]').length != 0) {
        this.kineticElement.getParent().moveToBottom();
        this.options += " disable-click ";
        this.kineticElement.tooltip_area = true;
        // disable hitArea for tooltip
        this.kineticElement.hitFunc(function(context){
            context.beginPath();
            context.rect(0,0,0,0);
            context.closePath();
            context.fillStrokeShape(this);
        });
    }
  }
}

if (typeof module !== 'undefined' && module.exports != null) {
    exports.XiaDetail = XiaDetail
}
//   This program is free software: you can redistribute it and/or modify
//   it under the terms of the GNU General Public License as published by
//   the Free Software Foundation, either version 3 of the License, or
//   (at your option) any later version.
//   This program is distributed in the hope that it will be useful,
//   but WITHOUT ANY WARRANTY; without even the implied warranty of
//   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//   GNU General Public License for more details.
//   You should have received a copy of the GNU General Public License
//   along with this program.  If not, see <http://www.gnu.org/licenses/>
//   
//   
// @author : Pascal Fautrero


/*
 * 
 */
class XiaImage extends XiaDetail {

    constructor(parent, detail, idText){
        super(parent, detail, idText)
        //this.zoomable = true
        this.width = this.detail.width * this.parent.iaScene.scale
        this.height = this.detail.height * this.parent.iaScene.scale
        this.persistent = "off"
    }

    start() {
        var rasterObj = new Image()

        this.kineticElement = new Kinetic.Image({
            id: this.parent.jsonSource.id,
            name: this.parent.jsonSource.title,
            x: parseFloat(this.detail.x) * this.parent.iaScene.coeff,
            y: parseFloat(this.detail.y) * this.parent.iaScene.coeff + this.parent.iaScene.y,
            width: this.detail.width,
            height: this.detail.height,
            scale: {x:this.parent.iaScene.coeff,y:this.parent.iaScene.coeff}
        })

        this.kineticElement.setXiaParent(this)
        this.kineticElement.setIaObject(this.parent)

        this.kineticElement.backgroundImage = rasterObj
        this.tooltip = ""

        this.kineticElement.droparea = false
        this.kineticElement.tooltip_area = false

        var that = this
        rasterObj.onload = function() {

            that.kineticElement.backgroundImageOwnScaleX = that.parent.iaScene.scale * that.detail.width / that.width;
            that.kineticElement.backgroundImageOwnScaleY = that.parent.iaScene.scale * that.detail.height / that.height;
            that.parent.group.add(that.kineticElement)

            if ((typeof(that.parent.jsonSource.fill) !== 'undefined') &&
                (that.parent.jsonSource.fill === "#000000")) {
                that.zoomable = false;
            }

            if ((typeof(that.parent.jsonSource.fill) !== 'undefined') &&
                (that.parent.jsonSource.fill === "#ffffff")) {
                that.persistent = "onImage";
                that.kineticElement.fillPriority('pattern');
                that.kineticElement.fillPatternScaleX(that.kineticElement.backgroundImageOwnScaleX * 1/that.parent.iaScene.scale);
                that.kineticElement.fillPatternScaleY(that.kineticElement.backgroundImageOwnScaleY * 1/that.parent.iaScene.scale);
                that.kineticElement.fillPatternImage(that.kineticElement.backgroundImage);
                that.zoomable = false;
            }


            // define hit area excluding transparent pixels

            var cropX = Math.max(parseFloat(that.detail.minX), 0);
            var cropY = Math.max(parseFloat(that.detail.minY), 0);
            var cropWidth = (Math.min(parseFloat(that.detail.maxX) - parseFloat(that.detail.minX), Math.floor(parseFloat(that.parent.iaScene.originalWidth) * 1)));
            var cropHeight = (Math.min(parseFloat(that.detail.maxY) - parseFloat(that.detail.minY), Math.floor(parseFloat(that.parent.iaScene.originalHeight) * 1)));
            if (cropX + cropWidth > that.parent.iaScene.originalWidth * 1) {
                cropWidth = Math.abs(that.parent.iaScene.originalWidth * 1 - cropX * 1);
            }
            if (cropY * 1 + cropHeight > that.parent.iaScene.originalHeight * 1) {
                cropHeight = Math.abs(that.parent.iaScene.originalHeight * 1 - cropY * 1);
            }

            var hitCanvas = that.parent.layer.getHitCanvas();
            that.parent.iaScene.completeImage = hitCanvas.getContext().getImageData(0,0,Math.floor(hitCanvas.width),Math.floor(hitCanvas.height));

            var canvas_source = document.createElement('canvas');
            canvas_source.setAttribute('width', that.detail.width);
            canvas_source.setAttribute('height', that.detail.height);
            var context_source = canvas_source.getContext('2d');
            context_source.drawImage(rasterObj,0,0, (that.detail.width), (that.detail.height));
            //document.body.appendChild(canvas_source)
            that.imgData = context_source.getImageData(0,0,canvas_source.width,canvas_source.height);

            /* that.xiaDetail[i].kineticElement.sceneFunc(function(context) {
                var yo = that.layer.getHitCanvas().getContext().getImageData(0,0,iaScene.width, iaScene.height);
                context.putImageData(yo, 0,0);
            });*/
            //that.addEventsManagement(i,zoomable, that, iaScene, baseImage, idText);
            that.manageDropAreaAndTooltips()
            that.parent.group.draw();

        };
        rasterObj.src = this.detail.image;

    }
}
if (typeof module !== 'undefined' && module.exports != null) {
     exports.XiaImage = XiaImage
}
//   This program is free software: you can redistribute it and/or modify
//   it under the terms of the GNU General Public License as published by
//   the Free Software Foundation, either version 3 of the License, or
//   (at your option) any later version.
//   This program is distributed in the hope that it will be useful,
//   but WITHOUT ANY WARRANTY; without even the implied warranty of
//   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//   GNU General Public License for more details.
//   You should have received a copy of the GNU General Public License
//   along with this program.  If not, see <http://www.gnu.org/licenses/>
//   
//   
// @author : Pascal Fautrero


/*
 * 
 */
class XiaPath extends XiaDetail {

    constructor(parent, detail, idText){
        super(parent, detail, idText)
        //this.zoomable = true
        this.width = this.detail.width * this.parent.iaScene.scale
        this.height = this.detail.height * this.parent.iaScene.scale
        this.persistent = "off"
        this.path = this.detail.path;
    }

    start() {


        // if detail is out of background, hack maxX and maxY
        if (parseFloat(this.detail.maxX) < 0) this.detail.maxX = 1;
        if (parseFloat(this.detail.maxY) < 0) this.detail.maxY = 1;
        this.kineticElement = new Kinetic.Path({
            id: this.parent.jsonSource.id,
            name: this.parent.jsonSource.title,
            data: this.detail.path,
            x: parseFloat(this.detail.x) * this.parent.iaScene.coeff,
            y: parseFloat(this.detail.y) * this.parent.iaScene.coeff + this.parent.iaScene.y,
            scale: {x:this.parent.iaScene.coeff,y:this.parent.iaScene.coeff},
            fill: 'rgba(0, 0, 0, 0)'
        });
        this.kineticElement.droparea = false;
        this.kineticElement.tooltip_area = false;

        // create path in a standalone image
        // to manage hitArea if this detail is under sprite...
        var tempCanvas = document.createElement('canvas')
        tempCanvas.setAttribute('width', this.detail.width)
        tempCanvas.setAttribute('height', this.detail.height)
        var tempContext = tempCanvas.getContext('2d')
        // Arghh...forced to remove single quotes from scene.path...
        var currentPath = new Path2D(this.detail.path.replace(/'/g, ""))
        tempContext.translate((-1) * this.detail.minX, (-1) * this.detail.minY)
        tempContext.fillStyle = "rgba(255, 255, 255, 255)"
        tempContext.fill(currentPath)
        this.imgData = tempContext.getImageData(0,0,tempCanvas.width,tempCanvas.height);
        //document.body.appendChild(tempCanvas)



        this.kineticElement.setXiaParent(this);
        this.kineticElement.setIaObject(this.parent);
        this.tooltip = "";

        // crop background image to suit shape box
        this.parent.cropCanvas = document.createElement('canvas');
        this.parent.cropCanvas.setAttribute('width', parseFloat(this.detail.maxX) - parseFloat(this.detail.minX));
        this.parent.cropCanvas.setAttribute('height', parseFloat(this.detail.maxY) - parseFloat(this.detail.minY));
        var cropCtx = this.parent.cropCanvas.getContext('2d');
        var cropX = Math.max(parseFloat(this.detail.minX), 0);
        var cropY = Math.max(parseFloat(this.detail.minY), 0);
        var cropWidth = (Math.min((parseFloat(this.detail.maxX) - parseFloat(this.detail.minX)) * this.parent.iaScene.scale, Math.floor(parseFloat(this.parent.iaScene.originalWidth) * this.parent.iaScene.scale)));
        var cropHeight = (Math.min((parseFloat(this.detail.maxY) - parseFloat(this.detail.minY)) * this.parent.iaScene.scale, Math.floor(parseFloat(this.parent.iaScene.originalHeight) * this.parent.iaScene.scale)));
        if (cropX * this.parent.iaScene.scale + cropWidth > this.parent.iaScene.originalWidth * this.parent.iaScene.scale) {
             cropWidth = this.parent.iaScene.originalWidth * this.parent.iaScene.scale - cropX * this.parent.iaScene.scale;
        }
        if (cropY * this.parent.iaScene.scale + cropHeight > this.parent.iaScene.originalHeight * this.parent.iaScene.scale) {
             cropHeight = this.parent.iaScene.originalHeight * this.parent.iaScene.scale - cropY * this.parent.iaScene.scale;
        }
        // bad workaround to avoid null dimensions
        if (cropWidth <= 0) cropWidth = 1;
        if (cropHeight <= 0) cropHeight = 1;
        cropCtx.drawImage(
            this.parent.imageObj,
            cropX * this.parent.iaScene.scale,
            cropY * this.parent.iaScene.scale,
            cropWidth,
            cropHeight,
            0,
            0,
            cropWidth,
            cropHeight
        );
        var dataUrl = this.parent.cropCanvas.toDataURL();
        delete this.parent.cropCanvas;
        var cropedImage = new Image();


        var that = this
        cropedImage.onload = function() {
            that.kineticElement.backgroundImage = cropedImage;
            that.kineticElement.backgroundImageOwnScaleX = 1;
            that.kineticElement.backgroundImageOwnScaleY = 1;
            that.kineticElement.fillPatternRepeat('no-repeat');
            that.kineticElement.fillPatternX(that.detail.minX);
            that.kineticElement.fillPatternY(that.detail.minY);
        };
        cropedImage.src = dataUrl
        var zoomable = true
        if ((typeof(this.detail.fill) !== 'undefined') &&
            (this.detail.fill === "#000000")) {
            zoomable = false
        }
        this.persistent = "off"
        if ((typeof(this.detail.fill) !== 'undefined') &&
            (this.detail.fill === "#ffffff")) {
            this.persistent = "onPath"
            this.kineticElement.fill('rgba(' + this.parent.iaScene.colorPersistent.red + ',' + this.parent.iaScene.colorPersistent.green + ',' + this.parent.iaScene.colorPersistent.blue + ',' + this.parent.iaScene.colorPersistent.opacity + ')');
        }
        //that.addEventsManagement(i, zoomable, that, iaScene, baseImage, idText);
        this.manageDropAreaAndTooltips()

        this.parent.group.add(this.kineticElement)
        this.parent.group.draw()

    }
}
if (typeof module !== 'undefined' && module.exports != null) {
     exports.XiaPath = XiaPath
}
//   This program is free software: you can redistribute it and/or modify
//   it under the terms of the GNU General Public License as published by
//   the Free Software Foundation, either version 3 of the License, or
//   (at your option) any later version.
//   This program is distributed in the hope that it will be useful,
//   but WITHOUT ANY WARRANTY; without even the implied warranty of
//   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//   GNU General Public License for more details.
//   You should have received a copy of the GNU General Public License
//   along with this program.  If not, see <http://www.gnu.org/licenses/>
//   
//   
// @author : Pascal Fautrero


/*
 * 
 */
class XiaSprite extends XiaDetail {

    constructor(parent, detail, idText){
        super(parent, detail, idText)
        this.zoomable = false
        this.width = this.parent.jsonSource.width * this.parent.iaScene.scale
        this.height = this.parent.jsonSource.height * this.parent.iaScene.scale
        this.timeLine = JSON.parse("[" + this.parent.jsonSource.timeline + "]")
        this.idle = this.createTimeLine(this.timeLine)
        this.persistent = "hiddenSprite";
    }

    createTimeLine(timeLine) {
        "use strict"
        var idle = []
        for(var k = 0; k < timeLine.length; k++) {
            idle.push(timeLine[k] * this.parent.jsonSource.width, 0, this.parent.jsonSource.width, this.parent.jsonSource.height)
        }
        return idle
    }

    start() {
        var rasterObj = new Image();
        this.kineticElement = new Kinetic.Sprite({
          x: parseFloat(this.parent.jsonSource.x) * this.parent.iaScene.coeff,
          y: parseFloat(this.parent.jsonSource.y) * this.parent.iaScene.coeff + this.parent.iaScene.y,
          image: rasterObj,
          animation: 'idle',
          animations: {
            idle: this.idle,
            hidden : [
                this.timeLine.length * this.parent.jsonSource.width, 0,
                this.parent.jsonSource.width, this.parent.jsonSource.height
            ]
          },
          frameRate: this.parent.iaScene.frameRate,
          frameIndex: 0,
          scale: {x:this.parent.iaScene.coeff,y:this.parent.iaScene.coeff}
        });

        this.kineticElement.setXiaParent(this);
        this.kineticElement.setIaObject(this.parent);

        this.kineticElement.backgroundImage = rasterObj;
        this.tooltip = "";
        this.kineticElement.droparea = false;
        this.kineticElement.tooltip_area = false;

        var that = this
        rasterObj.onload = function() {

            that.kineticElement.backgroundImageOwnScaleX = that.parent.iaScene.scale * that.parent.jsonSource.width / that.width;
            that.kineticElement.backgroundImageOwnScaleY = that.parent.iaScene.scale * that.parent.jsonSource.height / that.height;

            that.parent.group.add(that.kineticElement);

            that.imgData = []
            for (var k = 0; k < Math.max.apply(null, that.timeLine) + 1; k++) {
                var canvas_source = document.createElement('canvas')
                canvas_source.setAttribute('width', that.parent.jsonSource.width)
                canvas_source.setAttribute('height', that.parent.jsonSource.height)
                var context_source = canvas_source.getContext('2d')

                context_source.drawImage(
                    rasterObj,
                    that.parent.jsonSource.width * k,
                    0,
                    that.parent.jsonSource.width,
                    that.parent.jsonSource.height,
                    0,
                    0,
                    that.parent.jsonSource.width,
                    that.parent.jsonSource.height
                )

                //document.body.appendChild(canvas_source)
                that.imgData[k] = context_source.getImageData(0,0,canvas_source.width,canvas_source.height)
            }

            that.kineticElement.animation('hidden')
            that.kineticElement.start();
            if ((typeof(that.parent.jsonSource.fill) !== 'undefined') &&
                (that.parent.jsonSource.fill == "#ffffff")) {
                that.persistent = "persistentSprite";
                that.kineticElement.animation('idle')
             }
            //that.parent.addEventsManagement(i,that.zoomable, that.parent, that.parent.iaScene, that.parent.baseImage, that.idText);
            that.manageDropAreaAndTooltips()
            that.parent.group.draw()
            var hitCanvas = that.parent.layer.getHitCanvas();
            that.parent.iaScene.completeImage = hitCanvas.getContext().getImageData(0,0,Math.floor(hitCanvas.width),Math.floor(hitCanvas.height));
        };
        rasterObj.src = this.parent.jsonSource.image;

    }
}
if (typeof module !== 'undefined' && module.exports != null) {
     exports.XiaSprite = XiaSprite
}
// XORCipher - Super simple encryption using XOR and Base64
// MODIFIED VERSION TO AVOID underscore dependancy
// License : MIT
// 
// As a warning, this is **not** a secure encryption algorythm. It uses a very
// simplistic keystore and will be easy to crack.
//
// The Base64 algorythm is a modification of the one used in phpjs.org
// * http://phpjs.org/functions/base64_encode/
// * http://phpjs.org/functions/base64_decode/
//
// Examples
// --------
//
// XORCipher.encode("test", "foobar"); // => "EgocFhUX"
// XORCipher.decode("test", "EgocFhUX"); // => "foobar"
//
/* jshint forin:true, noarg:true, noempty:true, eqeqeq:true, strict:true,
undef:true, unused:true, curly:true, browser:true, indent:2, maxerr:50 */
/* global _ */

(function(window) {
    "use strict";

    var XORCipher = {
        encode: function(key, data) {
            data = xor_encrypt(key, data);
            return b64_encode(data);
        },
        decode: function(key, data) {
            data = b64_decode(data);
            return xor_decrypt(key, data);
        }
    };

    var b64_table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    function b64_encode(data) {
        var o1, o2, o3, h1, h2, h3, h4, bits, r, i = 0, enc = "";
        if (!data) { return data; }
        do {
        o1 = data[i++];
        o2 = data[i++];
        o3 = data[i++];
        bits = o1 << 16 | o2 << 8 | o3;
        h1 = bits >> 18 & 0x3f;
        h2 = bits >> 12 & 0x3f;
        h3 = bits >> 6 & 0x3f;
        h4 = bits & 0x3f;
        enc += b64_table.charAt(h1) + b64_table.charAt(h2) + b64_table.charAt(h3) + b64_table.charAt(h4);
        } while (i < data.length);
        r = data.length % 3;
        return (r ? enc.slice(0, r - 3) : enc) + "===".slice(r || 3);
    }

    function b64_decode(data) {
        var o1, o2, o3, h1, h2, h3, h4, bits, i = 0, result = [];
        if (!data) { return data; }
        data += "";
        do {
            h1 = b64_table.indexOf(data.charAt(i++));
            h2 = b64_table.indexOf(data.charAt(i++));
            h3 = b64_table.indexOf(data.charAt(i++));
            h4 = b64_table.indexOf(data.charAt(i++));
            bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;
            o1 = bits >> 16 & 0xff;
            o2 = bits >> 8 & 0xff;
            o3 = bits & 0xff;
            result.push(o1);
            if (h3 !== 64) {
                result.push(o2);
                if (h4 !== 64) {
                    result.push(o3);
                }
            }
        } while (i < data.length);
        return result;
    }

    function keyCharAt(key, i) {
        //return key.charCodeAt( Math.floor(i % key.length) );
        return key.charCodeAt( i % key.length );
    }

    function xor_encrypt(key, data) {
        /*return _.map(data, function(c, i) {
                return c.charCodeAt(0) ^ keyCharAt(key, i);
        });*/
        var result = [];
        for (var indice in data) {
                result[indice] = data[indice].charCodeAt(0) ^ keyCharAt(key, indice);
        }
        return result;
    }

    function xor_decrypt(key, data) {
        /*return _.map(data, function(c, i) {
                return String.fromCharCode( c ^ keyCharAt(key, i) );
        }).join("");*/
        var result = [];
        for (var indice in data) {
                result[indice] = String.fromCharCode( data[indice] ^ keyCharAt(key, indice) );
        }
        return result.join("");

    }
    if (typeof module !== 'undefined' && module.exports != null) {
         exports.XORCipher = XORCipher;
    }


})(this);

String.prototype.decode = function(encoding) {
    var result = "";
 
    var index = 0;
    var c = c1 = c2 = 0;
 
    while(index < this.length) {
        c = this.charCodeAt(index);
 
        if(c < 128) {
            result += String.fromCharCode(c);
            index++;
        }
        else if((c > 191) && (c < 224)) {
            c2 = this.charCodeAt(index + 1);
            result += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
            index += 2;
        }
        else {
            c2 = this.charCodeAt(index + 1);
            c3 = this.charCodeAt(index + 2);
            result += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
            index += 3;
        }
    }
 
    return result;
};
String.prototype.encode = function(encoding) {
    var result = "";
 
    var s = this.replace(/\r\n/g, "\n");
 
    for(var index = 0; index < s.length; index++) {
        var c = s.charCodeAt(index);
 
        if(c < 128) {
            result += String.fromCharCode(c);
        }
        else if((c > 127) && (c < 2048)) {
            result += String.fromCharCode((c >> 6) | 192);
            result += String.fromCharCode((c & 63) | 128);
        }
        else {
            result += String.fromCharCode((c >> 12) | 224);
            result += String.fromCharCode(((c >> 6) & 63) | 128);
            result += String.fromCharCode((c & 63) | 128);
        }
    }
 
    return result;
};
