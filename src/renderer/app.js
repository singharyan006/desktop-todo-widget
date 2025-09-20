// Desktop Todo Widget - Main Application Logic
class TodoWidget {
    constructor() {
        this.tasks = [];
        this.currentTheme = 'dark';
        this.isAlwaysOnTop = true;
        
        this.init();
    }
    
    async init() {
        await this.loadSettings();
        this.setupEventListeners();
        await this.loadTasks();
        this.updateUI();
        this.applyTheme();
    }
    
    async loadSettings() {
        try {
            this.currentTheme = await window.electronAPI.getStoreValue('theme', 'dark');
            this.isAlwaysOnTop = await window.electronAPI.getStoreValue('alwaysOnTop', true);
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    }
    
    async loadTasks() {
        try {
            this.tasks = await window.electronAPI.getStoreValue('tasks', []);
        } catch (error) {
            console.error('Error loading tasks:', error);
            this.tasks = [];
        }
    }
    
    async saveTasks() {
        try {
            await window.electronAPI.setStoreValue('tasks', this.tasks);
        } catch (error) {
            console.error('Error saving tasks:', error);
        }
    }
    
    setupEventListeners() {
        // Task input handlers
        const taskInput = document.getElementById('taskInput');
        const addBtn = document.getElementById('addBtn');
        
        taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && taskInput.value.trim()) {
                this.addTask(taskInput.value.trim());
                taskInput.value = '';
            }
        });
        
        addBtn.addEventListener('click', () => {
            if (taskInput.value.trim()) {
                this.addTask(taskInput.value.trim());
                taskInput.value = '';
            }
        });
        
        // Window control handlers
        document.getElementById('minimizeBtn').addEventListener('click', () => {
            window.electronAPI.minimizeWindow();
        });
        
        document.getElementById('closeBtn').addEventListener('click', () => {
            window.electronAPI.closeWindow();
        });
        
        document.getElementById('alwaysOnTopBtn').addEventListener('click', async () => {
            this.isAlwaysOnTop = await window.electronAPI.toggleAlwaysOnTop();
            this.updateAlwaysOnTopButton();
        });
        
        document.getElementById('themeBtn').addEventListener('click', () => {
            this.toggleTheme();
        });
        
        document.getElementById('clearCompletedBtn').addEventListener('click', () => {
            this.clearCompleted();
        });
        
        // Focus management
        taskInput.addEventListener('focus', () => {
            taskInput.select();
        });
        
        // Auto-focus on app activation
        window.addEventListener('focus', () => {
            if (!taskInput.matches(':focus')) {
                taskInput.focus();
            }
        });
    }
    
    addTask(text) {
        const task = {
            id: Date.now() + Math.random(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        this.tasks.unshift(task);
        this.saveTasks();
        this.updateUI();
        
        // Add animation to new task
        setTimeout(() => {
            const taskElement = document.querySelector(`[data-task-id="${task.id}"]`);
            if (taskElement) {
                taskElement.classList.add('slide-in');
            }
        }, 10);
    }
    
    toggleTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            task.completedAt = task.completed ? new Date().toISOString() : null;
            this.saveTasks();
            
            // Add completion animation
            const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
            if (taskElement && task.completed) {
                taskElement.classList.add('task-complete');
                setTimeout(() => taskElement.classList.remove('task-complete'), 300);
            }
            
            this.updateUI();
        }
    }
    
    deleteTask(taskId) {
        const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
        if (taskElement) {
            taskElement.classList.add('fade-out');
            setTimeout(() => {
                this.tasks = this.tasks.filter(t => t.id !== taskId);
                this.saveTasks();
                this.updateUI();
            }, 200);
        }
    }
    
    clearCompleted() {
        const completedTasks = this.tasks.filter(t => t.completed);
        if (completedTasks.length === 0) return;
        
        completedTasks.forEach(task => {
            const taskElement = document.querySelector(`[data-task-id="${task.id}"]`);
            if (taskElement) {
                taskElement.classList.add('fade-out');
            }
        });
        
        setTimeout(() => {
            this.tasks = this.tasks.filter(t => !t.completed);
            this.saveTasks();
            this.updateUI();
        }, 200);
    }
    
    updateUI() {
        this.renderTasks();
        this.updateTaskCount();
        this.updateClearButton();
        this.updateEmptyState();
    }
    
    renderTasks() {
        const tasksList = document.getElementById('tasksList');
        
        if (this.tasks.length === 0) {
            tasksList.innerHTML = '';
            return;
        }
        
        const tasksHTML = this.tasks.map(task => this.createTaskHTML(task)).join('');
        tasksList.innerHTML = tasksHTML;
        
        // Add event listeners to task elements
        this.tasks.forEach(task => {
            const taskElement = document.querySelector(`[data-task-id="${task.id}"]`);
            if (taskElement) {
                const checkbox = taskElement.querySelector('.task-checkbox');
                const deleteBtn = taskElement.querySelector('.delete-btn');
                
                checkbox.addEventListener('change', () => this.toggleTask(task.id));
                deleteBtn.addEventListener('click', () => this.deleteTask(task.id));
            }
        });
    }
    
    createTaskHTML(task) {
        const isCompleted = task.completed ? 'completed' : '';
        const textDecoration = task.completed ? 'line-through' : '';
        const opacity = task.completed ? 'opacity-60' : '';
        
        return `
            <div class="task-item ${opacity} bg-white/10 dark:bg-black/10 rounded-lg p-3 border border-white/20 dark:border-white/5 hover:border-white/40 dark:hover:border-white/10 transition-all group" data-task-id="${task.id}">
                <div class="flex items-start space-x-3">
                    <label class="flex items-center cursor-pointer">
                        <input type="checkbox" class="task-checkbox sr-only" ${task.completed ? 'checked' : ''}>
                        <div class="w-5 h-5 rounded-full border-2 border-gray-400 dark:border-gray-500 flex items-center justify-center transition-all ${task.completed ? 'bg-green-500 border-green-500' : 'hover:border-green-400'}">
                            ${task.completed ? '<svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>' : ''}
                        </div>
                    </label>
                    <div class="flex-1 min-w-0">
                        <p class="text-sm text-gray-800 dark:text-gray-200 ${textDecoration} break-words leading-relaxed">
                            ${this.escapeHtml(task.text)}
                        </p>
                        ${task.completed && task.completedAt ? `
                            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Completed ${this.formatDate(task.completedAt)}
                            </p>
                        ` : ''}
                    </div>
                    <button class="delete-btn opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 transition-all" title="Delete task">
                        <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `;
    }
    
    updateTaskCount() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        const remaining = total - completed;
        
        const taskCountElement = document.getElementById('taskCount');
        if (total === 0) {
            taskCountElement.textContent = '0 tasks';
        } else if (completed === 0) {
            taskCountElement.textContent = `${total} ${total === 1 ? 'task' : 'tasks'}`;
        } else {
            taskCountElement.textContent = `${remaining} of ${total} remaining`;
        }
    }
    
    updateClearButton() {
        const clearBtn = document.getElementById('clearCompletedBtn');
        const hasCompleted = this.tasks.some(t => t.completed);
        
        if (hasCompleted) {
            clearBtn.classList.remove('hidden');
        } else {
            clearBtn.classList.add('hidden');
        }
    }
    
    updateEmptyState() {
        const emptyState = document.getElementById('emptyState');
        const tasksList = document.getElementById('tasksList');
        
        if (this.tasks.length === 0) {
            emptyState.classList.remove('hidden');
            tasksList.classList.add('hidden');
        } else {
            emptyState.classList.add('hidden');
            tasksList.classList.remove('hidden');
        }
    }
    
    updateAlwaysOnTopButton() {
        const btn = document.getElementById('alwaysOnTopBtn');
        const svg = btn.querySelector('svg');
        
        if (this.isAlwaysOnTop) {
            btn.title = 'Always On Top (Enabled)';
            btn.classList.add('bg-blue-500/20', 'text-blue-500');
        } else {
            btn.title = 'Always On Top (Disabled)';
            btn.classList.remove('bg-blue-500/20', 'text-blue-500');
        }
    }
    
    async toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        await window.electronAPI.setStoreValue('theme', this.currentTheme);
        this.applyTheme();
    }
    
    applyTheme() {
        const html = document.documentElement;
        const app = document.getElementById('app');
        
        if (this.currentTheme === 'dark') {
            html.classList.add('dark');
            app.classList.remove('glass-light');
            app.classList.add('glass-dark');
        } else {
            html.classList.remove('dark');
            app.classList.remove('glass-dark');
            app.classList.add('glass-light');
        }
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);
        
        if (diffMins < 1) return 'just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        
        return date.toLocaleDateString();
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.todoWidget = new TodoWidget();
});

// Handle app focus for better UX
window.addEventListener('load', () => {
    const taskInput = document.getElementById('taskInput');
    taskInput.focus();
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + N: Focus on input
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        document.getElementById('taskInput').focus();
    }
    
    // Escape: Clear input or minimize window
    if (e.key === 'Escape') {
        const taskInput = document.getElementById('taskInput');
        if (taskInput.value) {
            taskInput.value = '';
        } else {
            window.electronAPI.minimizeWindow();
        }
    }
    
    // Ctrl/Cmd + Shift + C: Clear completed tasks
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        window.todoWidget?.clearCompleted();
    }
    
    // Ctrl/Cmd + T: Toggle theme
    if ((e.ctrlKey || e.metaKey) && e.key === 't') {
        e.preventDefault();
        window.todoWidget?.toggleTheme();
    }
});
