export type MenuItem = {
    id: string;
    title: string;
    icon: string;
    route: '/menu/agencyDetails' | '/menu/stakeholderDetails' | '/menu/bookingDetails' | '/menu/bookingData';
};

export const menus: MenuItem[] = [
    {
        id: '1',
        title: 'Agency Details',
        icon: 'office-building',
        route: '/menu/agencyDetails',
    },
    {
        id: '2',
        title: 'Stakeholder Details',
        icon: 'account-group',
        route: '/menu/stakeholderDetails',
    },
    {
        id: '3',
        title: 'Booking Details',
        icon: 'book',
        route: '/menu/bookingDetails',
    },
    {
        id: '4',
        title: 'Booking Data',
        icon: 'file-chart',
        route: '/menu/bookingData',
    },
];

// src/types/agency.ts

export interface AgencyDetails {
    id?: string;
    agencyName: string;
    ownerName: string;
    email: string;
    phone: string;
    whatsapp: string
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    website?: string | null; // optional if agency doesn’t have one
    registrationNumber?: string | null; // optional business registration number
    createdAt?: string; // backend-generated timestamps
    updatedAt?: string;
}

export interface StakeholderDetails {
    id?: string;
    businessName: string;
    contactPersonName: string,
    stakeholderType: string; // From dropdown
    taxiType?: string, // From dropdown
    designation: string;
    email?: string;
    phone: string;
    whatsapp: string;
    alternatePhone: string,
    address: string;
}



