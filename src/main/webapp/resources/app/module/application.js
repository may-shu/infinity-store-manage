'use strict';

define(['module/route-resolver', 'services/services-module', 'directives/directives-module'], function( app ) {
	/**
	 * Creation of Infinity-Store Module.
	 */
	var store = angular.module( 'Infinity-Store', ['route-resolver','Infinity.Directives', 'Infinity.Services', 'ngRoute']);
	
	/**
     * We need to store the references of the register methods, so as to make use of dynamic injection.
     * We have to do this in config, as many of these providers are only in config method.
     */
	store.config(['$routeProvider', 'RouteResolverProvider', '$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$httpProvider', '$locationProvider', function( $routeProvider, RouteResolverProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $httpProvider, $locationProvider ){
        
        /**
         * Capturing register methods.
         */
		store.register = {
            controller : $controllerProvider.register,
            directive : $compileProvider.register,
            filter : $filterProvider.register,
            factory : $provide.factory,
            service : $provide.service
        };
        
        /**
         * Write, and resolve.
         */
        var route = RouteResolverProvider.route;
        
        $routeProvider
            .when( '/', route.resolve( 'login' ));
        
    }]);
    
    /**
     * Angular first rus the config method, them, run method.
     * In this mehtod, we can do some application configuration actions.
     *
     * Here, we initialize our services and enable application to operate in no-hash-bang mode.
     */
	/*store.run([, function() {
        
    }]);*/
    
    return store;
})