-- CS4400: Introduction to Database Systems: Monday, March 3, 2025
-- Simple Airline Management System Course Project Mechanics [TEMPLATE] (v0)
-- Views, Functions & Stored Procedures

/* This is a standard preamble for most of our scripts.  The intent is to establish
a consistent environment for the database behavior. */
set global transaction isolation level serializable;
set global SQL_MODE = 'ANSI,TRADITIONAL';
set names utf8mb4;
set SQL_SAFE_UPDATES = 0;

set @thisDatabase = 'flight_tracking';
use flight_tracking;
-- -----------------------------------------------------------------------------
-- stored procedures and views
-- -----------------------------------------------------------------------------
/* Standard Procedure: If one or more of the necessary conditions for a procedure to
be executed is false, then simply have the procedure halt execution without changing
the database state. Do NOT display any error messages, etc. */

-- [_] supporting functions, views and stored procedures
-- -----------------------------------------------------------------------------
/* Helpful library capabilities to simplify the implementation of the required
views and procedures. */
-- -----------------------------------------------------------------------------
drop function if exists leg_time;
delimiter //
create function leg_time (ip_distance integer, ip_speed integer)
	returns time reads sql data
begin
	declare total_time decimal(10,2);
    declare hours, minutes integer default 0;
    set total_time = ip_distance / ip_speed;
    set hours = truncate(total_time, 0);
    set minutes = truncate((total_time - hours) * 60, 0);
    return maketime(hours, minutes, 0);
end //
delimiter ;

-- [1] add_airplane()
-- -----------------------------------------------------------------------------
/* This stored procedure creates a new airplane.  A new airplane must be sponsored
by an existing airline, and must have a unique tail number for that airline.
username.  An airplane must also have a non-zero seat capacity and speed. An airplane
might also have other factors depending on it's type, like the model and the engine.  
Finally, an airplane must have a new and database-wide unique location
since it will be used to carry passengers. */
-- -----------------------------------------------------------------------------
drop procedure if exists add_airplane;
delimiter //
create procedure add_airplane (in ip_airlineID varchar(50), in ip_tail_num varchar(50),
	in ip_seat_capacity integer, in ip_speed integer, in ip_locationID varchar(50),
    in ip_plane_type varchar(100), in ip_maintenanced boolean, in ip_model varchar(50),
    in ip_neo boolean)
sp_main: begin
	if ip_plane_type not in ('Boeing', 'Airbus', 'neither') then
		leave sp_main;
	  end if;
  if exists (select 1 from airplane where tail_num = ip_tail_num and airlineID = ip_airlineID) then leave sp_main; end if;
  if exists (select 1 from location where locationID = ip_locationID) then leave sp_main; end if;
  if not exists (select 1 from airline where airlineID = ip_airlineID) then leave sp_main; end if;
  if ip_seat_capacity <= 0 or ip_speed <= 0 then leave sp_main; end if;

  insert into location(locationID) values (ip_locationID);
  insert into airplane(airlineID, tail_num, seat_capacity, speed, locationID, plane_type, maintenanced, model, neo)
  values (ip_airlineID, ip_tail_num, ip_seat_capacity, ip_speed, ip_locationID, ip_plane_type, ip_maintenanced, ip_model, ip_neo);
end //
delimiter ;

-- [2] add_airport()
-- -----------------------------------------------------------------------------
/* This stored procedure creates a new airport.  A new airport must have a unique
identifier along with a new and database-wide unique location if it will be used
to support airplane takeoffs and landings.  An airport may have a longer, more
descriptive name.  An airport must also have a city, state, and country designation. */
-- -----------------------------------------------------------------------------
drop procedure if exists add_airport;
delimiter //
create procedure add_airport (in ip_airportID char(3), in ip_airport_name varchar(200),
    in ip_city varchar(100), in ip_state varchar(100), in ip_country char(3), in ip_locationID varchar(50))
sp_main: begin

    if exists (select 1 from airport where airportID = ip_airportID) then leave sp_main;
    end if;
    if exists (select 1 from location where locationID = ip_locationID) then leave sp_main;
    end if;   
    
    insert into location(locationID)
    values(ip_locationID);
    
    insert into airport(airportID, airport_name, city, state, country, locationID)
    values (ip_airportID, ip_airport_name, ip_city, ip_state, ip_country, ip_locationID);

end //
delimiter ;

