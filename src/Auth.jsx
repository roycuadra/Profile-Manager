import { useState } from 'react';
import { supabase } from './supabaseClient';
import Swal from 'sweetalert2';
import './style.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();

    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      Swal.fire({
        title: 'Error',
        text: error.error_description || error.message,
        icon: 'error',
        customClass: {
          popup: 'swal-wide' // Custom class for wider modals
        }
      });
    } else {
      Swal.fire({
        title: 'Success',
        text: 'Check your email for the login link!',
        icon: 'success',
        customClass: {
          popup: 'swal-wide' // Custom class for wider modals
        }
      });
    }
    setLoading(false);
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card p-4">
            <h1 className="card-title text-center">Profile Manager</h1>
            <p className="text-center text-black">Sign in via magic link with your email below</p>
            <form onSubmit={handleLogin}>
              <div className="form-floating mb-3">
                <input
                  className="form-control"
                  id="floatingInput"
                  type="email"
                  placeholder="Your email"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor="floatingInput">Email address</label>
              </div>
              <div className="text-center">
                <button className="btn btn-primary" type="submit" disabled={loading}>
                  {loading ? 'Loading...' : 'Send magic link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
