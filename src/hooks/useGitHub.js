import { useState, useEffect } from 'react';
import GitHubService from '../services/GitHubService';

// Custom hook for GitHub data
export const useGitHubProjects = (username = 'YouAreMyHome', limit = 8) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const gitHubService = new GitHubService(username);
        
        // Fetch projects and stats with better error handling
        try {
          const [projectsData, statsData] = await Promise.allSettled([
            gitHubService.getFeaturedProjects(limit),
            gitHubService.getUserStats()
          ]);

          // Handle projects result
          if (projectsData.status === 'fulfilled') {
            setProjects(projectsData.value);
          } else {
            console.warn('Failed to fetch projects:', projectsData.reason);
            setProjects([]); // Use empty array as fallback
          }

          // Handle stats result
          if (statsData.status === 'fulfilled') {
            setStats(statsData.value);
          } else {
            console.warn('Failed to fetch stats:', statsData.reason);
            setStats(null); // Use null as fallback
          }
          
        } catch (err) {
          console.error('Error fetching GitHub data:', err);
          setError(err.message);
          
          // Use fallback data
          setProjects([]);
          setStats(null);
        } finally {
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching GitHub data:', err);
        setError(err.message);
        
        // Use fallback data
        const gitHubService = new GitHubService(username);
        setProjects(gitHubService.getFallbackProjects());
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [username, limit]);

  const refetch = async () => {
    const gitHubService = new GitHubService(username);
    gitHubService.cache.clear(); // Clear cache
    
    try {
      setLoading(true);
      const projectsData = await gitHubService.getFeaturedProjects(limit);
      const statsData = await gitHubService.getUserStats();
      setProjects(projectsData);
      setStats(statsData);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    projects,
    stats,
    loading,
    error,
    refetch
  };
};

// Hook for single repository data
export const useGitHubRepo = (repoName) => {
  const [repo, setRepo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRepo = async () => {
      if (!repoName) return;

      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`https://api.github.com/repos/YouAreMyHome/${repoName}`);
        
        if (!response.ok) {
          throw new Error(`Repository not found: ${repoName}`);
        }

        const repoData = await response.json();
        const gitHubService = new GitHubService();
        const project = await gitHubService.transformRepoToProject(repoData);
        
        setRepo(project);
      } catch (err) {
        console.error('Error fetching repository:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRepo();
  }, [repoName]);

  return { repo, loading, error };
};

// Hook for GitHub activity/contribution data
export const useGitHubActivity = (username = 'YouAreMyHome') => {
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch recent events (commits, PRs, issues, etc.)
        const response = await fetch(
          `https://api.github.com/users/${username}/events/public?per_page=30`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch activity');
        }

        const events = await response.json();
        
        // Process and categorize events
        const processedActivity = events
          .filter(event => ['PushEvent', 'CreateEvent', 'PullRequestEvent', 'IssuesEvent'].includes(event.type))
          .map(event => ({
            id: event.id,
            type: event.type,
            repo: event.repo.name,
            date: new Date(event.created_at),
            description: getEventDescription(event),
            url: `https://github.com/${event.repo.name}`
          }))
          .slice(0, 10); // Limit to 10 recent activities

        setActivity(processedActivity);
      } catch (err) {
        console.error('Error fetching GitHub activity:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [username]);

  return { activity, loading, error };
};

// Helper function to get event description
const getEventDescription = (event) => {
  switch (event.type) {
    case 'PushEvent':
      const commits = event.payload.commits?.length || 0;
      return `Pushed ${commits} commit${commits !== 1 ? 's' : ''} to ${event.repo.name}`;
    case 'CreateEvent':
      return `Created ${event.payload.ref_type} in ${event.repo.name}`;
    case 'PullRequestEvent':
      return `${event.payload.action} pull request in ${event.repo.name}`;
    case 'IssuesEvent':
      return `${event.payload.action} issue in ${event.repo.name}`;
    default:
      return `Activity in ${event.repo.name}`;
  }
};

export default useGitHubProjects;
