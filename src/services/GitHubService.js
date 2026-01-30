// GitHub API service to fetch real projects
class GitHubService {
  constructor(username = 'YouAreMyHome') {
    this.username = username;
    this.baseUrl = 'https://api.github.com';
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    this.token = import.meta.env.VITE_GITHUB_TOKEN;
  }

  // Get headers with authentication
  getHeaders() {
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
    };
    
    if (this.token) {
      headers['Authorization'] = `token ${this.token}`;
    }
    
    return headers;
  }

  // Clear cache to force fresh data
  clearCache() {
    this.cache.clear();
  }

  // Fix encoding issues with Vietnamese text
  fixEncoding(text) {
    if (!text) return text;
    
    try {
      // Check if text contains mojibake (encoding issues)
      if (text.includes('Ã') || text.includes('â') || text.includes('á»')) {
        // Try to fix common Vietnamese encoding issues
        return text
          .replace(/Má»¥c tiÃªu/g, 'Mục tiêu')
          .replace(/há»c táº­p/g, 'học tập')
          .replace(/phÃ¡t triá»n/g, 'phát triển')
          .replace(/ká»¹ nÄng/g, 'kỹ năng')
          .replace(/á»©ng dá»¥ng/g, 'ứng dụng')
          .replace(/dá»± Ã¡n/g, 'dự án')
          .replace(/thá»±c hiá»n/g, 'thực hiện')
          .replace(/kinh nghiá»m/g, 'kinh nghiệm')
          .replace(/cÃ´ng nghá»/g, 'công nghệ')
          .replace(/lÃ m viá»c/g, 'làm việc');
      }
      return text;
    } catch (error) {
      console.error('Error fixing encoding:', error);
      return text;
    }
  }

  // Get cached data if available and not expired
  getCachedData(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  // Set data to cache
  setCachedData(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  // Fetch user repositories (owned)
  async fetchRepositories() {
    const cacheKey = `repos_${this.username}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(
        `${this.baseUrl}/users/${this.username}/repos?sort=updated&per_page=50`,
        {
          headers: this.getHeaders()
        }
      );

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const repos = await response.json();
      this.setCachedData(cacheKey, repos);
      return repos;
    } catch (error) {
      console.error('Error fetching repositories:', error);
      return [];
    }
  }

  // Fetch repositories where user contributed (not owned)
  async fetchContributedRepositories() {
    const cacheKey = `contributed_repos_${this.username}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      // First, get user's public events to find repositories they contributed to
      const eventsResponse = await fetch(
        `${this.baseUrl}/users/${this.username}/events/public?per_page=100`,
        {
          headers: this.getHeaders()
        }
      );

      if (!eventsResponse.ok) {
        throw new Error(`GitHub Events API error: ${eventsResponse.status}`);
      }

      const events = await eventsResponse.json();
      
      // Extract unique repository names from events (excluding owned repos)
      const contributedRepoNames = new Set();
      events.forEach(event => {
        if (event.repo && event.repo.name && 
            !event.repo.name.startsWith(`${this.username}/`) &&
            (event.type === 'PushEvent' || 
             event.type === 'PullRequestEvent' || 
             event.type === 'IssuesEvent' ||
             event.type === 'CreateEvent' ||
             event.type === 'CommitCommentEvent')) {
          contributedRepoNames.add(event.repo.name);
        }
      });

      // Fetch detailed info for each contributed repository
      const contributedRepos = [];
      const repoPromises = Array.from(contributedRepoNames).slice(0, 10).map(async (repoName) => {
        try {
          const repoResponse = await fetch(
            `${this.baseUrl}/repos/${repoName}`,
            {
              headers: this.getHeaders()
            }
          );
          
          if (repoResponse.ok) {
            const repoData = await repoResponse.json();
            return repoData;
          }
        } catch (error) {
          console.warn(`Failed to fetch repo ${repoName}:`, error);
        }
        return null;
      });

      const repos = await Promise.all(repoPromises);
      contributedRepos.push(...repos.filter(repo => repo !== null));
      
      this.setCachedData(cacheKey, contributedRepos);
      return contributedRepos;
    } catch (error) {
      console.error('Error fetching contributed repositories:', error);
      return [];
    }
  }

  // Fetch all repositories (owned + contributed)
  async fetchAllRepositories() {
    const cacheKey = `all_repos_${this.username}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const [ownedRepos, contributedRepos] = await Promise.all([
        this.fetchRepositories(),
        this.fetchContributedRepositories()
      ]);

      console.log('GitHubService - Owned repos:', ownedRepos.length);
      console.log('GitHubService - Contributed repos:', contributedRepos.length);
      console.log('GitHubService - Contributed repos list:', contributedRepos.map(r => `${r.owner.login}/${r.name}`));

      // Combine and sort by updated date
      const allRepos = [...ownedRepos, ...contributedRepos].sort((a, b) => 
        new Date(b.updated_at) - new Date(a.updated_at)
      );

      this.setCachedData(cacheKey, allRepos);
      return allRepos;
    } catch (error) {
      console.error('Error fetching all repositories:', error);
      return [];
    }
  }

  // Fetch repository languages
  async fetchRepoLanguages(repoName, ownerLogin = null) {
    const owner = ownerLogin || this.username;
    const cacheKey = `languages_${owner}_${repoName}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(
        `${this.baseUrl}/repos/${owner}/${repoName}/languages`,
        {
          headers: this.getHeaders()
        }
      );

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const languages = await response.json();
      this.setCachedData(cacheKey, languages);
      return languages;
    } catch (error) {
      console.error('Error fetching repository languages:', error);
      return {};
    }
  }

  // Fetch repository README for description
  async fetchRepoReadme(repoName, ownerLogin = null) {
    const owner = ownerLogin || this.username;
    const cacheKey = `readme_${owner}_${repoName}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(
        `${this.baseUrl}/repos/${owner}/${repoName}/readme`,
        {
          headers: this.getHeaders()
        }
      );

      if (!response.ok) {
        return null; // README might not exist
      }

      const readme = await response.json();
      // Decode base64 content with proper UTF-8 handling
      let content;
      try {
        // Use proper UTF-8 decoding for Vietnamese characters
        const bytes = atob(readme.content);
        const uint8Array = new Uint8Array(bytes.length);
        for (let i = 0; i < bytes.length; i++) {
          uint8Array[i] = bytes.charCodeAt(i);
        }
        content = new TextDecoder('utf-8').decode(uint8Array);
      } catch (error) {
        // Fallback to simple atob if TextDecoder fails
        content = atob(readme.content);
      }
      
      // Extract first paragraph as description
      const lines = content.split('\n');
      let description = '';
      
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('![')) {
          description = this.fixEncoding(trimmed.substring(0, 150));
          break;
        }
      }

      this.setCachedData(cacheKey, description);
      return description;
    } catch (error) {
      console.error('Error fetching repository README:', error);
      return null;
    }
  }

  // Transform GitHub repo data to project format
  async transformRepoToProject(repo) {
    // Check if this is a contributed project (not owned by user)
    const isContributed = repo.owner.login !== this.username;
    
    const languages = await this.fetchRepoLanguages(repo.name, isContributed ? repo.owner.login : null);
    
    // Use repo description first, fallback to README if description is empty
    let projectDescription = repo.description;
    if (!projectDescription || projectDescription.trim() === '') {
      const readmeDescription = await this.fetchRepoReadme(repo.name, isContributed ? repo.owner.login : null);
      projectDescription = readmeDescription;
    }

    // Get top languages
    const languageEntries = Object.entries(languages);
    const topLanguages = languageEntries
      .sort(([,a], [,b]) => b - a)
      .slice(0, 4)
      .map(([lang]) => lang);

    // Determine project status
    const lastUpdate = new Date(repo.updated_at);
    const monthsAgo = (Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24 * 30);
    const status = monthsAgo < 3 ? 'In Progress' : 'Completed';

    // Generate project image based on primary language
    const primaryLang = topLanguages[0] || 'Code';
    const languageColors = {
      JavaScript: '#f7df1e',
      TypeScript: '#3178c6',
      Python: '#3776ab',
      Java: '#ed8b00',
      'C++': '#00599c',
      'C#': '#239120',
      PHP: '#777bb4',
      Ruby: '#cc342d',
      Go: '#00add8',
      Rust: '#dea584',
      Swift: '#fa7343',
      Kotlin: '#0095d5',
      Dart: '#0175c2',
      Vue: '#4fc08d',
      React: '#61dafb',
      Angular: '#dd0031',
      HTML: '#e34f26',
      CSS: '#1572b6',
      SCSS: '#c6538c',
      Shell: '#89e051',
    };

    return {
      id: repo.id,
      title: this.fixEncoding(
        repo.name
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      ),
      description: this.fixEncoding(projectDescription) || 'A GitHub repository',
      image: this.generateProjectImage(primaryLang, languageColors[primaryLang]),
      technologies: topLanguages,
      link: repo.homepage || null, // Homepage/demo link
      github: repo.html_url, // GitHub repository link
      html_url: repo.html_url, // Backup GitHub link
      status: status,
      year: new Date(repo.created_at).getFullYear().toString(),
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      lastUpdate: lastUpdate,
      primaryLanguage: primaryLang,
      isPrivate: repo.private,
      size: repo.size,
      // Add information about contributed projects
      isContributed: isContributed,
      owner: isContributed ? repo.owner.login : this.username,
      contributionType: isContributed ? 'Contributor' : 'Owner',
      // Additional repository information
      repoName: repo.name,
      fullName: repo.full_name,
      clone_url: repo.clone_url,
      ssh_url: repo.ssh_url,
      language: repo.language,
      default_branch: repo.default_branch || 'main',
      archived: repo.archived,
      disabled: repo.disabled
    };
  }

  // Generate a project image placeholder
  generateProjectImage(language, color = '#00f7ff') {
    // Return a data URL for a simple SVG image
    const svg = `
      <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${color || '#00f7ff'};stop-opacity:0.3" />
            <stop offset="100%" style="stop-color:#7c3aed;stop-opacity:0.1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad1)"/>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
              font-family="monospace" font-size="24" fill="white" opacity="0.8">
          ${language}
        </text>
        <rect x="10" y="10" width="30" height="30" fill="${color || '#00f7ff'}" opacity="0.6" rx="5"/>
        <rect x="360" y="160" width="30" height="30" fill="#ec4899" opacity="0.4" rx="5"/>
      </svg>
    `;
    
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }

  // Get featured projects (public, recently updated, with good stats)
  async getFeaturedProjects(limit = 8) {
    try {
      const repos = await this.fetchAllRepositories(); // Changed to fetch all repos including contributed
      
      // Filter and sort repositories
      const featuredRepos = repos
        .filter(repo => {
          // Filter criteria for owned repos
          if (repo.owner.login === this.username) {
            return !repo.private && // Public only
                   !repo.fork && // Not a fork
                   repo.size > 0 && // Has content
                   repo.name !== this.username && // Not profile repo
                   !repo.name.includes('config'); // Not config repos
          }
          
          // Filter criteria for contributed repos
          return !repo.private && // Public only
                 repo.size > 0 && // Has content
                 (repo.stargazers_count > 0 || repo.forks_count > 0); // Has some activity
        })
        .sort((a, b) => {
          // Sort by activity score (stars + forks + recent updates)
          const scoreA = a.stargazers_count + a.forks_count + 
                        (Date.now() - new Date(a.updated_at).getTime() < 30 * 24 * 60 * 60 * 1000 ? 10 : 0);
          const scoreB = b.stargazers_count + b.forks_count + 
                        (Date.now() - new Date(b.updated_at).getTime() < 30 * 24 * 60 * 60 * 1000 ? 10 : 0);
          return scoreB - scoreA;
        })
        .slice(0, limit);

      // Transform repos to project format
      const projects = await Promise.all(
        featuredRepos.map(repo => this.transformRepoToProject(repo))
      );

      return projects;
    } catch (error) {
      console.error('Error getting featured projects:', error);
      return this.getFallbackProjects();
    }
  }

  // Fallback projects if API fails
  getFallbackProjects() {
    return [
      {
        id: 1,
        title: 'Portfolio Website',
        description: 'Personal cyberpunk-themed portfolio with interactive features',
        image: this.generateProjectImage('React', '#61dafb'),
        technologies: ['React', 'Tailwind CSS', 'Framer Motion', 'Vite'],
        link: 'https://letrongnghia.me',
        github: 'https://github.com/YouAreMyHome/portfolio',
        status: 'Completed',
        year: '2024',
        stars: 0,
        forks: 0,
        primaryLanguage: 'React'
      },
      {
        id: 2,
        title: 'AI Chat Assistant',
        description: 'Intelligent chatbot with natural language processing capabilities',
        image: this.generateProjectImage('Python', '#3776ab'),
        technologies: ['Python', 'FastAPI', 'OpenAI', 'React'],
        link: 'https://github.com/YouAreMyHome',
        github: 'https://github.com/YouAreMyHome',
        status: 'In Progress',
        year: '2024',
        stars: 0,
        forks: 0,
        primaryLanguage: 'Python'
      }
    ];
  }

  // Get user stats
  async getUserStats() {
    const cacheKey = `user_stats_${this.username}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const [userResponse, reposResponse] = await Promise.all([
        fetch(`${this.baseUrl}/users/${this.username}`, { headers: this.getHeaders() }),
        fetch(`${this.baseUrl}/users/${this.username}/repos?per_page=100`, { headers: this.getHeaders() })
      ]);

      if (!userResponse.ok || !reposResponse.ok) {
        throw new Error('Failed to fetch user stats');
      }

      const user = await userResponse.json();
      const repos = await reposResponse.json();

      const stats = {
        publicRepos: user.public_repos,
        totalStars: repos.reduce((sum, repo) => sum + repo.stargazers_count, 0),
        totalForks: repos.reduce((sum, repo) => sum + repo.forks_count, 0),
        followers: user.followers,
        following: user.following,
        joinDate: new Date(user.created_at),
        lastActive: new Date(Math.max(...repos.map(repo => new Date(repo.updated_at))))
      };

      this.setCachedData(cacheKey, stats);
      return stats;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      return {
        publicRepos: 0,
        totalStars: 0,
        totalForks: 0,
        followers: 0,
        following: 0,
        joinDate: new Date(),
        lastActive: new Date()
      };
    }
  }
}

export default GitHubService;
