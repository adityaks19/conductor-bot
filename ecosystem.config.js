module.exports = {
  apps: [{
    name: "conductor-bot",
    script: "app.js",
    watch: false,
    instances: 1,
    autorestart: true,
    max_memory_restart: "3G",
    min_uptime: "5s",
    max_restarts: 999,
    restart_delay: 1000,
    kill_timeout: 10000,
    listen_timeout: 15000,
    wait_ready: false,
    ignore_watch: ['node_modules', 'logs'],
    env: {
      NODE_ENV: "production",
      NODE_OPTIONS: "--max-old-space-size=2048"
    },
    // Error log file
    error_file: "logs/error.log",
    // Out log file
    out_file: "logs/out.log",
    // Combined log file
    log_file: "logs/combined.log",
    // Time format for logs
    time: true,
    // Merge logs
    merge_logs: true,
    // Log date format
    log_date_format: "YYYY-MM-DD HH:mm:ss Z",
    force: true,
    exp_backoff_restart_delay: 100
  }]
};
