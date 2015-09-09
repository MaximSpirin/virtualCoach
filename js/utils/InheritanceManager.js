/**
 * InheritanceManager
 */
(function (window) {
    InheritanceManager.createInheritance = function(ctor, superCtor){
        ctor.super_ = superCtor;
        ctor.prototype = Object.create(superCtor.prototype, {
            constructor: {
                value: ctor,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
    };

    function InheritanceManager(){

    }

    window.InheritanceManager = InheritanceManager;

}(window));