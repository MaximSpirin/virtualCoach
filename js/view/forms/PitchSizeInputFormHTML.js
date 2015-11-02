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
    PitchSizeInputFormHTML.prototype.formDOMElement;

    //constructor
    function PitchSizeInputFormHTML(initParams) {
        this.Form_constructor(initParams);

    }

    var p = createjs.extend(PitchSizeInputFormHTML, drillEditor.Form);

    p.constructForm = function(){
        this.Form_constructForm();

        this.formHTMLElement = jQuery.parseHTML("<div id='pitchSizeInputFormHTML' style='position:absolute;left:0px;top:0px;width: 800px;height: 600px;background: #ffffff;'> <div style='position: absolute; padding-top: 10px; padding-left: 10px '> <button id='pitchInputFormBackButton' type='button' class='btn btn-default'> <span class='glyphicon glyphicon-chevron-left' aria-hidden='true'></span>Back </button> </div><div class='outer'> <div class='middle'> <div class='inner'> <div class='container' style='width: inherit; height: 290px; background: #cccccc'> <h2 style='text-align: center'>Enter pitch size</h2> <form role='form'> <div class='form-group'> <label>Width:</label> <input class='form-control' id='pitch_width_input' placeholder='Enter width in meters'> </div><div class='form-group'> <label>Height:</label> <input type='height' id='pitch_height_input' class='form-control' placeholder='Enter height in meters'> </div><div class='checkbox'> <label> <input id='pitchInputFormUseDefaultCb' type='checkbox'>Use default size - 105 by 68 metres </label> </div><button id='pitchInputFormProceedButton' type='button' class='btn btn-primary btn-block'>Apply and proceed</button> </form> </div></div></div></div></div>")[0];
        $("#appContainer").append(this.formHTMLElement);

        $("#pitchInputFormBackButton").click(this,function(evt){
            var thisScope = evt.data;

            if(thisScope.negativeCallback){
                thisScope.negativeCallback.call(thisScope.initParams.callbackScope);
            }

            drillEditor.Dispatcher.getInstance().dispatchEvent(new drillEditor.ApplicationEvent(drillEditor.ApplicationEvent.HIDE_CURRENT_FORM));

        });

        $("#pitchInputFormUseDefaultCb").change(function(){
            var checked =  this.checked;
            if(checked){
                $("#pitch_width_input").val(drillEditor.ApplicationModel.DEFAULT_PITCH_WIDTH_METERS);
                $("#pitch_height_input").val(drillEditor.ApplicationModel.DEFAULT_PITCH_HEIGHT_METERS);
            }
        });

        $("#pitchInputFormProceedButton").click(this, function(evt){
            var pitchW = Number($("#pitch_width_input").val());
            var pitchH = Number($("#pitch_height_input").val());
            var thisScope = evt.data;
            if(thisScope.initParams.positiveCallback){
                thisScope.initParams.positiveCallback.call(thisScope.initParams.callbackScope, pitchW, pitchH);
            }
            //drillEditor.Dispatcher.getInstance().dispatchEvent(new drillEditor.ApplicationEvent(ApplicationEvent.HIDE_CURRENT_FORM));
        });

        this.formDOMElement = new createjs.DOMElement(this.formHTMLElement);

    };



    p.destroy = function(){
        this.Form_destroy();

        $("#pitchInputFormBackButton").unbind();
        $("#pitchInputFormUseDefaultCb").unbind();

        //remove this form from DOM and screen
        $("#pitchSizeInputFormHTML").remove();

        //remove DOMElement object from DL
        this.removeChild(this.formDOMElement);
        this.formDOMElement = null;
    };


    //window.drillEditor.PitchSizeInputFormHTML = createjs.extend(PitchSizeInputFormHTML,"DOMElement");
    drillEditor.PitchSizeInputFormHTML = createjs.promote(PitchSizeInputFormHTML,"Form");

}());