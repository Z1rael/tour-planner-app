# Some notes on my plan for this frontend

## Tours

As my understanding of the asked architecture and current state of planning in our project, i believe it would be beneficial to define the DTO's right now.
Though they can be adapted down the line i had my issues of designing anything without any proper decision.
Hence i came to the conclusion it will be a good idea to split the tours into at least 2 data types.

```typescript
interface TourSummary {
  id: number;
  name: string;
  from: string;
  to: string;
  transport_type: string; // or a kind of enum i have not come to a decision yet
  creator_id: number;
}
```

This interface should be the building block of the list few and also the DTO for the get all tours endpoint `/api/tours` or something like that.

```typescript
interface Tour {
  id: number;
  name: string;
  from: string;
  to: string;
  transport_type: string;
  description: string;
  distance: number; // both are calculated by the backend so hard to mock rn
  estimated_time: number; // both are calculated by the backend so hard to mock rn
  route_information: string; // this is the geoJSON string from ORS but this is hard to replicate without backend
  creator_id: number;
}
```

And this one for the detailed few in case it is selected etc...
Adding the creator id will help to handle the display of the edit and delete button, though real ownership will be handled in the backend of course.

with this out of the way i will need to plan the api services and of course the facades for the application. at the beginning i thought i might be a good idea to split everything into very granular pieces but i believe this is very much overkill and does not help my understanding of the whole "frontend" architecture thing. so i will be focusing on better splits and understanding the design a bit better. Hence my current plan on separation would be as followed:

- Tours
  - Api Services
    - Tours
    - Tour Logs
  - Facade (combined)
  - Components
    - Personal tour list
    - personal log list ?mebi
    - complete tour list
    - tour details
    - log list
- Map
  - Api service
    - idk is there a need for that
  - Facade
    - definitely need onw for that
  - Components
    - at least a component for the map
    - dont know if more is needed
- Auth
  - Api services
    - User Api service
  - Facade
    - some kind of that for session management
  - Components
    - Registration
    - Login
    - ?am i missing something

These are the more specialized things i came up with there is still the more general layout of the application missing such as the navbar, footer and prolly a shell as we had planned initially.

### Api Services

My current understanding of these things make me think that leaving the api service with plain api call returning Observables is a good design and i would try to implement them as such. I am currently not sure i i want to have some signal in the api services but i believe this would be a flaw in the design as of now.

### Facade services

So now we let the Facade handle all that state stuff and also the caching etc, etc it feels a bit like repetitive code at the beginning but i believe this is remedied by the fact that the components are enabled to be very slim with that design.

## Tour Logs

As of now i am still unsure if it is a good design decision to split tour logs into 2 separate data representations as well. as obviously it would be a hassle to fetch all the data. But on the other hand i don't see a reason why this would be a issue. There will never be a situation that needs `all` tour logs as far as i believe at the moment. Rather it is always a snapshot of them whether it be the logs of a specific tour or user. Because of this i believe the drawbacks of loading the full information of tour logs will be negligible for this project and the reduction of complexity beneficial.

```typescript
interface TouLog {
    id: number;
    tour_id: number;
    comment: string;
    timestamp: string // ISO datetime
    difficulty: number // 1-5
    total_distance: number;
    total_time: number;
    rating: number: // 1-5
}
```

## User

This is a rather generic object imo so not much to think about, at least for now

```typescript
interface User {
  id: number;
  username: string; // not sure if we want both but here we are for safety sake
  email: string; // not sure if we want both but here we are for safety sake
}
```
