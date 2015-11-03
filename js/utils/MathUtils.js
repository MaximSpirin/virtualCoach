//##############################################################################
// MathUtils
//##############################################################################

/**
 * Class drillEditor.MathUtils
 * Created by maxim_000 on 10/6/2015.
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";
    /******************* public variables *******************/


    /******************* static variables *******************/


    /********************** constructor *********************/
    function MathUtils() {
        //invoke constructor of superclass
        //this.SuperClass_constructor();
    }

    //extend this class from a superclass
    //var p = createjs.extend(MathUtils,SuperClass);

    /******************** private methods *******************/


    /******************** event handlers ********************/


    /******************* public static method ***************/
    MathUtils.getAngleBetween2Points = function(point1, point2){
        var angle = Math.atan2(point2.y - point1.y, point2.x - point1.x) * 180 / Math.PI;
        return angle;
    };

    MathUtils.getDistanceBetween2Points = function(point1, point2){
        var distance = Math.sqrt(Math.pow((point2.x - point1.x), 2) + Math.pow((point2.y - point1.y),2))
        return distance;
    };

    MathUtils.compareNumeric = function(a,b){
        if(a>b){
            return 1;
        }

        if(a<b){
            return -1;
        }

        return 0;
    };


    drillEditor.MathUtils = MathUtils;

}());