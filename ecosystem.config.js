module.exports = {
  apps: [
    {
      name: "wesy_api",
      script: "build/server.js",
      instances: 4,
      exec_mode: "cluster",
      watch: false
    }
  ]
};
