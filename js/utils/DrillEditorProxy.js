/**
 * Class DrillEditorProxy
 * Created by Max on 10/13/2015.
 */
(function (window) {
    /******************* public variables *******************/


    /******************* static variables *******************/
    DrillEditorProxy.drillStartupData = null;   // data of the drill that has to be rendered right after app start. If null then app starts with main menu view
    DrillEditorProxy.getDrillDataCallback = null; // editor app function that returns data of the current drill
    DrillEditorProxy.drillsCollection = null; //array of drills that user could open through load drill view.


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
        }
        return result;
    };


    window.DrillEditorProxy = DrillEditorProxy;

}(window));