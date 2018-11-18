import * as parseGooglePlace from 'parse-google-place';
import PlaceResult = google.maps.places.PlaceResult;

const service = new google.maps.places.AutocompleteService();
const servicePlaceDetails = new google.maps.places.PlacesService(document.createElement('div'));

export const googlePlacesAutocomplete = (text, callback) => {
  service.getPlacePredictions({input: text}, (data: any) => {
    callback(data);
  });
};

export const getParsedPlaceDetails = (place_id: string, callback: (parsed) => void) => {
  servicePlaceDetails.getDetails({placeId: place_id}, (info: PlaceResult) => {
    let parsed = parseGooglePlace(info);
    parsed.lat = info.geometry.location.lat();
    parsed.lng = info.geometry.location.lng();
    callback(parsed);
  });
};
