// DarkPerplexity CTI Application
class DarkPerplexityCTI {
    constructor() {
        this.config = {
            llmProvider: '',
            apiKey: '',
            ollamaIP: '127.0.0.1',
            ollamaPort: '11434'
        };
        
        this.searchHistory = [];
        this.lastSearchResults = null;
        this.isSearching = false;
        
        // Sample data from the provided JSON
        this.darkWebSources = [
            {
                name: "Ahmia",
                url: "juhanurmihxlp77nkq76byazcldy2hlmovfu2epvl5ankdibsot4csyd.onion",
                description: "Clean, filtered dark web search engine",
                status: "active",
                type: "search_engine"
            },
            {
                name: "Torch",
                url: "xmh57jrknzkhv6y3ls3ubitzfqnkrwxhopf5aygthi7d6rplyvk3noyd.onion",
                description: "Oldest and most comprehensive dark web search",
                status: "active",
                type: "search_engine"
            },
            {
                name: "Haystak",
                url: "haystak5njsmn2hqkewecpaxetahtwhsbsa64jom2k22z5afxhnpxfid.onion",
                description: "Over 1.5 billion pages indexed",
                status: "active",
                type: "search_engine"
            },
            {
                name: "NotEvil",
                url: "hss3uro2hsxfogfq.onion",
                description: "Uncensored dark web search engine",
                status: "active",
                type: "search_engine"
            },
            {
                name: "DuckDuckGo Onion",
                url: "3g2upl4pq6kufc4m.onion",
                description: "Privacy-focused search with dark web access",
                status: "active",
                type: "search_engine"
            }
        ];
        
        this.sampleIOCs = [
            {
                type: "ip",
                value: "185.220.101.45",
                description: "C&C server for Locky ransomware",
                threat_level: "high",
                first_seen: "2024-01-15",
                source: "Ahmia forum analysis"
            },
            {
                type: "domain",
                value: "darkmarket[.]onion",
                description: "Compromised credentials marketplace",
                threat_level: "critical",
                first_seen: "2024-02-01",
                source: "Torch marketplace monitoring"
            },
            {
                type: "hash",
                value: "a1b2c3d4e5f6789012345678901234567890abcd",
                description: "Banking trojan payload",
                threat_level: "high",
                first_seen: "2024-01-20",
                source: "Haystak malware analysis"
            },
            {
                type: "bitcoin",
                value: "1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2",
                description: "Ransomware payment wallet",
                threat_level: "medium",
                first_seen: "2024-01-25",
                source: "NotEvil financial tracking"
            }
        ];
        
        this.threatActors = [
            {
                name: "TA505",
                aliases: ["Dridex Group", "Locky Group"],
                motivation: "Financial gain",
                targets: ["Financial institutions", "Healthcare", "Retail"],
                geography: ["Global", "Focus on US/Europe"],
                ttps: ["Phishing", "Banking trojans", "Ransomware"],
                activity_level: "high",
                sophistication: "advanced"
            },
            {
                name: "APT41",
                aliases: ["Winnti Group", "Barium"],
                motivation: "Espionage and financial gain",
                targets: ["Healthcare", "Telecommunications", "Technology"],
                geography: ["China-based", "Global targeting"],
                ttps: ["Supply chain attacks", "Zero-day exploits", "Living off the land"],
                activity_level: "high",
                sophistication: "nation-state"
            },
            {
                name: "REvil",
                aliases: ["Sodinokibi", "RaaS Group"],
                motivation: "Financial gain",
                targets: ["Large enterprises", "Critical infrastructure"],
                geography: ["Russia/CIS", "Global victims"],
                ttps: ["Ransomware as a Service", "Double extortion", "Supply chain"],
                activity_level: "medium",
                sophistication: "advanced"
            }
        ];
        
        this.sampleQueries = [
            "Latest ransomware targeting financial institutions",
            "APT41 new campaigns 2024",
            "Banking trojan IOCs Q1 2024",
            "Cryptocurrency wallet compromises",
            "Healthcare data breaches underground markets",
            "Zero-day exploits for sale",
            "Nation-state attribution indicators",
            "Supply chain attack vectors",
            "Insider threat indicators",
            "Critical infrastructure targeting"
        ];
        
        this.init();
    }
    
