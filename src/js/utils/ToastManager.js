export class ToastManager {
    constructor() {
        this.initializeContainer();
    }

    initializeContainer() {
        let container = document.getElementById('toastContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toastContainer';
            container.className = 'fixed bottom-4 right-4 z-50 space-y-2';
            document.body.appendChild(container);
        }
        this.container = container;
    }

    show(message, type = 'info') {
        if (!this.container) {
            this.initializeContainer();
        }

        const toast = document.createElement('div');
        toast.className = `${this.getToastClasses(type)} transform transition-all duration-300 translate-x-full`;
        toast.innerHTML = `
            <div class="flex items-center">
                <div class="flex-shrink-0">
                    ${this.getToastIcon(type)}
                </div>
                <div class="ml-3">
                    <p class="text-sm font-medium">
                        ${message}
                    </p>
                </div>
                <div class="ml-4 flex-shrink-0 flex">
                    <button class="inline-flex text-gray-400 hover:text-gray-500 focus:outline-none">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `;

        this.container.appendChild(toast);

        // Animation d'entrée
        setTimeout(() => {
            toast.classList.remove('translate-x-full');
        }, 10);

        // Configurer le bouton de fermeture
        const closeButton = toast.querySelector('button');
        closeButton.addEventListener('click', () => this.removeToast(toast));

        // Auto-suppression après 5 secondes
        setTimeout(() => {
            this.removeToast(toast);
        }, 5000);
    }

    removeToast(toast) {
        toast.classList.add('translate-x-full');
        setTimeout(() => {
            if (toast.parentElement === this.container) {
                this.container.removeChild(toast);
            }
        }, 300);
    }

    getToastClasses(type) {
        const baseClasses = 'max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1';
        
        switch (type) {
            case 'success':
                return `${baseClasses} ring-green-500 p-4`;
            case 'error':
                return `${baseClasses} ring-red-500 p-4`;
            case 'warning':
                return `${baseClasses} ring-yellow-500 p-4`;
            default:
                return `${baseClasses} ring-blue-500 p-4`;
        }
    }

    getToastIcon(type) {
        switch (type) {
            case 'success':
                return '<i class="fas fa-check-circle text-green-500"></i>';
            case 'error':
                return '<i class="fas fa-exclamation-circle text-red-500"></i>';
            case 'warning':
                return '<i class="fas fa-exclamation-triangle text-yellow-500"></i>';
            default:
                return '<i class="fas fa-info-circle text-blue-500"></i>';
        }
    }
} 