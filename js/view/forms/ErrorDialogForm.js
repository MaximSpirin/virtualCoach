//##############################################################################
//
//##############################################################################

/**
 * Class ErrorDialogForm
 * Created by maxim_000 on 10/25/2015.
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";
    /******************* public variables *******************/
    ErrorDialogForm.prototype.formHTMLElement = null;
    ErrorDialogForm.prototype.formDOMElement = null;
    ErrorDialogForm.prototype.okButton = null;

    /******************* static variables *******************/
    //ErrorDialogForm.staticVar = "value";

    /********************** constructor *********************/
    function ErrorDialogForm(initParams) {
        //invoke constructor of superclass
        this.Form_constructor(initParams);
    }

    //extend this class from a superclass
    var p = createjs.extend(ErrorDialogForm, drillEditor.Form);

    /******************* overridden methods *****************/

    p.constructForm = function(){
        this.Form_constructForm();
        this.formHTMLElement = jQuery.parseHTML("<div id='error-dialog-form' class='dialog-form'> <div class='outer'> <div class='middle'> <div class='panel panel-danger dialog-panel'> <div id='error-dialog-header' class='panel-heading'>Error</div> <div class='panel-body' style='text-align: center'> <p id='error-dialog-label'></p> <button id='error-dialog-button' type='button' class='btn btn-default'> OK </button> </div> </div> </div> </div></div>");
        $("#appContainer").append(this.formHTMLElement);
        $("#error-dialog-label").text(this.initParams.errorMessage);

        //create createjs.DOMElement
        this.formDOMElement = new createjs.DOMElement(this.formHTMLElement);
    };

    p.destroy = function(){
        this.Form_destroy();
        // remove DOMElement object from DL
        $("#errorDialogForm").remove();

        this.removeChild(this.formDOMElement);
        this.formDOMElement = null;
    };


    /******************** private methods *******************/


    /******************** event handlers ********************/


    /******************* public static method ***************/

    //Make aliases for all superclass methods: SuperClass_methodName
    drillEditor.ErrorDialogForm = createjs.promote(ErrorDialogForm,"Form");

}());