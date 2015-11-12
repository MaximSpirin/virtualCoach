//##############################################################################
//
//##############################################################################

/**
 * Class PitchSizeInputFormHTML
 * Created by maxim_000 on 9/16/2015.
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";

    PitchSizeInputFormHTML.prototype.formHTMLElement;
    //PitchSizeInputFormHTML.prototype.formDOMElement;

    //constructor
    function PitchSizeInputFormHTML(initParams) {
        this.Form_constructor(initParams);

    }

    var p = createjs.extend(PitchSizeInputFormHTML, drillEditor.Form);


    p.updateApplyButtonState = function(){
        var widthInputValue = Number($("#pitch_width_input").val());
        var heightInputValue = Number($("#pitch_height_input").val());

        if(isNaN(widthInputValue) || isNaN(heightInputValue) || widthInputValue <= 0 || heightInputValue <= 0){
            $("#pitchInputFormProceedButton").addClass("disabled");
            this.inputValid = false;
        } else {
            $("#pitchInputFormProceedButton").removeClass("disabled");
            this.inputValid = true;
        }

    };

    p.constructForm = function(){
        this.Form_constructForm();

        this.formHTMLElement = jQuery.parseHTML("<div id='pitchSizeInputFormHTML' class='drill-editor-app-form'> <div style='position: absolute; padding-top: 10px; padding-left: 10px '> <button id='pitchInputFormBackButton' type='button' class='btn btn-default'> <span class='glyphicon glyphicon-chevron-left' aria-hidden='true'></span>Back </button> </div><div class='outer'> <div class='middle'> <div class='inner'> <div class='container' style='width: inherit; height: 290px; background: #cccccc'> <h2 style='text-align: center'>Enter pitch size</h2> <form role='form'> <div class='form-group'> <label>Width:</label> <input class='form-control' id='pitch_width_input' placeholder='Enter width in meters'> </div><div class='form-group'> <label>Height:</label> <input type='height' id='pitch_height_input' class='form-control' placeholder='Enter height in meters'> </div><div class='checkbox'> <label> <input id='pitchInputFormUseDefaultCb' type='checkbox'>Use default size - 105 by 68 metres </label> </div><button id='pitchInputFormProceedButton' type='button' class='btn btn-primary btn-block disabled'>Apply and proceed</button> </form> </div></div></div></div></div>")[0];
        $("#appContainer").append(this.formHTMLElement);

        $("#pitch_width_input").on("input", this, function(event){
            event.data.updateApplyButtonState();
        });

        $("#pitch_height_input").on("input", this, function(event){
            event.data.updateApplyButtonState();
        });

        $("#pitchInputFormBackButton").click(this,function(evt){
            var thisScope = evt.data;

            if(thisScope.negativeCallback){
                thisScope.negativeCallback.call(thisScope.initParams.callbackScope);
            }

            drillEditor.Dispatcher.getInstance().dispatchEvent(new drillEditor.ApplicationEvent(drillEditor.ApplicationEvent.HIDE_CURRENT_FORM));

        });

        $("#pitchInputFormUseDefaultCb").change(this, function(evt){
            var checked =  this.checked;
            if(checked){
                $("#pitch_width_input").val(drillEditor.ApplicationModel.DEFAULT_PITCH_WIDTH_METERS);
                $("#pitch_height_input").val(drillEditor.ApplicationModel.DEFAULT_PITCH_HEIGHT_METERS);
                evt.data.updateApplyButtonState();
            }
        });

        $("#pitchInputFormProceedButton").click(this, function(evt){

            var thisScope = evt.data;
            var pWidth;
            var pHeight;

            if(thisScope.inputValid){
                pWidth = Number($("#pitch_width_input").val());
                pHeight = Number($("#pitch_height_input").val());

                if(thisScope.initParams.positiveCallback){
                    thisScope.initParams.positiveCallback.call(thisScope.initParams.callbackScope, pWidth, pHeight);
                }
            }
        });

    };



    p.destroy = function(){
        this.Form_destroy();

        $("#pitchInputFormBackButton").off();
        $("#pitchInputFormUseDefaultCb").off();
        $("#pitchInputFormProceedButton").off();

        $("#pitch_width_input").off();
        $("#pitch_height_input").off();

        //remove this form from DOM and screen
        $("#pitchSizeInputFormHTML").remove();

        //remove DOMElement object from DL
        //this.removeChild(this.formDOMElement);
        this.formDOMElement = null;
    };


    //window.drillEditor.PitchSizeInputFormHTML = createjs.extend(PitchSizeInputFormHTML,"DOMElement");
    drillEditor.PitchSizeInputFormHTML = createjs.promote(PitchSizeInputFormHTML,"Form");

}());