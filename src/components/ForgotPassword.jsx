import React, { useState } from 'react';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleResetPassword = (e) => {
        e.preventDefault();
        const auth = getAuth();

        sendPasswordResetEmail(auth, email)
            .then(() => {
                setMessage('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.');
            })
            .catch((error) => {
                setMessage(`Bir hata oluştu: ${error.message}`);
            });
    };

    return (
        <div>
            <h2>Şifremi Unuttum</h2>
            <form onSubmit={handleResetPassword}>
                <input
                    type="email"
                    placeholder="E-posta adresinizi girin"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">Şifre Sıfırla</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ForgotPassword;
