export class ConfirmModal {
    constructor() {
        this.modal = null;
    }

    render(options = {}) {
        const {
            title = 'Confirmation',
            message = 'Êtes-vous sûr de vouloir effectuer cette action ?',
            confirmText = 'Confirmer',
            cancelText = 'Annuler',
            type = 'warning' // warning, danger, info
        } = options;

        const getTypeStyles = () => {
            switch (type) {
                case 'danger':
                    return {
                        icon: 'fa-exclamation-circle',
                        color: 'text-red-600',
                        bgColor: 'bg-red-100',
                        buttonColor: 'bg-red-600 hover:bg-red-700'
                    };
                case 'warning':
                    return {
                        icon: 'fa-exclamation-triangle',
                        color: 'text-yellow-600',
                        bgColor: 'bg-yellow-100',
                        buttonColor: 'bg-yellow-600 hover:bg-yellow-700'
                    };
                case 'info':
                    return {
                        icon: 'fa-info-circle',
                        color: 'text-blue-600',
                        bgColor: 'bg-blue-100',
                        buttonColor: 'bg-blue-600 hover:bg-blue-700'
                    };
                default:
                    return {
                        icon: 'fa-question-circle',
                        color: 'text-gray-600',
                        bgColor: 'bg-gray-100',
                        buttonColor: 'bg-gray-600 hover:bg-gray-700'
                    };
            }
        };

        const styles = getTypeStyles();

        const modalHtml = `
            <div id="confirmModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
                <div class="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4 relative transform transition-all">
                    <div class="flex items-center justify-center ${styles.bgColor} rounded-full w-12 h-12 mx-auto mb-4">
                        <i class="fas ${styles.icon} ${styles.color} text-xl"></i>
                    </div>
                    
                    <h3 class="text-lg font-medium text-center mb-2">${title}</h3>
                    <p class="text-gray-500 text-center mb-6">${message}</p>
                    
                    <div class="flex justify-end space-x-3">
                        <button id="cancelConfirm" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
                            ${cancelText}
                        </button>
                        <button id="confirmAction" class="px-4 py-2 text-sm font-medium text-white ${styles.buttonColor} rounded-md transition-colors">
                            ${confirmText}
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);
        this.modal = document.getElementById('confirmModal');

        return new Promise((resolve) => {
            document.getElementById('confirmAction').addEventListener('click', () => {
                this.close();
                resolve(true);
            });

            document.getElementById('cancelConfirm').addEventListener('click', () => {
                this.close();
                resolve(false);
            });

            // Fermer sur clic en dehors du modal
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.close();
                    resolve(false);
                }
            });
        });
    }

    close() {
        if (this.modal) {
            this.modal.remove();
            this.modal = null;
        }
    }
} 