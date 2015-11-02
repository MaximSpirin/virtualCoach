//##############################################################################
//
//##############################################################################

/**
 * Presentation class
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";
    //public variables
    Presentation.prototype.id = null;
    Presentation.prototype.pitchWidth;
    Presentation.prototype.pitchHeight;
    Presentation.prototype.elements; //array that stores vo of the presentation items

    //static variable
    Presentation.DEFAULT_ID = "0000";

    //constructor
    function Presentation(id) {
        this.id = id;
        this.elements = [];
    }

    // public functions
    Presentation.prototype.setPitchDimensions = function(width, height){
        this.pitchWidth = width;
        this.pitchHeight = height;
    };

    //private functions


    //public static method


    drillEditor.Presentation = Presentation;

}());