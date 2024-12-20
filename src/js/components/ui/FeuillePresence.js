export class FeuillePresence {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    render(seance, etudiants) {
        this.container.innerHTML = `
            <div class="bg-white rounded-lg shadow-lg p-4">
                <div class="flex justify-between items-center mb-4">
                    <div>
                        <h2 class="text-xl font-semibold">Feuille de présence</h2>
                        <p class="text-gray-600">
                            Séance du ${new Date(seance.date).toLocaleDateString('fr-FR')}
                        </p>
                    </div>
                    <button id="savePresencesBtn" class="btn-primary">
                        <i class="fas fa-save mr-2"></i>Enregistrer
                    </button>
                </div>

                <div class="space-y-2">
                    ${etudiants.map(etudiant => this.renderEtudiantRow(etudiant, seance)).join('')}
                </div>
            </div>
        `;
        this.setupEventListeners();
    }

    renderEtudiantRow(etudiant, seance) {
        const isAbsent = seance.absences?.some(abs => abs.etudiantId === etudiant.id);
        return `
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div class="flex items-center gap-3">
                    <img src="${etudiant.photo || 'default-avatar.png'}" 
                         alt="${etudiant.nomComplet}"
                         class="w-10 h-10 rounded-full">
                    <div>
                        <div class="font-medium">${etudiant.nomComplet}</div>
                        <div class="text-sm text-gray-500">${etudiant.matricule}</div>
                    </div>
                </div>
                <div class="flex items-center gap-4">
                    <label class="inline-flex items-center">
                        <input type="radio" 
                               name="presence_${etudiant.id}" 
                               value="present"
                               ${!isAbsent ? 'checked' : ''}
                               class="form-radio text-green-600">
                        <span class="ml-2">Présent</span>
                    </label>
                    <label class="inline-flex items-center">
                        <input type="radio" 
                               name="presence_${etudiant.id}" 
                               value="absent"
                               ${isAbsent ? 'checked' : ''}
                               class="form-radio text-red-600">
                        <span class="ml-2">Absent</span>
                    </label>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        const saveBtn = document.getElementById('savePresencesBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                const presences = this.collectPresences();
                this.onSave && this.onSave(presences);
            });
        }
    }

    collectPresences() {
        const presences = {
            presents: [],
            absents: []
        };

        this.container.querySelectorAll('input[type="radio"]:checked').forEach(radio => {
            const etudiantId = radio.name.split('_')[1];
            if (radio.value === 'present') {
                presences.presents.push(etudiantId);
            } else {
                presences.absents.push(etudiantId);
            }
        });

        return presences;
    }

    onSave(callback) {
        this.onSave = callback;
    }
} 