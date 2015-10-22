/**
 * Class LoadDrillView
 * Created by maxim_000 on 10/17/2015.
 */
(function (window) {
    /******************* public variables *******************/
    LoadDrillView.prototype.formHTMLElement = null;
    LoadDrillView.prototype.formDOMElement = null;
    LoadDrillView.prototype.selectedPresentationData = null;
    LoadDrillView.prototype.backButton = null;
    LoadDrillView.prototype.loadButton = null;

    /******************* static variables *******************/
    //LoadDrillView.staticVar = "value";

    /********************** constructor *********************/
    function LoadDrillView(initParams) {
        //invoke constructor of superclass
        this.Form_constructor(initParams);


    }

    //extend this class from a superclass
    var p = createjs.extend(LoadDrillView, Form);

    /********************* overridden methods *********************/
    p.constructForm = function(){
        this.Form_constructForm();
        this.formHTMLElement = jQuery.parseHTML("<div id='loadDrillView' class='drill-editor-app-form'> <div class='form-back-button'> <button id='loadDrillViewBackButton' type='button' class='btn btn-default'> <span class='glyphicon glyphicon-chevron-left' aria-hidden='true'></span>Back </button> </div> <div class='outer'> <div class='middle'> <div class='panel panel-default load-pitch-panel'> <h3 class='load-drill-form-h3'>Load drill</h3> <div class='load-pitch-container'> <div class='list-group load-pitch-list media'> </div> </div> <div class='load-pitch-form-load-btn-container'> <a class='btn disabled btn-default load-pitch-form-load-btn' href='#' role='button'>Load</a> </div> </div> </div> </div> </div>")[0];
        $("#appContainer").append(this.formHTMLElement);

        //add back button listener
        this.backButton = $("#loadDrillViewBackButton");
        this.backButton.click(this, function(evt){
            var thisScope = evt.data;

            if(thisScope.negativeCallback){
                thisScope.negativeCallback.call(thisScope.initParams.callbackScope);
            }

            Dispatcher.getInstance().dispatchEvent(new ApplicationEvent(ApplicationEvent.HIDE_CURRENT_FORM));
        });

        //add load button listener
        this.loadButton = $(".load-pitch-form-load-btn");
        this.loadButton.click(this, function(evt){
            var thisScope = evt.data;

            Dispatcher.getInstance().dispatchEvent(new ApplicationEvent(ApplicationEvent.HIDE_CURRENT_FORM));
            Dispatcher.getInstance().dispatchEvent(new ApplicationEvent(ApplicationEvent.LOAD_DRILL_BUTTON_CLICK,
                {drillId:thisScope.selectedPresentationData.drillId}));

        });

        //populate list of drills
        //for(var i=0;i<DrillEditorProxy.drillsCollection.length;i++){
        for(var i=0;i<ApplicationModel.getInstance().savedDrills.length;i++){
            //var drillShortInfo = DrillEditorProxy.drillsCollection[i];
            var drillShortInfo = ApplicationModel.getInstance().savedDrills[i];
            $(".load-pitch-list").append("<a href='#' class='list-group-item'> <div class='media-left'> <img class='media-object load-pitch-form-thumb-image' src=''> </div> <div class='media-body'> <h4 class='list-group-item-heading drill-name-label'></h4> <p class='list-group-item-text load-drill-view-size-label'></p> <p class='list-group-item-text load-drill-view-last-edit-label'></p> </div> </a>");

            var lastAddedItem = $($(".load-pitch-list .list-group-item:last")[0]);
            lastAddedItem.find(".drill-name-label").text(drillShortInfo.displayName);
            lastAddedItem.find(".load-drill-view-size-label").text("Pitch size: " + drillShortInfo.pitchWidth + " x " + drillShortInfo.pitchHeight + " meters");
            lastAddedItem.find(".load-drill-view-last-edit-label").text("Last modified: " + drillShortInfo.lastModified);
            lastAddedItem.find(".load-pitch-form-thumb-image").attr("src", drillShortInfo.thumbURL);


            lastAddedItem.click({thisScope:this, presentationData: drillShortInfo}, function(evt){
                var thisScope = evt.data.thisScope;
                $(this).addClass('active').siblings().removeClass('active');
                thisScope.setSelectedPresentationData(evt.data.presentationData);
            })
        }

        //create html content
        this.formDOMElement = new createjs.DOMElement(this.formHTMLElement);
    };

    p.setSelectedPresentationData = function(value){
        this.selectedPresentationData = value;
        if(this.selectedPresentationData){
            this.loadButton.removeClass('disabled');
        }
    };


    p.destroy = function(){
        this.Form_destroy();

        // unsubscribe listeners
        this.backButton.off();
        this.loadButton.off();

        $(".load-pitch-list .list-group-item").off();

        // remove DOMElement object from DL
        $("#loadDrillView").remove();

        this.removeChild(this.formDOMElement);
        this.formDOMElement = null;

    };

    /******************** private methods *******************/


    /******************** event handlers ********************/


    /******************* public static method ***************/

    window.LoadDrillView = createjs.promote(LoadDrillView,"Form");

}(window));