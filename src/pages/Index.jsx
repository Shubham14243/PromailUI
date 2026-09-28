import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const Index = () => (
    <main>
        <div className="w-full flex flex-col justify-center items-center">
            <Navbar />

            <section className="container">
                <div className="hero bg-base-200 min-h-[70vh]">
                    <div className="hero-content flex-col lg:flex-row-reverse">
                        <img
                            alt="Tailwind CSS hero component"
                            src="https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp"
                            className="w-full max-w-sm rounded-lg shadow-2xl"
                        />
                        <div>
                            <div className="mb-4">
                                <div className="inline-grid *:[grid-area:1/1]">
                                    <div className="status status-success animate-ping"></div>
                                    <div className="status status-success"></div>
                                </div> Free. No domain required.
                            </div>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">Send email through the SMTP you already have.</h1>
                            <p className="py-6">
                                Connect any SMTP account, point one API endpoint at it, and ProMail handles templates, delivery, and tracking. No domain to verify, no plan to pick, nothing to pay.
                            </p>
                            <div className="flex flex-row flex-wrap gap-3">
                                <button className="btn btn-primary">Connect your SMTP</button>
                                <button className="btn btn-ghost">View Docs</button>
                            </div>
                            <div className="flex flex-row flex-wrap gap-3">
                                <div className="p-3 sm:p-5">
                                    <h2 className="text-2xl sm:text-3xl font-bold">$0</h2>
                                    <h4>per month</h4>
                                </div>
                                <div className="p-3 sm:p-5">
                                    <h2 className="text-2xl sm:text-3xl font-bold">0</h2>
                                    <h4>domains required</h4>
                                </div>
                                <div className="p-3 sm:p-5">
                                    <h2 className="text-2xl sm:text-3xl font-bold">Many</h2>
                                    <h4>SMTP configs at once</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="container flex flex-col justify-center items-center p-4 sm:p-6 lg:p-10 bg-neutral" id="features">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl mb-10 text-center lg:text-left">Everything a transactional email needs, none of the setup.</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-0 sm:px-6 lg:px-10 gap-4 pb-5">
                    <div className="card col-span-1 bg-base-100 card-xl shadow-sm">
                        <div className="card-body">
                            <span className="text-3xl"><i className="bi bi-lightning-charge-fill" /></span>
                            <h2 className="card-title">One endpoint, any app</h2>
                            <p>Trigger a send with a single API call from any language. No domain to verify, no SDK to install, no dashboard clicking required.</p>
                        </div>
                    </div>
                    <div className="card col-span-1 bg-base-100 card-xl shadow-sm">
                        <div className="card-body">
                            <span className="text-3xl"><i className="bi bi-plug-fill" /></span>
                            <h2 className="card-title">Bring your own SMTP</h2>
                            <p>Connect Gmail, Zoho, or any provider you already use. It's your address and your sending reputation, not ours.</p>
                        </div>
                    </div>
                    <div className="card col-span-1 bg-base-100 card-xl shadow-sm">
                        <div className="card-body">
                            <span className="text-3xl"><i className="bi bi-hdd-network-fill" /></span>
                            <h2 className="card-title">Run several configs at once</h2>
                            <p>Keep separate SMTP accounts for different apps, environments, or clients, and pick one per request.</p>
                        </div>
                    </div>
                    <div className="card col-span-1 bg-base-100 card-xl shadow-sm">
                        <div className="card-body">
                            <span className="text-3xl"><i className="bi bi-braces" /></span>
                            <h2 className="card-title">Templates with real variables</h2>
                            <p>Write an email once, then drop in <code>{`{{name}}`}</code>, <code>{`{{amount}}`}</code>, or anything else at send time.</p>
                        </div>
                    </div>
                    <div className="card col-span-1 bg-base-100 card-xl shadow-sm">
                        <div className="card-body">
                            <span className="text-3xl"><i className="bi bi-list-check" /></span>
                            <h2 className="card-title">Every send, logged</h2>
                            <p>See exactly what was sent, when, and what happened to it — debugging a missing email takes a minute, not an afternoon.</p>
                        </div>
                    </div>
                    <div className="card col-span-1 bg-base-100 card-xl shadow-sm">
                        <div className="card-body">
                            <span className="text-3xl"><i className="bi bi-cursor-fill" /></span>
                            <h2 className="card-title">Open and click tracking</h2>
                            <p>Know when an email is opened or a link inside it is clicked, without writing any tracking code yourself.</p>
                        </div>
                    </div>
                </div>
                <Link to="/docs" className="btn btn-primary">View Docs</Link>
            </section>

            <section className="container flex flex-col justify-center items-center p-4 sm:p-6 lg:p-10 bg-base-100 mt-5" id="workflow">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl mb-10 text-center lg:text-left">From your app <i>to their inbox.</i></h2>
                <div className="px-0 sm:px-6 lg:px-10 gap-4 pb-5">
                    <ul className="steps steps-vertical lg:steps-horizontal">
                        <li className="step step-primary">
                            Create an app
                            <p>Create an instance for you application.</p>
                        </li>
                        <li className="step step-primary">
                            Connect your SMTP
                            <p>Add the credentials once — Gmail, Zoho, or your own mail server.</p>
                        </li>
                        <li className="step step-primary">
                            Build a template
                            <p>Write the email, mark what changes with variables, save it.</p>
                        </li>
                        <li className="step step-primary">
                            Call the endpoint
                            <p>POST the recipient and variables from your app. That's the integration.</p>
                        </li>
                        <li className="step step-primary">
                            Watch it land
                            <p>Follow delivery, opens, and clicks — or pull it straight from the logs.</p>
                        </li>
                    </ul>
                </div>
            </section>

            <section className="container" id="pricing">
                <div className="hero bg-base-200 min-h-[45vh]">
                    <div className="hero-content flex-col lg:flex-row-reverse">
                        <div className="text-center lg:text-left">
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">Free, and not just to start.</h1>
                            <p className="py-6">
                                No plans, no send limits set by us, no credit card. Connect your own SMTP and ProMail runs for as long as you use it. The only limits are the ones your SMTP provider sets.
                            </p>
                            <Link to="/signup" className="btn btn-primary">Connect your SMTP</Link>
                        </div>
                        <div className="card w-full max-w-sm shrink-0 items-center lg:items-start">
                            <span className="text-7xl sm:text-8xl lg:text-9xl">$0</span>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="footer container sm:footer-horizontal bg-neutral text-neutral-content items-center p-4">
                <aside className="grid-flow-col items-center gap-4">
                    <span className="text-xl font-bold"><i className="bi bi-envelope-paper-fill" /> ProMail</span>
                    <p>Copyright © {new Date().getFullYear()} - All right reserved</p>
                </aside>
                <nav className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
                    <Link to="" className="text-xl"><i className="bi bi-github" /></Link>
                    <Link to="" className="text-xl"><i className="bi bi-linkedin" /></Link>
                </nav>
            </footer>
        </div>
    </main>
);

export default Index;