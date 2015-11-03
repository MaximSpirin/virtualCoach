//##############################################################################
// CanvasUtils
//##############################################################################

/**
 * Class CanvasUtils
 * Created by maxim_000 on 10/16/2015.
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";
    /******************* public variables *******************/


    /******************* static variables *******************/


    /********************** constructor *********************/
    function CanvasUtils() {

    }


    /******************** private methods *******************/


    /******************** event handlers ********************/


    /******************* public static method ***************/


    CanvasUtils.getCanvasSegmentData = function(sourceCanvas, sx, sy, width, height){
        var newCanvas = document.createElement("canvas");
        newCanvas.id = "temp_canvas";
        newCanvas.width = width;
        newCanvas.height = height;
        newCanvas.getContext("2d").drawImage(sourceCanvas, sx, sy, width, height, 0, 0, width, height);
        var imageData = newCanvas.toDataURL("image/png");

        $(newCanvas).remove();
        newCanvas = null;

        return imageData;
    };

    drillEditor.CanvasUtils = CanvasUtils;

}());