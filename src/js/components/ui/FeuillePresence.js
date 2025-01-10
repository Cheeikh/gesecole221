export class FeuillePresence {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    async render(seanceId) {
        try {
            const seance = await app.seanceService.getSeanceById(seanceId);
            const etudiants = await app.etudiantService.getEtudiantsParClasse(seance.cours.classeId);

            const html = `
                <div class="bg-white p-6 rounded-lg shadow">
                    <div class="mb-6">
                        <h2 class="text-xl font-semibold mb-2">${seance.cours.libelle}</h2>
                        <p class="text-gray-600">
                            ${new Date(seance.date).toLocaleDateString('fr-FR')} | 
                            ${seance.heureDebut} - ${seance.heureFin} | 
                            Salle: ${seance.salle}
                        </p>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Étudiant
                                    </th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Présence
                                    </th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Heure d'arrivée
                                    </th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Observation
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                ${etudiants.data.map(etudiant => {
                                    const absence = seance.absences?.find(a => a.etudiantId === etudiant.id);
                                    return `
                                        <tr>
                                            <td class="px-6 py-4">
                                                <div class="flex items-center">
                                                    <div class="text-sm font-medium text-gray-900">
                                                        ${etudiant.nomComplet}
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="px-6 py-4">
                                                <select 
                                                    class="presence-select border rounded px-2 py-1"
                                                    data-etudiant-id="${etudiant.id}">
                                                    <option value="present" ${!absence ? 'selected' : ''}>Présent</option>
                                                    <option value="absent" ${absence ? 'selected' : ''}>Absent</option>
                                                </select>
                                            </td>
                                            <td class="px-6 py-4">
                                                <input 
                                                    type="time" 
                                                    class="heure-arrivee border rounded px-2 py-1"
                                                    data-etudiant-id="${etudiant.id}"
                                                    ${absence ? 'disabled' : ''}>
                                            </td>
                                            <td class="px-6 py-4">
                                                <input 
                                                    type="text" 
                                                    class="observation border rounded px-2 py-1 w-full"
                                                    data-etudiant-id="${etudiant.id}"
                                                    placeholder="Observation...">
                                            </td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>

                    <div class="mt-6 flex justify-end">
                        <button 
                            id="savePresence" 
                            class="px-4 py-2 bg-[#E67D23] text-white rounded hover:bg-[#D66D13]">
                            Enregistrer
                        </button>
                    </div>
                </div>
            `;

            this.container.innerHTML = html;
            this.setupEventListeners(seanceId);
        } catch (error) {
            console.error('Erreur lors du chargement de la feuille de présence:', error);
            app.toast.show('Erreur lors du chargement de la feuille de présence', 'error');
        }
    }

    setupEventListeners(seanceId) {
        const presenceSelects = document.querySelectorAll('.presence-select');
        const saveButton = document.getElementById('savePresence');

        presenceSelects.forEach(select => {
            select.addEventListener('change', (e) => {
                const etudiantId = e.target.dataset.etudiantId;
                const heureArrivee = document.querySelector(`.heure-arrivee[data-etudiant-id="${etudiantId}"]`);
                
                if (e.target.value === 'absent') {
                    heureArrivee.disabled = true;
                    heureArrivee.value = '';
                } else {
                    heureArrivee.disabled = false;
                }
            });
        });

        saveButton.addEventListener('click', async () => {
            try {
                const presences = [];
                presenceSelects.forEach(select => {
                    const etudiantId = select.dataset.etudiantId;
                    const heureArrivee = document.querySelector(`.heure-arrivee[data-etudiant-id="${etudiantId}"]`).value;
                    const observation = document.querySelector(`.observation[data-etudiant-id="${etudiantId}"]`).value;

                    if (select.value === 'absent') {
                        presences.push({
                            etudiantId: parseInt(etudiantId),
                            seanceId: seanceId,
                            statut: 'non_justifié',
                            dateAbs: new Date().toISOString().split('T')[0]
                        });
                    }
                });

                // Enregistrer les absences
                for (const presence of presences) {
                    await app.absenceService.createAbsence(presence);
                }

                app.toast.show('Présences enregistrées avec succès', 'success');
                app.loadSeanceData();
            } catch (error) {
                console.error('Erreur lors de l\'enregistrement des présences:', error);
                app.toast.show('Erreur lors de l\'enregistrement des présences', 'error');
            }
        });
    }
} 