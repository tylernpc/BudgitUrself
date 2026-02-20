import {auth0} from "@/lib/auth/auth0";

export default async function BudgetsPage() {
    const session = await auth0.getSession();

    return (
        <div className="app-container">
            <div className="main-card-wrapper">
                <p>Logged in as {session?.user.email}</p>

                {/* Display user info (name, email, etc.) */}
                <h1>User Profile</h1>
                <pre>{JSON.stringify(session?.user, null, 2)}</pre>

                {/* Ends the session and redirects to Auth0 to log out */}
                <a href="/auth/logout">Logout</a>
                <h1 className="main-title">Next.js + Auth0</h1>

                <div className="action-card">
                    {(
                        <div className="logged-in-section">
                            <p className="logged-in-message">✅ Successfully logged in!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
