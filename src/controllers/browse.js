app.controller("BrowseController", function($scope) {
	$scope.selectedItem = null
	$scope.items = [
		{	
			_id: '1',
			name: 'phone',
			dateFound: '2022-01-02',
			locationFound: 'Train Station',
			description: 'Pear aPhone, black, cracked screen.'
		},
		{
			_id: '2',
			name: 'bike',
			dateFound: '2022-02-14',
			locationFound: 'Cafe',
			description: 'BMX with rad flames decal down the side.'
		},
		{
			_id: '3',
			name: 'wallet',
			dateFound: '2022-03-01',
			locationFound: 'Shop',
			description: 'Empty, found it like that.'
		}
	]
});