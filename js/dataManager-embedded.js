// Data Manager Module - Embedded Data Version
class DataManager {
    constructor() {
        this.students = [];
        this.config = {};
        this.isInitialized = false;
    }

    async initialize() {
        try {
            this.loadEmbeddedData();
            this.isInitialized = true;
            console.log('DataManager initialized successfully');
        } catch (error) {
            console.error('Failed to initialize DataManager:', error);
            throw error;
        }
    }

    loadEmbeddedData() {
        // Embedded student data (copy from CSV)
        this.students = [
            { id: "4240150", name: "Adalmira Djenabú Maiga" },
            { id: "4240430", name: "Afonso Da Silva Pato" },
            { id: "4240151", name: "Alexandre Daniel Gomes" },
            { id: "4240461", name: "Álvaro Monteiro Mendes" },
            { id: "4240512", name: "Ana Francisca Dos Reis De Morais" },
            { id: "4240444", name: "Ana Margarida Oliveira Fernandes" },
            { id: "4240440", name: "Andreia Calado Gouveia Bacalhau" },
            { id: "4240415", name: "Angelina Beatriz Maurício Mendes" },
            { id: "4240630", name: "Beatriz Ataide Nunes Vaz" },
            { id: "4240534", name: "Beatriz Da Conceição Silva Pedra" },
            { id: "4240653", name: "Beatriz Guedes Borges" },
            { id: "4240340", name: "Beatriz Mendes Silva Saraiva" },
            { id: "4240487", name: "Bernardo Filipe Coelho Dos Santos" },
            { id: "4220219", name: "Cesar Fonseca Faria Coelho" },
            { id: "4240349", name: "Débora Santos Costa" },
            { id: "4240477", name: "Duarte Alexandre Arroja Romão" },
            { id: "4240452", name: "Eliana Patrícia Batista Garcia" },
            { id: "4240446", name: "Esmeralda Monteiro Daubard" },
            { id: "4240007", name: "Eufémia Mendes Dos Santos Mandinga" },
            { id: "4240006", name: "Feliciano Mendes" },
            { id: "4240603", name: "Francisco Bryant-Jorge De Miranda" },
            { id: "4240303", name: "Francisco Tavares Simoes" },
            { id: "4240756", name: "Gil Duarte Azeitona" },
            { id: "4240517", name: "Gonçalo Pereira Antunes" },
            { id: "4230309", name: "Guilherme Emanuel Parrales De Jesus" },
            { id: "4240301", name: "Gustavo De Pedro Penha" },
            { id: "4240314", name: "Heloisa Bezerra Braga" },
            { id: "4240535", name: "Henrique José Carreira Correia" },
            { id: "4240378", name: "Ivan Rafael Matos Pequito" },
            { id: "4240785", name: "Joana Daniela De Jesus" },
            { id: "4240533", name: "Joana Filipa Martins Ferreira" },
            { id: "4220413", name: "João Mário Da Silva Reis Amaro" },
            { id: "4240356", name: "Joao Silva Ramos" },
            { id: "4240008", name: "Joaquin Teran Reyes" },
            { id: "4240449", name: "José Diogo Teixeira Pereira" },
            { id: "4240623", name: "Lucas Domingues Mendes" },
            { id: "4240387", name: "Luis Maria Lacerda Nobre D'orey" },
            { id: "4240123", name: "Mamadu Darame" },
            { id: "4240393", name: "Maria Inês Andrade Morais" },
            { id: "4240602", name: "Maria Inês Navega Póvoa" },
            { id: "4240409", name: "Maria João Teles Santos" },
            { id: "4240419", name: "Maria Martins Margarido" },
            { id: "4240467", name: "Maria Timóteo Firme" },
            { id: "4240365", name: "Mariana Patrício Vieira" },
            { id: "4240375", name: "Mariana Peixoto Poça" },
            { id: "4240448", name: "Mariana Ponto Pires" },
            { id: "4240404", name: "Marta Isabel Carrilho Pinto" },
            { id: "4230534", name: "Martim Lopes Coelho Pinto Matias" },
            { id: "4240480", name: "Matilde Alfaiate Pereira" },
            { id: "4240427", name: "Micael Alexandre Lopes Antas" }
        ];

        // Embedded configuration
        this.config = {
            "instructor": {
                "email": "raul.bernardino@ipleiria.pt",
                "name": "Raul Bernardino"
            },
            "evaluation": {
                "minGroupSize": 3,
                "maxGroupSize": 5,
                "allowMultipleSubmissions": false
            },
            "ratingScale": [
                { "label": "Excellent", "value": 100, "color": "text-green-700" },
                { "label": "Very good", "value": 85, "color": "text-green-600" },
                { "label": "Good", "value": 71.5, "color": "text-blue-600" },
                { "label": "Reasonable", "value": 57.2, "color": "text-yellow-600" },
                { "label": "Average", "value": 42.9, "color": "text-orange-600" },
                { "label": "Mediocre", "value": 28.6, "color": "text-red-500" },
                { "label": "Bad", "value": 14.3, "color": "text-red-600" },
                { "label": "Awful", "value": 0, "color": "text-red-800" }
            ]
        };
    }

