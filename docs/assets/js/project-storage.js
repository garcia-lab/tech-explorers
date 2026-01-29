/**
 * 🚀 Tech Explorers - Project Storage System
 * 
 * This module handles saving, loading, and sharing student projects.
 * Uses localStorage for persistence and URL compression for sharing.
 * No accounts needed - just save and share!
 */

// LZ-based compression for URLs (minimal implementation)
const LZString = {
    compressToEncodedURIComponent: function(input) {
        if (input == null) return "";
        return LZString._compress(input, 6, function(a) {
            return "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$".charAt(a);
        });
    },
    
    decompressFromEncodedURIComponent: function(input) {
        if (input == null) return "";
        if (input === "") return null;
        input = input.replace(/ /g, "+");
        return LZString._decompress(input.length, 32, function(index) {
            return "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$".indexOf(input.charAt(index));
        });
    },
    
    _compress: function(uncompressed, bitsPerChar, getCharFromInt) {
        if (uncompressed == null) return "";
        let i, value, context_dictionary = {}, context_dictionaryToCreate = {},
            context_c = "", context_wc = "", context_w = "", context_enlargeIn = 2,
            context_dictSize = 3, context_numBits = 2, context_data = [], context_data_val = 0,
            context_data_position = 0;
        
        for (i = 0; i < uncompressed.length; i++) {
            context_c = uncompressed.charAt(i);
            if (!Object.prototype.hasOwnProperty.call(context_dictionary, context_c)) {
                context_dictionary[context_c] = context_dictSize++;
                context_dictionaryToCreate[context_c] = true;
            }
            context_wc = context_w + context_c;
            if (Object.prototype.hasOwnProperty.call(context_dictionary, context_wc)) {
                context_w = context_wc;
            } else {
                if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
                    if (context_w.charCodeAt(0) < 256) {
                        for (i = 0; i < context_numBits; i++) {
                            context_data_val = (context_data_val << 1);
                            if (context_data_position === bitsPerChar - 1) {
                                context_data_position = 0;
                                context_data.push(getCharFromInt(context_data_val));
                                context_data_val = 0;
                            } else { context_data_position++; }
                        }
                        value = context_w.charCodeAt(0);
                        for (i = 0; i < 8; i++) {
                            context_data_val = (context_data_val << 1) | (value & 1);
                            if (context_data_position === bitsPerChar - 1) {
                                context_data_position = 0;
                                context_data.push(getCharFromInt(context_data_val));
                                context_data_val = 0;
                            } else { context_data_position++; }
                            value = value >> 1;
                        }
                    } else {
                        value = 1;
                        for (i = 0; i < context_numBits; i++) {
                            context_data_val = (context_data_val << 1) | value;
                            if (context_data_position === bitsPerChar - 1) {
                                context_data_position = 0;
                                context_data.push(getCharFromInt(context_data_val));
                                context_data_val = 0;
                            } else { context_data_position++; }
                            value = 0;
                        }
                        value = context_w.charCodeAt(0);
                        for (i = 0; i < 16; i++) {
                            context_data_val = (context_data_val << 1) | (value & 1);
                            if (context_data_position === bitsPerChar - 1) {
                                context_data_position = 0;
                                context_data.push(getCharFromInt(context_data_val));
                                context_data_val = 0;
                            } else { context_data_position++; }
                            value = value >> 1;
                        }
                    }
                    context_enlargeIn--;
                    if (context_enlargeIn === 0) {
                        context_enlargeIn = Math.pow(2, context_numBits);
                        context_numBits++;
                    }
                    delete context_dictionaryToCreate[context_w];
                } else {
                    value = context_dictionary[context_w];
                    for (i = 0; i < context_numBits; i++) {
                        context_data_val = (context_data_val << 1) | (value & 1);
                        if (context_data_position === bitsPerChar - 1) {
                            context_data_position = 0;
                            context_data.push(getCharFromInt(context_data_val));
                            context_data_val = 0;
                        } else { context_data_position++; }
                        value = value >> 1;
                    }
                }
                context_enlargeIn--;
                if (context_enlargeIn === 0) {
                    context_enlargeIn = Math.pow(2, context_numBits);
                    context_numBits++;
                }
                context_dictionary[context_wc] = context_dictSize++;
                context_w = String(context_c);
            }
        }
        if (context_w !== "") {
            if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
                if (context_w.charCodeAt(0) < 256) {
                    for (i = 0; i < context_numBits; i++) {
                        context_data_val = (context_data_val << 1);
                        if (context_data_position === bitsPerChar - 1) {
                            context_data_position = 0;
                            context_data.push(getCharFromInt(context_data_val));
                            context_data_val = 0;
                        } else { context_data_position++; }
                    }
                    value = context_w.charCodeAt(0);
                    for (i = 0; i < 8; i++) {
                        context_data_val = (context_data_val << 1) | (value & 1);
                        if (context_data_position === bitsPerChar - 1) {
                            context_data_position = 0;
                            context_data.push(getCharFromInt(context_data_val));
                            context_data_val = 0;
                        } else { context_data_position++; }
                        value = value >> 1;
                    }
                } else {
                    value = 1;
                    for (i = 0; i < context_numBits; i++) {
                        context_data_val = (context_data_val << 1) | value;
                        if (context_data_position === bitsPerChar - 1) {
                            context_data_position = 0;
                            context_data.push(getCharFromInt(context_data_val));
                            context_data_val = 0;
                        } else { context_data_position++; }
                        value = 0;
                    }
                    value = context_w.charCodeAt(0);
                    for (i = 0; i < 16; i++) {
                        context_data_val = (context_data_val << 1) | (value & 1);
                        if (context_data_position === bitsPerChar - 1) {
                            context_data_position = 0;
                            context_data.push(getCharFromInt(context_data_val));
                            context_data_val = 0;
                        } else { context_data_position++; }
                        value = value >> 1;
                    }
                }
                context_enlargeIn--;
                if (context_enlargeIn === 0) {
                    context_enlargeIn = Math.pow(2, context_numBits);
                    context_numBits++;
                }
                delete context_dictionaryToCreate[context_w];
            } else {
                value = context_dictionary[context_w];
                for (i = 0; i < context_numBits; i++) {
                    context_data_val = (context_data_val << 1) | (value & 1);
                    if (context_data_position === bitsPerChar - 1) {
                        context_data_position = 0;
                        context_data.push(getCharFromInt(context_data_val));
                        context_data_val = 0;
                    } else { context_data_position++; }
                    value = value >> 1;
                }
            }
            context_enlargeIn--;
            if (context_enlargeIn === 0) {
                context_numBits++;
            }
        }
        value = 2;
        for (i = 0; i < context_numBits; i++) {
            context_data_val = (context_data_val << 1) | (value & 1);
            if (context_data_position === bitsPerChar - 1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
            } else { context_data_position++; }
            value = value >> 1;
        }
        while (true) {
            context_data_val = (context_data_val << 1);
            if (context_data_position === bitsPerChar - 1) {
                context_data.push(getCharFromInt(context_data_val));
                break;
            } else context_data_position++;
        }
        return context_data.join('');
    },
    
    _decompress: function(length, resetValue, getNextValue) {
        let dictionary = [], enlargeIn = 4, dictSize = 4, numBits = 3,
            entry = "", result = [], i, w, bits, resb, maxpower, power, c,
            data = { val: getNextValue(0), position: resetValue, index: 1 };
        
        for (i = 0; i < 3; i++) dictionary[i] = i;
        
        bits = 0; maxpower = Math.pow(2, 2); power = 1;
        while (power !== maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position === 0) { data.position = resetValue; data.val = getNextValue(data.index++); }
            bits |= (resb > 0 ? 1 : 0) * power;
            power <<= 1;
        }
        
        switch (bits) {
            case 0:
                bits = 0; maxpower = Math.pow(2, 8); power = 1;
                while (power !== maxpower) {
                    resb = data.val & data.position;
                    data.position >>= 1;
                    if (data.position === 0) { data.position = resetValue; data.val = getNextValue(data.index++); }
                    bits |= (resb > 0 ? 1 : 0) * power;
                    power <<= 1;
                }
                c = String.fromCharCode(bits);
                break;
            case 1:
                bits = 0; maxpower = Math.pow(2, 16); power = 1;
                while (power !== maxpower) {
                    resb = data.val & data.position;
                    data.position >>= 1;
                    if (data.position === 0) { data.position = resetValue; data.val = getNextValue(data.index++); }
                    bits |= (resb > 0 ? 1 : 0) * power;
                    power <<= 1;
                }
                c = String.fromCharCode(bits);
                break;
            case 2:
                return "";
        }
        dictionary[3] = c;
        w = c;
        result.push(c);
        
        while (true) {
            if (data.index > length) return "";
            bits = 0; maxpower = Math.pow(2, numBits); power = 1;
            while (power !== maxpower) {
                resb = data.val & data.position;
                data.position >>= 1;
                if (data.position === 0) { data.position = resetValue; data.val = getNextValue(data.index++); }
                bits |= (resb > 0 ? 1 : 0) * power;
                power <<= 1;
            }
            
            switch (c = bits) {
                case 0:
                    bits = 0; maxpower = Math.pow(2, 8); power = 1;
                    while (power !== maxpower) {
                        resb = data.val & data.position;
                        data.position >>= 1;
                        if (data.position === 0) { data.position = resetValue; data.val = getNextValue(data.index++); }
                        bits |= (resb > 0 ? 1 : 0) * power;
                        power <<= 1;
                    }
                    dictionary[dictSize++] = String.fromCharCode(bits);
                    c = dictSize - 1;
                    enlargeIn--;
                    break;
                case 1:
                    bits = 0; maxpower = Math.pow(2, 16); power = 1;
                    while (power !== maxpower) {
                        resb = data.val & data.position;
                        data.position >>= 1;
                        if (data.position === 0) { data.position = resetValue; data.val = getNextValue(data.index++); }
                        bits |= (resb > 0 ? 1 : 0) * power;
                        power <<= 1;
                    }
                    dictionary[dictSize++] = String.fromCharCode(bits);
                    c = dictSize - 1;
                    enlargeIn--;
                    break;
                case 2:
                    return result.join('');
            }
            
            if (enlargeIn === 0) { enlargeIn = Math.pow(2, numBits); numBits++; }
            
            if (dictionary[c]) {
                entry = dictionary[c];
            } else {
                if (c === dictSize) {
                    entry = w + w.charAt(0);
                } else {
                    return null;
                }
            }
            result.push(entry);
            dictionary[dictSize++] = w + entry.charAt(0);
            enlargeIn--;
            if (enlargeIn === 0) { enlargeIn = Math.pow(2, numBits); numBits++; }
            w = entry;
        }
    }
};

