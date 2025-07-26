// The Honeypot Hotel - Feed JavaScript
// Handles live feed updates and real-time scammer interaction display

class HoneypotFeed {
    constructor() {
        this.feedItems = [];
        this.isLive = true;
        this.updateInterval = null;
        this.maxFeedItems = 50;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.startLiveUpdates();
        this.loadInitialFeed();
    }

    setupEventListeners() {
        // Feed item interactions
        document.addEventListener('click', (e) => {
            if (e.target.closest('.feed-item')) {
                this.handleFeedItemClick(e.target.closest('.feed-item'));
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
    }

    handleFeedItemClick(feedItem) {
        // Add click effect
        feedItem.style.transform = 'scale(0.98)';
        setTimeout(() => {
            feedItem.style.transform = '';
        }, 150);

        // Show detailed view (could be expanded)
        const scammerId = feedItem.querySelector('.scammer-id').textContent;
        console.log(`Clicked on ${scammerId}`);
    }

    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + P to pause/resume feed
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
            e.preventDefault();
            this.toggleLiveUpdates();
        }

        // Ctrl/Cmd + C to clear feed
        if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
            e.preventDefault();
            this.clearFeed();
        }

        // Ctrl/Cmd + R to refresh feed
        if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
            e.preventDefault();
            this.refreshFeed();
        }
    }

    startLiveUpdates() {
        this.updateInterval = setInterval(() => {
            if (this.isLive) {
                this.addNewFeedItem();
            }
        }, 3000); // Add new item every 3 seconds
    }

    pause() {
        this.isLive = false;
        console.log('Feed paused');
    }

    resume() {
        this.isLive = true;
        console.log('Feed resumed');
    }

    toggleLiveUpdates() {
        this.isLive = !this.isLive;
        const pauseBtn = document.getElementById('pauseFeed');
        
        if (this.isLive) {
            pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
            pauseBtn.style.background = 'var(--bg-tertiary)';
            this.showNotification('Live feed resumed', 'success');
        } else {
            pauseBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
            pauseBtn.style.background = 'var(--success)';
            this.showNotification('Live feed paused', 'warning');
        }
    }

    clearFeed() {
        const feedContainer = document.getElementById('scammerFeed');
        feedContainer.innerHTML = '';
        this.feedItems = [];
        this.showNotification('Feed cleared', 'info');
    }

    refreshFeed() {
        this.clearFeed();
        this.loadInitialFeed();
        this.showNotification('Feed refreshed', 'success');
    }

    loadInitialFeed() {
        // Load initial feed items
        const initialItems = this.generateInitialFeedItems();
        initialItems.forEach(item => {
            this.addFeedItem(item, false);
        });
    }

    generateInitialFeedItems() {
        const items = [];
        const personalities = ['eager', 'romance', 'philosophical'];
        
        for (let i = 0; i < 5; i++) {
            items.push(this.generateMockFeedData(personalities[i % personalities.length]));
        }
        
        return items;
    }

    addNewFeedItem() {
        const personalities = ['eager', 'romance', 'philosophical'];
        const randomPersonality = personalities[Math.floor(Math.random() * personalities.length)];
        const newItem = this.generateMockFeedData(randomPersonality);
        
        this.addFeedItem(newItem, true);
    }

    addFeedItem(data, isNew = true) {
        const feedContainer = document.getElementById('scammerFeed');
        const feedItem = this.createFeedItemElement(data, isNew);
        
        // Add to beginning of feed
        feedContainer.insertBefore(feedItem, feedContainer.firstChild);
        
        // Store in memory
        this.feedItems.unshift(data);
        
        // Limit feed items
        if (this.feedItems.length > this.maxFeedItems) {
            this.feedItems.pop();
            if (feedContainer.children.length > this.maxFeedItems) {
                feedContainer.removeChild(feedContainer.lastChild);
            }
        }
        
        // Add to feed items array
        this.feedItems.unshift({
            id: Date.now(),
            data: data,
            element: feedItem
        });
        
        // Animate new items
        if (isNew) {
            this.animateNewItem(feedItem);
        }
    }

    createFeedItemElement(data, isNew) {
        const feedItem = document.createElement('div');
        feedItem.className = `feed-item ${isNew ? 'new' : ''}`;
        feedItem.dataset.scammerId = data.scammerId;
        
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
            <div class="feed-actions">
                <button class="action-btn" title="View Details">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn" title="Export Conversation">
                    <i class="fas fa-download"></i>
                </button>
                <button class="action-btn" title="Mark as Interesting">
                    <i class="fas fa-star"></i>
                </button>
            </div>
        `;
        
        // Add action button listeners
        this.setupActionButtons(feedItem);
        
        return feedItem;
    }

    setupActionButtons(feedItem) {
        const actionBtns = feedItem.querySelectorAll('.action-btn');
        
        actionBtns.forEach((btn, index) => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleActionButton(index, feedItem);
            });
        });
    }

    handleActionButton(actionIndex, feedItem) {
        const scammerId = feedItem.dataset.scammerId;
        
        switch (actionIndex) {
            case 0: // View Details
                this.viewScammerDetails(scammerId);
                break;
            case 1: // Export Conversation
                this.exportConversation(scammerId);
                break;
            case 2: // Mark as Interesting
                this.toggleInteresting(feedItem);
                break;
        }
    }

    viewScammerDetails(scammerId) {
        // This would open a modal with detailed scammer information
        this.showNotification(`Viewing details for ${scammerId}`, 'info');
    }

    exportConversation(scammerId) {
        // Export conversation as JSON
        const conversation = this.getConversationData(scammerId);
        const blob = new Blob([JSON.stringify(conversation, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `conversation-${scammerId}-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showNotification(`Exported conversation for ${scammerId}`, 'success');
    }

    toggleInteresting(feedItem) {
        const starBtn = feedItem.querySelector('.action-btn:last-child i');
        const isInteresting = starBtn.classList.contains('fas');
        
        if (isInteresting) {
            starBtn.classList.remove('fas');
            starBtn.classList.add('far');
            this.showNotification('Removed from interesting', 'info');
        } else {
            starBtn.classList.remove('far');
            starBtn.classList.add('fas');
            starBtn.style.color = '#FFD700';
            this.showNotification('Marked as interesting', 'success');
        }
    }

    getConversationData(scammerId) {
        // This would fetch actual conversation data from the backend
        return {
            scammerId: scammerId,
            timestamp: new Date().toISOString(),
            conversation: [
                {
                    sender: 'scammer',
                    message: 'Hello dear, I am lonely soldier in Syria...',
                    timestamp: new Date(Date.now() - 3600000).toISOString()
                },
                {
                    sender: 'ai',
                    message: 'I\'ve been waiting for you my whole life! When can we get matching tattoos?',
                    timestamp: new Date(Date.now() - 3500000).toISOString()
                }
            ]
        };
    }

    animateNewItem(feedItem) {
        // Add entrance animation
        feedItem.style.opacity = '0';
        feedItem.style.transform = 'translateX(-50px)';
        
        setTimeout(() => {
            feedItem.style.transition = 'all 0.5s ease-out';
            feedItem.style.opacity = '1';
            feedItem.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove 'new' class after animation
        setTimeout(() => {
            feedItem.classList.remove('new');
        }, 3000);
    }

    generateMockFeedData(personality) {
        const scammerMessages = {
            eager: [
                "Hello! I am lonely and looking for friendship...",
                "I have inherited millions of dollars and need help...",
                "Your email was selected for a special prize...",
                "I am a beautiful woman looking for love...",
                "Your account has been compromised, click here..."
            ],
            romance: [
                "Hello beautiful, I am lonely soldier in Syria...",
                "I am handsome man looking for true love...",
                "Your profile caught my attention...",
                "I am divorced and looking for someone special...",
                "I am wealthy businessman seeking companionship..."
            ],
            philosophical: [
                "Greetings, I am seeking meaningful connection...",
                "I have discovered ancient wisdom about money...",
                "Your destiny has been revealed to me...",
                "I am spiritual guide offering enlightenment...",
                "The universe has brought us together..."
            ]
        };
        
        const aiResponses = {
            eager: [
                "OH MY GOODNESS YES!!! I HAVE BEEN WAITING FOR SOMEONE LIKE YOU!!!",
                "HAROLD ALWAYS SAID I WAS TOO TRUSTING BUT YOU SEEM SO NICE!!!",
                "I ALREADY TOLD MY CHURCH GROUP ABOUT OUR BUSINESS DEAL!!!",
                "YES I WOULD LOVE TO HELP YOU TRANSFER YOUR MILLIONS!!!",
                "DO I NEED TO GIVE YOU MY SOCIAL SECURITY NUMBER? IT'S TATTOOED ON MY ARM!!!"
            ],
            romance: [
                "I've been waiting for you my whole life! When can we get matching tattoos?",
                "I've told my mom about us and she's making meatloaf for when you visit!",
                "Why did you take 4 minutes to respond? Are you talking to other women?",
                "I've already named our future children! When's our wedding?",
                "I've been crying because you haven't responded in 2 hours!"
            ],
            philosophical: [
                "Before I send money, what does 'urgent' really mean in the context of our shared human experience?",
                "This bank transfer form is asking for my 'identity' - but aren't we all just temporary arrangements of stardust?",
                "Your dying grandmother story made me contemplate mortality. Have you read Heidegger?",
                "What is the ontological status of this 'inheritance' you speak of?",
                "In the grand scheme of cosmic consciousness, what is money but a social construct?"
            ]
        };
        
        const messages = scammerMessages[personality];
        const responses = aiResponses[personality];
        
        return {
            scammerId: `Scammer #${Math.floor(Math.random() * 1000)}`,
            time: this.getRandomTime(),
            personality: personality,
            scammerMessage: messages[Math.floor(Math.random() * messages.length)],
            aiResponse: responses[Math.floor(Math.random() * responses.length)],
            metrics: {
                timeEngaged: `${Math.floor(Math.random() * 5) + 1} hours`,
                stressLevel: `${Math.floor(Math.random() * 30) + 70}%`,
                messagesSent: Math.floor(Math.random() * 50) + 10
            }
        };
    }

    getRandomTime() {
        const times = [
            'Just now',
            '2 minutes ago',
            '5 minutes ago',
            '10 minutes ago',
            '15 minutes ago',
            '30 minutes ago'
        ];
        return times[Math.floor(Math.random() * times.length)];
    }

    getPersonalityName(personality) {
        const names = {
            'eager': 'Overeager Victim',
            'romance': 'Romance Psychopath',
            'philosophical': 'Philosophical Inquisitor'
        };
        return names[personality] || 'Unknown';
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

    // Public methods for external use
    // pause() and resume() methods are now defined above

    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
    }
}

// Initialize feed when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.honeypotFeed = new HoneypotFeed();
}); 