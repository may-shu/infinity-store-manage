'use strict';

/**
 * @author Gaurav Tiwari.
 */
define([], function() {
    
    /** 
     * RouteResolver is a provider responsible for resolving dynamic loading of templates and controllers.
     *
     * Syntax :
     * ==========
     *
     * .when( '/', route.resolve( 'login' ))
     *
     * RouteResolveProvider will try to locate login directory inside configured working directory.
     * And in that directory, login.html will be picked up as templateUrl,
     * and, LoginController.js as Controller file.
     *
     * Module simply aims at, write less, do more approach.
     */
    var routeResolver = function() {
        
        /**
         * It's provider.
         * And all providers have $get function, so.
         */
        this.$get = function() {
            return this;
        };
        
        /**
         * Utility Method to convert a string to camel case.
         * Example : user-list ->userList
         */
        var converToCamelCase = function( str ) {
            return str.replace( /-([a-z])/g, function( g ) { return g[1].toUpperCase();});
        };
        
        /**
         * Utility method to make first letter capital of a string.
         * Example : homeController -> HomeController
         */
        var makeFirstLetterCapital = function( str ) {
            return str.charAt( 0 ).toUpperCase() + str.slice( 1 );
        };
        
        /**
         * Utility method to compute template URL for given configuration.
         * If subDirectory parameter is present, it will be for URL-generation, otherwise, baseName will do just fine.
         */
        var getTemplateUrl = function( routeConfig, baseName, subDirectory) {
            if( subDirectory ) {
                return routeConfig.getDirectory() + '/' + baseName + '/' + subDirectory + '/' + subDirectory + '.html';
            }
            return routeConfig.getDirectory() + '/' + baseName + '/' + baseName + '.html';
        };
        
        /**
         * Utility method to compute controller's name.
         * If subDirectory parameter is present, it will be used for retrieving Controller's name otherwise, baseName will do just fine.
         */
        var getControllerName = function( baseName, subDirectory ) {
        	if( subDirectory ) {
        		return makeFirstLetterCapital( converToCamelCase( subDirectory )) + 'Controller';
        	}
            
            return makeFirstLetterCapital( converToCamelCase( baseName )) + 'Controller';
        };
        
        /**
         * Utility method to compute controller's path.
         * If subDirectory parameter is present, it will be used for generation of controller's name.
         * Otherwise, baseName will alone be used.
         */
        var getControllerPath = function( routeConfig, baseName, subDirectory) {
            if( subDirectory ) {
                return routeConfig.getDirectory() + '/' + baseName + '/' + subDirectory + '/' + makeFirstLetterCapital( converToCamelCase( subDirectory )) + 'Controller.js';
            }
            
            return routeConfig.getDirectory() + '/' + baseName + '/' + makeFirstLetterCapital( converToCamelCase( baseName )) + 'Controller.js';
        };
        
        /**
         * Route Configuration.
         */
        this.routeConfig = function () {
            
            /**
             * Working Directory
             */
            var directory = '/resources/app/components',
                
                setDirectory = function( dir ) {
                    directory = dir;
                },
                
                getDirectory = function () {
                    return directory;
                };
            
            return {
                setDirectory : setDirectory,
                getDirectory : getDirectory
            };
        }();
        
        /**
         * Function configures templateUrl and Controller file.
         */
        this.route = function( routeConfig ) {
            
            /**
             * Method that computes templateUrl, controller and resolves these dependencies.
             */
            var resolve = function( baseName, subDirectory ) {
                if( !baseName ) {
                    return;
                }
                
                /**
                 * baseName : login,
                 * templateUrl : login.html,
                 * controller : LoginController
                 */
                var routeDef = {
                    templateUrl : getTemplateUrl( routeConfig, baseName, subDirectory ),
                    controller : getControllerName( baseName, subDirectory )
                };
                
                /**
                 * Dependencies are created here.
                 *
                 * dependencies = [(workingDirectory)/login/LoginController.js]
                 */
                routeDef.resolve = {
                    load : ['$q', '$rootScope', function( $q, $rootScope ) {
                        var dependencies = [ getControllerPath( routeConfig, baseName, subDirectory )];
                        
                        return resolveDependencies( $q, $rootScope, dependencies );
                    }]
                };
                
                return routeDef;
            },
                
            /**
             * Ask Require to load these dependencies.
             */
            resolveDependencies = function( $q, $rootScope, dependencies ) {
                /**
                 * Promise that will be kept. Guranteed.
                 */
                var defer = $q.defer();
                
                /**
                 * Ask require to fetch.
                 */
                require( dependencies, function() {
                    /**
                     * We got the results here in callback.
                     * Set promise to resolved here.
                     * And apply the values in the rootScope.
                     */
                    defer.resolve();
                    $rootScope.$apply();
                });
                
                /**
                 * Return the promise.
                 */
                return defer.promise;
            };
            
            /**
             * Only One Method is exposed.
             */
            return {
                resolve : resolve
            }
        }( this.routeConfig );
    }
    
    /**
     * Create a new Module.
     * And create a provider.
     */
    var app = angular.module( 'route-resolver', [] );
    app.provider( 'RouteResolver', routeResolver );
});