import { useState, type FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../auth/AuthContext';
import { AuthApi } from '../api/client';
import Logo from '../components/Logo';

type Step = 'phone' | 'otp';

const PHONE_REGEX = /^[0-9]{10}$/;

function extractErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.message ?? fallback;
  }
  if (err instanceof Error) return err.message;
  return fallback;
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState<string | null>(null);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = (location.state as { from?: string } | null)?.from ?? '/shop';

  const handleSendOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!PHONE_REGEX.test(phone)) {
      setError('Enter a valid 10-digit phone number.');
      return;
    }
    setSubmitting(true);
    try {
      // No SMS provider is wired up yet — auth-service generates the OTP
      // and returns it in the response so it can be shown on screen here.
      const response = await AuthApi.requestOtp(phone);
      setOtp(response.otp);
      setEnteredOtp('');
      setStep('otp');
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to request OTP. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const response = await AuthApi.verifyOtp(phone, enteredOtp);
      login(response.phoneNumber, response.token);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(extractErrorMessage(err, 'Incorrect OTP. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    setError(null);
    setSubmitting(true);
    try {
      const response = await AuthApi.requestOtp(phone);
      setOtp(response.otp);
      setEnteredOtp('');
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to resend OTP. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <Logo size="lg" />
        </div>
        <h2>Welcome to Salepe</h2>
        <p>
          {step === 'phone'
            ? 'Sign in with your phone number to start shopping.'
            : 'Enter the OTP shown below to continue.'}
        </p>

        {step === 'phone' && (
          <form onSubmit={handleSendOtp} className="form">
            <label>
              Phone Number
              <input
                type="tel"
                inputMode="numeric"
                placeholder="10-digit phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                required
              />
            </label>
            {error && <p className="error">{error}</p>}
            <button className="btn" type="submit" disabled={submitting}>
              {submitting ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="form">
            <p>
              OTP for <strong>{phone}</strong>:
            </p>
            <p className="otp-display">{otp}</p>
            <label>
              Enter OTP
              <input
                type="text"
                inputMode="numeric"
                placeholder="6-digit OTP"
                value={enteredOtp}
                onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
              />
            </label>
            {error && <p className="error">{error}</p>}
            <button className="btn" type="submit" disabled={submitting}>
              {submitting ? 'Verifying...' : 'Verify & Login'}
            </button>
            <div className="login-actions">
              <button type="button" className="link-btn" onClick={handleResendOtp} disabled={submitting}>
                Resend OTP
              </button>
              <button type="button" className="link-btn" onClick={() => setStep('phone')}>
                Change phone number
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
