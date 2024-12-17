import './globals.css';

declare global {
    interface Window {
        NL_CONNECTTOKEN: string;
    }
}

import { app, events, init, window as neuWindow } from '@neutralinojs/lib';

import App from './App';
import ReactDOM from 'react-dom/client';
import ModalProvider from './components/modal/ModalProvider';

if (import.meta.env.DEV) {

    try {
        // @ts-ignore: Cannot find module
        const authInfo = await import('../../.tmp/auth_info.json');
        const { nlToken, nlPort } = authInfo;
        window.NL_PORT = nlPort;
        window.NL_TOKEN = nlToken;
        window.NL_CONNECTTOKEN = nlToken;
        window.NL_ARGS = [
            'bin\\neutralino-win_x64.exe',
            '',
            '--load-dir-res',
            '--path=.',
            '--export-auth-info',
            '--neu-dev-extension',
            '--neu-dev-auto-reload',
            '--window-enable-inspector',
        ];

    } catch {
        console.error(
            'Auth file not found, native API calls will not work.'
        );
    }

}

init();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <ModalProvider>
        <App />
    </ModalProvider>
);

function onWindowClose() {
    app.exit();
}

events.on('windowClose', onWindowClose);

neuWindow.focus();
