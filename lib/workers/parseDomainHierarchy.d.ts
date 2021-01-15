/**
   Worker - Parse Domain Hierarchy

   This function workerizes the process of taking a raw location hierarchy at the domain level and
   parsing it into an object containing flat maps of location names to thin location objects
   (containing only type, description, and parent) for each site in the domain.

   Example output:
   {
     JORN: {
       TOWER100344: { ... },
       MEGAPT100976: { ... },
       ...
     },
     SRER: {
       TOWER104454: { ... },
       MEGAPT100995: { ... },
       ...
     },
     ...
   }
*/
export default function parseDomainHierarchy(rawHierarchy: any): any;
