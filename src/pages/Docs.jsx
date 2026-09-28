import { useMemo } from 'react';
import Navbar from '../components/Navbar';

const Docs = () => {

    const requestBody = `{
    "app_id": 123,
    "mail_key": "<mail_key>",
    "to": "john.doe@example.com",
    "template_slug": "verify-user-email",
    "variables": {
        "name": "John Doe",
        "verification_key": "ABC123456"
    }
}`;

    const backendBaseUrl = import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:8080";

    const sections = useMemo(() => [
        {
            title: 'Send Email',
            description: 'Use this endpoint to send an email through your configured template.',
            curl: `curl --location --request POST 'localhost:8080/api/v1/email/send' \\
    --header 'Content-Type: application/json' \\
    --header 'Accept: */*' \\
    --data '${requestBody}'`,
            url: backendBaseUrl + '/api/v1/email/send',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
            },
            body: requestBody,
            validations: [
                'app_id must be a valid integer.',
                'mail_key must be a valid UUID string.',
                'to must be a valid email address.',
                'template_slug is required when sending a template-based email.',
                'variables must be a JSON object when provided.',
            ],
            success: {
                status: 200,
                response: `{
    "message": "Email accepted successfully.",
    "status": "accepted",
    "data": {
        "acknowledgement_id": "<acknowledgement_id>",
    }
}`,
            },
            failure: {
                status: 400,
                message: `{
    "message": "Invalid or expired mail_key provided.",
    "status": "failed",
}
`,
            },
            error: {
                status: 500,
                message: `{
    "message": "Something went wrong.",
    "status": "error",
}`,
            },
        },
    ], []);

    const topics = [
        { id: 'overview', label: 'How it works' },
        { id: 'apps', label: 'Create an App' },
        { id: 'templates', label: 'Create Templates' },
        { id: 'mail-key', label: 'Mail Key' },
        { id: 'setup-SMTP', label: 'SMTP Setup' },
        { id: 'send-email', label: 'Send Email API' },
        { id: 'test-email', label: 'Test Email Delivery' },
        { id: 'email-logs', label: 'Email Delivery Logs' },
    ];

    return (
        <>
            <div className="w-full flex flex-col justify-center items-center">
                <Navbar />
            </div>
            
            <div className="min-h-screen bg-base-200 px-4 py-8 text-base-content">
                <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
                    <aside className="lg:sticky lg:top-6 lg:h-fit">
                        <nav className="rounded-2xl bg-base-100 p-4 shadow-sm" aria-label="Documentation topics">
                            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-base-content/50">On this page</p>
                            <ul className="space-y-1">
                                {topics.map((topic) => (
                                    <li key={topic.id}>
                                        <a className="btn btn-ghost btn-sm w-full justify-start" href={`#${topic.id}`}>
                                            {topic.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </aside>

                    <main className="flex min-w-0 flex-col gap-6">
                        <section id="overview" className="scroll-mt-6 rounded-2xl bg-base-100 p-6 shadow-sm">
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Documentation</p>
                            <h1 className="mt-2 text-3xl font-bold">Email API Integration Guide</h1>
                            <p className="mt-2 max-w-3xl text-sm text-base-content/70">
                                Create an app, build reusable templates, send messages from your application, and inspect delivery results from one workflow.
                            </p>
                        </section>

                        <section className="card bg-base-100 shadow-sm" aria-labelledby="how-it-works-title">
                            <div className="card-body gap-4">
                                <h2 id="how-it-works-title" className="card-title">How it works</h2>
                                <ul className="list-disc space-y-2 pl-6 text-sm text-base-content/70">
                                    <li>Sign in to obtain the bearer token used by the dashboard and API requests.</li>
                                    <li>Create an app and use its numeric <code>app_id</code> to scope templates and email requests.</li>
                                    <li>Generate an active mail key for the app and keep it on your server, never in browser code.</li>
                                    <li>Create a template with a unique slug, then send it with recipient data in <code>variables</code>.</li>
                                    <li>Use the test endpoint for a direct subject and body while you are checking delivery.</li>
                                </ul>
                            </div>
                        </section>

                        <section id="apps" className="card scroll-mt-6 bg-base-100 shadow-sm">
                            <div className="card-body gap-4">
                                <h2 className="card-title">1. Create and manage an App</h2>
                                <p className="text-sm text-base-content/70">An app is the container for your mail key, SMTP configuration, templates, and email history.</p>
                                <ol className="list-decimal space-y-2 pl-6 text-sm text-base-content/70">
                                    <li>Open the dashboard and choose <strong>Create App</strong>.</li>
                                    <li>Enter an app name and a description, then submit the form.</li>
                                    <li>Open the new app to configure SMTP settings and manage its templates.</li>
                                    <li>Delete an app only when its templates and delivery history are no longer needed.</li>
                                </ol>
                            </div>
                        </section>

                        <section id="templates" className="card scroll-mt-6 bg-base-100 shadow-sm">
                            <div className="card-body gap-4">
                                <h2 className="card-title">2. Create and manage Templates</h2>
                                <p className="text-sm text-base-content/70">Templates belong to one app. Their slug is the stable identifier you pass when sending an email.</p>
                                <ol className="list-decimal space-y-2 pl-6 text-sm text-base-content/70">
                                    <li>Open an app and select <strong>Create Template</strong>.</li>
                                    <li>Enter a name, a lowercase slug using letters, numbers, and hyphens, and a subject.</li>
                                    <li>Choose <code>html</code> or <code>text</code> content, then save the template.</li>
                                    <li>Open the template to update its name, slug, subject, status, and content.</li>
                                    <li>Disable a template when it should no longer accept sends; delete it only when it is no longer required.</li>
                                </ol>
                            </div>
                        </section>

                        <section id="mail-key" className="card scroll-mt-6 bg-base-100 shadow-sm">
                            <div className="card-body gap-4">
                                <h2 className="card-title">3. Generate or refresh your mail key</h2>
                                <ol className="list-decimal space-y-2 pl-6 text-sm text-base-content/70">
                                    <li>Open your app settings in the dashboard.</li>
                                    <li>Navigate to the email configuration section.</li>
                                    <li>Click Generate Mail Key or Refresh Mail Key to issue a new key.</li>
                                    <li>Copy the new mail key immediately and store it in your server environment.</li>
                                    <li>Update your request payloads. Refreshing invalidates the previous key.</li>
                                </ol>
                            </div>
                        </section>

                        <section id="setup-SMTP" className="card scroll-mt-6 bg-base-100 shadow-sm">
                            <div className="card-body gap-4">
                                <h2 className="card-title">3. Setup your Gmail SMTP Account</h2>
                                <h3 className="card-title">Step 1: Enable 2-Step Verification</h3>
                                <ol className="list-decimal space-y-2 pl-6 text-sm text-base-content/70">
                                    <li>Sign in to your Google Account..</li>
                                    <li>Open Security settings.</li>
                                    <li>Under How you sign in to Google, select 2-Step Verification.</li>
                                    <li>Follow the instructions to enable 2-Step Verification for your account.</li>
                                </ol>
                                <h3 className="card-title">Step 2: Create a Gmail App Password</h3>
                                <ol className="list-decimal space-y-2 pl-6 text-sm text-base-content/70">
                                    <li>After enabling 2-Step Verification, open your Google Account's App Passwords page.</li>
                                    <li>Sign in again if prompted.</li>
                                    <li>Enter a name such as ProMail SMTP.</li>
                                    <li>Click Create.</li>
                                    <li>Google will generate a 16-character App Password.</li>
                                    <li>Copy the App Password and store it securely in your server environment.</li>
                                </ol>
                                <h3 className="card-title">Step 3: Configure SMTP</h3>
                                <ol className="list-decimal space-y-2 pl-6 text-sm text-base-content/70">
                                    <li>Use the following Gmail SMTP settings:</li>
                                    <li>SMTP_HOST=smtp.gmail.com</li>
                                    <li>SMTP_PORT=587</li>
                                    <li>SMTP_USERNAME=your-email@gmail.com</li>
                                    <li>SMTP_PASSWORD=your-16-character-app-password</li>
                                    <li>Use TLS/STARTTLS with port 587.</li>
                                </ol>
                                <h3 className="card-title">Step 4: Add the Credentials to ProMail</h3>
                                <ol className="list-decimal space-y-2 pl-6 text-sm text-base-content/70">
                                    <li>Add the SMTP credentials to your ProMail App Configrations and save it.</li>
                                    <li>Your application can now use Gmail's SMTP server to send emails.</li>
                                </ol>
                            </div>
                        </section>

                        {sections.map((section) => (
                            <section id="send-email" key={section.title} className="card scroll-mt-6 bg-base-100 shadow-sm">
                                <div className="card-body gap-5">
                                    <div>
                                        <h2 className="card-title text-primary">4. {section.title}</h2>
                                        <p className="text-sm text-base-content/70">{section.description}</p>
                                    </div>

                                    <div className="grid gap-4 lg:grid-cols-2">
                                        <div className="rounded-box bg-base-200 p-4">
                                            <h3 className="mb-2 font-semibold">Request</h3>

                                            <h3 className="mb-2 font-semibold">URL - {section.url}</h3>
                                            <h3 className="mb-2 font-semibold">Headers</h3>
                                            <pre className="overflow-x-auto whitespace-pre-wrap text-xs leading-6">{JSON.stringify(section.headers, null, 2)}</pre>
                                        </div>
                                        <div className="rounded-box bg-base-200 p-4">
                                            <h3 className="mb-2 font-semibold">Body</h3>
                                            <pre className="overflow-x-auto whitespace-pre-wrap text-xs leading-6">{section.body}</pre>
                                        </div>
                                    </div>
                                    <div className="rounded-box bg-base-200 p-4">
                                        <h3 className="mb-2 font-semibold">cURL</h3>
                                        <pre className="overflow-x-auto whitespace-pre-wrap text-xs leading-6">{section.curl}</pre>
                                    </div>

                                    <div className="rounded-box border border-base-300 p-4">
                                        <h3 className="mb-2 font-semibold">Validations</h3>
                                        <ul className="list-disc space-y-1 pl-6 text-sm text-base-content/70">
                                            {section.validations.map((validation) => (
                                                <li key={validation}>{validation}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="flex flex-col gap-4">
                                        <div className="rounded-box border border-success/30 bg-success/10 p-4">
                                            <h3 className="font-semibold text-success">Success</h3>
                                            <p className="mt-2 text-sm">Status: {section.success.status}</p>
                                            <p className="mt-2 text-sm">Response:</p>
                                            <pre className="mt-2 overflow-x-auto whitespace-pre-wrap text-xs leading-6">{section.success.response}</pre>
                                        </div>
                                        <div className="rounded-box border border-warning/30 bg-warning/10 p-4">
                                            <h3 className="font-semibold text-warning">Failure</h3>
                                            <p className="mt-2 text-sm">Status: {section.failure.status}</p>
                                            <pre className="mt-2 overflow-x-auto whitespace-pre-wrap text-xs leading-6">{section.failure.message}</pre>
                                        </div>
                                        <div className="rounded-box border border-error/30 bg-error/10 p-4">
                                            <h3 className="font-semibold text-error">Error</h3>
                                            <p className="mt-2 text-sm">Status: {section.error.status}</p>
                                            <pre className="mt-2 overflow-x-auto whitespace-pre-wrap text-xs leading-6">{section.error.message}</pre>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        ))}

                        <section id="test-email" className="card scroll-mt-6 bg-base-100 shadow-sm">
                            <div className="card-body gap-4">
                                <h2 className="card-title">5. Test Email Delivery</h2>
                                <p className="text-sm text-base-content/70">Send a one-off message from the app page to verify the app configuration and recipient delivery.</p>
                                <ol className="list-decimal space-y-2 pl-6 text-sm text-base-content/70">
                                    <li>Open the app you want to test from the dashboard.</li>
                                    <li>Click <strong>Test Email</strong> at the top of the app page.</li>
                                    <li>Enter the recipient email address in the <strong>Email</strong> field.</li>
                                    <li>Enter a subject and message body.</li>
                                    <li>Click <strong>Send</strong>. The app uses its mail key automatically for the test request.</li>
                                    <li>Open <strong>Email Logs</strong> to confirm the status or inspect any error message.</li>
                                </ol>
                            </div>
                        </section>

                        <section id="email-logs" className="card scroll-mt-6 bg-base-100 shadow-sm">
                            <div className="card-body gap-4">
                                <h2 className="card-title">6. Check Email Delivery Logs</h2>
                                <p className="text-sm text-base-content/70">Use the Email Logs page to confirm delivery, investigate failures, and open the full record for a message.</p>
                                <ol className="list-decimal space-y-2 pl-6 text-sm text-base-content/70">
                                    <li>Open <strong>Email Logs</strong> from the navigation.</li>
                                    <li>Filter by recipient email, app, template, start date, or end date.</li>
                                    <li>Click <strong>Search</strong> to apply filters, or <strong>Reset</strong> to clear them.</li>
                                    <li>Read the status, error message, sent time, and creation time in the results table.</li>
                                    <li>Open a log UUID to inspect the complete request and delivery details.</li>
                                </ol>
                            </div>
                        </section>
                    </main>
                </div>
            </div>
        </>
    );
};

export default Docs;