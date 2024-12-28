import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { Place } from '../place.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent  implements  OnInit{
  places = signal<Place[] | undefined>(undefined);
  isFetching = signal(false);
  error = signal('');
  private httpclient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);

  // constructor(private httpClient : HttpClient){}

  ngOnInit(){
    this.isFetching.set(true);
    const subscription = this.httpclient.get<{places:Place[]}>('http://localhost:3000/user-places')
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