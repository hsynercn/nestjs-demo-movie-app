# Application Design

## Story

In the defined business domain:

-  Add (Register) Users: There are two types of users, managers and customers. Users
have an email, password, and age info.
-  Login: The user will log in using email and password.
-  Add Movie: Only managers can perform this operation. Movies have a name, sessions,
and age restriction info. Sessions consist of the date, room no, and time slot info.
Ex. Name: My Movie, Sessions: [{Date, Time Slot, Room No}, {...}, …], Age: 13
Assume that time slots are constant. (10.00-12.00, 12.00-14.00, …, 22.00-00.00)
- List Movies: All users can perform this operation.
- Delete Movie: Only managers can perform this operation.
- Modify Movie Info: Only managers can perform this operation.
- Buy Ticket: Consider age restriction for this operation.
- Watch Movie: The user can watch a movie if s/he has a valid ticket for that session. The
service should return a successful response.
    - If the user gets a successful response, You should create a record entry
consisting of [user, movie, date]
- List Watched Movies: The user can see the list of movies s/he has watched before

## Extracted Terms

- Room: Is a physical location where movies are shown, with a specific capacity
- Movie: Is a movie that can be watched with a minimum age restriction
- Session: Is a 2 hours period, a movie that is shown in a room at a specific time
- Ticket: Is a ticket that is bought by a user to watch a movie in a session
- Manager: Is a person who can add rooms and movies, and create sessions

## Key Scenarios

Actors:

- Manager: Admin user who can modify the most of the entities
- User: Customer user who can buy tickets, and watch movies

We can target the key scenarios as follows:

Session creation:

- Manager adds a room
- Manager adds a movie
- Manager creates a session with a movie and a room, for a specific date and time slot
- Manager cannot create a session for a room, date and time slot that is already scheduled

Ticket creation:
- User lists movies
- User picks a movie a lists sessions
- User picks a session and buys a ticket
- User cannot buy a ticket for a session that at full capacity
- User cannot buy a ticket for a session with an age restriction that is not satisfied

Ticket usage:
- User uses a ticket to watch a movie in a session
- Ticket becomes a used ticket

Listing watched movies:
- User could list his/her tickets

## Domain Model

With extracted scenarios, we can define the domain model with the following entities:

- Room Entity: Physical location model with a name, and capacity
- Movie Entity: Movie model with a name, age restriction
- Session Entity: Session model with a movie, room, date, and time slot
- Ticket Entity: Ticket model with a user, session, and status
- User Entity: User model with an email, password, and age info

I have preferred to use different modules/services for each entity, and a module for authentication. In a NestJS application we can leverage the module system to encapsulate the domain modules.

- All modules will encapsulate their own domain model, and business details. Service layer will be responsible for the business logic.
- We can integrate the modules at service layer.
- We will not use a shared database between the modules, we will not use entity restrictions which references to other entities.
- One module could inject the required module for its service layer.
- In the future, we can further decouple the modules in necessary conditions. We can use extract new services from the existing modules.

We can represent the domain model with the following relation diagram:

```mermaid
classDiagram
    SessionsModule ..> MoviesModule
    SessionsModule ..> RoomsModule
    AuthModule ..> UsersModule
    TicketsModule ..> UsersModule
    TicketsModule ..> SessionsModule
```

### RoomsModule

Will be responsible for CRUD operations for room entity.

### MoviesModule

Will be responsible for CRUD operations for movie entity.

### SessionsModule

Will be responsible for CRUD operations for session entity.

- Two session entities cannot exist with the same room, date, and time slot.

### TicketsModule

Will be responsible for CRUD operations for ticket entity.

- A ticket cannot be created for a session that is full, or has an age restriction that is not satisfied by the user.

## Technical Design

## TypeORM, Entities

I have selected the TypeORM as the common ORM for all modules. TypeORm is a popular ORM for Node.js applications. It provides isolation from the underlying database technology. We can use the same entities on different databases. Additionally, we will utilize the in memory database for the e2e tests.

If we repeat the isolation principle for modules we will not use any cross entity references. We will not use any foreign key constraints. Similar constraints will be implemented at the service layer. Our individual entities will be only responsible for their own entity.

For better reliability we will introduce several constraints at the database level:

- User table will apply a unique constraint for the email column.
- Session will apply a unique constraint for the room, date, and time slot columns.

For several cases we will consider using indexing for better performance, but we should avoid premature optimization. We can plan the optimization steps with metrics.

### Authentication

For application authentication, we will use JWT (JSON Web Token) authentication. We will use a JWT token to authenticate the user after login. This app will not provide the full functionality of a real-world authentication system. For the guard strategies we will use passport.js module.

Passport.js is a popular authentication middleware for Node.js. We will use passport.js local strategy for authentication, in long term we can extend the authentication system with other strategies like oauth2, or social media authentication.

- App will not use refresh tokens, and we will not use a blacklist for the tokens.
- App will not use a password policy.
- App will not use a password reset, change, recovery functionality.
- App will not use a password expiration.
- App will not support oauth2 federated authentication with social media accounts.

On the user registration, we will use bcrypt.js module to hash the password.

NestJS provides the guard system to protect the endpoints. We will require the user to be authenticated for the endpoints that require authentication. We will use JwtAuthGuard for this purpose.

### Role Policy

We have two types of users, managers and customers. App will use a role policy to restrict the access to the endpoints.

At the user registration, we are accepting the user role as a parameter, this behavior is not realistic for a real-world application.

Currently, we don't have defined user leveraging mechanism. For our app we can consider migrating the initial admin user with a prod migration and with the initial admin manager we can change the role of the users, can create new managers.

For role policy control we will use API endpoint decorators. We will use @Roles decorator to restrict the access to the endpoints. We will use RoleGuard to protect the endpoints.

### Unit Tests with Jest, E2E Tests with Supertest

I have created unit tests for movies, rooms, session modules. Unit tests are based on the Jest framework. For unit testing strategy spec files are located next to the source files, they will contain the layer behavior tests.

Service layer tests will be only responsible for the business logic. We will mock the repository layer for the service layer tests. If we use other modules in the service layer, we will mock them too. By this way we could test the service layer in fine isolation. Same principle is also applied to the controller layer. For this case we will mock the related service classes. NestJS provides great flexibility with the help of native dependency injection system.