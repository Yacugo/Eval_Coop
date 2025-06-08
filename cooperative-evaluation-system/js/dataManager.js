// Data Manager Module
class DataManager {
    constructor() {
        this.students = [];
        this.config = {};
        this.isInitialized = false;
    }

    async initialize() {
        try {
            await Promise.all([
                this.loadStudents(),
                this.loadConfig()
            ]);
            this.isInitialized = true;
            console.log('DataManager initialized successfully');
        } catch (error) {
            console.error('Failed to initialize DataManager:', error);
            throw error;
        }
    }

    async loadStudents() {
        try {
            const response = await fetch('./data/students.csv');
            const csvText = await response.text();
            this.students = this.parseCSV(csvText);
        } catch (error) {
            console.error('Failed to load students:', error);
            throw new Error('Could not load student data. Please check if data/students.csv exists.');
        }
    }

    async loadConfig() {
        try {
            const response = await fetch('./data/config.json');
            this.config = await response.json();
        } catch (error) {
            console.error('Failed to load config:', error);
            throw new Error('Could not load configuration. Please check if data/config.json exists.');
        }
    }

    parseCSV(csvText) {
        const lines = csvText.trim().split('\n');
        const headers = lines[0].split(',');
        const students = [];

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',');
            if (values.length >= 2) {
                students.push({
                    id: values[0].trim(),
                    name: values[1].trim()
                });
            }
        }

        return students;
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
