export const dateFormatter = {
    toLocalDate(dateString) {
        return new Date(dateString).toLocaleDateString('fr-FR');
    },

    toInputDate(date) {
        const d = new Date(date);
        return d.getFullYear() + '-' + 
               String(d.getMonth() + 1).padStart(2, '0') + '-' + 
               String(d.getDate()).padStart(2, '0');
    },

    formatTime(timeString) {
        return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}; 