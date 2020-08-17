/**
   Worker - Parse Locations Array

   This function workerizes the process of taking an array of unparsed location objects from a
   locations GraphQL fetch and generating a map of location names to parsed location objects.

   Example output:
   {
     SRER_022.basePlot.all: { name: ..., type: ..., ... },
     SRER_015.birdGrid.brd: { name: ..., type: ..., ... },
     ...
   }
*/
export default function parseLocationsArray(locationsArray?: any[]): any;
