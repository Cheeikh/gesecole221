export const dateFormatter = {
    toLocalDate(dateString) {
        return new Date(dateString).toLocaleDateString('fr-FR');
    },

    toInputDate(date) {
        return date.toISOString().split('T')[0];
    },

    formatTime(timeString) {
        return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}; 