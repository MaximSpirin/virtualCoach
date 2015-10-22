/**
 * Class DrillEditorProxy
 * Created by Max on 10/13/2015.
 */
(function (window) {
    /******************* public variables *******************/


    /******************* static variables *******************/

    //callbacks that are set by outer code:
    DrillEditorProxy.drillStartupData = null;   // Should be set by outer code. data of the drill that has to be rendered right after app start. If null then app starts with main menu view
    DrillEditorProxy.getDrillByIdCallback = null;  // Should be set by outer code.
    DrillEditorProxy.getSavedDrillsCallback = null; // Should be set by outer code.

    //callbacks set by editor application
    DrillEditorProxy.getDrillDataCallback = null; // Should be set by drill editor. Editor app function that returns data of the current drill

    /********************** constructor *********************/
    function DrillEditorProxy() {

    }
    /******************* static methods ********************/


    /**
     * Returns data of the current/last active drill created/opened through drill editor.
     * Should be called from outer code
     * @returns {*}
     */
    DrillEditorProxy.getEditedDrillData = function(){
        var result;
        if(DrillEditorProxy.getDrillDataCallback){
            result = DrillEditorProxy.getDrillDataCallback();
        }
        return result;
    };

    /**
     * Retrieves drill data by its id.
     * Should be called from app side
     * @param drillId
     * @param successCallback
     * @param failureCallback
     */
    DrillEditorProxy.getDrillDataById = function(drillId, successCallback, failureCallback, scope){
        if(DrillEditorProxy.getDrillByIdCallback){
            DrillEditorProxy.getDrillByIdCallback(drillId, successCallback, failureCallback, scope);
        }
    };

    /**
     * Retrieves an array of drills previously created by user
     * @param successCallback
     * @param failureCallback
     */
    DrillEditorProxy.getSavedDrills = function(successCallback, failureCallback, scope){
        if(DrillEditorProxy.getSavedDrillsCallback){
            DrillEditorProxy.getSavedDrillsCallback(successCallback, failureCallback, scope);
        }
    };


    window.DrillEditorProxy = DrillEditorProxy;

}(window));