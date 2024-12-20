export class JustificationForm {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    render(absence) {
        this.container.innerHTML = `
            <form id="justificationForm" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Motif de l'absence
                    </label>
                    <textarea name="justification" 
                             rows="4" 
                             class="input-primary w-full"
                             placeholder="Saisissez le motif de l'absence..."
                             required>${absence?.justification || ''}</textarea>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Document justificatif
                    </label>
                    <input type="file" 
                           name="document" 
                           accept=".pdf,.jpg,.jpeg,.png"
                           class="input-primary w-full">
                    <p class="text-sm text-gray-500 mt-1">
                        Formats acceptés: PDF, JPG, PNG
                    </p>
                </div>

                <div class="flex justify-end gap-4 mt-6">
                    <button type="button" id="cancelBtn" class="btn-secondary">
                        Annuler
                    </button>
                    <button type="submit" class="btn-primary">
                        Valider la justification
                    </button>
                </div>
            </form>
        `;
        this.setupEventListeners();
    }

    setupEventListeners() {
        const form = document.getElementById('justificationForm');
        const cancelBtn = document.getElementById('cancelBtn');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const justificationData = Object.fromEntries(formData.entries());
            this.onSubmit && this.onSubmit(justificationData);
        });

        cancelBtn.addEventListener('click', () => {
            this.onCancel && this.onCancel();
        });
    }

    onSubmit(callback) {
        this.onSubmit = callback;
    }

    onCancel(callback) {
        this.onCancel = callback;
    }
} 