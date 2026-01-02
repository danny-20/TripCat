// ----------------------------------------------
// ADMIN MENU TYPES (NO CATEGORY GROUPING)
// ----------------------------------------------

export type AdminMenuItem = {
    id: string;
    title: string;
    icon: string; // MaterialCommunityIcons icon name
    route: '/(admin)/menu/manageUsers' | '/(admin)/menu/manageAgencies' |
    '/(admin)/menu/manageStakeholders' | '/(admin)/menu/itineraries' |
    '/(admin)/menu/itineraryTemplates' | '/(admin)/menu/reports' |
    '/(admin)/menu/logs';
    //ensures valid folder-based routes
};

// ----------------------------------------------
// ADMIN MENU ITEMS (FLAT LIST, WITH FOLDER ROUTES)
// ----------------------------------------------

export const adminMenus: AdminMenuItem[] = [
    {
        id: "1",
        title: "Manage Users",
        icon: "account-cog",
        route: "/(admin)/menu/manageUsers", // <-- folder-based
    },
    {
        id: "2",
        title: "Manage Agencies",
        icon: "office-building-cog",
        route: "/(admin)/menu/manageAgencies",
    },
    {
        id: "3",
        title: "Manage Stakeholders",
        icon: "account-group",
        route: "/(admin)/menu/manageStakeholders",
    },
    {
        id: "4",
        title: "All Itineraries",
        icon: "map-search",
        route: "/(admin)/menu/itineraries",
    },
    {
        id: "5",
        title: "Itinerary Templates",
        icon: "file-document-edit",
        route: "/(admin)/menu/itineraryTemplates",
    },
    {
        id: "6",
        title: "Reports",
        icon: "file-chart",
        route: "/(admin)/menu/reports",
    },
    {
        id: "7",
        title: "System Logs",
        icon: "progress-clock",
        route: "/(admin)/menu/logs",
    },
];
