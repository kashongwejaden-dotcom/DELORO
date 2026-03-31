import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '', mfaToken: '' });
    const [error, setError] = useState('');
    const [mfaRequired, setMfaRequired] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await login(formData.email, formData.password, formData.mfaToken);
            if (response.user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (err) {
            if (err.response && err.response.data.mfaRequired) {
                setMfaRequired(true);
                setError('Please enter your MFA code.');
            } else {
                setError(err.response?.data?.error || 'Login failed');
            }
        }
    };

    return (
        <div className="page-auth">
            <div className="auth-box">
                <h2>Connexion</h2>
                {error && <div className="auth-error">{error}</div>}
                
                <form onSubmit={handleSubmit} className="auth-form">
                    {!mfaRequired && (
                        <>
                            <div className="input-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="jean@johndoe.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label>Mot de passe</label>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </>
                    )}

                    {mfaRequired && (
                        <div className="input-group">
                            <label>Code de vérification MFA (6 chiffres)</label>
                            <input
                                type="text"
                                name="mfaToken"
                                placeholder="123456"
                                value={formData.mfaToken}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    )}

                    <button type="submit" className="btn-primary auth-submit">
                        {mfaRequired ? 'Vérifier' : 'Se connecter'}
                    </button>
                </form>

                <p className="auth-footer">
                    Vous n'avez pas de compte ? <Link to="/register">S'inscrire</Link>
                </p>
            </div>

            <style>{`
                .page-auth {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 80px 20px 40px;
                    background: var(--bg-dark);
                }

                .auth-box {
                    width: 100%;
                    max-width: 420px;
                    background: rgba(15, 15, 15, 0.7);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 12px;
                    padding: 3rem 2.5rem;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
                    backdrop-filter: blur(10px);
                }

                .auth-box h2 {
                    font-family: var(--font-serif);
                    font-size: 2.2rem;
                    color: var(--text-light);
                    margin-bottom: 2rem;
                    text-align: center;
                    letter-spacing: 0.05em;
                }

                .auth-error {
                    background: rgba(252, 129, 129, 0.1);
                    color: #fc8181;
                    padding: 1rem;
                    border-radius: 4px;
                    border: 1px solid rgba(252, 129, 129, 0.3);
                    margin-bottom: 1.5rem;
                    font-size: 0.9rem;
                    text-align: center;
                }

                .auth-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .input-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .input-group label {
                    font-size: 0.8rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    color: var(--text-muted);
                }

                .auth-form input {
                    width: 100%;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 1rem;
                    color: var(--text-light); /* Enforce white text color explicitly */
                    font-size: 1rem;
                    border-radius: 4px;
                    transition: border-color var(--transition-fast), background var(--transition-fast);
                    -webkit-appearance: none; /* Prevent iOS default styling overrides */
                }

                .auth-form input:focus {
                    outline: none;
                    border-color: var(--accent-gold);
                    background: rgba(255, 255, 255, 0.06);
                }

                .auth-form input::placeholder {
                    color: rgba(255, 255, 255, 0.2);
                }

                .auth-submit {
                    margin-top: 1rem;
                    width: 100%;
                    padding: 1.1rem;
                }

                .auth-footer {
                    margin-top: 2.5rem;
                    text-align: center;
                    color: var(--text-muted);
                    font-size: 0.9rem;
                }

                .auth-footer a {
                    color: var(--accent-gold);
                    margin-left: 0.5rem;
                    text-decoration: underline;
                }

                @media (max-width: 480px) {
                    .auth-box {
                        padding: 2.5rem 1.5rem;
                        border: none;
                        background: transparent;
                        box-shadow: none;
                    }
                }
            `}</style>
        </div>
    );
};

export default Login;