    getStudents() {
        return this.students;
    }

    getConfig() {
        return this.config;
    }

    getStudentById(id) {
        return this.students.find(student => student.id === id);
    }

    getRatingScale() {
        return this.config.ratingScale || [];
    }

    getInstructorEmail() {
        return this.config.instructor?.email || 'instructor@university.edu';
    }

    // Local storage management
    saveSubmission(submissionData) {
        const submissions = this.getSubmissions();
        submissions.push(submissionData);
        localStorage.setItem('evaluationSubmissions', JSON.stringify(submissions));
    }

    getSubmissions() {
        return JSON.parse(localStorage.getItem('evaluationSubmissions') || '[]');
    }

    hasSubmitted(studentId) {
        const submissions = this.getSubmissions();
        return submissions.some(sub => sub.evaluatorId === studentId);
    }

    clearSubmissions() {
        localStorage.removeItem('evaluationSubmissions');
    }

    // CSV generation
    generateCSVForSubmission(submission) {
        let csvContent = 'Evaluator ID,Evaluator Name,Evaluated ID,Evaluated Name,Rating,Rating Label,Comment,Timestamp\n';
        
        submission.evaluations.forEach(evaluation => {
            csvContent += `"${submission.evaluatorId}","${submission.evaluatorName}","${evaluation.evaluatedId}","${evaluation.evaluatedName}","${evaluation.rating}","${evaluation.ratingLabel}","${evaluation.comment}","${submission.timestamp}"\n`;
        });

        return csvContent;
    }

    generateAllCSV() {
        const submissions = this.getSubmissions();
        let csvContent = 'Evaluator ID,Evaluator Name,Evaluated ID,Evaluated Name,Rating,Rating Label,Comment,Timestamp\n';
        
        submissions.forEach(submission => {
            submission.evaluations.forEach(evaluation => {
                csvContent += `"${submission.evaluatorId}","${submission.evaluatorName}","${evaluation.evaluatedId}","${evaluation.evaluatedName}","${evaluation.rating}","${evaluation.ratingLabel}","${evaluation.comment}","${submission.timestamp}"\n`;
            });
        });

        return csvContent;
    }

    // Statistics
    getStatistics() {
        const submissions = this.getSubmissions();
        const totalSubmissions = submissions.length;
        const totalStudents = this.students.length;
        const submissionRate = ((totalSubmissions / totalStudents) * 100).toFixed(1);
        
        const allRatings = [];
        submissions.forEach(submission => {
            submission.evaluations.forEach(evaluation => {
                allRatings.push(evaluation.rating);
            });
        });

        const averageRating = allRatings.length > 0 ? 
            (allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(1) : 0;

        return {
            totalSubmissions,
            totalStudents,
            submissionRate,
            totalEvaluations: allRatings.length,
            averageRating
        };
    }
}

// Export for use in other modules
window.DataManager = DataManager;
