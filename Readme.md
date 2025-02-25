# Skill Exchange Platform

## User Profiles

- **POST /users/register**: Create a new user profile.✅
- **POST /users/login**: user login .✅
- **POST /users/logout**: user logout. --
- **PUT /users/edit**: Update an existing user profile.✅
- \*\*PUT /users/profile getting a user profile.✅

- **DELETE /users/:id**: Delete a user profile.

## Skills

- **GET /skills**: Retrieve a list of all skills offered/requested.
- **GET /skills/:id**: Retrieve details of a specific skill by ID.
- **POST /skills**: Create a new skill offering/request.
- **PUT /skills/:id**: Update an existing skill offering/request.
- **DELETE /skills/:id**: Delete a skill offering/request.

## Ratings and Reviews

- **POST /skills/:id/review**: Add a review for a skill.
- **GET /skills/:id/reviews**: Retrieve all reviews for a specific skill.

## Booking System

- **GET /bookings**: Retrieve a list of all bookings.
- **GET /bookings/:id**: Retrieve details of a specific booking by ID.
- **POST /bookings**: Create a new booking (both provider and requester can create).
- **PUT /bookings/:id**: Update an existing booking (both provider and requester can update).
- **DELETE /bookings/:id**: Cancel a booking (both provider and requester can cancel).
- **PUT /bookings/:id/accept**: Accept a booking request (only for the provider).
- **PUT /bookings/:id/reject**: Reject a booking request (only for the provider).
- **GET /bookings/user/:id**: Retrieve all bookings for a specific user (both provider and requester).
- **GET /bookings/status/:status**: Retrieve all bookings by status (e.g., pending, accepted, rejected).
- **GET /bookings/type/:type**: Retrieve all bookings by type (offering or requesting).
- **GET /bookings/date/:date**: Retrieve all bookings for a specific date.

---

## Calendar Integration

- **GET /calendar**: Retrieve user's calendar events.
- **POST /calendar/events**: Create a new calendar event for a booking.
- **DELETE /calendar/events/:id**: Delete a calendar event.

This API provides a comprehensive structure for managing user profiles, skills, bookings, and barter exchanges, ensuring a seamless experience for users in the skill exchange platform.
