/**
 * Application model
 */
(function (window) {
    //public variables
    ApplicationModel.prototype.serviceLocator;
    ApplicationModel.prototype.user;
    ApplicationModel.prototype.platformInfo;
    ApplicationModel.prototype.userID;
    ApplicationModel.prototype.sessionID;
    ApplicationModel.prototype.assetsLoaded;
    ApplicationModel.prototype.mpp; // meters per pixel

    //static variables and constants
    ApplicationModel.VERSION = "0.0.6";
    ApplicationModel.debugVersion = false;
    ApplicationModel.instance = null;
    ApplicationModel.APP_WIDTH = 800;
    ApplicationModel.APP_HEIGHT = 600;
    ApplicationModel.DEFAULT_PITCH_WIDTH_METERS = 105;
    ApplicationModel.DEFAULT_PITCH_HEIGHT_METERS = 68;

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
        this.serviceLocator = ServiceLocator.getInstance();
       // this.user = new User();
        this.platformInfo = ServiceLocator.getInstance().platformInfoService.getPlatformInfo();

        //console.log("Model constructor fired.");
        //console.log(this.platformInfo);
    }

    window.ApplicationModel = ApplicationModel;

}(window));
