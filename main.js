(function(){
	var app = angular.module("GW2Armory",["ngStorage"]);
			
	var StorageController = function($scope,$localStorage) {
		$scope.save = function(key) {
			$localStorage.APIKey = key;
		}
		
	}
	
	var MainController = function($scope,$http,$localStorage) {

		var onError = function(response) {
			console.log(response);
			$scope.error = "Could not get data. (" + response.data.text + ")";
		}

		var onAccountComplete = function(response) {
			$scope.page = "Account Info";
			$scope.account = response.data;
			getWorld($scope.account.world);
			$scope.guilds = [];
			for(var x=0; x < $scope.account.guilds.length; x++) {
				console.log($scope.account.guilds[x]);
				getGuild($scope.account.guilds[x]);
			}
			getCharacters($scope.APIKey);
		}

		var onWorldComplete = function(response) {
			$scope.world = response.data;
		}

		var onGuildsComplete = function(response) {
			$scope.guilds.push(response.data);
		}

		var onCharactersComplete = function(response) {
			$scope.characters = response.data;
		}

		var getAccount = function(APIKey) {
			$http.get("https://api.guildwars2.com/v2/account?access_token="+APIKey)
				.then(onAccountComplete,onError);
		}

		function getWorld(worldID) {
			$http.get("https://api.guildwars2.com/v2/worlds?id="+worldID)
				.then(onWorldComplete,onError);
		}

		function getGuild(guildID) {
			$http.get("https://api.guildwars2.com/v1/guild_details.json?guild_id="+guildID)
				.then(onGuildsComplete,onError);
		}

		function getCharacters(APIKey) {
			$http.get("https://api.guildwars2.com/v2/characters?access_token="+APIKey)
				.then(onCharactersComplete,onError);	
		}

		$scope.load = function() {
			$scope.APIKey = $localStorage.APIKey;
		}
		
		$scope.load();
		getAccount($scope.APIKey);
				
	}

	app.controller('StorageController',['$scope','$localStorage',StorageController]);
	app.controller('MainController',['$scope','$http','$localStorage',MainController]);
})();