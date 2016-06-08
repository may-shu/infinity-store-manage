/**
 * This script file is used to configure require.js in the application.
 * In current configuration, we set the baseUrl, and the url arguments that require is going to append in all sub-sequent requests.
 *
 * In the require section, 
 * We list out all the dependencies, that application must load before kicking off the application.
 *
 * Finally, when everything is loaded, we call the callback to start the application.
 */
require.config({
    baseUrl : 'resources/app',
    urlArgs : 'v=1.0'
});

require([
    'module/application',
    'module/route-resolver',
    
    'directives/directives-module',
    
    'services/services-module',
    
    'components/IndexController'],
        
        function(){
    angular.bootstrap( document, ['Infinity-Store']);
    });