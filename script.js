let map;
let marker;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 14.5995, lng: 120.9842 },
    zoom: 8,
  });

  map.addListener('click', function (event) {
    placeMarker(event.latLng);
  });
}

function placeMarker(location) {
  if (marker) {
    marker.setPosition(location);
  } else {
    marker = new google.maps.Marker({
      position: location,
      map: map,
      draggable: true,
    });
  }

  updateTable(marker.getPosition());
}

function placeMarker(location) {
  if (marker) {
    marker.setPosition(location);
  } else {
    marker = new google.maps.Marker({
      position: location,
      map: map,
      draggable: true,
    });
  }

  updateTable(marker.getPosition());
  getLocationNameAndMGRS(location);
}

function getLocationNameAndMGRS(location) {
  const geocoder = new google.maps.Geocoder();
  
  geocoder.geocode({ location: location }, function (results, status) {
    if (status === google.maps.GeocoderStatus.OK && results[0]) {
      const locationName = results[0].formatted_address;
      const mgrsResult = mgrs.forward([location.lng(), location.lat()]); // Using mgrs library to get MGRS
  
      // Update the table with location name and MGRS
      document.getElementById('location').innerText = locationName;
      document.getElementById('mgrs').innerText = mgrsResult;
    } else {
      console.error('Geocoder failed with status: ' + status);
    }
  });
}

function updateTable(location) {
  const latitude = location.lat().toFixed(6);
  const longitude = location.lng().toFixed(6);

  document.getElementById('latitude').innerText = latitude;
  document.getElementById('longitude').innerText = longitude;
}


function setMapLocation(latitude, longitude) {
  const location = new google.maps.LatLng(latitude, longitude);
  map.setCenter(location);
  new google.maps.Marker({
    position: location,
    map: map,
    title: 'Converted Location',
  });
}

function displayTableData(latitude, longitude, location, mgrs) {
    const data = [
      { latitude: latitude || 'N/A', longitude: longitude || 'N/A', location: location || 'N/A', mgrs: mgrs || 'N/A' }
    ];
  
    document.getElementById('latitude').innerText = data[0].latitude;
    document.getElementById('longitude').innerText = data[0].longitude;
    document.getElementById('location').innerText = data[0].location;
    document.getElementById('mgrs').innerText = data[0].mgrs;
  }

  function convertLocation() {
    const locationInput = document.getElementById('locationInput').value.trim();
  
    if (!locationInput) {
      console.error('Please enter a valid location.');
      displayTableData();
      setMapLocation(0, 0); // Set a default location
      return;
    }
  
    const geocoder = new google.maps.Geocoder();
  
    geocoder.geocode({ address: locationInput }, function (results, status) {
      if (status === google.maps.GeocoderStatus.OK && results[0]) {
        const latitude = results[0].geometry.location.lat();
        const longitude = results[0].geometry.location.lng();
        const mgrsResult = mgrs.forward([longitude, latitude]);
  
        displayTableData(latitude, longitude, results[0].formatted_address, mgrsResult);
        setMapLocation(latitude, longitude);
      } else {
        console.error('Geocode was not successful for the following reason: ' + status);
        displayTableData();
        setMapLocation(0, 0); // Set a default location
      }
    });
  }

  function convertByCoordinates() {
    const latitude = parseFloat(document.getElementById('latitudeInput').value);
    const longitude = parseFloat(document.getElementById('longitudeInput').value);
  
    if (!isNaN(latitude) && !isNaN(longitude) && latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180) {
      const latLng = new google.maps.LatLng(latitude, longitude);
      const geocoder = new google.maps.Geocoder();
  
      geocoder.geocode({ 'location': latLng }, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK && results[0]) {
          const locationName = results[0].formatted_address;
          const mgrsResult = mgrs.forward([longitude, latitude]);
          displayTableData(latitude, longitude, locationName, mgrsResult);
          setMapLocation(latitude, longitude);
        } else {
          console.error('Geocode was not successful for the following reason: ' + status);
          displayTableData();
          setMapLocation(0, 0); // Set a default location
        }
      });
    } else {
      console.error('Invalid coordinates.');
      displayTableData();
      setMapLocation(0, 0); // Set a default location
    }
  }
  

  function convertToLatLongFromMGRS() {
    const mgrsInput = document.getElementById('mgrsInput').value.trim();
  
    if (!mgrsInput) {
      console.error('Please enter valid MGRS coordinates.');
      displayTableData();
      setMapLocation(0, 0); // Set a default location
      return;
    }
  
    try {
      const mgrsResult = mgrs.toPoint(mgrsInput);
      const latitude = mgrsResult[1]; // Corrected latitude index
      const longitude = mgrsResult[0]; // Corrected longitude index
  
      if (!isNaN(latitude) && !isNaN(longitude)) {
        const latLng = new google.maps.LatLng(latitude, longitude);
        const geocoder = new google.maps.Geocoder();
  
        geocoder.geocode({ 'location': latLng }, function (results, status) {
          if (status === google.maps.GeocoderStatus.OK && results[0]) {
            const locationName = results[0].formatted_address;
            displayTableData(latitude, longitude, locationName, mgrsInput);
            setMapLocation(latitude, longitude);
          } else {
            console.error('Geocode was not successful for the following reason: ' + status);
            displayTableData();
            setMapLocation(0, 0); // Set a default location
          }
        });
      } else {
        console.error('Invalid MGRS coordinates.');
        displayTableData();
        setMapLocation(0, 0); // Set a default location
      }
    } catch (error) {
      console.error('Error converting MGRS to coordinates:', error);
      displayTableData();
      setMapLocation(0, 0); // Set a default location
    }
  }
  
  document.getElementById('darkModeBtn').addEventListener('click', toggleDarkMode);

  function toggleDarkMode() {
      const body = document.body;
      const darkModeButton = document.getElementById('darkModeBtn');
  
      if (body.classList.contains('dark-theme')) {
          body.classList.remove('dark-theme');
          body.classList.add('light-theme');
          updateColors('light-theme');
          darkModeButton.innerText = 'Dark Mode'; // Change text to 'Dark Mode'
      } else {
          body.classList.remove('light-theme');
          body.classList.add('dark-theme');
          updateColors('dark-theme');
          darkModeButton.innerText = 'Light Mode'; // Change text to 'Light Mode'
      }
  }

function updateColors(theme) {
  const elementsToChange = document.querySelectorAll('.element-to-change-color');
  elementsToChange.forEach(element => {
      if (theme === 'dark-theme') {
          element.style.transition = 'color 0.3s ease-in-out'; // Smooth transition
          
          // Change to white or another suitable light color
          element.style.color = '#ffffff'; 
          // Change background colors, border colors, or other color properties for visibility
      } else {
          element.style.transition = 'color 0.3s ease-in-out'; // Smooth transition
          
          // Change to black or another suitable dark color
          element.style.color = '#000000'; 
          // Reset other color properties as needed for the light theme
      }
  });
}

  