// ============================================
// PROJECT STORAGE CLASS
// ============================================

class ProjectStorage {
    constructor() {
        this.STORAGE_KEY = 'techExplorers_projects';
        this.ACHIEVEMENTS_KEY = 'techExplorers_achievements';
        this.STUDENT_KEY = 'techExplorers_student';
    }
    
    // Generate unique project ID
    generateId() {
        return 'proj_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }
    
    // Get all saved projects
    getAllProjects() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Error loading projects:', e);
            return [];
        }
    }
    
    // Save a project
    saveProject(project) {
        const projects = this.getAllProjects();
        const existingIndex = projects.findIndex(p => p.id === project.id);
        
        const projectData = {
            id: project.id || this.generateId(),
            name: project.name || 'Untitled Project',
            type: project.type || 'html', // html, css, js, full
            html: project.html || '',
            css: project.css || '',
            js: project.js || '',
            thumbnail: project.thumbnail || null,
            createdAt: project.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            adventure: project.adventure || null // Which adventure it came from
        };
        
        if (existingIndex >= 0) {
            projects[existingIndex] = projectData;
        } else {
            projects.unshift(projectData); // Add to beginning
        }
        
        // Keep only last 50 projects
        if (projects.length > 50) {
            projects.pop();
        }
        
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(projects));
        return projectData;
    }
    
    // Get a single project by ID
    getProject(id) {
        const projects = this.getAllProjects();
        return projects.find(p => p.id === id);
    }
    
    // Delete a project
    deleteProject(id) {
        const projects = this.getAllProjects();
        const filtered = projects.filter(p => p.id !== id);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    }
    
    // Create shareable URL for a project
    createShareableUrl(project, baseUrl = window.location.origin) {
        const data = JSON.stringify({
            n: project.name,
            t: project.type,
            h: project.html,
            c: project.css,
            j: project.js
        });
        
        const compressed = LZString.compressToEncodedURIComponent(data);
        return `${baseUrl}/playground/project-builder.html?p=${compressed}`;
    }
    
    // Load project from URL
    loadFromUrl() {
        const params = new URLSearchParams(window.location.search);
        const compressed = params.get('p');
        
        if (!compressed) return null;
        
        try {
            const decompressed = LZString.decompressFromEncodedURIComponent(compressed);
            const data = JSON.parse(decompressed);
            return {
                name: data.n || 'Shared Project',
                type: data.t || 'full',
                html: data.h || '',
                css: data.c || '',
                js: data.j || ''
            };
        } catch (e) {
            console.error('Error loading project from URL:', e);
            return null;
        }
    }
    
    // Generate thumbnail from iframe
    async generateThumbnail(iframe) {
        // For now, return a placeholder. In production, you could use html2canvas
        return null;
    }
    
    // Student profile
    getStudent() {
        try {
            const data = localStorage.getItem(this.STUDENT_KEY);
            return data ? JSON.parse(data) : { name: '', avatar: '🧑‍💻' };
        } catch (e) {
            return { name: '', avatar: '🧑‍💻' };
        }
    }
    
    saveStudent(student) {
        localStorage.setItem(this.STUDENT_KEY, JSON.stringify(student));
    }
    
    // Achievements
    getAchievements() {
        try {
            const data = localStorage.getItem(this.ACHIEVEMENTS_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    }
    
    addAchievement(achievement) {
        const achievements = this.getAchievements();
        if (!achievements.find(a => a.id === achievement.id)) {
            achievements.push({
                ...achievement,
                earnedAt: new Date().toISOString()
            });
            localStorage.setItem(this.ACHIEVEMENTS_KEY, JSON.stringify(achievements));
            return true; // New achievement!
        }
        return false; // Already had it
    }
    
    // Check if adventure is complete
    isAdventureComplete(adventureId) {
        const achievements = this.getAchievements();
        return achievements.some(a => a.adventure === adventureId && a.type === 'complete');
    }
}

// ============================================
// QR CODE GENERATOR (Simple implementation)
// ============================================

class QRCode {
    static generate(text, size = 200) {
        // Use Google Charts API for QR code generation (works without dependencies)
        const encoded = encodeURIComponent(text);
        return `https://chart.googleapis.com/chart?cht=qr&chs=${size}x${size}&chl=${encoded}&choe=UTF-8`;
    }
}

// ============================================
// SHARE MODAL COMPONENT
// ============================================

class ShareModal {
    constructor() {
        this.modal = null;
        this.createModal();
    }
    
    createModal() {
        const modal = document.createElement('div');
        modal.id = 'share-modal';
        modal.innerHTML = `
            <div class="share-modal-overlay"></div>
            <div class="share-modal-content">
                <button class="share-modal-close">&times;</button>
                <h2>🎉 Share Your Project!</h2>
                <p class="share-subtitle">Show your creation to friends and family!</p>
                
                <div class="share-section">
                    <h3>📱 Scan with Phone</h3>
                    <p>Parents can scan this to see your project!</p>
                    <div class="qr-container">
                        <img id="share-qr-code" src="" alt="QR Code">
                    </div>
                </div>
                
                <div class="share-section">
                    <h3>🔗 Share Link</h3>
                    <div class="share-link-container">
                        <input type="text" id="share-link-input" readonly>
                        <button id="copy-link-btn">📋 Copy</button>
                    </div>
                    <p id="copy-feedback" class="copy-feedback"></p>
                </div>
                
                <div class="share-section">
                    <h3>💾 Download</h3>
                    <p>Save your project to your computer!</p>
                    <button id="download-project-btn" class="download-btn">
                        <i class="fas fa-download"></i> Download HTML File
                    </button>
                </div>
            </div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            #share-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 10000;
            }
            
            #share-modal.open {
                display: block;
            }
            
            .share-modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(5px);
            }
            
            .share-modal-content {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                border-radius: 25px;
                padding: 40px;
                max-width: 500px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 25px 80px rgba(0, 0, 0, 0.3);
                animation: modalSlideIn 0.3s ease;
            }
            
            @keyframes modalSlideIn {
                from {
                    opacity: 0;
                    transform: translate(-50%, -45%);
                }
                to {
                    opacity: 1;
                    transform: translate(-50%, -50%);
                }
            }
            
            .share-modal-close {
                position: absolute;
                top: 15px;
                right: 20px;
                background: none;
                border: none;
                font-size: 2rem;
                cursor: pointer;
                color: #666;
                transition: color 0.3s;
            }
            
            .share-modal-close:hover {
                color: #f72585;
            }
            
            .share-modal-content h2 {
                font-family: 'Comic Neue', cursive;
                font-size: 2rem;
                color: #3a0ca3;
                margin: 0 0 10px 0;
                text-align: center;
            }
            
            .share-subtitle {
                text-align: center;
                color: #666;
                margin-bottom: 30px;
            }
            
            .share-section {
                background: #f8f9fa;
                border-radius: 15px;
                padding: 20px;
                margin-bottom: 20px;
            }
            
            .share-section h3 {
                font-size: 1.1rem;
                color: #333;
                margin: 0 0 10px 0;
            }
            
            .share-section p {
                color: #666;
                font-size: 0.9rem;
                margin: 0 0 15px 0;
            }
            
            .qr-container {
                text-align: center;
                padding: 20px;
                background: white;
                border-radius: 15px;
            }
            
            .qr-container img {
                max-width: 200px;
                border-radius: 10px;
            }
            
            .share-link-container {
                display: flex;
                gap: 10px;
            }
            
            #share-link-input {
                flex: 1;
                padding: 12px 15px;
                border: 2px solid #e0e0e0;
                border-radius: 10px;
                font-size: 0.9rem;
                background: white;
            }
            
            #copy-link-btn {
                padding: 12px 20px;
                background: #4361ee;
                color: white;
                border: none;
                border-radius: 10px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s;
            }
            
            #copy-link-btn:hover {
                background: #3a0ca3;
                transform: scale(1.05);
            }
            
            .copy-feedback {
                text-align: center;
                color: #06d6a0;
                font-weight: bold;
                min-height: 20px;
                margin-top: 10px;
            }
            
            .download-btn {
                width: 100%;
                padding: 15px;
                background: linear-gradient(135deg, #06d6a0, #00b894);
                color: white;
                border: none;
                border-radius: 15px;
                font-size: 1.1rem;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s;
            }
            
            .download-btn:hover {
                transform: scale(1.02);
                box-shadow: 0 5px 20px rgba(6, 214, 160, 0.4);
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(modal);
        this.modal = modal;
        
        // Event listeners
        modal.querySelector('.share-modal-overlay').addEventListener('click', () => this.close());
        modal.querySelector('.share-modal-close').addEventListener('click', () => this.close());
        modal.querySelector('#copy-link-btn').addEventListener('click', () => this.copyLink());
    }
    
    open(project, downloadCallback) {
        const storage = new ProjectStorage();
        const shareUrl = storage.createShareableUrl(project);
        
        // Set QR code
        this.modal.querySelector('#share-qr-code').src = QRCode.generate(shareUrl);
        
        // Set link
        this.modal.querySelector('#share-link-input').value = shareUrl;
        
        // Set download callback
        this.modal.querySelector('#download-project-btn').onclick = downloadCallback;
        
        // Clear feedback
        this.modal.querySelector('#copy-feedback').textContent = '';
        
        this.modal.classList.add('open');
    }
    
    close() {
        this.modal.classList.remove('open');
    }
    
    copyLink() {
        const input = this.modal.querySelector('#share-link-input');
        navigator.clipboard.writeText(input.value).then(() => {
            this.modal.querySelector('#copy-feedback').textContent = '✅ Copied to clipboard!';
            setTimeout(() => {
                this.modal.querySelector('#copy-feedback').textContent = '';
            }, 3000);
        });
    }
}

// ============================================
// CELEBRATION EFFECTS
// ============================================

class Celebration {
    static confetti() {
        // Create confetti container
        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            pointer-events: none;
            z-index: 99999;
            overflow: hidden;
        `;
        document.body.appendChild(container);
        
        const colors = ['#f72585', '#4361ee', '#06d6a0', '#ffd166', '#7209b7'];
        const emojis = ['🎉', '⭐', '🌟', '✨', '🎊', '🏆', '💫'];
        
        // Create confetti pieces
        for (let i = 0; i < 100; i++) {
            const piece = document.createElement('div');
            const isEmoji = Math.random() > 0.7;
            
            if (isEmoji) {
                piece.textContent = emojis[Math.floor(Math.random() * emojis.length)];
                piece.style.fontSize = (Math.random() * 20 + 15) + 'px';
            } else {
                piece.style.width = (Math.random() * 10 + 5) + 'px';
                piece.style.height = (Math.random() * 10 + 5) + 'px';
                piece.style.background = colors[Math.floor(Math.random() * colors.length)];
                piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            }
            
            piece.style.cssText += `
                position: absolute;
                left: ${Math.random() * 100}%;
                top: -20px;
                animation: confettiFall ${Math.random() * 3 + 2}s linear forwards;
                transform: rotate(${Math.random() * 360}deg);
            `;
            
            container.appendChild(piece);
        }
        
        // Add animation keyframes
        if (!document.querySelector('#confetti-styles')) {
            const style = document.createElement('style');
            style.id = 'confetti-styles';
            style.textContent = `
                @keyframes confettiFall {
                    to {
                        top: 110%;
                        transform: rotate(${Math.random() * 720}deg);
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Clean up after animation
        setTimeout(() => container.remove(), 5000);
    }
    
    static badge(name, icon = '🏆') {
        const badge = document.createElement('div');
        badge.innerHTML = `
            <div class="celebration-badge">
                <div class="badge-icon">${icon}</div>
                <div class="badge-text">
                    <div class="badge-title">Achievement Unlocked!</div>
                    <div class="badge-name">${name}</div>
                </div>
            </div>
        `;
        
        badge.style.cssText = `
            position: fixed;
            top: 20px;
            right: -400px;
            z-index: 99998;
            animation: badgeSlideIn 0.5s ease forwards, badgeSlideOut 0.5s ease 4s forwards;
        `;
        
        // Add styles
        if (!document.querySelector('#badge-styles')) {
            const style = document.createElement('style');
            style.id = 'badge-styles';
            style.textContent = `
                .celebration-badge {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    background: linear-gradient(135deg, #ffd166, #f72585);
                    color: white;
                    padding: 20px 30px;
                    border-radius: 20px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
                }
                
                .badge-icon {
                    font-size: 3rem;
                }
                
                .badge-title {
                    font-size: 0.9rem;
                    opacity: 0.9;
                }
                
                .badge-name {
                    font-size: 1.3rem;
                    font-weight: bold;
                    font-family: 'Comic Neue', cursive;
                }
                
                @keyframes badgeSlideIn {
                    to { right: 20px; }
                }
                
                @keyframes badgeSlideOut {
                    to { right: -400px; }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(badge);
        setTimeout(() => badge.remove(), 5000);
    }
}

// ============================================
// GLOBAL INSTANCE
// ============================================

window.TechExplorers = {
    storage: new ProjectStorage(),
    shareModal: null, // Lazy initialized
    celebration: Celebration,
    
    // Initialize share modal (call when needed)
    initShareModal() {
        if (!this.shareModal) {
            this.shareModal = new ShareModal();
        }
        return this.shareModal;
    },
    
    // Quick share a project
    share(project, downloadCallback) {
        this.initShareModal();
        this.shareModal.open(project, downloadCallback);
    },
    
    // Check for shared project in URL
    checkSharedProject() {
        return this.storage.loadFromUrl();
    }
};

console.log('🚀 Tech Explorers Project Storage loaded!');
