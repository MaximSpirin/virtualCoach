//##############################################################################
//  ApplicationModel
//##############################################################################

/**
 * Application model
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";
    //public variables
   ApplicationModel.prototype.serviceLocator;
   ApplicationModel.prototype.platformInfo;
   ApplicationModel.prototype.assetsLoaded;
   ApplicationModel.prototype.mpp; // meters per pixel
   ApplicationModel.prototype.appMode; // eitherApplicationModel.EDIT_DRILL_APP_MODE orApplicationModel.NEW_DRILL_APP_MODE


    //static variables and constants
   ApplicationModel.VERSION = "0.1.9";
   ApplicationModel.debugVersion = false;
   ApplicationModel.instance = null;
   ApplicationModel.APP_WIDTH = 800;
   ApplicationModel.APP_HEIGHT = 600;
   ApplicationModel.DEFAULT_PITCH_WIDTH_METERS = 105;
   ApplicationModel.DEFAULT_PITCH_HEIGHT_METERS = 68;

   ApplicationModel.EDIT_DRILL_APP_MODE = "edit_drill_app_mode";
   ApplicationModel.NEW_DRILL_APP_MODE = "new_drill_app_mode";

    //static functions
   ApplicationModel.getInstance = function () {
        if(!ApplicationModel.instance){
            ApplicationModel.instance = new ApplicationModel();
        }

        return ApplicationModel.instance;
    };

    //constructor
    function ApplicationModel(){

        if(ApplicationModel.instance){
            throw new Error("Only one instance of ApplicationModel is allowed");
        }

        // initialize properties


    }

    drillEditor.ApplicationModel = ApplicationModel;

}());
