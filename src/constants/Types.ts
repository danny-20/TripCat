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