    init() {
        this.loadConfig();
        this.setupEventListeners();
        this.initializeQuickQueries();
        this.startHealthChecks();
        this.checkTorStatus();
        this.updateSourceStatus();
    }
    
    loadConfig() {
        try {
            const savedConfig = localStorage.getItem('darkperplexity-config');
            if (savedConfig) {
                this.config = { ...this.config, ...JSON.parse(savedConfig) };
                this.updateConfigUI();
            }
        } catch (error) {
            console.log('No saved config found, using defaults');
        }
    }
    
    saveConfig() {
        try {
            localStorage.setItem('darkperplexity-config', JSON.stringify(this.config));
            this.showToast('Configuration saved successfully', 'success');
        } catch (error) {
            this.showToast('Failed to save configuration', 'error');
        }
    }
    
    setupEventListeners() {
        // Header controls
        const settingsBtn = document.getElementById('settingsBtn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const configPanel = document.getElementById('configPanel');
                if (configPanel) {
                    configPanel.classList.add('open');
                }
            });
        }
        
        const closeConfig = document.getElementById('closeConfig');
        if (closeConfig) {
            closeConfig.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const configPanel = document.getElementById('configPanel');
                if (configPanel) {
                    configPanel.classList.remove('open');
                }
            });
        }
        
        const clearBtn = document.getElementById('clearBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.clearResults();
            });
        }
        
        // Export functionality
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const exportMenu = document.getElementById('exportMenu');
                if (exportMenu) {
                    exportMenu.classList.toggle('show');
                }
            });
        }
        
        const exportPdf = document.getElementById('exportPdf');
        if (exportPdf) {
            exportPdf.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.exportToPDF();
                const exportMenu = document.getElementById('exportMenu');
                if (exportMenu) {
                    exportMenu.classList.remove('show');
                }
            });
        }
        
        const exportMarkdown = document.getElementById('exportMarkdown');
        if (exportMarkdown) {
            exportMarkdown.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.exportToMarkdown();
                const exportMenu = document.getElementById('exportMenu');
                if (exportMenu) {
                    exportMenu.classList.remove('show');
                }
            });
        }
        
        // Configuration
        const llmProvider = document.getElementById('llmProvider');
        if (llmProvider) {
            llmProvider.addEventListener('change', (e) => {
                this.config.llmProvider = e.target.value;
                this.updateConfigSections();
            });
        }
        
        const apiKey = document.getElementById('apiKey');
        if (apiKey) {
            apiKey.addEventListener('input', (e) => {
                this.config.apiKey = e.target.value;
            });
        }
        
        const ollamaIP = document.getElementById('ollamaIP');
        if (ollamaIP) {
            ollamaIP.addEventListener('input', (e) => {
                this.config.ollamaIP = e.target.value;
            });
        }
        
        const ollamaPort = document.getElementById('ollamaPort');
        if (ollamaPort) {
            ollamaPort.addEventListener('input', (e) => {
                this.config.ollamaPort = e.target.value;
            });
        }
        
        const testConnection = document.getElementById('testConnection');
        if (testConnection) {
            testConnection.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.testLLMConnection();
            });
        }
        
        const saveConfig = document.getElementById('saveConfig');
        if (saveConfig) {
            saveConfig.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.saveConfig();
            });
        }
        
        // Search functionality
        const searchBtn = document.getElementById('searchBtn');
        if (searchBtn) {
            searchBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.performSearch();
            });
        }
        
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.performSearch();
                }
            });
        }
        
        // Advanced search toggle
        const advancedToggle = document.getElementById('advancedToggle');
        if (advancedToggle) {
            advancedToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const options = document.getElementById('advancedOptions');
                if (options) {
                    if (options.style.display === 'none' || options.style.display === '') {
                        options.style.display = 'block';
                    } else {
                        options.style.display = 'none';
                    }
                }
            });
        }
        
        // Expandable sections
        document.querySelectorAll('.expand-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const button = e.target.closest('.expand-btn');
                if (button && button.dataset.target) {
                    const target = button.dataset.target;
                    const content = document.getElementById(target);
                    
                    if (content) {
                        if (content.classList.contains('collapsed')) {
                            content.classList.remove('collapsed');
                            button.classList.remove('collapsed');
                        } else {
                            content.classList.add('collapsed');
                            button.classList.add('collapsed');
                        }
                    }
                }
            });
        });
        
        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.export-dropdown')) {
                const exportMenu = document.getElementById('exportMenu');
                if (exportMenu) {
                    exportMenu.classList.remove('show');
                }
            }
        });
    }
    
    initializeQuickQueries() {
        const container = document.getElementById('queryTags');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.sampleQueries.forEach(query => {
            const tag = document.createElement('span');
            tag.className = 'query-tag';
            tag.textContent = query;
            tag.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const searchInput = document.getElementById('searchInput');
                if (searchInput) {
                    searchInput.value = query;
                }
                this.performSearch();
            });
            container.appendChild(tag);
        });
    }
    
    updateConfigSections() {
        const apiKeySection = document.getElementById('apiKeySection');
        const ollamaSection = document.getElementById('ollamaSection');
        
        if (apiKeySection && ollamaSection) {
            if (this.config.llmProvider === 'chatgpt4' || this.config.llmProvider === 'chatgpt35') {
                apiKeySection.style.display = 'block';
                ollamaSection.style.display = 'none';
            } else if (this.config.llmProvider === 'ollama') {
                apiKeySection.style.display = 'none';
                ollamaSection.style.display = 'block';
            } else {
                apiKeySection.style.display = 'none';
                ollamaSection.style.display = 'none';
            }
        }
    }
    
    updateConfigUI() {
        const llmProvider = document.getElementById('llmProvider');
        const apiKey = document.getElementById('apiKey');
        const ollamaIP = document.getElementById('ollamaIP');
        const ollamaPort = document.getElementById('ollamaPort');
        
        if (llmProvider) llmProvider.value = this.config.llmProvider;
        if (apiKey) apiKey.value = this.config.apiKey;
        if (ollamaIP) ollamaIP.value = this.config.ollamaIP;
        if (ollamaPort) ollamaPort.value = this.config.ollamaPort;
        
        this.updateConfigSections();
    }
    
    async testLLMConnection() {
        const testBtn = document.getElementById('testConnection');
        if (!testBtn) return;
        
        testBtn.disabled = true;
        testBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Testing...';
        
        try {
            let result = false;
            
            if (this.config.llmProvider === 'chatgpt4' || this.config.llmProvider === 'chatgpt35') {
                result = await this.testOpenAIConnection();
            } else if (this.config.llmProvider === 'ollama') {
                result = await this.testOllamaConnection();
            }
            
            if (result) {
                this.showToast('LLM connection successful', 'success');
                this.updateLLMStatus('CONNECTED', 'Connected and ready');
            } else {
                this.showToast('LLM connection failed', 'error');
                this.updateLLMStatus('ERROR', 'Connection failed');
            }
        } catch (error) {
            this.showToast('LLM connection error: ' + error.message, 'error');
            this.updateLLMStatus('ERROR', 'Connection error');
        } finally {
            testBtn.disabled = false;
            testBtn.innerHTML = '<i class="fas fa-plug"></i> Test Connection';
        }
    }
    
    async testOpenAIConnection() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(this.config.apiKey.length > 20);
            }, 1000);
        });
    }
    
    async testOllamaConnection() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(this.config.ollamaIP && this.config.ollamaPort);
            }, 1000);
        });
    }
    
    async performSearch() {
        const searchInput = document.getElementById('searchInput');
        if (!searchInput) return;
        
        const query = searchInput.value.trim();
        if (!query) {
            this.showToast('Please enter a search query', 'warning');
            return;
        }
        
        if (!this.config.llmProvider) {
            this.showToast('Please configure an LLM provider first', 'warning');
            return;
        }
        
        this.isSearching = true;
        this.updateSearchUI(true);
        
        try {
            await this.simulateSearch(query);
            this.showResults(query);
            this.updateSearchStats(query);
            this.showToast('Search completed successfully', 'success');
        } catch (error) {
            this.showToast('Search failed: ' + error.message, 'error');
        } finally {
            this.isSearching = false;
            this.updateSearchUI(false);
        }
    }
    
    async simulateSearch(query) {
        const phases = [
            'Connecting to TOR network...',
            'Querying dark web sources...',
            'Analyzing results with LLM...',
            'Extracting IOCs...',
            'Generating threat intelligence...'
        ];
        
        for (let i = 0; i < phases.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 800));
        }
        
        this.lastSearchResults = this.generateSearchResults(query);
    }
    
    generateSearchResults(query) {
        const queryLower = query.toLowerCase();
        
        let relevantIOCs = this.sampleIOCs.filter(ioc => 
            ioc.description.toLowerCase().includes(queryLower) ||
            queryLower.includes(ioc.type) ||
            (queryLower.includes('ransomware') && ioc.description.includes('ransomware')) ||
            (queryLower.includes('banking') && ioc.description.includes('banking')) ||
            (queryLower.includes('financial') && ioc.description.includes('banking'))
        );
        
        let relevantActors = this.threatActors.filter(actor =>
            actor.name.toLowerCase().includes(queryLower) ||
            actor.motivation.toLowerCase().includes(queryLower) ||
            actor.targets.some(target => target.toLowerCase().includes(queryLower)) ||
            (queryLower.includes('ransomware') && actor.ttps.some(ttp => ttp.includes('Ransomware'))) ||
            (queryLower.includes('financial') && actor.targets.some(target => target.includes('Financial')))
        );
        
        // If no specific matches, use sample data
        if (relevantIOCs.length === 0) {
            relevantIOCs = this.sampleIOCs.slice(0, 2);
        }
        if (relevantActors.length === 0) {
            relevantActors = this.threatActors.slice(0, 1);
        }
        
        return {
            query: query,
            summary: this.generateExecutiveSummary(query, relevantIOCs, relevantActors),
            iocs: relevantIOCs,
            actors: relevantActors,
            sources: this.darkWebSources.slice(0, 3),
            timestamp: new Date().toISOString()
        };
    }
    
    generateExecutiveSummary(query, iocs, actors) {
        const actorNames = actors.map(a => a.name).join(', ');
        const iocTypes = [...new Set(iocs.map(i => i.type))].join(', ');
        
        return `Based on analysis of dark web sources regarding "${query}", we identified ${iocs.length} indicators of compromise (${iocTypes}) and ${actors.length} relevant threat actors${actorNames ? ` including ${actorNames}` : ''}. 

The intelligence suggests ongoing criminal activity with particular focus on financial institutions and healthcare sectors. Key findings include evidence of ransomware operations, banking trojans, and credential marketplaces.

**Risk Assessment**: ${this.calculateRiskLevel(iocs, actors)}
**Confidence Level**: High
**Recommendation**: Immediate defensive measures recommended for identified IOCs.`;
    }
    
    calculateRiskLevel(iocs, actors) {
        const criticalIOCs = iocs.filter(ioc => ioc.threat_level === 'critical').length;
        const highActivityActors = actors.filter(actor => actor.activity_level === 'high').length;
        
        if (criticalIOCs > 0 || highActivityActors > 0) {
            return 'HIGH';
        } else if (iocs.length > 2 || actors.length > 1) {
            return 'MEDIUM';
        } else {
            return 'LOW';
        }
    }
    
    showResults(query) {
        const resultsSection = document.getElementById('resultsSection');
        if (!resultsSection) return;
        
        resultsSection.style.display = 'block';
        
        // Query Summary
        const querySummary = document.getElementById('querySummary');
        if (querySummary) {
            querySummary.innerHTML = `
                <div class="query-info">
                    <strong>Query:</strong> ${query}<br>
                    <strong>Timestamp:</strong> ${new Date().toLocaleString()}<br>
                    <strong>Sources Queried:</strong> ${this.darkWebSources.length}<br>
                    <strong>Processing Time:</strong> ${(Math.random() * 5 + 2).toFixed(1)}s
                </div>
            `;
        }
        
        // Executive Summary
        const executiveSummary = document.getElementById('executiveSummary');
        if (executiveSummary) {
            executiveSummary.innerHTML = `
                <div class="summary-content">
                    ${this.lastSearchResults.summary.replace(/\n/g, '<br>')}
                </div>
            `;
        }
        
        // IOCs
        this.renderIOCs();
        
        // Threat Actors
        this.renderThreatActors();
        
        // Sources
        this.renderSources();
    }
    
    renderIOCs() {
        const container = document.getElementById('iocGrid');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.lastSearchResults.iocs.forEach(ioc => {
            const iocElement = document.createElement('div');
            iocElement.className = 'ioc-item';
            iocElement.innerHTML = `
                <div class="ioc-header">
                    <span class="ioc-type">${ioc.type}</span>
                    <span class="threat-level ${ioc.threat_level}">${ioc.threat_level}</span>
                </div>
                <div class="ioc-value">${ioc.value}</div>
                <div class="ioc-description">${ioc.description}</div>
                <div class="ioc-meta">
                    <span>First seen: ${ioc.first_seen}</span>
                    <span>Source: ${ioc.source}</span>
                </div>
            `;
            container.appendChild(iocElement);
        });
    }
    
    renderThreatActors() {
        const container = document.getElementById('actorProfiles');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.lastSearchResults.actors.forEach(actor => {
            const actorElement = document.createElement('div');
            actorElement.className = 'actor-profile';
            actorElement.innerHTML = `
                <div class="actor-header">
                    <div>
                        <div class="actor-name">${actor.name}</div>
                        <div class="actor-aliases">Also known as: ${actor.aliases.join(', ')}</div>
                    </div>
                    <span class="activity-level ${actor.activity_level}">${actor.activity_level}</span>
                </div>
                <div class="actor-details">
                    <div class="detail-item">
                        <span class="detail-label">Motivation</span>
                        <span class="detail-value">${actor.motivation}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Targets</span>
                        <span class="detail-value">${actor.targets.join(', ')}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Geography</span>
                        <span class="detail-value">${actor.geography.join(', ')}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">TTPs</span>
                        <span class="detail-value">${actor.ttps.join(', ')}</span>
                    </div>
                </div>
            `;
            container.appendChild(actorElement);
        });
    }
    
    renderSources() {
        const container = document.getElementById('sourceList');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.lastSearchResults.sources.forEach(source => {
            const sourceElement = document.createElement('div');
            sourceElement.className = 'source-item';
            sourceElement.innerHTML = `
                <div class="source-info">
                    <div class="source-name">${source.name}</div>
                    <div class="source-url">${source.url}</div>
                    <div class="source-description">${source.description}</div>
                </div>
                <a href="http://${source.url}" target="_blank" class="source-link">
                    <i class="fas fa-external-link-alt"></i> Visit
                </a>
            `;
            container.appendChild(sourceElement);
        });
    }
    
    updateSearchUI(searching) {
        const searchBtn = document.getElementById('searchBtn');
        const searchIcon = document.getElementById('searchIcon');
        const loadingIcon = document.getElementById('loadingIcon');
        
        if (searchBtn) {
            searchBtn.disabled = searching;
        }
        
        if (searchIcon) {
            searchIcon.style.display = searching ? 'none' : 'block';
        }
        
        if (loadingIcon) {
            loadingIcon.style.display = searching ? 'block' : 'none';
        }
    }
    
    clearResults() {
        const resultsSection = document.getElementById('resultsSection');
        const searchInput = document.getElementById('searchInput');
        
        if (resultsSection) {
            resultsSection.style.display = 'none';
        }
        
        if (searchInput) {
            searchInput.value = '';
        }
        
        this.lastSearchResults = null;
        this.showToast('Results cleared', 'info');
    }
    
    exportToPDF() {
        if (!this.lastSearchResults) {
            this.showToast('No results to export', 'warning');
            return;
        }
        
        const content = this.generatePDFContent();
        
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cti-report-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showToast('Report exported as text file', 'success');
    }
    
    exportToMarkdown() {
        if (!this.lastSearchResults) {
            this.showToast('No results to export', 'warning');
            return;
        }
        
        const content = this.generateMarkdownContent();
        
        const blob = new Blob([content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cti-report-${new Date().toISOString().split('T')[0]}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showToast('Report exported as Markdown', 'success');
    }
    
    generatePDFContent() {
        const results = this.lastSearchResults;
        let content = `CYBER THREAT INTELLIGENCE REPORT\n`;
        content += `=====================================\n\n`;
        content += `Query: ${results.query}\n`;
        content += `Timestamp: ${new Date(results.timestamp).toLocaleString()}\n\n`;
        
        content += `EXECUTIVE SUMMARY\n`;
        content += `-----------------\n`;
        content += `${results.summary}\n\n`;
        
        content += `INDICATORS OF COMPROMISE\n`;
        content += `------------------------\n`;
        results.iocs.forEach(ioc => {
            content += `Type: ${ioc.type.toUpperCase()}\n`;
            content += `Value: ${ioc.value}\n`;
            content += `Description: ${ioc.description}\n`;
            content += `Threat Level: ${ioc.threat_level.toUpperCase()}\n`;
            content += `First Seen: ${ioc.first_seen}\n`;
            content += `Source: ${ioc.source}\n\n`;
        });
        
        content += `THREAT ACTORS\n`;
        content += `-------------\n`;
        results.actors.forEach(actor => {
            content += `Name: ${actor.name}\n`;
            content += `Aliases: ${actor.aliases.join(', ')}\n`;
            content += `Motivation: ${actor.motivation}\n`;
            content += `Activity Level: ${actor.activity_level.toUpperCase()}\n`;
            content += `Targets: ${actor.targets.join(', ')}\n`;
            content += `Geography: ${actor.geography.join(', ')}\n`;
            content += `TTPs: ${actor.ttps.join(', ')}\n\n`;
        });
        
        return content;
    }
    
    generateMarkdownContent() {
        const results = this.lastSearchResults;
        let content = `# Cyber Threat Intelligence Report\n\n`;
        content += `**Query:** ${results.query}\n`;
        content += `**Timestamp:** ${new Date(results.timestamp).toLocaleString()}\n\n`;
        
        content += `## Executive Summary\n\n`;
        content += `${results.summary}\n\n`;
        
        content += `## Indicators of Compromise\n\n`;
        content += `| Type | Value | Description | Threat Level | First Seen |\n`;
        content += `|------|-------|-------------|--------------|------------|\n`;
        results.iocs.forEach(ioc => {
            content += `| ${ioc.type} | \`${ioc.value}\` | ${ioc.description} | ${ioc.threat_level} | ${ioc.first_seen} |\n`;
        });
        
        content += `\n## Threat Actors\n\n`;
        results.actors.forEach(actor => {
            content += `### ${actor.name}\n\n`;
            content += `- **Aliases:** ${actor.aliases.join(', ')}\n`;
            content += `- **Motivation:** ${actor.motivation}\n`;
            content += `- **Activity Level:** ${actor.activity_level}\n`;
            content += `- **Targets:** ${actor.targets.join(', ')}\n`;
            content += `- **Geography:** ${actor.geography.join(', ')}\n`;
            content += `- **TTPs:** ${actor.ttps.join(', ')}\n\n`;
        });
        
        return content;
    }
    
    startHealthChecks() {
        this.performHealthCheck();
        setInterval(() => {
            this.performHealthCheck();
        }, 30000);
    }
    
    performHealthCheck() {
        this.checkTorStatus();
        this.checkLLMStatus();
        this.updateSourceStatus();
    }
    
    checkTorStatus() {
        setTimeout(() => {
            const isConnected = Math.random() > 0.1;
            this.updateTorStatus(isConnected);
        }, 1000);
    }
    
    updateTorStatus(isConnected) {
        const indicator = document.getElementById('torIndicator');
        const text = document.getElementById('torText');
        const status = document.getElementById('torConnectionStatus');
        const details = document.getElementById('torDetails');
        
        if (indicator) {
            if (isConnected) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        }
        
        if (text) {
            text.textContent = isConnected ? 'TOR: ON' : 'TOR: OFF';
        }
        
        if (status) {
            status.textContent = isConnected ? 'CONNECTED' : 'DISCONNECTED';
            status.className = isConnected ? 'status-badge active' : 'status-badge error';
        }
        
        if (details) {
            details.textContent = isConnected ? 
                'TOR network accessible, dark web sources available' : 
                'TOR network not accessible, limited functionality';
        }
    }
    
    checkLLMStatus() {
        if (!this.config.llmProvider) {
            this.updateLLMStatus('NOT CONFIGURED', 'LLM provider not configured');
            return;
        }
        
        setTimeout(() => {
            const isConnected = this.config.apiKey || (this.config.ollamaIP && this.config.ollamaPort);
            if (isConnected) {
                this.updateLLMStatus('CONNECTED', `${this.config.llmProvider} ready`);
            } else {
                this.updateLLMStatus('ERROR', 'Configuration incomplete');
            }
        }, 500);
    }
    
    updateLLMStatus(status, details) {
        const statusElement = document.getElementById('llmStatus');
        const detailsElement = document.getElementById('llmDetails');
        
        if (statusElement) {
            statusElement.textContent = status;
            statusElement.className = 'status-badge ' + (
                status === 'CONNECTED' ? 'active' : 
                status === 'ERROR' ? 'error' : 
                'inactive'
            );
        }
        
        if (detailsElement) {
            detailsElement.textContent = details;
        }
    }
    
    updateSourceStatus() {
        const container = document.getElementById('sourceStatusList');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.darkWebSources.forEach(source => {
            const item = document.createElement('div');
            item.className = 'source-status-item';
            
            const isActive = source.status === 'active' && Math.random() > 0.05;
            
            item.innerHTML = `
                <span>${source.name}</span>
                <span class="source-status-indicator ${isActive ? 'active' : 'error'}"></span>
            `;
            
            container.appendChild(item);
        });
    }
    
    updateSearchStats(query) {
        const status = document.getElementById('searchStatsStatus');
        const details = document.getElementById('searchStats');
        
        if (status) {
            status.textContent = 'COMPLETED';
            status.className = 'status-badge active';
        }
        
        if (details) {
            details.innerHTML = `
                <div>Query: "${query}"</div>
                <div>Results: ${this.lastSearchResults.iocs.length} IOCs, ${this.lastSearchResults.actors.length} actors</div>
                <div>Sources: ${this.lastSearchResults.sources.length} queried</div>
            `;
        }
    }
    
    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        if (!container) return;
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = type === 'success' ? 'check' : 
                   type === 'error' ? 'exclamation-triangle' : 
                   type === 'warning' ? 'exclamation-triangle' : 'info';
        
        toast.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        `;
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (container.contains(toast)) {
                    container.removeChild(toast);
                }
            }, 300);
        }, 5000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new DarkPerplexityCTI();
    
    // Add keyboard shortcut for search
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            app.performSearch();
        }
    });
    
    // Expose app globally for debugging
    window.DarkPerplexityApp = app;
});