import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements  OnInit{
  places = signal<Place[] | undefined>(undefined);
  isFetching = signal(false);
  error = signal('');
  private httpclient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);

  // constructor(private httpClient : HttpClient){}

  ngOnInit(){
    this.isFetching.set(true);
    const subscription = this.httpclient.get<{places:Place[]}>('http://localhost:3000/places')
    .pipe(
    map((resData) => resData.places
    ))
    .subscribe({
      next: (places)=>{
this.places.set(places);      },
error:(error)=>{
this.error.set(error.message);
},
complete:()=>{
    this.isFetching.set(false);
}
    });

    this.destroyRef.onDestroy(()=>{
      subscription.unsubscribe();
    });
  }
  onselectPlace(selectPlace:Place){
    this.httpclient.put('http://localhost:3000/user-places',{
      placeId:selectPlace.id
    }).subscribe(
      {
        next: (resData)=>console.log(resData)
      }
    )
  }
}