-- [3] add_person()
-- -----------------------------------------------------------------------------
/* This stored procedure creates a new person.  A new person must reference a unique
identifier along with a database-wide unique location used to determine where the
person is currently located: either at an airport, or on an airplane, at any given
time.  A person must have a first name, and might also have a last name.

A person can hold a pilot role or a passenger role (exclusively).  As a pilot,
a person must have a tax identifier to receive pay, and an experience level.  As a
passenger, a person will have some amount of frequent flyer miles, along with a
certain amount of funds needed to purchase tickets for flights. */
-- -----------------------------------------------------------------------------
drop procedure if exists add_person;
delimiter //
create procedure add_person (in ip_personID varchar(50), in ip_first_name varchar(100),
    in ip_last_name varchar(100), in ip_locationID varchar(50), in ip_taxID varchar(50),
    in ip_experience integer, in ip_miles integer, in ip_funds integer)
sp_main: begin
  if exists (select 1 from person where personID = ip_personID) then leave sp_main; end if;
  if not exists (select 1 from location where locationID = ip_locationID) then leave sp_main; end if;
  if ip_first_name is null then leave sp_main; end if;
  if ( (ip_taxID is not null and ip_experience is not null) = (ip_miles is not null and ip_funds is not null) ) then leave sp_main; end if;

  insert into person(personID, first_name, last_name, locationID)
  values (ip_personID, ip_first_name, ip_last_name, ip_locationID);

  if (ip_taxID is not null and ip_experience is not null) then
    insert into pilot(personID, taxID, experience, commanding_flight)
    values (ip_personID, ip_taxID, ip_experience, NULL);
  end if;

  if (ip_miles is not null and ip_funds is not null) then
    insert into passenger(personID, miles, funds)
    values (ip_personID, ip_miles, ip_funds);
  end if;
end //
DELIMITER ;


-- [4] grant_or_revoke_pilot_license()
-- -----------------------------------------------------------------------------
/* This stored procedure inverts the status of a pilot license.  If the license
doesn't exist, it must be created; and, if it aready exists, then it must be removed. */
-- -----------------------------------------------------------------------------
drop procedure if exists grant_or_revoke_pilot_license;
delimiter //
create procedure grant_or_revoke_pilot_license (in ip_personID varchar(50), in ip_license varchar(100))
sp_main: begin
    if not exists (select 1 from pilot where personID = ip_personID) then leave sp_main;
    end if;
    
    if exists (select 1 from pilot_licenses where personID = ip_personID and license = ip_license) then
		delete from pilot_licenses
		where personID = ip_personID and license = ip_license;
	else
		insert into pilot_licenses(personID, license)
		values (ip_personID, ip_license);
	end if;
end //
delimiter ;

-- [5] offer_flight()
-- -----------------------------------------------------------------------------
/* This stored procedure creates a new flight.  The flight can be defined before
an airplane has been assigned for support, but it must have a valid route.  And
the airplane, if designated, must not be in use by another flight.  The flight
can be started at any valid location along the route except for the final stop,
and it will begin on the ground.  You must also include when the flight will
takeoff along with its cost. */
-- -----------------------------------------------------------------------------
drop procedure if exists offer_flight;
delimiter //
create procedure offer_flight (in ip_flightID varchar(50), in ip_routeID varchar(50),
    in ip_support_airline varchar(50), in ip_support_tail varchar(50), in ip_progress integer,
    in ip_next_time time, in ip_cost integer)
sp_main: begin
  if exists (select 1 from flight where flightID = ip_flightID) then leave sp_main; end if;
  if ip_support_airline is not null and ip_support_tail is not null and not exists (select 1 from airplane where airlineID = ip_support_airline and tail_num = ip_support_tail) then leave sp_main; end if;
  if ip_support_airline is not null and ip_support_tail is not null and exists (select 1 from flight where support_airline = ip_support_airline and support_tail = ip_support_tail) then leave sp_main; end if;
  if not exists (select 1 from route where routeID = ip_routeID) then leave sp_main; end if;
  if ip_progress >= (select count(*) from route_path where routeID = ip_routeID) then leave sp_main; end if;

  insert into flight(flightID, routeID, support_airline, support_tail, progress, airplane_status, next_time, cost)
  values (ip_flightID, ip_routeID, ip_support_airline, ip_support_tail, ip_progress, 'on_ground', ip_next_time, ip_cost);
end //
delimiter ;

