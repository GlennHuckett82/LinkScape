module.exports = async () => {
  const pid = global.__VITE_SERVER_PID__;
  if (pid) {
    try {
      process.kill(pid);
    } catch {}
  }
};
