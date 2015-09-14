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

    //static variables and constants
    ApplicationModel.VERSION = "0.0.3";
    ApplicationModel.debugVersion = false;
    ApplicationModel.instance = null;
    ApplicationModel.APP_WIDTH = 800;
    ApplicationModel.APP_HEIGHT = 600;

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