-- [6] flight_landing()
-- -----------------------------------------------------------------------------
/* This stored procedure updates the state for a flight landing at the next airport
along it's route.  The time for the flight should be moved one hour into the future
to allow for the flight to be checked, refueled, restocked, etc. for the next leg
of travel.  Also, the pilots of the flight should receive increased experience, and
the passengers should have their frequent flyer miles updated. */
-- -----------------------------------------------------------------------------
drop procedure if exists flight_landing;
delimiter //
create procedure flight_landing (in ip_flightID varchar(50))
sp_main: begin

    if not exists (select 1 from flight where flightID = ip_flightID) then leave sp_main;
    end if;
    
    if (select airplane_status from flight where flightID = ip_flightID) != 'in_flight' then leave sp_main;
    end if;
    
    update pilot set experience = experience + 1 where commanding_flight = ip_flightID;
    
    update passenger p set p.miles = p.miles + 
		(select l.distance from route_path r 
		 left outer join leg l on r.legID = l.legID 
		 where r.routeID = (select f.routeID from flight f where f.flightID = ip_flightID) 
		 and r.sequence = (select f.progress from flight f where f.flightID = ip_flightID)) 
	where p.personID in (select personID from person per where per.locationID = 
		(select a.locationID from airplane a where a.locationID is not null and a.tail_num = (select f.support_tail from flight f where flightID = ip_flightID) and a.airlineID = (select f.support_airline from flight f where flightID = ip_flightID)));
    
    update flight set airplane_status = 'on_ground' where flightID = ip_flightID;
    update flight set next_time = addtime(next_time, '01:00:00') where flightID = ip_flightID;


end //
delimiter ;

-- [7] flight_takeoff()
-- -----------------------------------------------------------------------------
/* This stored procedure updates the state for a flight taking off from its current
airport towards the next airport along it's route.  The time for the next leg of
the flight must be calculated based on the distance and the speed of the airplane.
And we must also ensure that Airbus and general planes have at least one pilot
assigned, while Boeing must have a minimum of two pilots. If the flight cannot take
off because of a pilot shortage, then the flight must be delayed for 30 minutes. */
-- -----------------------------------------------------------------------------
drop procedure if exists flight_takeoff;
delimiter //
create procedure flight_takeoff (in ip_flightID varchar(50))
sp_main: begin
  declare currProgress int;
  declare currRouteID varchar(100);
  declare planeType varchar(100);
  declare supportTail varchar(100);
  declare airplaneSpeed int;
  declare legDistance int;
  declare flightTime float;
  declare hoursPart int;
  declare minutesPart int;
  declare secondsPart int;
  declare commandingFlightCount int;
  declare finalTime varchar(100);

  if not exists (select 1 from flight where flightID = ip_flightID) then leave sp_main; end if;
  if (select airplane_status from flight where flightID = ip_flightID) != 'on_ground' then leave sp_main; end if;

  select progress into currProgress from flight where flightID = ip_flightID;
  select routeID into currRouteID from flight where flightID = ip_flightID;
  if not exists (select 1 from route_path where routeID = currRouteID and sequence = currProgress + 1) then leave sp_main; end if;

  select plane_type, tail_num into planeType, supportTail from airplane where airlineID = (select support_airline from flight where flightID = ip_flightID) and tail_num = (select support_tail from flight where flightID = ip_flightID);
  select count(*) into commandingFlightCount from pilot where commanding_flight = ip_flightID;

  if (planeType = 'Boeing' and commandingFlightCount < 2) or (planeType != 'Boeing' and commandingFlightCount < 1) then
    update flight set next_time = addtime(next_time, '00:30:00') where flightID = ip_flightID;
    leave sp_main;
  end if;

  update flight set airplane_status = 'in_flight', progress = currProgress + 1 where flightID = ip_flightID;

  select speed into airplaneSpeed from airplane where tail_num = supportTail;
  select l.distance into legDistance from route_path r join leg l on r.legID = l.legID where r.routeID = currRouteID and r.sequence = currProgress + 1;

  set flightTime = legDistance / airplaneSpeed;
  set hoursPart = floor(flightTime);
  set minutesPart = floor((flightTime - hoursPart) * 60);
  set secondsPart = round((((flightTime - hoursPart) * 60 - minutesPart) * 60));

  if secondsPart = 60 then set secondsPart = 0; set minutesPart = minutesPart + 1; end if;
  if minutesPart = 60 then set minutesPart = 0; set hoursPart = hoursPart + 1; end if;

  set finalTime = concat(lpad(hoursPart,2,'0'), ':', lpad(minutesPart,2,'0'), ':', lpad(secondsPart,2,'0'));
  update flight set next_time = addtime(next_time, finalTime) where flightID = ip_flightID;
