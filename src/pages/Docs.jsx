import { useMemo } from 'react';
import Navbar from '../components/Navbar';

const requestBody = `{
  "app_id": 1,
  "mail_key": "bb899da6-33a4-4492-a4af-d9a2201823ec",
  "to": "srshristirajput999@gmail.com",
  "template_slug": "verify-email-user",
  "variables": {
    "name": "ABCD XYZ",
    "otp": "123456"
  }
}`;

const testRequestBody = `{
  "app_id": 1,
  "mail_key": "bb899da6-33a4-4492-a4af-d9a2201823ec",
  "to": "srshristirajput999@gmail.com",
  "subject": "Test Email",
  "body": "<h3>This</h3> is test body.\n\nJust checking!!!"
}`;

const Docs = () => {
    const sections = useMemo(() => [
        {
            title: 'Send email',
            description: 'Use this endpoint to send an email through your configured template.',
            curl: `curl --location --request POST 'localhost:8080/api/v1/email/send' \\
  --header 'Authorization: Bearer <token>' \\
  --header 'Content-Type: application/json' \\
  --data '${requestBody}'`,
            postman: `POST localhost:8080/api/v1/email/send
Authorization: Bearer <token>
Content-Type: application/json`,
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
                message: 'Email queued or sent successfully.',
            },
            failure: {
                status: 400,
                message: 'Invalid request payload or missing required fields.',
            },
            error: {
                status: 500,
                message: 'Server error while processing the email request.',
            },
        },
        {
            title: 'Test email',
            description: 'Send a quick plain test email without using a template.',
            curl: `curl --location --request POST 'localhost:8080/api/v1/email/send/test' \\
  --header 'Authorization: Bearer <token>' \\
  --header 'Content-Type: application/json' \\
  --data '${testRequestBody}'`,
            postman: `POST localhost:8080/api/v1/email/send/test
Authorization: Bearer <token>
Content-Type: application/json`,
            body: testRequestBody,
            validations: [
                'app_id must be a valid integer.',
                'mail_key must be a valid UUID string.',
                'to must be a valid email address.',
                'subject is required for test emails.',
                'body is required and should be a non-empty string.',
            ],
            success: {
                status: 200,
                message: 'Test email delivered successfully.',
            },
            failure: {
                status: 400,
                message: 'Invalid body, subject, or recipient.',
            },
            error: {
                status: 500,
                message: 'Unexpected server error while sending the test email.',
            },
        },
    ], []);

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-base-200 px-4 py-8 text-base-content">
                <div className="mx-auto flex max-w-6xl flex-col gap-6">
                    <div className="rounded-2xl bg-base-100 p-6 shadow-sm">
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Documentation</p>
                        <h1 className="mt-2 text-3xl font-bold">Email API integration guide</h1>
                        <p className="mt-2 max-w-3xl text-sm text-base-content/70">
                            Use the endpoints below to integrate your application with the email service, send templated messages, and test delivery quickly.
                        </p>
                    </div>

                    <div className="card bg-base-100 shadow-sm">
                        <div className="card-body gap-4">
                            <h2 className="card-title">How it works</h2>
                            <ul className="list-disc space-y-2 pl-6 text-sm text-base-content/70">
                                <li>Authenticate your request with a bearer token from the auth service.</li>
                                <li>Pass your app identifier and an active mail key for the app.</li>
                                <li>Use a valid recipient email and template variables when sending templated emails.</li>
                                <li>Use the test endpoint for quick delivery checks during development.</li>
                            </ul>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow-sm">
                        <div className="card-body gap-4">
                            <h2 className="card-title">Generate or refresh your mail key</h2>
                            <ol className="list-decimal space-y-2 pl-6 text-sm text-base-content/70">
                                <li>Open your app settings in the dashboard.</li>
                                <li>Navigate to the email configuration section.</li>
                                <li>Click Generate Mail Key or Refresh Mail Key to issue a new key.</li>
                                <li>Copy the new mail key immediately and update it in your environment or request payload.</li>
                                <li>Use the new mail key for all future requests; the previous key will stop working after refresh.</li>
                            </ol>
                        </div>
                    </div>

                    {sections.map((section) => (
                        <div key={section.title} className="card bg-base-100 shadow-sm">
                            <div className="card-body gap-5">
                                <div>
                                    <h2 className="card-title">{section.title}</h2>
                                    <p className="text-sm text-base-content/70">{section.description}</p>
                                </div>

                                <div className="grid gap-4 lg:grid-cols-2">
                                    <div className="rounded-box bg-base-200 p-4">
                                        <h3 className="mb-2 font-semibold">cURL</h3>
                                        <pre className="overflow-x-auto whitespace-pre-wrap text-xs leading-6">{section.curl}</pre>
                                    </div>
                                    <div className="rounded-box bg-base-200 p-4">
                                        <h3 className="mb-2 font-semibold">Postman</h3>
                                        <pre className="overflow-x-auto whitespace-pre-wrap text-xs leading-6">{section.postman}</pre>
                                    </div>
                                </div>

                                <div className="rounded-box border border-base-300 p-4">
                                    <h3 className="mb-2 font-semibold">Request body structure</h3>
                                    <pre className="overflow-x-auto whitespace-pre-wrap text-xs leading-6">{section.body}</pre>
                                </div>

                                <div className="rounded-box border border-base-300 p-4">
                                    <h3 className="mb-2 font-semibold">Validations</h3>
                                    <ul className="list-disc space-y-1 pl-6 text-sm text-base-content/70">
                                        {section.validations.map((validation) => (
                                            <li key={validation}>{validation}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="grid gap-4 md:grid-cols-3">
                                    <div className="rounded-box border border-success/30 bg-success/10 p-4">
                                        <h3 className="font-semibold text-success">Success</h3>
                                        <p className="mt-2 text-sm">Status: {section.success.status}</p>
                                        <p className="text-sm text-base-content/70">{section.success.message}</p>
                                    </div>
                                    <div className="rounded-box border border-warning/30 bg-warning/10 p-4">
                                        <h3 className="font-semibold text-warning">Failure</h3>
                                        <p className="mt-2 text-sm">Status: {section.failure.status}</p>
                                        <p className="text-sm text-base-content/70">{section.failure.message}</p>
                                    </div>
                                    <div className="rounded-box border border-error/30 bg-error/10 p-4">
                                        <h3 className="font-semibold text-error">Error</h3>
                                        <p className="mt-2 text-sm">Status: {section.error.status}</p>
                                        <p className="text-sm text-base-content/70">{section.error.message}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Docs;