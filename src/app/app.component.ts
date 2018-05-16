import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Inject} from '@angular/core';

declare var google: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public places = [];
  private search_count = 0;
  private search_results = [];
  public current_address = null;
  constructor(private http: HttpClient, private spinner: NgxSpinnerService, public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.spinner.show();
    this.loadCurrentLocation(this.loadPlaces);
  }

  private loadGMapPlaces(q: string, loc: any): void {
    const map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: loc.lat, lng: loc.lng},
      zoom: 15
    });
    const request = {
      location: {lat: loc.lat, lng: loc.lng},
      query: q,
      radius: 50,
      rankBy: google.maps.places.RankBy.DISTANCE
    };
    const s = new google.maps.places.PlacesService(map);
    s.textSearch(request, (res) => {
      this.search_results = this.search_results.concat(res);
      this.search_count++;
      if (this.search_count === 4) {
        for (let i = 0; i < this.search_results.length; i++) {
          this.search_results[i]['distance'] = this.distance(
            {lat: loc.lat, lng: loc.lng},
            this.search_results[i].geometry.location);
          if (i + 1 === this.search_results.length) {
           localStorage.setItem('result', JSON.stringify(this.search_results));
          }
        }
      }
    });
  }

  private reverseGeocode(loc: any) {
    const request = {
      location: {lat: loc.latitude, lng: loc.longitude}
    };
    const geocoder = new google.maps.Geocoder();
    const s = geocoder.geocode(request, (data) => {
      this.current_address = data[0].formatted_address;
    });
  }

  private loadPlaces(scope: any, loc: any): void {
    let places = [];
    scope.reverseGeocode(loc);
    scope.loadGMapPlaces('public toilets', {lat: loc.latitude, lng: loc.longitude});
    scope.loadGMapPlaces('starbucks', {lat: loc.latitude, lng: loc.longitude});
    scope.loadGMapPlaces('costa cafe', {lat: loc.latitude, lng: loc.longitude});
    scope.loadGMapPlaces('pubs', {lat: loc.latitude, lng: loc.longitude});

    setTimeout(() => {
      const d = localStorage.getItem('result');
      places = JSON.parse(d);
      scope.places = places;
      scope.spinner.hide();
    }, 2000);
  }

  // Returns Distance between two latlng objects using haversine formula
  public distance(p1: any, p2: any): any {
    if (!p1 || !p2) {
      return 0;
    }
    const R = 6371000; // Radius of the Earth in m
    const dLat = (p2.lat() - p1.lat) * Math.PI / 180;
    const dLon = (p2.lng() - p1.lng) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(p1.lat * Math.PI / 180) * Math.cos(p2.lat() * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;

    //kmToMiles
    const miles = (d * 0.000621371).toFixed(2);
    return miles;
  }

  private loadCurrentLocation(callback): void {
    const that = this;
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };
    navigator.geolocation.getCurrentPosition((pos) => {
      callback(that, pos.coords);
    }, (err) => {
      that.loadCurrentLocation(callback);
    }, options);
  }

  openDialog(data: any): void {
     const dialogRef = this.dialog.open(InfoDialogComponent, {
      width: '250px',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
}

@Component({
  selector: 'app-info-dialog-component',
  templateUrl: 'dialog.html',
})
export class InfoDialogComponent {


  constructor(
    public dialogRef: MatDialogRef<InfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  onButtonClick(type: any, data: any): void {
    if (type === 0) {
      this.redirectToUber(data);
    } else {
      this.redirectToMaps(data);
    }
  }

  private redirectToMaps(data: any): void {
    const destination = data.formatted_address;
    const travelmode = 'walking';
    const dir_action = 'navigate';
    window.location.href = 'https://www.google.com/maps/dir/?api=1&destination=' + destination
    + '&travelmode=' + travelmode + '&dir_action=' + dir_action;
  }

  private redirectToUber(data: any): void {
    const destination =  data.formatted_address;
    window.location.href = 'https://m.uber.com/ul/?action=setPickup&dropoff[formatted_address]=' + destination;
  }

}
