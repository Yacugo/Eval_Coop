// Cooperative Evaluation Application
class EvaluationApp {
    constructor() {
        this.dataManager = new DataManager();
        this.currentStudent = null;
        this.selectedGroupMembers = [];
        this.lastSubmissionData = null;
    }

    async initialize() {
        try {
            await this.dataManager.initialize();
            this.populateStudentSelect();
            this.setupEventListeners();
            console.log('EvaluationApp initialized successfully');
        } catch (error) {
            this.showError('Failed to initialize application: ' + error.message);
        }
    }

    showError(message) {
        alert('Error: ' + message);
        console.error(message);
    }

    populateStudentSelect() {
        const select = document.getElementById('studentSelect');
        while (select.children.length > 1) {
            select.removeChild(select.lastChild);
        }
        
        this.dataManager.getStudents().forEach(student => {
            const option = document.createElement('option');
            option.value = student.id;
            option.textContent = `${student.name} (${student.id})`;
            select.appendChild(option);
        });
    }

    setupEventListeners() {
        document.getElementById('loginBtn').addEventListener('click', () => this.handleLogin());
        document.getElementById('proceedToEvaluation').addEventListener('click', () => this.showEvaluationSection());
        document.getElementById('submitEvaluation').addEventListener('click', () => this.handleSubmitEvaluation());
        document.getElementById('emailResults').addEventListener('click', () => this.emailResults());
        document.getElementById('downloadResults').addEventListener('click', () => this.downloadCurrentResults());
        document.getElementById('exportData').addEventListener('click', () => this.exportAllData());
        document.getElementById('viewStats').addEventListener('click', () => this.viewStatistics());
        document.getElementById('clearData').addEventListener('click', () => this.clearAllData());
    }

    handleLogin() {
        const studentSelect = document.getElementById('studentSelect');
        const selectedId = studentSelect.value;
        
        if (!selectedId) {
            alert('Please select your name from the list.');
            return;
        }

        if (this.dataManager.hasSubmitted(selectedId)) {
            document.getElementById('alreadySubmitted').classList.remove('hidden');
            return;
        }

        this.currentStudent = this.dataManager.getStudentById(selectedId);
        
        document.getElementById('loginSection').classList.add('hidden');
        document.getElementById('groupSelectionSection').classList.remove('hidden');
        
        this.populateAvailableStudents();
        this.selectStudent(this.currentStudent);
    }

    populateAvailableStudents() {
        const container = document.getElementById('availableStudents');
        container.innerHTML = '';
        
        this.dataManager.getStudents().forEach(student => {
            const div = document.createElement('div');
            div.className = 'p-2 hover:bg-blue-100 cursor-pointer border-b border-gray-200';
            div.innerHTML = `
                <div class="flex items-center">
                    <span class="text-sm font-medium">${student.name}</span>
                    <span class="text-xs text-gray-500 ml-2">(${student.id})</span>
                    ${student.id === this.currentStudent.id ? '<span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded ml-2">You</span>' : ''}
                </div>
            `;
            div.addEventListener('click', () => this.selectStudent(student));
            container.appendChild(div);
        });
    }

    selectStudent(student) {
        if (this.selectedGroupMembers.find(s => s.id === student.id)) {
            return;
        }

        const config = this.dataManager.getConfig();
        if (this.selectedGroupMembers.length >= config.evaluation.maxGroupSize) {
            alert(`You can select maximum ${config.evaluation.maxGroupSize} group members.`);
            return;
        }

        this.selectedGroupMembers.push(student);
        this.updateSelectedStudentsDisplay();
        this.updateProceedButton();
        this.updateSelectionInfo();
    }

    removeStudent(studentId) {
        const config = this.dataManager.getConfig();
        if (studentId === this.currentStudent.id && this.selectedGroupMembers.length <= config.evaluation.minGroupSize) {
            alert('You must include yourself in the group.');
            return;
        }
        
        this.selectedGroupMembers = this.selectedGroupMembers.filter(s => s.id !== studentId);
        this.updateSelectedStudentsDisplay();
        this.updateProceedButton();
        this.updateSelectionInfo();
    }

