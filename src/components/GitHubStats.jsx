import React from 'react';
import { motion } from 'framer-motion';
import { Star, GitFork, Users, Calendar, Activity, TrendingUp } from 'lucide-react';
import { useGitHubProjects, useGitHubActivity } from '../hooks/useGitHub';

const GitHubStats = ({ username = 'YouAreMyHome' }) => {
  const { stats, loading: statsLoading } = useGitHubProjects(username);
  const { activity, loading: activityLoading } = useGitHubActivity(username);

  if (statsLoading) {
    return (
      <div className="cyber-card p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-700 rounded"></div>
            <div className="h-3 bg-gray-700 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const statItems = [
    {
      icon: Star,
      label: 'Total Stars',
      value: stats.totalStars,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10'
    },
    {
      icon: GitFork,
      label: 'Total Forks',
      value: stats.totalForks,
      color: 'text-cyber-blue',
      bgColor: 'bg-cyber-blue/10'
    },
    {
      icon: Activity,
      label: 'Public Repos',
      value: stats.publicRepos,
      color: 'text-cyber-purple',
      bgColor: 'bg-cyber-purple/10'
    },
    {
      icon: Users,
      label: 'Followers',
      value: stats.followers,
      color: 'text-cyber-pink',
      bgColor: 'bg-cyber-pink/10'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statItems.map((item, index) => (
          <motion.div
            key={item.label}
            className={`cyber-card p-4 ${item.bgColor} border-gray-700`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${item.bgColor}`}>
                <item.icon size={20} className={item.color} />
              </div>
              <div>
                <div className={`text-xl font-bold ${item.color}`}>
                  {item.value.toLocaleString()}
                </div>
                <div className="text-xs text-gray-400 font-mono">
                  {item.label}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Timeline Info */}
      <div className="cyber-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-orbitron font-bold text-white flex items-center gap-2">
            <Calendar className="text-cyber-blue" size={20} />
            GitHub Timeline
          </h3>
          <TrendingUp className="text-green-400" size={16} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Member since:</span>
            <div className="text-white font-mono">
              {stats.joinDate?.toLocaleDateString()}
            </div>
          </div>
          <div>
            <span className="text-gray-400">Last active:</span>
            <div className="text-cyber-blue font-mono">
              {stats.lastActive?.toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      {activity && activity.length > 0 && (
        <div className="cyber-card p-6">
          <h3 className="text-lg font-orbitron font-bold text-white mb-4 flex items-center gap-2">
            <Activity className="text-cyber-purple" size={20} />
            Recent Activity
          </h3>
          
          <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
            {activity.slice(0, 5).map((item, index) => (
              <motion.div
                key={item.id}
                className="flex items-start space-x-3 p-3 bg-gray-800/50 rounded-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-2 h-2 bg-cyber-blue rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-300">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500 font-mono">
                      {item.date.toLocaleDateString()}
                    </span>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-cyber-blue hover:text-white transition-colors"
                    >
                      View →
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {activity.length > 5 && (
            <div className="text-center mt-4">
              <a
                href={`https://github.com/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-cyber-blue hover:text-white transition-colors font-mono"
              >
                View all activity on GitHub →
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GitHubStats;
