/**
 * Class DrillEditorProxy
 * Created by Max on 10/13/2015.
 */
(function (window) {
    /******************* public variables *******************/


    /******************* static variables *******************/
    DrillEditorProxy.drillStartupData = null;   // data of the drill that has to be rendered right after app start. If null then app starts with main menu view
    DrillEditorProxy.drillsCollection = null; //array of drills that user could open through load drill view.

    DrillEditorProxy.getDrillDataCallback = null; // Should be set by drill editor. Editor app function that returns data of the current drill
    DrillEditorProxy.getDrillByIdCallback = null;  // Should be set by outer code.

    /********************** constructor *********************/
    function DrillEditorProxy() {

    }
    /******************* static methods *******************/


    /**
     * Returns data of the current/last active drill created/opened through drill editor.
     * Should be called from outer code
     * @returns {*}
     */
    DrillEditorProxy.getEditedDrillData = function(){
        var result;
        if(DrillEditorProxy.getDrillDataCallback){
            result = DrillEditorProxy.getDrillDataCallback();
        }new Promise
        return result;
    };

    /**
     * Retrieves drill data by its id.
     * Should be called from app side
     * @param drillId
     * @param successCallback
     * @param failureCallback
     */
    DrillEditorProxy.getDrillDataById = function(drillId, successCallback, failureCallback){
        if(DrillEditorProxy.getDrillByIdCallback){
            DrillEditorProxy.getDrillByIdCallback(drillId, successCallback, failureCallback);
        }
    };


    window.DrillEditorProxy = DrillEditorProxy;

}(window));