end //
delimiter ;


-- [8] passengers_board()
-- -----------------------------------------------------------------------------
/* This stored procedure updates the state for passengers getting on a flight at
its current airport.  The passengers must be at the same airport as the flight,
and the flight must be heading towards that passenger's desired destination.
Also, each passenger must have enough funds to cover the flight.  Finally, there
must be enough seats to accommodate all boarding passengers. */
-- -----------------------------------------------------------------------------
drop procedure if exists passengers_board;
delimiter //
create procedure passengers_board (in ip_flightID varchar(50))
sp_main: begin
	
    declare myStatus varchar(50);
    declare myRouteID varchar(50);
    declare myProgress int;
    
    declare myNext_time TIME;
    declare myFlight_cost int;
    declare mySupport_airline varchar(50);
    
    declare mySupport_tail varchar(50);
    declare myTotal_legs int;
    
    declare myAirport_location varchar(50);  
    declare myNext_airport varchar(50);    
    
    declare myCandidate_count int;
    declare mySeat_capacity int;
    declare myBoarded_count int;
    
    declare myAirplane_location varchar(50); 
    declare myTemp_airport_id char(3);         

    select airplane_status, routeID, progress, next_time, cost, support_airline, support_tail into myStatus, myRouteID, myProgress, myNext_time, myFlight_cost, mySupport_airline, mySupport_tail
	from flight
	where flightID = ip_flightID;
   
   
    IF myStatus IS NULL THEN LEAVE sp_main; END IF;
   
    IF NOT EXISTS (SELECT * FROM flight WHERE flightID = ip_flightID) THEN LEAVE sp_main; END IF;
   
    IF NOT (myStatus = 'on_ground') THEN leave sp_main; END IF;
   
    select count(*) into myTotal_legs from route_path
      where routeID = myRouteID;
      
    IF myProgress >= myTotal_legs THEN
         leave sp_main;
    END IF;
   
    if myProgress = 0 then(select l.departure into myTemp_airport_id from route_path rp join leg l on rp.legID = l.legID where rp.routeID = myRouteID and rp.sequence = 1);
    ELSE
         (select l.arrival into myTemp_airport_id from route_path rp join leg l ON rp.legID = l.legID where rp.routeID = myRouteID AND rp.sequence = myProgress);
    END IF;
   
   
   
    select locationID into myAirport_location from airport where airportID = myTemp_airport_id;
   
    select l.arrival into myNext_airport from route_path rp
	join leg l ON rp.legID = l.legID
	where rp.routeID = myRouteID AND rp.sequence = (myProgress + 1);
   
   
   
    select seat_capacity, locationID
	into mySeat_capacity, myAirplane_location from airplane where airlineID = mySupport_airline AND tail_num = mySupport_tail;
   
    select count(*) into myBoarded_count from person
      where locationID = myAirplane_location and personID in (select personID from passenger);
   
   
   
    select count(distinct per.personID) INTO myCandidate_count from person per
      join passenger p ON per.personID = p.personID join passenger_vacations pv ON per.personID = pv.personID
      where per.locationID = myAirport_location and pv.airportID = myNext_airport and pv.sequence = 1 and p.funds >= myFlight_cost;
    IF (myBoarded_count + myCandidate_count) > mySeat_capacity then
         leave sp_main;
    END IF;
   
   
    update passenger p join person per ON p.personID = per.personID join passenger_vacations pv on per.personID = pv.personID
      set p.funds = p.funds - myFlight_cost,per.locationID = myAirplane_location
      where per.locationID = myAirport_location and pv.airportID = myNext_airport and pv.sequence = 1 and p.funds >= myFlight_cost;
        
end //
delimiter ;

