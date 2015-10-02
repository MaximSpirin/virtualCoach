/**
 * Class PresentationController
 * Created by maxim_000 on 9/21/2015.
 */
(function (window) {
    //public variables
    //PresentationController.prototype.publicVar = "value";

    //static variable
    //PresentationController.staticVar = "value";

    //constructor
    function PresentationController() {
        //invoke constructor of superclass
        //this.SuperClass_constructor();
    }

    //extend this class from a superclass
    //var p = createjs.extend(PresentationController,SuperClass);

    // public functions
    //PresentationController.prototype.publicFunction = function (param1) { };

    //private functions





    PresentationController.prototype.copyElementToClipboard = function(sourceElement){
        //make a copy of source element's rendererData
        var clonedSourceData = this.cloneElementData(sourceElement);
        this.clipboardData = clonedSourceData;
    };




    //public static method
    PresentationController.prototype.cloneElementData = function(sourceElement){
        var sourceElementData = sourceElement.rendererData;
        var clonedElementData = jQuery.extend(true, {}, sourceElementData);
        return clonedElementData
    };

    //Make aliases for all superclass methods: SuperClass_methodName
    //window.PresentationController = createjs.promote(PresentationController,"SuperClass");

    window.PresentationController = PresentationController;

}(window));