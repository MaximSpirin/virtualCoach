/**
 * Created by maxim_000 on 10/13/2015.
 */
/**
 * Class DrillNameInputForm
 * Created by maxim_000 on 9/16/2015.
 */
(function (window) {

    DrillNameInputForm.prototype.formHTMLElement;
    DrillNameInputForm.prototype.formDOMElement;

    //constructor
    function DrillNameInputForm(initParams) {
        this.Form_constructor(initParams);
    }

    //var p = createjs.extend(DrillNameInputForm, createjs.DOMElement);
    var p = createjs.extend(DrillNameInputForm, Form);

    p.constructForm = function(){
        this.Form_constructForm();

        this.formHTMLElement = jQuery.parseHTML("<div id='DrillNameInputForm' style='position:absolute;left:0px;top:0px;width: 800px;height: 600px;background: #ffffff;'> <div style='position: absolute; padding-top: 10px; padding-left: 10px '> <button id='nameInputFormBackButton' type='button' class='btn btn-default'><span class='glyphicon glyphicon-chevron-left' aria-hidden='true'></span>Back</button> </div> <div class='outer'> <div class='middle'> <div class='inner'> <div class='container' style='width: inherit; height: 160px; background: #cccccc'> <h3 style='text-align: center'>Enter drill name</h3> <form role='form'> <div class='form-group'><input class='form-control' id='pitch_width_input' placeholder='Enter a new name'> </div> <button id='pitchInputFormProceedButton' type='button' class='btn btn-primary btn-block'>Save</button> </form> </div> </div> </div> </div> </div>")[0];
        $("#appContainer").append(this.formHTMLElement);

        $("#nameInputFormBackButton").click(this,function(evt){
            var thisScope = evt.data;

            if(thisScope.negativeCallback){
                thisScope.negativeCallback.call(thisScope.initParams.callbackScope);
            }

            Dispatcher.getInstance().dispatchEvent(new ApplicationEvent(ApplicationEvent.HIDE_CURRENT_FORM));

        });

        $("#pitchInputFormUseDefaultCb").change(function(){
            var checked =  this.checked;
            if(checked){
                $("#pitch_width_input").val(ApplicationModel.DEFAULT_PITCH_WIDTH_METERS);
                $("#pitch_height_input").val(ApplicationModel.DEFAULT_PITCH_HEIGHT_METERS);
            }
        });

        $("#pitchInputFormProceedButton").click(this, function(evt){
            var pitchW = Number($("#pitch_width_input").val());
            var pitchH = Number($("#pitch_height_input").val());
            var thisScope = evt.data;
            if(thisScope.initParams.positiveCallback){
                thisScope.initParams.positiveCallback.call(thisScope.initParams.callbackScope, pitchW, pitchH);
            }
            //Dispatcher.getInstance().dispatchEvent(new ApplicationEvent(ApplicationEvent.HIDE_CURRENT_FORM));
        });

        this.formDOMElement = new createjs.DOMElement(this.formHTMLElement);

    };



    p.destroy = function(){
        this.Form_destroy();

        $("#pitchInputFormBackButton").unbind();
        $("#pitchInputFormUseDefaultCb").unbind();

        //remove this form from DOM and screen
        $("#DrillNameInputForm").remove();

        //remove DOMElement object from DL
        this.removeChild(this.formDOMElement);
        this.formDOMElement = null;
    };


    window.DrillNameInputForm = createjs.promote(DrillNameInputForm,"Form");

}(window));