-- [9] passengers_disembark()
-- -----------------------------------------------------------------------------
/* This stored procedure updates the state for passengers getting off of a flight
at its current airport.  The passengers must be on that flight, and the flight must
be located at the destination airport as referenced by the ticket. */
-- -----------------------------------------------------------------------------
drop procedure if exists passengers_disembark;
delimiter //
create procedure passengers_disembark (in ip_flightID varchar(50))
sp_main: begin
	declare airplaneStatus varchar(50);
    declare airplaneRouteID varchar(50);
    declare airplaneProgress int;
    declare airplaneNextTime TIME;
    
    declare flightCost int;
    declare supportAirline varchar(50);
    declare supportTail varchar(50);
    
    declare tempAirportID char(3); 
    declare airportLocation varchar(50); 
    declare airplaneLocation varchar(50);


	select airplane_status, routeID, progress, next_time, cost, support_airline, support_tail into airplaneStatus, airplaneRouteID, airplaneProgress, airplaneNextTime, flightCost, supportAirline, supportTail
	from flight where flightID = ip_flightID;
	if airplaneStatus IS NULL then 
		 leave sp_main;
	END IF;
	if not (airplaneStatus = 'on_ground') then 
		 leave sp_main;
	END IF;



	select l.arrival into tempAirportID from route_path rp
	join leg l on rp.legID = l.legID
	where rp.routeID = airplaneRouteID and rp.sequence = airplaneProgress;


	select locationID into airportLocation from airport
	where airportID = tempAirportID;


	select locationID into airplaneLocation
	  from airplane where airlineID = supportAirline and tail_num = supportTail;



	update person p join passenger pa ON p.personID = pa.personID join passenger_vacations pv on p.personID = pv.personID
	set p.locationID = airportLocation where p.locationID = airplaneLocation and pv.airportID = tempAirportID and pv.sequence = 1;


	update passenger_vacations pv join person p on p.personID = pv.personID
	join (select distinct personID
		from passenger_vacations where airportID = tempAirportID) AS varun ON varun.personID = p.personID
	set pv.sequence = pv.sequence - 1
	where p.locationID = airportLocation and pv.sequence > 1;
		
        
        
	delete from passenger_vacations
	where sequence <= 0;

end //
delimiter ;

-- [10] assign_pilot()
-- -----------------------------------------------------------------------------
/* This stored procedure assigns a pilot as part of the flight crew for a given
flight.  The pilot being assigned must have a license for that type of airplane,
and must be at the same location as the flight.  Also, a pilot can only support
one flight (i.e. one airplane) at a time.  The pilot must be assigned to the flight
and have their location updated for the appropriate airplane. */
-- -----------------------------------------------------------------------------
drop procedure if exists assign_pilot;
delimiter //
create procedure assign_pilot (in ip_flightID varchar(50), ip_personID varchar(50))
sp_main: begin
	declare myFlightStatus VARCHAR(50);
    declare myRouteID VARCHAR(50);
    declare myProgress INT;
    
    declare myTotalLegs INT;
    declare mySupportAirline VARCHAR(50);
    
    declare mySupportTail VARCHAR(50);
    declare myAirplaneType VARCHAR(100);
    
    declare myCurrAirportID CHAR(3);
    declare myAirportLoc VARCHAR(50);
    declare myAirplaneLoc VARCHAR(50);
    declare myPilotLoc VARCHAR(50);
    
    if not exists (select * from flight where flightID = ip_flightID) then leave sp_main; end if;
    
    select airplane_status, routeID, progress, support_airline, support_tail into myFlightStatus, myRouteID, myProgress, mySupportAirline, mySupportTail
	from flight
	where flightID = ip_flightID;
    if not (myFlightStatus = 'on_ground') then leave sp_main; end if;
    
    select count(*) into myTotalLegs from route_path where routeID = myRouteID;
    if myProgress >= myTotalLegs then leave sp_main; end if;
    
    
    if not exists (select * from pilot where personID = ip_personID) then leave sp_main;
    end if;
    if exists (select * from pilot where personID = ip_personID and commanding_flight is not null) then leave sp_main;
    end if;
    select plane_type, locationID INTO myAirplaneType, myAirplaneLoc from airplane where airlineID = mySupportAirline AND tail_num = mySupportTail;



    if not exists (select * from pilot_licenses where personID = ip_personID and license = myAirplaneType) then
         leave sp_main;
    end if;
    
    if myProgress = 0 then
        select l.departure into myCurrAirportID from route_path rp join leg l ON rp.legID = l.legID
          where rp.routeID = myRouteID and rp.sequence = 1;
    else
        select l.arrival into myCurrAirportID from route_path rp
          join leg l on rp.legID = l.legID
          where rp.routeID = myRouteID and rp.sequence = myProgress;
    end if;
    
    
    select locationID into myAirportLoc from airport where airportID = myCurrAirportID;
    select locationID into myPilotLoc from person where personID = ip_personID;
    if not (myPilotLoc = myAirportLoc) then leave sp_main; end if;
    
    
    update pilot set commanding_flight = ip_flightID where personID = ip_personID;
    update person set locationID = myAirplaneLoc where personID = ip_personID;
    
