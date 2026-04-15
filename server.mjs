import express from 'express';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function loadEnvFile() {
  const envPath = join(__dirname, '.env');
  if (!existsSync(envPath)) return;

  const envFile = readFileSync(envPath, 'utf8');
  envFile.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;

    const [key, ...valueParts] = trimmed.split('=');
    const value = valueParts.join('=').trim();
    if (key && !(key in process.env)) {
      process.env[key] = value;
    }
  });
}

loadEnvFile();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const browserDistFolder = join(__dirname, 'dist', 'portfolio', 'browser');
const hasBrowserDist = existsSync(browserDistFolder);
if (hasBrowserDist) {
  app.use(express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }));
} else {
  console.warn(`Warning: browser build folder not found at ${browserDistFolder}. Static files will not be served.`);
}

let transporter = null;
let transporterError = null;

async function initializeTransporter() {
  const emailUser = process.env['EMAIL_USER'];
  const emailPass = process.env['EMAIL_PASS'];
  const clientId = process.env['GMAIL_CLIENT_ID'];
  const clientSecret = process.env['GMAIL_CLIENT_SECRET'];
  const refreshToken = process.env['GMAIL_REFRESH_TOKEN'];
  const accessToken = process.env['GMAIL_ACCESS_TOKEN'];

  if (!emailUser) {
    console.error(
      'EMAIL_USER is required to send contact form emails. Set this environment variable before starting the server.',
    );
    transporterError = new Error('Email sender is missing.');
    return null;
  }

  const mailerModule = await import('nodemailer');
  const nodemailer = mailerModule.default ?? mailerModule;

  let authOptions;
  if (clientId && clientSecret && refreshToken) {
    authOptions = {
      type: 'OAuth2',
      user: emailUser,
      clientId,
      clientSecret,
      refreshToken,
      accessToken,
    };
  } else if (emailPass) {
    authOptions = {
      user: emailUser,
      pass: emailPass,
    };
  } else {
    console.error(
      'Email authentication is not configured. Set either Gmail OAuth2 variables or EMAIL_PASS for app password.',
    );
    transporterError = new Error('Email authentication is not configured.');
    return null;
  }

  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: authOptions,
  });

  try {
    await transport.verify();
    transporterError = null;
    console.log('Nodemailer transporter initialized successfully.');
    return transport;
  } catch (error) {
    transporterError = error;
    console.error(
      'Failed to initialize email transporter. Contact form will be disabled until valid authentication is configured.',
      error,
    );
    return null;
  }
}

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    if (!transporter) {
      transporter = await initializeTransporter();
    }

    if (!transporter) {
      const authError = transporterError && transporterError.code === 'EAUTH';
      return res.status(500).json({
        success: false,
        error: transporterError?.message
          ? transporterError.message
          : authError
            ? 'Email authentication failed. Verify EMAIL_USER and EMAIL_PASS.'
            : 'Email service is not configured. Please set EMAIL_USER and EMAIL_PASS.',
      });
    }

    const mailOptions = {
      from: process.env['EMAIL_USER'] || process.env['EMAIL_TO'] || 'sobinv71@gmail.com',
      to: process.env['EMAIL_TO'] || process.env['EMAIL_USER'] || 'sobinv71@gmail.com',
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><small>This email was sent from your portfolio contact form.</small></p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: 'Email sent successfully!',
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send email. Please try again later.',
    });
  }
});

app.get(/.*/, (req, res) => {
  if (hasBrowserDist) {
    res.sendFile(join(browserDistFolder, 'index.html'));
  } else {
    res.status(404).send('Not Found');
  }
});

function listenOnPort(port, maxRetries = 5) {
  return new Promise((resolve, reject) => {
    const server = app.listen(port);

    server.on('listening', () => {
      console.log(`Node Express server listening on http://localhost:${port}`);
      resolve(server);
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE' && maxRetries > 0) {
        const nextPort = port + 1;
        console.warn(`Port ${port} is already in use. Trying port ${nextPort}...`);
        resolve(listenOnPort(nextPort, maxRetries - 1));
        return;
      }
      reject(error);
    });
  });
}

async function startServer() {
  transporter = await initializeTransporter();

  const basePort = Number(process.env['PORT'] || 4000);
  await listenOnPort(basePort);
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
