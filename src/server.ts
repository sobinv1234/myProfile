import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import * as express from 'express';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { bootstrapApplication } from '@angular/platform-browser';
import { config } from './app/app.config.server';
import { AppComponent } from './app/app';

const browserDistFolder = join(fileURLToPath(new URL('.', import.meta.url)), '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

// Middleware to parse JSON bodies
app.use(express.json());

/**
 * Configure Nodemailer transporter for Gmail.
 * Set environment variables before starting the server:
 * - EMAIL_USER: your Gmail address
 * - EMAIL_PASS: your Gmail app password
 */
let transporter: any = null;
let transporterError: any = null;

async function initializeTransporter() {
  const emailUser = process.env['EMAIL_USER'];
  const emailPass = process.env['EMAIL_PASS'];

  if (!emailUser || !emailPass) {
    console.error(
      'EMAIL_USER and EMAIL_PASS are required to send contact form emails. Set these environment variables before starting the server.',
    );
    transporterError = new Error('Email credentials are missing.');
    return null;
  }

  const mailerModule = await import('nodemailer');
  const nodemailer = (mailerModule as any).default ?? mailerModule;
  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

  try {
    await transport.verify();
    transporterError = null;
    console.log('Nodemailer transporter initialized successfully.');
    return transport;
  } catch (error) {
    transporterError = error;
    console.error(
      'Failed to initialize email transporter. Contact form will be disabled until valid EMAIL_USER/EMAIL_PASS are configured.',
      error,
    );
    return null;
  }
}

async function startServer() {
  transporter = await initializeTransporter();

  const port = process.env['PORT'] || 4000;
  app.listen(port, (error: any) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Contact form endpoint
 */
app.post('/api/contact', async (req: any, res: any) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
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
      from: process.env['EMAIL_USER'] || 'sobinv71@gmail.com',
      to: process.env['EMAIL_TO'] || 'sobinv71@gmail.com',
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

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req: any, res: any, next: any) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
const bootstrap = () => bootstrapApplication(AppComponent, config);

if (isMainModule(import.meta.url)) {
  startServer().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
}

export default bootstrap;

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
