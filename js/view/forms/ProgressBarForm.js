/**
 * Created by maxim_000 on 10/13/2015.
 */
/**
 * Class DrillNameInputForm
 * Created by maxim_000 on 9/16/2015.
 */
(function (window) {

    ProgressBarForm.prototype.formHTMLElement;
    ProgressBarForm.prototype.formDOMElement;

    //constructor
    function ProgressBarForm(initParams) {
        this.Form_constructor(initParams);
    }

    var p = createjs.extend(ProgressBarForm, Form);

    p.constructForm = function(){
        this.Form_constructForm();

        var headerText = this.initParams ? this.initParams.headerText : " ";

        this.formHTMLElement = jQuery.parseHTML("<div id='progressBarForm' class='progress-bar-form'> <div class='outer'> <div class='middle'> <div class='panel panel-default progress-bar-panel'> <h3 class='progress-bar-form-h3'></h3> <div class='progress' style='margin-left: 10px; margin-right: 10px'> <div class='progress-bar progress-bar-striped active' role='progressbar' aria-valuenow='100' aria-valuemin='0' aria-valuemax='100' style='width: 100%'> </div> </div> </div> </div> </div></div>")[0];
        $("#appContainer").append(this.formHTMLElement);
        $("#progressBarForm .progress-bar-form-h3").text(headerText);
        this.formDOMElement = new createjs.DOMElement(this.formHTMLElement);

    };



    p.destroy = function(){
        this.Form_destroy();



        //remove this form from DOM and screen
        $("#progressBarForm").remove();

        //remove DOMElement object from DL
        this.removeChild(this.formDOMElement);
        this.formDOMElement = null;
    };


    window.ProgressBarForm = createjs.promote(ProgressBarForm,"Form");

}(window));