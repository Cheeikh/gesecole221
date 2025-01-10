export async function initCoursPage() {
    const coursTable = new CoursTable('coursTableBody');
    window.coursTable = coursTable; // Pour accéder aux méthodes depuis le HTML
    await coursTable.render();
} 