// The Honeypot Hotel - Analytics JavaScript
// Handles charts, data visualization, and statistical analysis

class HoneypotAnalytics {
    constructor() {
        this.charts = {};
        this.currentTimeframe = '24h';
        this.init();
    }

    init() {
        this.initializeCharts();
        this.setupRealTimeUpdates();
    }

    initializeCharts() {
        this.createStressChart();
        this.createPersonalityEffectivenessChart();
        this.createScammerTypeChart();
        this.createResponseTimeChart();
    }

    createStressChart() {
        const ctx = document.getElementById('stressChart');
        if (!ctx) return;

        this.charts.stress = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.generateTimeLabels(),
                datasets: [{
                    label: 'Average Scammer Stress Level',
                    data: this.generateStressData(),
                    borderColor: '#FFA500',
                    backgroundColor: 'rgba(255, 165, 0, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#FFA500',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#ffffff',
                            font: {
                                size: 14,
                                family: 'Inter'
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(45, 45, 45, 0.9)',
                        titleColor: '#FFA500',
                        bodyColor: '#ffffff',
                        borderColor: '#FFA500',
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            color: '#cccccc',
                            font: {
                                size: 12
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)',
                            drawBorder: false
                        },
                        title: {
                            display: true,
                            text: 'Stress Level (%)',
                            color: '#cccccc',
                            font: {
                                size: 14
                            }
                        }
                    },
                    x: {
                        ticks: {
                            color: '#cccccc',
                            font: {
                                size: 12
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)',
                            drawBorder: false
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }

    createPersonalityEffectivenessChart() {
        // This would be a bar chart showing effectiveness of each personality
        const effectivenessData = {
            'Romance Psychopath': 94,
            'Philosophical Inquisitor': 87,
            'Overeager Victim': 76
        };

        // Update the effectiveness bars in the HTML
        Object.entries(effectivenessData).forEach(([personality, value]) => {
            const bar = document.querySelector(`[data-personality="${personality.toLowerCase().replace(' ', '-')}"] .effectiveness-fill`);
            if (bar) {
                bar.style.width = `${value}%`;
                bar.parentElement.nextElementSibling.textContent = `${value}%`;
            }
        });
    }

    createScammerTypeChart() {
        // Create a pie chart for scammer types (if we add a canvas for it)
        const scammerTypes = {
            'Romance Scams': 45,
            'Nigerian Prince': 25,
            'Lottery Winners': 15,
            'Phishing': 10,
            'Other': 5
        };

        // This would be implemented if we add a canvas element for it
        console.log('Scammer type distribution:', scammerTypes);
    }

    createResponseTimeChart() {
        // This would show average response times for different personalities
        const responseTimes = {
            'Romance Psychopath': 2.3,
            'Philosophical Inquisitor': 4.1,
            'Overeager Victim': 1.8
        };

        console.log('Average response times:', responseTimes);
    }

    generateTimeLabels() {
        const labels = [];
        const now = new Date();
        
        for (let i = 23; i >= 0; i--) {
            const time = new Date(now.getTime() - (i * 60 * 60 * 1000));
            labels.push(time.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false 
            }));
        }
        
        return labels;
    }

    generateStressData() {
        // Generate realistic stress level data
        const data = [];
        let baseStress = 65;
        
        for (let i = 0; i < 24; i++) {
            // Add some randomness and trends
            const variation = (Math.random() - 0.5) * 20;
            const trend = Math.sin(i / 6) * 10; // Daily cycle
            const stress = Math.max(30, Math.min(100, baseStress + variation + trend));
            data.push(Math.round(stress));
        }
        
        return data;
    }

    updateCharts(timeframe) {
        this.currentTimeframe = timeframe;
        
        // Update stress chart with new data
        if (this.charts.stress) {
            this.charts.stress.data.labels = this.generateTimeLabels();
            this.charts.stress.data.datasets[0].data = this.generateStressData();
            this.charts.stress.update('active');
        }
        
        // Update effectiveness bars with new data
        this.updateEffectivenessBars();
    }

    updateEffectivenessBars() {
        // Simulate effectiveness changes based on timeframe
        const effectivenessData = {
            'romance-psychopath': Math.floor(Math.random() * 20) + 80,
            'philosophical-inquisitor': Math.floor(Math.random() * 20) + 75,
            'overeager-victim': Math.floor(Math.random() * 20) + 65
        };

        Object.entries(effectivenessData).forEach(([personality, value]) => {
            const bar = document.querySelector(`[data-personality="${personality}"] .effectiveness-fill`);
            const valueElement = document.querySelector(`[data-personality="${personality}"] .effectiveness-value`);
            
            if (bar && valueElement) {
                // Animate the bar width change
                const currentWidth = parseInt(bar.style.width) || 0;
                this.animateBarWidth(bar, currentWidth, value);
                valueElement.textContent = `${value}%`;
            }
        });
    }

    animateBarWidth(bar, startWidth, endWidth) {
        const duration = 1000;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const currentWidth = startWidth + (endWidth - startWidth) * this.easeOutQuart(progress);
            bar.style.width = `${currentWidth}%`;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }

    setupRealTimeUpdates() {
        // Update charts every 30 seconds
        setInterval(() => {
            this.updateCharts(this.currentTimeframe);
        }, 30000);
    }

    // Analytics methods for different timeframes
    getAnalyticsForTimeframe(timeframe) {
        const data = {
            '24h': {
                totalScammers: 47,
                avgStressLevel: 78,
                totalHoursWasted: 156,
                rageQuits: 12
            },
            '7d': {
                totalScammers: 234,
                avgStressLevel: 82,
                totalHoursWasted: 892,
                rageQuits: 67
            },
            '30d': {
                totalScammers: 1023,
                avgStressLevel: 85,
                totalHoursWasted: 3456,
                rageQuits: 234
            }
        };
        
        return data[timeframe] || data['24h'];
    }

    // Export analytics data
    exportAnalytics() {
        const data = {
            timeframe: this.currentTimeframe,
            timestamp: new Date().toISOString(),
            analytics: this.getAnalyticsForTimeframe(this.currentTimeframe),
            charts: {
                stress: this.charts.stress ? this.charts.stress.data : null
            }
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `honeypot-analytics-${this.currentTimeframe}-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // Generate reports
    generateReport() {
        const analytics = this.getAnalyticsForTimeframe(this.currentTimeframe);
        const report = `
# The Honeypot Hotel - Analytics Report
## Timeframe: ${this.currentTimeframe}
## Generated: ${new Date().toLocaleString()}

### Key Metrics:
- **Total Scammers Engaged**: ${analytics.totalScammers}
- **Average Stress Level**: ${analytics.avgStressLevel}%
- **Total Hours Wasted**: ${analytics.totalHoursWasted}
- **Rage Quits**: ${analytics.rageQuits}

### Personality Effectiveness:
- Romance Psychopath: 94%
- Philosophical Inquisitor: 87%
- Overeager Victim: 76%

### Recommendations:
1. Continue using Romance Psychopath personality for maximum psychological impact
2. Increase deployment of Philosophical Inquisitor for variety
3. Monitor stress levels to ensure optimal torment levels
        `;
        
        const blob = new Blob([report], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `honeypot-report-${this.currentTimeframe}-${Date.now()}.md`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Initialize analytics when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.honeypotAnalytics = new HoneypotAnalytics();
}); 