    updateSelectedStudentsDisplay() {
        const container = document.getElementById('selectedStudents');
        
        if (this.selectedGroupMembers.length === 0) {
            container.innerHTML = '<p class="text-gray-500 text-center">No students selected yet</p>';
            return;
        }

        container.innerHTML = this.selectedGroupMembers.map(student => `
            <div class="flex items-center justify-between p-2 bg-white border rounded mb-2">
                <div>
                    <span class="text-sm font-medium">${student.name}</span>
                    <span class="text-xs text-gray-500 ml-2">(${student.id})</span>
                    ${student.id === this.currentStudent.id ? '<span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded ml-2">You</span>' : ''}
                </div>
                <button onclick="app.removeStudent('${student.id}')" class="text-red-500 hover:text-red-700">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
    }

    updateSelectionInfo() {
        const countElement = document.getElementById('selectionCount');
        const selfIncludedMsg = document.getElementById('selfIncludedMessage');
        const selfMissingMsg = document.getElementById('selfMissingMessage');
        const config = this.dataManager.getConfig();
        
        countElement.textContent = `${this.selectedGroupMembers.length}/${config.evaluation.maxGroupSize}`;
        
        const hasSelf = this.selectedGroupMembers.find(s => s.id === this.currentStudent.id);
        
        if (hasSelf) {
            selfIncludedMsg.classList.remove('hidden');
            selfMissingMsg.classList.add('hidden');
        } else {
            selfIncludedMsg.classList.add('hidden');
            selfMissingMsg.classList.remove('hidden');
        }
    }

    updateProceedButton() {
        const button = document.getElementById('proceedToEvaluation');
        const hasCurrentStudent = this.selectedGroupMembers.find(s => s.id === this.currentStudent.id);
        const config = this.dataManager.getConfig();
        
        if (this.selectedGroupMembers.length >= config.evaluation.minGroupSize && 
            this.selectedGroupMembers.length <= config.evaluation.maxGroupSize && 
            hasCurrentStudent) {
            button.disabled = false;
        } else {
            button.disabled = true;
        }
    }

    showEvaluationSection() {
        if (!this.selectedGroupMembers.find(s => s.id === this.currentStudent.id)) {
            this.selectedGroupMembers.push(this.currentStudent);
        }

        document.getElementById('groupSelectionSection').classList.add('hidden');
        document.getElementById('evaluationSection').classList.remove('hidden');
        
        this.populateEvaluationTable();
    }

    populateEvaluationTable() {
        const tbody = document.getElementById('evaluationTableBody');
        tbody.innerHTML = '';
        const ratingScale = this.dataManager.getRatingScale();

        this.selectedGroupMembers.forEach(student => {
            const row = document.createElement('tr');
            row.className = student.id === this.currentStudent.id ? 'bg-yellow-50' : '';
            
            row.innerHTML = `
                <td class="border border-gray-300 p-3 font-medium">
                    ${student.name}
                    ${student.id === this.currentStudent.id ? '<span class="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded ml-2">Self</span>' : ''}
                    <div class="text-xs text-gray-500">${student.id}</div>
                </td>
                ${ratingScale.map(rating => `
                    <td class="border border-gray-300 p-2 text-center">
                        <input type="radio" name="rating_${student.id}" value="${rating.value}" class="w-4 h-4">
                    </td>
                `).join('')}
                <td class="border border-gray-300 p-2">
                    <textarea name="comment_${student.id}" class="w-full p-2 border border-gray-300 rounded text-sm" rows="2" placeholder="Optional comments..."></textarea>
                </td>
            `;
            
            tbody.appendChild(row);
        });
    }

    handleSubmitEvaluation() {
        const evaluations = [];
        let hasErrors = false;
        const ratingScale = this.dataManager.getRatingScale();

        this.selectedGroupMembers.forEach(student => {
            const ratingInput = document.querySelector(`input[name="rating_${student.id}"]:checked`);
            const commentInput = document.querySelector(`textarea[name="comment_${student.id}"]`);

            if (!ratingInput) {
                alert(`Please provide a rating for ${student.name}`);
                hasErrors = true;
                return;
            }

            evaluations.push({
                evaluatedId: student.id,
                evaluatedName: student.name,
                rating: parseFloat(ratingInput.value),
                ratingLabel: ratingScale.find(r => r.value === parseFloat(ratingInput.value)).label,
                comment: commentInput.value.trim()
            });
        });

        if (hasErrors) return;

        const submissionData = {
            evaluatorId: this.currentStudent.id,
            evaluatorName: this.currentStudent.name,
            timestamp: new Date().toISOString(),
            evaluations: evaluations
        };

        this.lastSubmissionData = submissionData;
        this.dataManager.saveSubmission(submissionData);

        document.getElementById('evaluationSection').classList.add('hidden');
        document.getElementById('successSection').classList.remove('hidden');
    }

    emailResults() {
        if (!this.lastSubmissionData) {
            alert('No evaluation data to send.');
            return;
        }

        const csvData = this.dataManager.generateCSVForSubmission(this.lastSubmissionData);
        const instructorEmail = this.dataManager.getInstructorEmail();
        const subject = `Group Evaluation Submission - ${this.lastSubmissionData.evaluatorName} (${this.lastSubmissionData.evaluatorId})`;
        const body = `Dear Instructor,

Please find my group evaluation submission below.

Student: ${this.lastSubmissionData.evaluatorName}
Student ID: ${this.lastSubmissionData.evaluatorId}
Submission Date: ${new Date(this.lastSubmissionData.timestamp).toLocaleString()}
Number of Evaluations: ${this.lastSubmissionData.evaluations.length}

CSV Data:
${csvData}

Best regards,
${this.lastSubmissionData.evaluatorName}`;

        const mailtoUrl = `mailto:${instructorEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoUrl;
    }

    downloadCurrentResults() {
        if (!this.lastSubmissionData) {
            alert('No evaluation data to download.');
            return;
        }

        const csvContent = this.dataManager.generateCSVForSubmission(this.lastSubmissionData);
        this.downloadFile(csvContent, `evaluation_${this.lastSubmissionData.evaluatorId}_${new Date().toISOString().slice(0, 10)}.csv`);
    }

    exportAllData() {
        const csvContent = this.dataManager.generateAllCSV();
        if (!csvContent || csvContent.split('\n').length <= 1) {
            alert('No evaluation data to export.');
            return;
        }
        this.downloadFile(csvContent, `cooperative_evaluations_${new Date().toISOString().slice(0, 10)}.csv`);
    }

    downloadFile(content, filename) {
        const blob = new Blob([content], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    viewStatistics() {
        const stats = this.dataManager.getStatistics();
        const statsDisplay = document.getElementById('statsDisplay');
        
        if (stats.totalSubmissions === 0) {
            statsDisplay.innerHTML = '<p class="text-gray-500">No evaluation data available.</p>';
            statsDisplay.classList.remove('hidden');
            return;
        }

        statsDisplay.innerHTML = `
            <h3 class="font-semibold mb-3">Evaluation Statistics</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div class="bg-blue-50 p-3 rounded">
                    <div class="text-2xl font-bold text-blue-600">${stats.totalSubmissions}</div>
                    <div class="text-sm text-gray-600">Submissions</div>
                </div>
                <div class="bg-green-50 p-3 rounded">
                    <div class="text-2xl font-bold text-green-600">${stats.submissionRate}%</div>
                    <div class="text-sm text-gray-600">Participation</div>
                </div>
                <div class="bg-purple-50 p-3 rounded">
                    <div class="text-2xl font-bold text-purple-600">${stats.totalEvaluations}</div>
                    <div class="text-sm text-gray-600">Total Evaluations</div>
                </div>
                <div class="bg-yellow-50 p-3 rounded">
                    <div class="text-2xl font-bold text-yellow-600">${stats.averageRating}</div>
                    <div class="text-sm text-gray-600">Average Rating</div>
                </div>
            </div>
        `;
        
        statsDisplay.classList.remove('hidden');
    }

    clearAllData() {
        if (confirm('Are you sure you want to clear all evaluation data? This action cannot be undone.')) {
            this.dataManager.clearSubmissions();
            alert('All evaluation data has been cleared.');
            document.getElementById('statsDisplay').classList.add('hidden');
        }
    }
}

// Initialize application when page loads
let app;
document.addEventListener('DOMContentLoaded', async () => {
    app = new EvaluationApp();
    await app.initialize();
});
