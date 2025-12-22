
export const isAuthenticated = (): boolean => {
    return localStorage.getItem('isAdminAuthenticated') === 'true';
};

export const login = (username: string, pass: string): boolean => {
    if (username === 'admin' && pass === '123') {
        localStorage.setItem('isAdminAuthenticated', 'true');
        return true;
    }
    return false;
};

export const logout = (): void => {
    localStorage.removeItem('isAdminAuthenticated');
};
