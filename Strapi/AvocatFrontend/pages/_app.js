import "@/styles/globals.css";
import Navbar from "@/components/NavBar";

// pages/_app.js
import AuthWrapper from '../components/AuthProvider';

function MyApp({ Component, pageProps }) {
    return (
        <AuthWrapper>

            <Component {...pageProps} />
        </AuthWrapper>
    );
}

export default MyApp;
