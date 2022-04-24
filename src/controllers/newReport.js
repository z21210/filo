module.exports = function($scope, $rootScope, $state, $http) {
	if ($rootScope.getUserPrivilege() == 0) {
		$state.go('login', {accessing: 'newReport'})
	}
	if ($rootScope.getUserPrivilege() == 2) {
		$state.go('review')
	}

	$scope.imageSrc = ''
	$scope.report = {
		name: '',
		category: '',
		dateFound: '',
		locationFound: '',
		description: '',
		image: []
	}

	$scope.uploadImages = function () {
		files = document.getElementById('image').files
		$scope.uploadImage(files, 0)
	}
	document.getElementById('image').onchange = $scope.uploadImages
	$scope.uploadImage = function (images, index) {
		if (index >= images.length) {
			$scope.$apply() // force image ng-repeat to update when done
			return
		}
		fileReader = new FileReader()
		fileReader.onloadend = function (event) {
			const dataStart = fileReader.result.indexOf(',')+1
			const data = fileReader.result.slice(dataStart)
			const hex = Buffer.from(data, 'base64').toString('hex')
			const fileSignature = hex.slice(0,28) // first 14 bytes of the image file, to verify that it is an image
			if (fileSignature.slice(0, 6)  == 'ffd8ff' || // jpeg
					fileSignature.slice(0, 16) == '89504e470d0a1a0a' || // png
					fileSignature.slice(0, 8)  == '52494646' && fileSignature.slice(16, 28) == '574542505650' || // webp
					fileSignature.slice(0, 12) == '474946383961' || fileSignature.slice(0, 12) == '474946383761' || // gif
					fileSignature.slice(0, 8)  == '00000100' || fileSignature.slice(0, 8) == '00000200' || // ico
					fileSignature.slice(0, 8)  == '69636e73' || // icns
					fileSignature.slice(0, 8) == '49492a00' || fileSignature.slice(0, 8) == '4d4d002a' || // tiff
					fileSignature.slice(0, 8) == '425047fb' || // bpg
					fileSignature.slice(0, 24) == '0000000c6a5020200d0a870a' || // jpeg 2000
					fileSignature.slice(0, 24) == '0000000c4a584c200d0a870a' // jpeg xl
			) {
				if (!$scope.report.image.includes(fileReader.result)) {
					$scope.report.image.push(fileReader.result)
				}
			}
			$scope.uploadImage(images, index+1)
		}
		fileReader.readAsDataURL(images[index])
	}
	$scope.removeImage = function (index) {
		$scope.report.image.splice(index, 1	)
	}

	$scope.createReport = function () {
		document.getElementById('report').setAttribute('disabled', 'disabled')
		$scope.report.dateFound = document.getElementById('dateFound').value //string with no regard to timezone, as location is included
		$http({ 
			method: 'POST',
			url: '/api/item',
			headers: {
				'Authorization': `Basic ${$rootScope.user.auth}`
			},
			data: $scope.report
		 })
		.then(
			function (res) {
				$state.go('items', {itemId: ''})
			},
			function (err) {
				$scope.registerError = err.data
				document.getElementById('report').removeAttribute('disabled')
			}
		)
	}
}