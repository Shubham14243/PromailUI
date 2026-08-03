import { create } from "Zustand";

const getStoredUser = () => {
    if (typeof window === 'undefined') {
        return null;
    }

    try {
        const storedUser = localStorage.getItem('proMailUser');
        return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
        console.error('Failed to parse stored user:', error);
        return null;
    }
};

const useAuthStore = create((set) => ({
    user: getStoredUser(),
    setUser: (user) => {
        if (typeof window !== 'undefined') {
            if (user) {
                localStorage.setItem('proMailUser', JSON.stringify(user));
            } else {
                localStorage.removeItem('proMailUser');
            }
        }

        set({ user });
    },
    clearUser: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('proMailUser');
        }

        set({ user: null });
    },
}));

export default useAuthStore;