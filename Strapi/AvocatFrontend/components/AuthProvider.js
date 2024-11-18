// components/AuthProvider.js
import { AuthProvider } from '../context/AuthContext';

const AuthWrapper = ({ children }) => (
    <AuthProvider>{children}</AuthProvider>
);

export default AuthWrapper;
