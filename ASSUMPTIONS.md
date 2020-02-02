# Hotel Booking system 

## Descrition
```
Internal system for capturing client bookings
Should be able to add new booking
Should be able to delete existing booking
```

## Testing
```
All fields are mandatory 
Field types
    Firstname   : string
    Surname     : string
    Price       : integer (max/min)
    Deposit     : boolean
    Check-in    : date
    Check-out   : date
```

### Scenarios
```
Expect to save a valid booking
Expect to delete an existing booking
Expect to not be able to save any null fields
Expect to not be able to save an empty string fields
Expect to not be able to save strings in integer fields
Expect to not be able to save invalid date fields (yyyy-mm-dd)
Expect to not be able to save a check-in / check-out date in the past
Expect to not be able to save with a check-out date < check-in date
```

# Manual testing (X potential issues)
```
Basic functionality for adding and removing a booking works
UI upates (after a while) when the new booking is added
X. No UI field validation
X. No error validation when an api error has occured
X. Firstname,Surname,Price allow empty strings
X. Date can be any date in format yyyy-mm-dd
```

## Ingoring
```
Performance - slow for user feedback - could be handled with loaders and error messages.
Mobile - doesnt seem to be built with mobile in mind.
Security - crud systems should be tested for sql injection, see embeeded basic auth tokens.
Can delete bookings you havnt created, should be user associated.
No idea of limits to number of bookings allowed for this hotel.
```