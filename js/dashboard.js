// The Honeypot Hotel - Main Dashboard JavaScript
// Handles core dashboard functionality and interactions

class HoneypotDashboard {
    constructor() {
        this.currentPersonality = 'eager';
        this.isFeedPaused = false;
        this.stats = {
            activeScammers: 0,
            hoursWasted: 0,
            rageQuits: 0,
            activeHoneypots: 47,
            emailsGenerated: 1234,
            responseRate: 89
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadStats();
        this.startRealTimeUpdates();
        this.initializeCharts();
        
        // Wait for feed system to be ready
        setTimeout(() => {
            if (window.honeypotFeed) {
                console.log('Dashboard connected to feed system');
            }
        }, 100);
    }

    setupEventListeners() {
        // Personality selector
        document.querySelectorAll('.personality-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchPersonality(e.target.dataset.personality);
            });
        });

        // Feed controls
        document.getElementById('pauseFeed').addEventListener('click', () => {
            this.toggleFeed();
        });

        document.getElementById('clearFeed').addEventListener('click', () => {
            this.clearFeed();
        });

        // Time filter buttons
        document.querySelectorAll('.time-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.changeTimeFilter(e.target.dataset.time);
            });
        });

        // Add hover effects to stat items
        document.querySelectorAll('.stat-item').forEach(item => {
            item.addEventListener('mouseenter', () => {
                this.animateStatItem(item);
            });
        });
    }

    switchPersonality(personality) {
        // Remove active class from all buttons
        document.querySelectorAll('.personality-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Add active class to selected button
        document.querySelector(`[data-personality="${personality}"]`).classList.add('active');
        
        this.currentPersonality = personality;
        
        // Show notification
        this.showNotification(`Switched to ${this.getPersonalityName(personality)} mode`, 'success');
        
        // Update system status
        this.updateSystemStatus(`Active Personality: ${this.getPersonalityName(personality)}`);
    }

    getPersonalityName(personality) {
        const names = {
            'eager': 'Overeager Victim',
            'romance': 'Romance Psychopath',
            'philosophical': 'Philosophical Inquisitor'
        };
        return names[personality] || 'Unknown';
    }

    toggleFeed() {
        this.isFeedPaused = !this.isFeedPaused;
        const pauseBtn = document.getElementById('pauseFeed');
        
        // Control the feed system
        if (window.honeypotFeed) {
            if (this.isFeedPaused) {
                window.honeypotFeed.pause();
            } else {
                window.honeypotFeed.resume();
            }
        }
        
        if (this.isFeedPaused) {
            pauseBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
            pauseBtn.style.background = 'var(--success)';
            this.showNotification('Live feed paused', 'warning');
        } else {
            pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
            pauseBtn.style.background = 'var(--bg-tertiary)';
            this.showNotification('Live feed resumed', 'success');
        }
    }

    clearFeed() {
        const feedContainer = document.getElementById('scammerFeed');
        feedContainer.innerHTML = '';
        this.showNotification('Feed cleared', 'info');
    }

    changeTimeFilter(timeframe) {
        // Remove active class from all time buttons
        document.querySelectorAll('.time-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Add active class to selected button
        document.querySelector(`[data-time="${timeframe}"]`).classList.add('active');
        
        // Update analytics based on timeframe
        this.updateAnalytics(timeframe);
        this.showNotification(`Updated to ${timeframe} view`, 'info');
    }

    loadStats() {
        // Simulate loading stats from API
        this.updateStatsDisplay();
        
        // Animate stat numbers
        this.animateStatNumbers();
    }

    updateStatsDisplay() {
        document.getElementById('activeScammers').textContent = this.stats.activeScammers;
        document.getElementById('hoursWasted').textContent = this.stats.hoursWasted;
        document.getElementById('rageQuits').textContent = this.stats.rageQuits;
        document.getElementById('activeHoneypots').textContent = this.stats.activeHoneypots;
        document.getElementById('emailsGenerated').textContent = this.stats.emailsGenerated.toLocaleString();
        document.getElementById('responseRate').textContent = this.stats.responseRate + '%';
    }

    animateStatNumbers() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const finalValue = parseInt(stat.textContent.replace(/,/g, ''));
            this.animateNumber(stat, 0, finalValue, 2000);
        });
    }

    animateNumber(element, start, end, duration) {
        const startTime = performance.now();
        const startValue = start;
        const change = end - start;

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const currentValue = Math.floor(startValue + (change * this.easeOutQuart(progress)));
            element.textContent = currentValue.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }

    animateStatItem(item) {
        item.style.transform = 'translateY(-10px) scale(1.05)';
        setTimeout(() => {
            item.style.transform = 'translateY(-5px) scale(1.02)';
        }, 150);
        setTimeout(() => {
            item.style.transform = 'translateY(0) scale(1)';
        }, 300);
    }

    startRealTimeUpdates() {
        // Simulate real-time updates every 5 seconds
        setInterval(() => {
            if (!this.isFeedPaused) {
                this.updateStats();
                this.addMockFeedItem();
            }
        }, 5000);
    }

    updateStats() {
        // Simulate stat changes
        this.stats.activeScammers = Math.max(0, this.stats.activeScammers + Math.floor(Math.random() * 3) - 1);
        this.stats.hoursWasted += Math.floor(Math.random() * 2);
        this.stats.rageQuits += Math.floor(Math.random() * 2);
        
        this.updateStatsDisplay();
    }

    addMockFeedItem() {
        const feedContainer = document.getElementById('scammerFeed');
        const mockData = this.generateMockFeedData();
        
        const feedItem = this.createFeedItem(mockData);
        feedContainer.insertBefore(feedItem, feedContainer.firstChild);
        
        // Remove old items if too many
        if (feedContainer.children.length > 10) {
            feedContainer.removeChild(feedContainer.lastChild);
        }
    }

    generateMockFeedData() {
        const personalities = ['eager', 'romance', 'philosophical'];
        const personality = personalities[Math.floor(Math.random() * personalities.length)];
        
        const scammerMessages = [
            "Hello dear, I am lonely soldier in Syria...",
            "Congratulations! You have won $1,000,000!",
            "I am Nigerian prince, need help transfer money...",
            "Your account has been suspended, click here...",
            "I am beautiful woman, looking for love..."
        ];
        
        const aiResponses = {
            eager: [
                "OH MY GOODNESS YES!!! I HAVE BEEN WAITING FOR SOMEONE LIKE YOU!!!",
                "HAROLD ALWAYS SAID I WAS TOO TRUSTING BUT YOU SEEM SO NICE!!!",
                "I ALREADY TOLD MY CHURCH GROUP ABOUT OUR BUSINESS DEAL!!!"
            ],
            romance: [
                "I've been waiting for you my whole life! When can we get matching tattoos?",
                "I've told my mom about us and she's making meatloaf for when you visit!",
                "Why did you take 4 minutes to respond? Are you talking to other women?"
            ],
            philosophical: [
                "Before I send money, what does 'urgent' really mean in the context of our shared human experience?",
                "This bank transfer form is asking for my 'identity' - but aren't we all just temporary arrangements of stardust?",
                "Your dying grandmother story made me contemplate mortality. Have you read Heidegger?"
            ]
        };
        
        return {
            scammerId: `Scammer #${Math.floor(Math.random() * 1000)}`,
            time: 'Just now',
            personality: personality,
            scammerMessage: scammerMessages[Math.floor(Math.random() * scammerMessages.length)],
            aiResponse: aiResponses[personality][Math.floor(Math.random() * aiResponses[personality].length)],
            metrics: {
                timeEngaged: `${Math.floor(Math.random() * 5) + 1} hours`,
                stressLevel: `${Math.floor(Math.random() * 30) + 70}%`,
                messagesSent: Math.floor(Math.random() * 50) + 10
            }
        };
    }

    createFeedItem(data) {
        const feedItem = document.createElement('div');
        feedItem.className = 'feed-item new';
        feedItem.innerHTML = `
            <div class="feed-header">
                <span class="scammer-id">${data.scammerId}</span>
                <span class="feed-time">${data.time}</span>
                <span class="personality-tag ${data.personality}">${this.getPersonalityName(data.personality)}</span>
            </div>
            <div class="feed-content">
                <p class="scammer-message">"${data.scammerMessage}"</p>
                <p class="ai-response">"${data.aiResponse}"</p>
            </div>
            <div class="feed-metrics">
                <span class="metric"><i class="fas fa-clock"></i> ${data.metrics.timeEngaged} engaged</span>
                <span class="metric"><i class="fas fa-thermometer-half"></i> Stress Level: ${data.metrics.stressLevel}</span>
                <span class="metric"><i class="fas fa-messages"></i> ${data.metrics.messagesSent} messages sent</span>
            </div>
        `;
        
        // Remove 'new' class after animation
        setTimeout(() => {
            feedItem.classList.remove('new');
        }, 3000);
        
        return feedItem;
    }

    updateSystemStatus(message) {
        const statusIndicator = document.querySelector('.status-indicator span:last-child');
        statusIndicator.textContent = message;
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${this.getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--bg-secondary);
            border: 1px solid var(--${type === 'success' ? 'success' : type === 'warning' ? 'warning' : type === 'danger' ? 'danger' : 'info'});
            border-radius: 8px;
            padding: 1rem;
            color: var(--text-primary);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            box-shadow: var(--shadow-medium);
            animation: slideInRight 0.3s ease-out;
        `;
        
        // Add close button functionality
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease-in';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            warning: 'exclamation-triangle',
            danger: 'times-circle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    updateAnalytics(timeframe) {
        // This would normally fetch data from the backend
        // For now, we'll just show a notification
        console.log(`Updating analytics for ${timeframe} timeframe`);
    }

    initializeCharts() {
        // Initialize Chart.js charts
        if (typeof Chart !== 'undefined') {
            this.createStressChart();
        }
    }

    createStressChart() {
        const ctx = document.getElementById('stressChart');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
                datasets: [{
                    label: 'Average Scammer Stress Level',
                    data: [65, 72, 78, 85, 92, 89],
                    borderColor: '#FFA500',
                    backgroundColor: 'rgba(255, 165, 0, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#ffffff'
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            color: '#cccccc'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#cccccc'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                }
            }
        });
    }
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.honeypotDashboard = new HoneypotDashboard();
}); 