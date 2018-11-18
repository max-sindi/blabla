export interface IOrderProfile {
    id: string;
    type: string;
    loading: string;
    customer: any;
    locations: ILocation[];
    containers: IContainer[];
}


export interface ILocation {
    id: number;
    type: string;
    date: string;
    address: string;
    description: string;
    point: {
        type: string;
        coordinates: number[];
    }
}


export interface IContainer {
    id: number;
    line: number;
    type: number;
    is_genset: null | boolean;
    cargo_description: string;
    cargo_weight: number;
    cargo_package: string;
    is_adr: boolean;
    un_number: null | boolean;
    trailer_type: string;
    is_trailer_protected: boolean;
    is_trailer_telescopic: boolean;
    truck_axles: number;
    trailer_axles: number;
    genset_temperature: any;
    price: number;
}