end //
delimiter ;


-- [11] recycle_crew()
-- -----------------------------------------------------------------------------
/* This stored procedure releases the assignments for a given flight crew.  The
flight must have ended, and all passengers must have disembarked. */
-- -----------------------------------------------------------------------------
drop procedure if exists recycle_crew;
delimiter //
create procedure recycle_crew (in ip_flightID varchar(50))
sp_main: begin
    declare flightStatus varchar(20);
    declare routeID varchar(50);
    declare progress integer;
    declare numlegs integer;
    declare plane_airlineID varchar(50);
    declare plane_tail_num varchar(50);
    declare passengerCount int;
	declare endingLegID varchar(50);
    declare endingAirportID char(3);
	declare airport_locationID varchar(50);
    
    -- Ensure that the flight is on the ground
    select f.routeID, f.airplane_status, f.progress, f.support_airline, f.support_tail 
    into routeID, flightStatus, progress, plane_airlineID, plane_tail_num 
    from flight as f
    where f.flightID = ip_flightID;
    
    if flightStatus != 'on_ground' then leave sp_main; 
    end if;
    
    -- Ensure that the flight does not have any more legs
    select count(*) into numlegs from route_path as r where r.routeID = routeID;
    if progress != numlegs then leave sp_main;
    end if;
    
    select a.locationID into airport_locationID from route_path r join leg l ON r.legID = l.legID join airport a ON l.arrival = a.airportID where r.routeID = routeID AND r.sequence = numlegs;
        
    -- Ensure that the flight is empty of passengers
    select count(*) into passengerCount 
    from person p
    join passenger pa on p.personID = pa.personID
    join airplane a on p.locationID = a.locationID
    where a.airlineID = plane_airlineID and a.tail_num = plane_tail_num;
    
    if passengerCount > 0 then leave sp_main;
    end if;
    
    -- Update assignments of all pilots
    -- Move all pilots to the airport the plane of the flight is located at
    update person p
    join pilot pi on p.personID = pi.personID
    set p.locationID = airport_locationID,
        pi.commanding_flight = NULL
    where pi.commanding_flight = ip_flightID;
    
end //
delimiter ;

-- [12] retire_flight()
-- -----------------------------------------------------------------------------
/* This stored procedure removes a flight that has ended from the system.  The
flight must be on the ground, and either be at the start its route, or at the
end of its route.  And the flight must be empty - no pilots or passengers. */
-- -----------------------------------------------------------------------------
drop procedure if exists retire_flight;
delimiter //
create procedure retire_flight (in ip_flightID varchar(50))
sp_main: begin
  declare flightStatus varchar(20);
  declare progress integer;
  declare routeID varchar(50);
  declare plane_airlineID varchar(50);
  declare plane_tail_num varchar(50);
  declare numlegs integer;
  declare remainingPeople integer;

  select routeID, airplane_status, progress, support_airline, support_tail
  into routeID, flightStatus, progress, plane_airlineID, plane_tail_num
  from flight where flightID = ip_flightID;

  if flightStatus != 'on_ground' then leave sp_main; end if;

  select count(*) into numlegs from route_path where routeID = routeID;
  if progress != 1 and progress != numlegs then leave sp_main; end if;

  select count(*) into remainingPeople from person p
  join airplane a on p.locationID = a.locationID
  where a.airlineID = plane_airlineID and a.tail_num = plane_tail_num;
  if remainingPeople > 0 then leave sp_main; end if;

  delete from flight where flightID = ip_flightID;
end //
delimiter ;

-- [13] simulation_cycle()
-- -----------------------------------------------------------------------------
/* This stored procedure executes the next step in the simulation cycle.  The flight
with the smallest next time in chronological order must be identified and selected.
If multiple flights have the same time, then flights that are landing should be
preferred over flights that are taking off.  Similarly, flights with the lowest
identifier in alphabetical order should also be preferred.

If an airplane is in flight and waiting to land, then the flight should be allowed
to land, passengers allowed to disembark, and the time advanced by one hour until
the next takeoff to allow for preparations.

If an airplane is on the ground and waiting to takeoff, then the passengers should
be allowed to board, and the time should be advanced to represent when the airplane
will land at its next location based on the leg distance and airplane speed.

If an airplane is on the ground and has reached the end of its route, then the
flight crew should be recycled to allow rest, and the flight itself should be
retired from the system. */
-- -----------------------------------------------------------------------------
drop procedure if exists simulation_cycle;
delimiter //
create procedure simulation_cycle ()
sp_main: begin
declare flight_id VARCHAR(50);
declare airplane_status VARCHAR(100);
declare route_id VARCHAR(50);
declare curr_progress INT;
declare sequence_end INT;

