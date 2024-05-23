import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import PropTypes from 'prop-types'
import Avatar from './Avatar'
import 'bootstrap/dist/css/bootstrap.min.css'
import './style.css' // Import custom CSS for adjustments

export default function Account({ session }) {
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState(null)
  const [website, setWebsite] = useState(null)
  const [avatar_url, setAvatarUrl] = useState(null)

  Account.propTypes = {
    session: PropTypes.any, // Replace 'any' with a more specific type if possible
  }

  useEffect(() => {
    async function getProfile() {
      try {
        setLoading(true)
        const { user } = session

        let { data, error } = await supabase
          .from('profiles')
          .select(`username, website, avatar_url`)
          .eq('id', user.id)
          .single()

        if (error) {
          throw error
        }

        setUsername(data.username)
        setWebsite(data.website)
        setAvatarUrl(data.avatar_url)
      } catch (error) {
        console.warn(error.message)
      } finally {
        setLoading(false)
      }
    }

    getProfile()
  }, [session])

  async function updateProfile({ username, website, avatar_url }) {
    try {
      setLoading(true)
      const { user } = session

      const updates = {
        id: user.id,
        username,
        website,
        avatar_url,
        updated_at: new Date(),
      }

      let { error } = await supabase.from('profiles').upsert(updates)

      if (error) {
        throw error
      }
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-fluid mt-3 mt-md-5"> {/* Adjusted margin top for mobile */}
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6"> {/* Adjusted column width */}
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Account</h2>
              <Avatar
                url={avatar_url}
                size={150}
                onUpload={(url) => {
                  setAvatarUrl(url)
                  updateProfile({ username, website, avatar_url: url })
                }}
              />
              <form>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    id="email"
                    type="text"
                    className="form-control"
                    value={session.user.email}
                    disabled
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Name</label>
                  <input
                    id="username"
                    type="text"
                    className="form-control"
                    value={username || ''}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="website" className="form-label">Website</label>
                  <input
                    id="website"
                    type="text"
                    className="form-control"
                    value={website || ''}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </div>
                <div className="d-grid gap-2">
                  <button
                    className="btn btn-primary"
                    onClick={() => updateProfile({ username, website, avatar_url })}
                    disabled={loading}
                  >
                    {loading ? 'Loading ...' : 'Update'}
                  </button>
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => supabase.auth.signOut()}
                  >
                    Sign Out
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}