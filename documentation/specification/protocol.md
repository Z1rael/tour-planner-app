# Project Protocol – Tour Management Application
## 1. Technical Steps & Decisions
### 1.1 Architecture

The application is built using Angular & follows a Facade-based architecture.

A central TourFacade is used to:
- Manage application state
- Handle business logic
- Provide data to UI components

This ensures a clear separation between:
- Presentation layer (components)
- Business logic (facade/services)

### 1.2 Design Decisions
#### Facade Pattern

The TourFacade acts as an abstraction layer between components & services.

#### Benefits:
- Simplifies component logic
- Centralizes state management
- Improves testability

#### Angular Signals & Forms

The application uses:
- signal() for state
- form() API for forms

#### Benefits:
- Reactive updates without manual subscriptions
- Reduced boilerplate
- Cleaner data flow
- Standalone Components

All components are implemented as standalone components.

#### Reasons:
- No need for NgModules
- Easier reuse & testing
- Cleaner project structure

### 1.3 Challenges & Failures
Fucking centering a god damn div & the bubbles & getting them to be the same size
localStorage

## 2. Application Features
see Use-Case.drawio.svg
### Main features:
- User registration
- User login
- View tours
- Search tours
- View tour details
- Create tour
- Edit tour

## 3. Wireframes
see Wiremocks.drawio.svg

## 4. Application Architecture
see database.puml
see entities.puml

#### Overview
The architecture consists of:
#### Components
- TourList
- TourDetails
- TourForm
- Login / Register
- Facade
- TourFacade
- Services
- TourService (data handling)
- MapService (route calculation)

### Full-Text Search Flow
#### Process description:
1. User enters search query
2. Component calls setQuery()
3. Facade updates query state
4. Filtered tours are computed
5. UI updates automatically

## 6. Time Tracking
| Task | Time |
| ------ | ------ |
| general .css   | 5h   |
| user mock service   | 3h   |
| leaflet integration   | 2h |
| restructuring html   | 1h   |
| Cell   | Cell   |
| Cell   | Cell   |

Total: X hours

## 7. Git History
https://github.com/Z1rael/tour-planner-app

## 8. Summary
The project demonstrates:
- A clean separation of concerns using the Facade pattern
- Reactive programming with Angular Signals
- Modular & maintainable component structure
- A foundation for future extensions