select f.flightID, f.airplane_status, f.routeID, f.progress
into flight_id, airplane_status, route_id, curr_progress
from flight f where f.airplane_status IN ('in_flight', 'on_ground')

order by
    f.next_time asc,
    f.airplane_status = 'in_flight' desc,
    f.progress desc,
    f.flightID asc
limit 1;

select max(sequence) into sequence_end from route_path where routeID = route_id;

if airplane_status = 'in_flight' then
    call flight_landing(flight_id);
    call passengers_disembark(flight_id);

    if curr_progress = sequence_end then
        call retire_flight(flight_id);
        call recycle_crew(flight_id);
    end if;
end if;

if airplane_status = 'on_ground' then
    if curr_progress = sequence_end then
        call retire_flight(flight_id);
        call recycle_crew(flight_id);
    else
        call passengers_board(flight_id);
        call flight_takeoff(flight_id);
    end if;
end if;
end //
delimiter ;


-- [14] flights_in_the_air()
-- -----------------------------------------------------------------------------
/* This view describes where flights that are currently airborne are located. 
We need to display what airports these flights are departing from, what airports 
they are arriving at, the number of flights that are flying between the 
departure and arrival airport, the list of those flights (ordered by their 
flight IDs), the earliest and latest arrival times for the destinations and the 
list of planes (by their respective flight IDs) flying these flights. */
-- -----------------------------------------------------------------------------
create or replace view flights_in_the_air (departing_from, arriving_at, num_flights,
	flight_list, earliest_arrival, latest_arrival, airplane_list) as
select 
	l.departure as departing_from, 
    l.arrival as arriving_at, 
    count(*) as num_flights, 
    group_concat(f.flightID separator ',') as flight_list, 
    min(f.next_time) earliest_arrival, 
    max(f.next_time) latest_arrival, 
    group_concat(a.locationID separator ',') as airplane_list
from flight f 
	join route_path r on f.routeID = r.routeID AND f.progress = r.sequence 
    join leg l on r.legID = l.legID 
    join airplane a on f.support_airline = a.airlineID and f.support_tail = a.tail_num
where f.airplane_status = 'in_flight' 
group by l.departure, l.arrival;

-- [15] flights_on_the_ground()
-- ------------------------------------------------------------------------------
/* This view describes where flights that are currently on the ground are 
located. We need to display what airports these flights are departing from, how 
many flights are departing from each airport, the list of flights departing from 
each airport (ordered by their flight IDs), the earliest and latest arrival time 
amongst all of these flights at each airport, and the list of planes (by their 
respective flight IDs) that are departing from each airport.*/
-- ------------------------------------------------------------------------------
create or replace view flights_on_the_ground (departing_from, num_flights,
	flight_list, earliest_arrival, latest_arrival, airplane_list) as 
select
	case when f.progress = 0 then l.departure else l.arrival end as departing_from,
	count(*) as num_flights,
    group_concat(f.flightID separator ',') as flight_list, 
	min(f.next_time) earliest_arrival, 
	max(f.next_time) latest_arrival, 
	group_concat(a.locationID separator ',') as airplane_list
from flight f
	join route_path r on f.routeID = r.routeID and r.sequence = case when f.progress = 0 then 1 else f.progress end
	join leg l on r.legID = l.legID 
	join airplane a on f.support_airline = a.airlineID and f.support_tail = a.tail_num
where f.airplane_status = 'on_ground'
group by case when f.progress = 0 then l.departure else l.arrival end;

-- [16] people_in_the_air()
-- -----------------------------------------------------------------------------
/* This view describes where people who are currently airborne are located. We 
need to display what airports these people are departing from, what airports 
they are arriving at, the list of planes (by the location id) flying these 
people, the list of flights these people are on (by flight ID), the earliest 
and latest arrival times of these people, the number of these people that are 
pilots, the number of these people that are passengers, the total number of 
people on the airplane, and the list of these people by their person id. */
-- -----------------------------------------------------------------------------
create or replace view people_in_the_air (departing_from, arriving_at, num_airplanes,
	airplane_list, flight_list, earliest_arrival, latest_arrival, num_pilots,
	num_passengers, joint_pilots_passengers, person_list) as
