import { create } from 'zustand';

// Define the store interface
interface EmailStore {
    email: string;
    setEmail: (email: string) => void;
    clearEmail: () => void;
}

const useEmailStore = create<EmailStore>((set) => ({
    email: '',
    setEmail: (email) => set({ email }),
    clearEmail: () => set({ email: '' })
}));

export default useEmailStore;