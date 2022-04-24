module.exports = function($scope, $rootScope, $http, $state, $stateParams) {
	$scope.getItems = () => $http({ 
		method: 'GET',
		url: '/api/items'
	 })
	.then(
		function (res) {
			if (res.status == 200) {
				//format dates
				res.data.forEach((item) => {
					item.dateListed = item.dateListed.split('T')[0]
				})
				$scope.items = res.data
			} else {
				$scope.itemsMessage = 'An error ocurred when fetching items'
			}
		},
		function (err) {
			$scope.itemsMessage = err.data
		}
	)
	$scope.getItems()
	
	$scope.refresh = function () {
		$scope.getItems()
		$scope.selectedItemId = null
	}

	// sorting and default
	$scope.sort = {
		by: 'dateListed',
		descending: true
	}
	$scope.sortBy = function(by) {
		if ($scope.sort.by == by) {
			$scope.sort.descending = !$scope.sort.descending;
		} else {
			$scope.sort.by = by;
			$scope.sort.descending = false;
		}
	}

	$scope.selectItem = function (itemId) {
		if ($rootScope.getUserPrivilege() == 0) {
			$state.go('login', {accessing: 'items', params: `{"itemId": "${itemId}"}` })
			return
		} 
		$http({
			method: 'GET',
			url: `/api/item/${itemId}`,
			headers: {
				'Authorization': `Basic ${$rootScope.user.auth}`
			}
		})
		.then(
			function (res) {
				if (res.status == 200) {
					//format date
					res.data.dateListed = res.data.dateListed.split('T')[0]
					$scope.selectedItem = res.data
					$scope.itemMessage = ''
					if ($scope.editedItem._id != $scope.selectedItemId) {
						$scope.editedItem = null
					}
				} else {
					$scope.itemMessage = 'An error ocurred when fetching item details'
				}
			},
			function (err) {
				$scope.itemMessage = 'An error ocurred when fetching item details'
			}
		)
		$scope.selectedItemId = itemId
	}
	if ($stateParams.itemId !== undefined) {
		$scope.selectItem($stateParams.itemId)
	}

	$scope.requestItem = function () {
		$http({
			method: 'PUT',
			url: '/api/request',
			headers: {
				'Authorization': `Basic ${$rootScope.user.auth}`
			},
			data: {
				itemId: $scope.selectedItemId,
				reason: $scope.reason
			}
		})
		.then(
			function (res) {
				$scope.itemMessage = 'Item requested'
				$state.go('requests')
			},
			function (err) {
				$scope.itemMessage = err.data
			}
		)
	}

	$scope.openEditItemForm = function () {
		$scope.editedItem = Object.assign({}, $scope.selectedItem)
		$scope.editedItem.image = [...$scope.selectedItem.image] // copy array, not just reference
		$scope.editedItem.dateFound = new Date(`${$scope.editedItem.dateFound}T00:00:00Z`) // turn "date" string into actual date for input
	}
	$scope.uploadImages = function () {
		files = document.getElementById('image').files
		$scope.uploadImage(files, 0)
	}

	$scope.isFileImage = function (URLEncoded) {
		const dataStart = URLEncoded.indexOf(',')+1
		const data = URLEncoded.slice(dataStart)
		const hex = Buffer.from(data, 'base64').toString('hex')
		const fileSignature = hex.slice(0,28) // first 14 bytes of the image file, to verify that it is an image
		return (
			fileSignature.slice(0, 6)  == 'ffd8ff' || // jpeg
			fileSignature.slice(0, 16) == '89504e470d0a1a0a' || // png
			fileSignature.slice(0, 8)  == '52494646' && fileSignature.slice(16, 28) == '574542505650' || // webp
			fileSignature.slice(0, 12) == '474946383961' || fileSignature.slice(0, 12) == '474946383761' || // gif
			fileSignature.slice(0, 8)  == '00000100' || fileSignature.slice(0, 8) == '00000200' || // ico
			fileSignature.slice(0, 8)  == '69636e73' || // icns
			fileSignature.slice(0, 8) == '49492a00' || fileSignature.slice(0, 8) == '4d4d002a' || // tiff
			fileSignature.slice(0, 8) == '425047fb' || // bpg
			fileSignature.slice(0, 24) == '0000000c6a5020200d0a870a' || // jpeg 2000
			fileSignature.slice(0, 24) == '0000000c4a584c200d0a870a'// jpeg xl
		)
	}
	$scope.isFileUnique = function (URLEncoded) {
		return !$scope.editedItem.image.includes(URLEncoded)
	}
	$scope.isFileValid = function (URLEncoded) {
		return $scope.isFileImage(fileReader.result) && $scope.isFileUnique(fileReader.result)
	}

	document.getElementById('image').onchange = $scope.uploadImages
	$scope.uploadImage = function (images, index) {
		if (index >= images.length) {
			$scope.$apply() // force image ng-repeat to update when done
			return
		}
		fileReader = new FileReader()
		fileReader.onloadend = function (event) {
			/* Although this validation is already present on the back-end,
			   validating it here prevents telling the user that an invalid file would be submimtted in the first place */
			if ($scope.isFileValid(fileReader.result)) {
				$scope.editedItem.image.push(fileReader.result)
			}
			$scope.uploadImage(images, index+1)
		}
		fileReader.readAsDataURL(images[index])
	}
	$scope.removeImage = function (index) {
		$scope.editedItem.image.splice(index, 1	)
	}

	$scope.editItem = function () {
		$scope.editedItem.dateFound = document.getElementById('dateFound').value // string with no regard to timezone, as location is included
		$http({
			method: 'PUT',
			url: `/api/item/${$scope.selectedItemId}`,
			headers: {
				'Authorization': `Basic ${$rootScope.user.auth}`
			},
			data: $scope.editedItem
		})
		.then(
			function (res) {
				$scope.itemMessage = 'Item edited'
				$scope.selectedItem = $scope.editedItem
				$scope.editedItem = null
				$scope.getItems()
			},
			function (err) {
				$scope.itemMessage = err.data
			}
		)
	}

	$scope.deleteItemButton = 'Delete item'
	$scope.deleteItem = function () {
		switch ($scope.deleteItemButton) {
			case 'Delete item':
				$scope.deleteItemButton = 'Are you sure?'
				break
			case 'Are you sure?':
				$scope.deleteItemButton = 'Really sure?'
				break
			case 'Really sure?':
				$http({
					method: 'DELETE',
					url: `/api/item/${$scope.selectedItemId}`,
					headers: {
						'Authorization': `Basic ${$rootScope.user.auth}`
					}
				})
				.then(
					function (res) {
						$scope.deleteItemButton = 'Delete item'
						$scope.refresh()
					},
					function (err) {
						$scope.itemMessage = err.data
					}
				)
				break
		}
	}
}