-- DONE
-- select '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_';
select
    l.departure as departing_from,
    l.arrival as arriving_at,
    count(distinct a.locationID) as num_airplanes,
    group_concat(distinct a.locationID order by a.locationID separator ',') as airplane_list,
    group_concat(distinct f.flightID order by f.flightID separator ',') as flight_list,
    min(f.next_time) as earliest_arrival,
    max(f.next_time) as latest_arrival,
    count(distinct case when pilot.personID is not null then person.personID end) as num_pilots,
    count(distinct case when passenger.personID is not null then person.personID end) as num_passengers,
    count(distinct person.personID) as joint_pilots_passengers,
    group_concat(distinct person.personID order by person.personID separator ',') as person_list
from flight f
join airplane a on f.support_airline = a.airlineID and f.support_tail = a.tail_num
join route_path rp on f.routeID = rp.routeID and rp.sequence = f.progress
join leg l on rp.legID = l.legID
join person on person.locationID = a.locationID
left join pilot on person.personID = pilot.personID
left join passenger on person.personID = passenger.personID
where f.airplane_status = 'in_flight'
group by l.departure, l.arrival;

-- [17] people_on_the_ground()
-- -----------------------------------------------------------------------------
/* This view describes where people who are currently on the ground and in an 
airport are located. We need to display what airports these people are departing 
from by airport id, location id, and airport name, the city and state of these 
airports, the number of these people that are pilots, the number of these people 
that are passengers, the total number people at the airport, and the list of 
these people by their person id. */
-- -----------------------------------------------------------------------------
create or replace view people_on_the_ground (departing_from, airport, airport_name,
	city, state, country, num_pilots, num_passengers, joint_pilots_passengers, person_list) as
-- DONE
-- select '_', '_', '_', '_', '_', '_', '_', '_', '_', '_';
select 
    ap.airportID as departing_from,
    ap.locationID as airport,
    ap.airport_name,
    ap.city,
    ap.state,
    ap.country,
    count(distinct case when pi.personID is not null then p.personID end) as num_pilots,
    count(distinct case when pa.personID is not null then p.personID end) as num_passengers,
    count(distinct p.personID) as joint_pilots_passengers,
    group_concat(distinct p.personID order by p.personID) as person_list
from person p
join airport ap on p.locationID = ap.locationID
left join pilot pi on p.personID = pi.personID
left join passenger pa on p.personID = pa.personID
group by
    ap.airportID, ap.locationID, ap.airport_name, ap.city, ap.state, ap.country;

-- [18] route_summary()
-- -----------------------------------------------------------------------------
/* This view will give a summary of every route. This will include the routeID, 
the number of legs per route, the legs of the route in sequence, the total 
distance of the route, the number of flights on this route, the flightIDs of 
those flights by flight ID, and the sequence of airports visited by the route. */
-- -----------------------------------------------------------------------------
create or replace view route_summary (route, num_legs, leg_sequence, route_length,
	num_flights, flight_list, airport_sequence) as
-- DONE
-- select '_', '_', '_', '_', '_', '_', '_';
select
    r.routeID as route,
    count(rp.legID) as num_legs,
    group_concat(rp.legID order by rp.sequence separator ',') as leg_sequence,
    sum(l.distance) as route_length,
    (
        select count(distinct f.flightID)
        from flight f
        where f.routeID = r.routeID
    ) as num_flights,
    (
        select group_concat(distinct f.flightID order by f.flightID separator ',')
        from flight f
        where f.routeID = r.routeID
    ) as flight_list,
    group_concat(concat(l.departure, '->', l.arrival) order by rp.sequence separator ',') as airport_sequence
from route r
join route_path rp on r.routeID = rp.routeID
join leg l on rp.legID = l.legID
group by r.routeID;

-- [19] alternative_airports()
-- -----------------------------------------------------------------------------
/* This view displays airports that share the same city and state. It should 
specify the city, state, the number of airports shared, and the lists of the 
airport codes and airport names that are shared both by airport ID. */
-- -----------------------------------------------------------------------------
create or replace view alternative_airports (city, state, country, num_airports,
	airport_code_list, airport_name_list) as
-- DONE
-- select '_', '_', '_', '_', '_', '_';
select
    city,
    state,
    min(country) as country,
    count(*) as num_airports,
    group_concat(airportID order by airportID separator ',') as airport_code_list,
    group_concat(airport_name order by airportID separator ',') as airport_name_list
from airport
group by city, state
having count(*) > 1;