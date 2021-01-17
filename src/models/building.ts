import { VirtualTourDefinition } from "./virtual-tour-definition";

export interface Building {
    id: string;
    name: string;
    objUrl: string;
    userId: string;
    virtualTour?: VirtualTourDefinition;
}