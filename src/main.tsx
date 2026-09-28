import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
/* Self-hosted @font-face (public/fonts/*.woff2) — index.html-এর Google Fonts
 * <link> সরানোর পরও fonts আসবে, আর render-blocking third-party request থাকবে না।
 * index.css-এর পরে import করা, যাতে local override-গুলো base-এর উপরে বসে। */
import './fonts.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
