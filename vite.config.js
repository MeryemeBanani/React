import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // 👇 Serve se usi routing o hai problemi al refresh
    historyApiFallback: true
  }
});

