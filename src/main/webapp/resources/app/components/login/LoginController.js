'use strict';

define(['module/application'], function( app ) {
	app.register.controller( 'LoginController', ['$scope', function( $scope ) {
		console.log( 'LoginController' );
	}]);
});