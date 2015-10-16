/**
 * Class CanvasUtils
 * Created by maxim_000 on 10/16/2015.
 */
(function (window) {
    /******************* public variables *******************/
    //CanvasUtils.prototype.publicVar = "value";

    /******************* static variables *******************/
    //CanvasUtils.staticVar = "value";

    /********************** constructor *********************/
    function CanvasUtils() {
        //invoke constructor of superclass
        //this.SuperClass_constructor();
    }

    //extend this class from a superclass
    //var p = createjs.extend(CanvasUtils,SuperClass);

    /******************** private methods *******************/


    /******************** event handlers ********************/


    /******************* public static method ***************/

        //CanvasUtils.staticFunctionName = function(param1){ //method body };


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

    window.CanvasUtils = CanvasUtils;

}(window));