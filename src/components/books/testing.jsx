import React, { useState } from 'react';
import {
  GoogleMap,
  LoadScript,
  DirectionsRenderer,
  Autocomplete
} from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '500px',
};

const center = {
  lat: -26.2041, // Johannesburg
  lng: 28.0473,
};

function App() {
  const [start, setStart] = useState('');
  const [destination, setDestination] = useState('');
  const [directions, setDirections] = useState(null);

  const [autocompleteStart, setAutocompleteStart] = useState(null);
  const [autocompleteDestination, setAutocompleteDestination] = useState(null);

  const handleLoadStart = (autocomplete) => {
    setAutocompleteStart(autocomplete);
  };

  const handleLoadDestination = (autocomplete) => {
    setAutocompleteDestination(autocomplete);
  };

  const handlePlaceChangedStart = () => {
    if (autocompleteStart) {
      const place = autocompleteStart.getPlace();
      setStart(place.formatted_address);
    }
  };

  const handlePlaceChangedDestination = () => {
    if (autocompleteDestination) {
      const place = autocompleteDestination.getPlace();
      setDestination(place.formatted_address);
    }
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // ✅ Reverse geocode to get the human-readable address
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode(
          { location: { lat: latitude, lng: longitude } },
          (results, status) => {
            if (status === 'OK' && results[0]) {
              setStart(results[0].formatted_address);
            } else {
              alert('Could not get address from your location.');
              console.error('Geocoder failed:', status);
            }
          }
        );
      },
      (error) => {
        alert('Unable to retrieve your location.');
        console.error('Geolocation error:', error);
      }
    );
  };

  const handleGetDirections = () => {
    if (!start || !destination) {
      alert('Please enter both start and destination!');
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: start,
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error(`Error fetching directions: ${result}`);
        }
      }
    );
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Google Maps Directions</h1>

      <LoadScript
        googleMapsApiKey="AIzaSyC1CE9DjOz0lpPuBRSttcbb4UVoter4oVs"
        libraries={['places']}
      >
        <div className="mb-4 space-y-2">
          <Autocomplete onLoad={handleLoadStart} onPlaceChanged={handlePlaceChangedStart}>
            <input
              type="text"
              placeholder="Start Address"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </Autocomplete>

          <button
            onClick={handleUseMyLocation}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Use My Location
          </button>

          <Autocomplete onLoad={handleLoadDestination} onPlaceChanged={handlePlaceChangedDestination}>
            <input
              type="text"
              placeholder="Destination Address"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </Autocomplete>

          <button
            onClick={handleGetDirections}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Get Directions
          </button>
        </div>

        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={10}
        >
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}

export default App;
