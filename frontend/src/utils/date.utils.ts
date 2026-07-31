export const getLocalDateString = (date: Date) => {
        const offset = date.getTimezoneOffset();
        const localDate = new Date(date.getTime() - offset * 60 * 1000);
        return localDate.toISOString().split('T')[0];
    };

export const getNextDay = (dateString: string) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    return getLocalDateString(date);
};

export const formatTime = (dateString: string) => {
    const newDate = new Date(dateString);
    return newDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};