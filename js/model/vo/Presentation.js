/**
 * Presentation class
 */
(function (window) {
    //public variables
    Presentation.prototype.id = null;
    Presentation.prototype.pitchWidth;
    Presentation.prototype.pitchHeight;

    //static variable
    //Presentation.staticVar = "value";

    //constructor
    function Presentation(id) {
        this.id = id;
    }

    // public functions
    Presentation.prototype.setPitchDimensions = function(width, height){
        this.pitchWidth = width;
        this.pitchHeight = height;
    };

    //private functions


    //public static method


    window.Presentation = Presentation;

}(window));