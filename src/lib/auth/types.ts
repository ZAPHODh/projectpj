export type Session = {
    email: string;
    user: {
        id: string,
        salonId: string | null
        name: string,
        emailVerified: boolean,
        image: string | undefined | null
    },
    accessToken: string;
};
