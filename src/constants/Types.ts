export type MenuItem = {
    id: string;
    title: string;
    icon: string;
    route: '/(user)/menu/agencyDetails' | '/(user)/menu/stakeholders' | '/(user)/menu/itinerary' | '/(user)/menu/templates';
};

export const menus: MenuItem[] = [
    {
        id: '1',
        title: 'Agency Details',
        icon: 'office-building',
        route: '/(user)/menu/agencyDetails',
    },
    {
        id: '2',
        title: 'Stakeholders',
        icon: 'account-group',
        route: '/(user)/menu/stakeholders',
    },
    {
        id: '3',
        title: 'Itinerary',
        icon: 'map',
        route: '/(user)/menu/itinerary',
    },
    {
        id: '4',
        title: 'Templates',
        icon: 'file-document-multiple',
        route: '/(user)/menu/templates',
    },
];


export interface AgencyDetails {
    id: number;               // Supabase numeric primary key
    uid: string;              // user foreign key
    agencyName: string;
    ownerName: string;
    email: string;
    phone: string;
    whatsapp: string;
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    website?: string | null;
    registrationNumber?: string | null;
    createdAt?: string;       // timestamps
    updatedAt?: string;
}

export type AgencyDetailsPayload = {
    uid: string;              // required for INSERT
    agencyName: string;
    ownerName: string;
    email: string;
    phone: string;
    whatsapp: string;
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    website?: string | null;
    registrationNumber?: string | null;
};

export interface StakeholderDetails {
    id?: number;
    uid: string;

    stakeholderType: string;
    taxiType?: string | null;

    businessName: string;
    contactPersonName: string;
    designation: string;

    email?: string; // Only here, not in main table?
    phone: string;
    whatsapp?: string | null;
    alternatePhone?: string | null;

    address: string;

    updated_at?: string;
}


// ==================
// Stakeholder Types
// ==================
export interface Stakeholder {
    id: number;
    uid: string;

    stakeholderType: string;
    taxiType?: string | null;

    businessName: string;
    contactPersonName: string;
    designation: string;

    phone: string;
    whatsapp?: string | null;
    alternatePhone?: string | null;

    address: string;

    created_at?: string;
    updated_at?: string;
}

export interface DropdownProps {
    label: string;
    value: string;
    list: string[];
    onSelect: (item: string) => void;
    theme?: Record<string, any>;
    error?: string;
}


export type CreateStakeholderPayload = {
    stakeholderType: string;
    taxiType?: string | null;

    businessName: string;
    contactPersonName: string;
    designation: string;

    phone: string;
    whatsapp?: string | null;
    alternatePhone?: string | null;

    address: string;
};

export type UpdateStakeholderPayload = {
    id: number;

    stakeholderType?: string;
    taxiType?: string | null;

    businessName?: string;
    contactPersonName?: string;
    designation?: string;

    phone?: string;
    whatsapp?: string | null;
    alternatePhone?: string | null;

    address?: string;
};
export interface StakeholderForm {
    stakeholderType: string;
    taxiType: string;
    businessName: string;
    contactPersonName: string;
    designation: string;
    phone: string;
    whatsapp: string;
    alternatePhone: string;
    address: string;
}

// -----------------------------
// ITINERARY TYPES
// -----------------------------

export type ItineraryActivity = {
    id: string;                       // local UI id only
    time?: string | null;
    description: string;
    location?: string | null;
};

// Payload version (sent to DB)
export type ItineraryActivityPayload = {
    time?: string | null;
    description: string;
    location?: string | null;
};


// -----------------------------
// DAY TYPES
// -----------------------------
export type ItineraryDay = {
    id: string;                       // local UI id only
    dayNumber: number;
    title?: string | null;
    activities: ItineraryActivity[];
};

// Payload version (DB write)
export type ItineraryDayPayload = {
    dayNumber: number;
    title?: string | null;
    activities: ItineraryActivityPayload[];
};


// -----------------------------
// DEFAULT TEMPLATE FROM DB
// -----------------------------
export type ItineraryTemplate = {
    id: string;
    title: string;
    description?: string | null;

    default_days: {
        dayNumber: number;
        title?: string | null;
        activities: {
            time?: string | null;
            description: string;
            location?: string | null;
        }[];
    }[];

    created_by: string;
    updated_by?: string | null;
    created_at: string;
    updated_at: string;
};


// -----------------------------
// CREATE ITINERARY PAYLOAD
// (Matches Supabase insert API)
// -----------------------------
export type CreateItineraryPayload = {
    created_by: string;
    updated_by: string;

    title: string;
    customer_name: string | null;

    trip_start_date: string | null;
    trip_end_date: string | null;

    num_adults: number | null;
    num_children: number | null;

    notes?: string | null;
    inclusions?: string | null;
    exclusions?: string | null;
    terms?: string | null;

    days: ItineraryDayPayload[];
};


// -----------------------------
// ITINERARY LIST VIEW
// -----------------------------
export type ItineraryListItem = {
    id: string;
    title: string;
    customer_name: string | null;
    trip_start_date: string | null;
    trip_end_date: string | null;

    created_by: string;
    updated_by?: string | null;

    created_at: string;
    updated_at: string;
};


// -----------------------------
// FULL ITINERARY (DETAIL VIEW)
// -----------------------------
export type ItineraryDetails = {
    id: string;
    title: string;
    customer_name: string | null;
    trip_start_date: string | null;
    trip_end_date: string | null;

    num_adults: number | null;
    num_children: number | null;

    notes?: string | null;
    inclusions?: string | null;
    exclusions?: string | null;
    terms?: string | null;

    created_by: string;
    updated_by?: string | null;
    created_at: string;
    updated_at: string;

    days: {
        dayNumber: number;
        title?: string | null;
        activities: ItineraryActivityPayload[];
    }[];
};


/////tempaltes
export type TemplateMaster = {
    id: number;
    user_id: string;
    district: string;
    template_title: string;
    travel_time: string;
    description: string;
    overnight_stay?: string | null;
    created_at: string;
    updated_at: string;
};


export type TemplatePayload = {
    user_id: string;
    district: string;
    template_title: string;
    travel_time: string;
    description: string;
    overnight_stay?: string | null;
};

