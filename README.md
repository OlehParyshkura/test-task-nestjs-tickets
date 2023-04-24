Test task Nest.js tickets

The product is a ticketing platform that sells tickets to events.

This platform has an admin panel for Promoters to set up their events and create different ticket tiers to sell on a platform. Tickets are purchased by Buyers. The platform receives a commission (Service Fee) for the provision of its services.

1. Create a ticket tier entity that has a Price group containing these fields:

   Service Fee

   Buyer Price

   Promoter Receives Price. 

   Calculation in these fields should be based on a following fee model:

    - Service Fee is a percentage rate of a Buyer Price.
    - Service Fee can’t be less than Minimum Fee.
    - Buyer Price is a retail price of a ticket, purchased by a Buyer.
    - Promoter Receives Price is a difference between Buyer Price and a Service Fee.

   A Promoter should be able to put values into one of two fields (Buyer Price or Promoter Receives Price) and get the correct calculation for the other field based on settings.


1. Create settings for the platform’s admin to set global fee model’s parameters:

   Service Fee Rate (%) setting to set the rate that the platform wants to receive;

   Minimum Fee (absolute value) setting to ensure the platform receives a minimum amount of revenue for each ticket sold.

2. Provide unit tests to ensure the Price group’s fields behave as intended.

Technology:

Please use Nest.js framework and SQL database (ideally PostgreSQL) to complete the task.
