/**
 * A singleton that contains references to all services
 */
(function (window) {

    //************************************* public variables **************************************//
    //services
    ServiceLocator.prototype.platformInfoService;

    //static variable
    ServiceLocator.instance = null;

    //static const
    ServiceLocator.BASE_URL = "https://api.server.com";

    //*************************************** static functions ************************************//
    ServiceLocator.getInstance = function(){
        if(ServiceLocator.instance == null){
            ServiceLocator.instance = new ServiceLocator();
        }

        return ServiceLocator.instance;
    };

    //**************************************** constructor ***************************************//
    function ServiceLocator(){
        if(ServiceLocator.instance){
            throw new Error("Only one instance of ServiceLocator is allowed");
            return;
        }

        //instantiate services
        this.platformInfoService = new PlatformInfoService();

    }

    window.ServiceLocator = ServiceLocator;

}(window));
